<?php

class GenericModel {
    private $conn;
    private $table;

    public function __construct($db, $table) {
        $this->conn = $db;
        $this->table = $table;
    }

    public function getAll() {
        $columns = $this->getTableColumns();
        $order = in_array('sort_order', $columns) ? "ORDER BY sort_order ASC, id ASC" : "ORDER BY id ASC";
        $stmt = $this->conn->prepare("SELECT * FROM \"$this->table\" $order");
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'decodeRow'], $rows);
    }

    public function getById($id) {
        $stmt = $this->conn->prepare("SELECT * FROM \"$this->table\" WHERE id = :id LIMIT 1");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        $stmt->execute();
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        return $row ? $this->decodeRow($row) : false;
    }

    public function getActive() {
        $columns = $this->getTableColumns();
        $order = in_array('sort_order', $columns) ? "ORDER BY sort_order ASC, id ASC" : "ORDER BY id ASC";
        if (in_array('status_toggle', $columns)) {
            $stmt = $this->conn->prepare("SELECT * FROM \"$this->table\" WHERE status_toggle = 'Active' $order");
        } else if (in_array('status', $columns)) {
            $stmt = $this->conn->prepare("SELECT * FROM \"$this->table\" WHERE status = 'Active' $order");
        } else {
            $stmt = $this->conn->prepare("SELECT * FROM \"$this->table\" $order");
        }
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map([$this, 'decodeRow'], $rows);
    }

    public function create($data) {
        $columns = $this->getTableColumns();
        $filteredData = array_intersect_key($data, array_flip($columns));
        
        foreach ($filteredData as $key => $val) {
            if (is_array($val)) {
                $filteredData[$key] = json_encode($val);
            }
        }

        $fields = array_keys($filteredData);
        $placeholders = array_map(fn($f) => ":$f", $fields);
        $sql = "INSERT INTO \"$this->table\" (\"" . implode('", "', $fields) . "\") VALUES (" . implode(', ', $placeholders) . ")";
        $stmt = $this->conn->prepare($sql);
        return $stmt->execute($filteredData);
    }

    public function update($id, $data) {
        $columns = $this->getTableColumns();
        $filteredData = array_intersect_key($data, array_flip($columns));

        foreach ($filteredData as $key => $val) {
            if (is_array($val)) {
                $filteredData[$key] = json_encode($val);
            }
        }

        $sets = array_map(fn($f) => "\"$f\" = :$f", array_keys($filteredData));
        $updateStr = implode(', ', $sets);
        
        if (in_array('updated_at', $columns)) {
            $updateStr .= ", updated_at = CURRENT_TIMESTAMP";
        }
        $sql = "UPDATE \"$this->table\" SET $updateStr WHERE id = :id";
        $stmt = $this->conn->prepare($sql);
        $filteredData['id'] = $id;
        return $stmt->execute($filteredData);
    }

    public function delete($id) {
        $stmt = $this->conn->prepare("DELETE FROM \"$this->table\" WHERE id = :id");
        $stmt->bindParam(':id', $id, PDO::PARAM_INT);
        return $stmt->execute();
    }

    public function getTableColumns() {
        try {
            $stmt = $this->conn->prepare("PRAGMA table_info(\"$this->table\")");
            $stmt->execute();
            return array_map(fn($col) => $col['name'], $stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (Exception $e) {
            return [];
        }
    }

    private function decodeRow($row) {
        foreach ($row as $key => $val) {
            if (is_string($val) && (strpos($val, '{') === 0 || strpos($val, '[') === 0)) {
                $decoded = json_decode($val, true);
                if (json_last_error() === JSON_ERROR_NONE) {
                    $row[$key] = $decoded;
                }
            }
        }
        return $row;
    }
}
