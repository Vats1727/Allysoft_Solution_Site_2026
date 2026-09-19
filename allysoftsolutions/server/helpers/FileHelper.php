<?php

class FileHelper {
    /**
     * Handles file uploads from $_FILES
     */
    public static function upload($file, $subDir = '', $prefix = 'file') {
        if (!$file || !isset($file['error']) || $file['error'] !== UPLOAD_ERR_OK) return null;
        
        $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
        $filename = $prefix . '_' . time() . '_' . uniqid() . '.' . $ext;
        
        $baseDir = dirname(__DIR__) . '/public/assets/';
        $targetDir = $baseDir . ($subDir ? trim($subDir, '/') . '/' : '');
        
        if (!file_exists($targetDir)) @mkdir($targetDir, 0777, true);
        
        $path = $targetDir . $filename;
        if (move_uploaded_file($file['tmp_name'], $path)) {
            return 'assets/' . ($subDir ? trim($subDir, '/') . '/' : '') . $filename;
        }
        
        return null;
    }

    /**
     * Deletes a file from the upload directory
     */
    public static function delete($path) {
        if (!$path) return;
        // Path is expected to be 'assets/subdir/filename.ext' or 'upload/subdir/filename.ext'
        $fullPath = dirname(__DIR__) . '/public/' . ltrim($path, '/');
        if (file_exists($fullPath) && is_file($fullPath)) {
            @unlink($fullPath);
        }
    }

    /**
     * Saves a base64 encoded image
     */
    public static function saveBase64Image($base64, $subDir = '', $prefix = 'img') {
        if (!$base64 || !preg_match('/^data:image\/(\w+);base64,/', $base64, $type)) return $base64;
        
        $data = base64_decode(preg_replace('/^data:image\/(\w+);base64,/', '', $base64));
        $ext = strtolower($type[1]);
        $filename = $prefix . '_' . time() . '_' . uniqid() . '.' . $ext;
        
        $baseDir = dirname(__DIR__) . '/public/assets/';
        $targetDir = $baseDir . ($subDir ? trim($subDir, '/') . '/' : '');
        
        if (!file_exists($targetDir)) @mkdir($targetDir, 0777, true);
        
        $path = $targetDir . $filename;
        @file_put_contents($path, $data);
        
        return 'assets/' . ($subDir ? trim($subDir, '/') . '/' : '') . $filename;
    }
}
