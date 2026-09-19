<?php

require_once __DIR__ . '/../models/GenericModel.php';
require_once __DIR__ . '/../helpers/FileHelper.php';
require_once __DIR__ . '/../helpers/response.php';

class GenericController {
    private $model;
    private $table;

    public function __construct($table) {
        $this->table = $table;
        $this->model = new GenericModel(Database::connect(), $table);
    }

    public function getAll() {
        return jsonResponse($this->model->getAll());
    }

    public function getActive() {
        return jsonResponse($this->model->getActive());
    }

    public function getById($id) {
        $data = $this->model->getById($id);
        if ($data) return jsonResponse($data);
        http_response_code(404);
        return jsonResponse(['error' => 'Record not found']);
    }

    public function create() {
        $data = $_POST;
        if (empty($data)) {
            $data = json_decode(file_get_contents("php://input"), true) ?? [];
        }

        if ($this->table === 'users' && !empty($data['password'])) {
            $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
        }

        // Auto-detect columns and handle file uploads generics
        $columns = $this->model->getTableColumns();
        foreach ($columns as $col) {
            if (isset($_FILES[$col]) && $_FILES[$col]['error'] === UPLOAD_ERR_OK) {
                $data[$col] = FileHelper::upload($_FILES[$col], $this->table, $col);
            }
        }

        // Support base64 image strings as well
        foreach ($data as $key => $val) {
            if (is_string($val) && strpos($val, 'data:image') === 0 && in_array($key, $columns)) {
                $data[$key] = FileHelper::saveBase64Image($val, $this->table, $key);
            }
        }

        if ($this->model->create($data)) {
            $db = Database::connect();
            $lastId = $db->lastInsertId();
            $created = $this->model->getById($lastId);

            if ($this->table === 'submissions') {
                try {
                    require_once __DIR__ . '/../helpers/MailHelper.php';
                    $userEmail = $created['email'] ?? '';
                    $userName = $created['name'] ?? '';
                    $subjectField = $created['subject'] ?? '';
                    $messageContent = $created['message'] ?? '';

                    // Get owner email from contact_section
                    $ownerEmail = null;
                    $ownerEmailsList = [];
                    try {
                        $stmtContact = $db->query("SELECT owner_email FROM contact_section LIMIT 1");
                        $ownerEmailField = $stmtContact ? $stmtContact->fetchColumn() : null;
                        if (!empty($ownerEmailField)) {
                            $rawOwnerEmails = array_map('trim', explode(',', $ownerEmailField));
                            foreach ($rawOwnerEmails as $rawEmail) {
                                if (!empty($rawEmail) && filter_var($rawEmail, FILTER_VALIDATE_EMAIL)) {
                                    $ownerEmailsList[] = $rawEmail;
                                }
                            }
                            if (!empty($ownerEmailsList)) {
                                $ownerEmail = $ownerEmailsList[0];
                            }
                        }
                    } catch (Exception $ex) {
                        error_log("Failed to fetch owner_email: " . $ex->getMessage());
                    }

                    if (!empty($userEmail)) {
                        MailHelper::sendSubmissionConfirmation($userEmail, $userName, $userEmail, $subjectField, $messageContent, $ownerEmail);
                    }

                    // Get all admin users to notify them
                    $stmt = $db->query("SELECT email FROM users");
                    $admins = $stmt->fetchAll(PDO::FETCH_COLUMN);
                    foreach ($admins as $adminEmail) {
                        if (!empty($adminEmail)) {
                            MailHelper::sendSubmissionNotification($adminEmail, $userName, $userEmail, $subjectField, $messageContent);
                        }
                    }

                    // Notify owner email(s) as well if not already in admin list
                    foreach ($ownerEmailsList as $ownerMail) {
                        if (!in_array($ownerMail, $admins)) {
                            MailHelper::sendSubmissionNotification($ownerMail, $userName, $userEmail, $subjectField, $messageContent);
                        }
                    }
                } catch (Exception $e) {
                    error_log("Email confirmation service error: " . $e->getMessage());
                }
            }

            return jsonResponse(['success' => true, 'data' => $created]);
        }

        http_response_code(500);
        return jsonResponse(['error' => 'Failed to create record']);
    }

    public function update($id) {
        $data = $_POST;
        if (empty($data)) {
            $data = json_decode(file_get_contents("php://input"), true) ?? [];
        }

        if ($this->table === 'users') {
            if (empty($data['password'])) {
                unset($data['password']);
            } else {
                $data['password'] = password_hash($data['password'], PASSWORD_DEFAULT);
            }
        }

        $existing = $this->model->getById($id);
        if (!$existing) {
            http_response_code(404);
            return jsonResponse(['error' => 'Record not found']);
        }

        // Auto-detect columns and handle file uploads generics, with cleanup
        $columns = $this->model->getTableColumns();
        foreach ($columns as $col) {
            if (isset($_FILES[$col]) && $_FILES[$col]['error'] === UPLOAD_ERR_OK) {
                // Delete previous file if exists to prevent storage leaks
                if (!empty($existing[$col])) {
                    FileHelper::delete($existing[$col]);
                }
                $data[$col] = FileHelper::upload($_FILES[$col], $this->table, $col);
            }
        }

        // Support direct base64 image strings from customizers
        foreach ($data as $key => $val) {
            if (is_string($val) && strpos($val, 'data:image') === 0 && in_array($key, $columns)) {
                if (!empty($existing[$key])) {
                    FileHelper::delete($existing[$key]);
                }
                $data[$key] = FileHelper::saveBase64Image($val, $this->table, $key);
            }
        }

        // Handle explicitly cleared image fields to delete the file immediately
        foreach ($columns as $col) {
            if (isset($data[$col]) && ($data[$col] === '' || $data[$col] === null || $data[$col] === 'null')) {
                if (!empty($existing[$col]) && is_string($existing[$col]) && 
                    (strpos($existing[$col], 'upload/') === 0 || strpos($existing[$col], '/upload/') === 0 || 
                     strpos($existing[$col], 'assets/') === 0 || strpos($existing[$col], '/assets/') === 0)) {
                    FileHelper::delete($existing[$col]);
                }
            }
        }

        if ($this->model->update($id, $data)) {
            $updated = $this->model->getById($id);
            return jsonResponse(['success' => true, 'data' => $updated]);
        }

        http_response_code(500);
        return jsonResponse(['error' => 'Failed to update record']);
    }

    public function delete($id) {
        $existing = $this->model->getById($id);
        if (!$existing) {
            http_response_code(404);
            return jsonResponse(['error' => 'Record not found']);
        }

        // Delete any related files generics
        $columns = $this->model->getTableColumns();
        foreach ($columns as $col) {
            if (!empty($existing[$col]) && is_string($existing[$col]) && 
                (strpos($existing[$col], 'upload/') === 0 || strpos($existing[$col], '/upload/') === 0 || 
                 strpos($existing[$col], 'assets/') === 0 || strpos($existing[$col], '/assets/') === 0)) {
                FileHelper::delete($existing[$col]);
            }
        }

        if ($this->model->delete($id)) {
            return jsonResponse(['success' => true]);
        }

        http_response_code(500);
        return jsonResponse(['error' => 'Failed to delete record']);
    }
}
