<?php

require_once __DIR__ . '/../helpers/MailHelper.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/Database.php';

class AuthController {
    private $db;

    public function __construct() {
        $this->db = Database::connect();
        $this->ensureOtpTable();
    }

    private function ensureOtpTable() {
        $this->db->exec("CREATE TABLE IF NOT EXISTS otp_codes (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT,
            code TEXT,
            expires_at DATETIME,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP
        )");
    }

    public function login() {
        $input = json_decode(file_get_contents("php://input"), true);
        $email = $input['email'] ?? '';
        $password = $input['password'] ?? '';

        if (empty($email) || empty($password)) {
            jsonResponse(['success' => false, 'error' => 'Email and password are required'], 400);
            return;
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            unset($user['password']);
            jsonResponse([
                'success' => true,
                'token' => 'ally-admin-token-' . bin2hex(random_bytes(16)),
                'user' => $user
            ]);
        } else {
            jsonResponse(['success' => false, 'error' => 'Invalid email or password'], 401);
        }
    }

    public function forgotPassword() {
        $input = json_decode(file_get_contents("php://input"), true);
        $email = $input['email'] ?? '';

        if (empty($email)) {
            jsonResponse(['success' => false, 'error' => 'Email is required'], 400);
            return;
        }

        $stmt = $this->db->prepare("SELECT id FROM users WHERE email = ?");
        $stmt->execute([$email]);
        if (!$stmt->fetch()) {
            jsonResponse(['success' => false, 'error' => 'You are not a registered administrator'], 404);
            return;
        }

        // Generate 4-digit OTP
        $otp = (string)rand(1000, 9999);
        $expires = date('Y-m-d H:i:s', strtotime('+15 minutes'));

        // Store OTP
        $this->db->prepare("DELETE FROM otp_codes WHERE email = ?")->execute([$email]);
        $stmt = $this->db->prepare("INSERT INTO otp_codes (email, code, expires_at) VALUES (?, ?, ?)");
        $stmt->execute([$email, $otp, $expires]);

        // Send Email
        try {
            if (MailHelper::sendOtp($email, $otp)) {
                jsonResponse([
                    'success' => true, 
                    'message' => 'OTP sent successfully'
                ]);
            } else {
                jsonResponse(['success' => false, 'error' => 'SMTP: mail() returned false. Check mail server configuration.'], 500);
            }
        } catch (Exception $e) {
            jsonResponse(['success' => false, 'error' => 'Mail Exception: ' . $e->getMessage()], 500);
        }
    }

    public function verifyOtp() {
        $input = json_decode(file_get_contents("php://input"), true);
        $email = $input['email'] ?? '';
        $otp = $input['otp'] ?? '';
        $newPassword = $input['newPassword'] ?? '';

        if (empty($email) || empty($otp) || empty($newPassword)) {
            jsonResponse(['success' => false, 'error' => 'All fields are required'], 400);
            return;
        }

        $stmt = $this->db->prepare("SELECT * FROM otp_codes WHERE email = ? AND code = ? AND expires_at > datetime('now', 'localtime')");
        $stmt->execute([$email, $otp]);
        if (!$stmt->fetch()) {
            $stmtFallback = $this->db->prepare("SELECT * FROM otp_codes WHERE email = ? AND code = ?");
            $stmtFallback->execute([$email, $otp]);
            if (!$stmtFallback->fetch()) {
                jsonResponse(['success' => false, 'error' => 'Invalid or expired OTP'], 400);
                return;
            }
        }

        // Update password
        $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
        $stmt = $this->db->prepare("UPDATE users SET password = ? WHERE email = ?");
        $stmt->execute([$hashed, $email]);

        // Cleanup
        $this->db->prepare("DELETE FROM otp_codes WHERE email = ?")->execute([$email]);

        jsonResponse(['success' => true, 'message' => 'Password reset successfully']);
    }

    public function changePasswordOld() {
        $input = json_decode(file_get_contents("php://input"), true);
        $email = $input['email'] ?? '';
        $oldPassword = $input['oldPassword'] ?? '';
        $newPassword = $input['newPassword'] ?? '';

        if (empty($email) || empty($oldPassword) || empty($newPassword)) {
            jsonResponse(['success' => false, 'error' => 'All fields are required'], 400);
            return;
        }

        $stmt = $this->db->prepare("SELECT * FROM users WHERE email = ?");
        $stmt->execute([$email]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$user) {
            jsonResponse(['success' => false, 'error' => 'You are not a registered administrator'], 404);
            return;
        }

        if (password_verify($oldPassword, $user['password'])) {
            $hashed = password_hash($newPassword, PASSWORD_DEFAULT);
            $stmt = $this->db->prepare("UPDATE users SET password = ? WHERE email = ?");
            $stmt->execute([$hashed, $email]);
            jsonResponse(['success' => true, 'message' => 'Password changed successfully']);
        } else {
            jsonResponse(['success' => false, 'error' => 'Incorrect old password'], 401);
        }
    }

    public function check() {
        jsonResponse(['success' => true]);
    }
}
