<?php

$sourceDir = __DIR__ . '/../public/upload';
$destDir = __DIR__ . '/../public/assets';
$dbPath = __DIR__ . '/../database/ally.sqlite';

echo "Starting assets migration...\n";

// 1. Copy files from upload to assets folder recursively
if (file_exists($sourceDir)) {
    if (!file_exists($destDir)) {
        mkdir($destDir, 0777, true);
    }
    
    copyRecursive($sourceDir, $destDir);
    echo "Files copied from public/upload to public/assets successfully.\n";
} else {
    echo "No public/upload directory found. Skipping file copy.\n";
}

// 2. Update SQLite references
if (file_exists($dbPath)) {
    try {
        $pdo = new PDO('sqlite:' . $dbPath);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        
        $updates = [
            'navbar_section' => ['logo'],
            'projects' => ['image'],
            'why_ally_section' => ['image'],
            'about_section' => ['image'],
            'team' => ['image'],
            'footer_section' => ['brand_name']
        ];
        
        foreach ($updates as $table => $columns) {
            // Check if table exists
            $stmt = $pdo->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = ?");
            $stmt->execute([$table]);
            if ($stmt->fetch()) {
                foreach ($columns as $column) {
                    $query = "UPDATE `{$table}` SET `{$column}` = REPLACE(`{$column}`, 'upload/', 'assets/') WHERE `{$column}` LIKE '%upload/%'";
                    $count = $pdo->exec($query);
                    if ($count > 0) {
                        echo "Updated {$count} rows in table '{$table}', column '{$column}'.\n";
                    }
                }
            }
        }
        // Also migrate team table static images to use the assets/ prefix
        $stmtTeam = $pdo->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name = 'team'");
        $stmtTeam->execute();
        if ($stmtTeam->fetch()) {
            $countTeam = $pdo->exec("UPDATE team SET image = '/assets' || image WHERE image NOT LIKE '/assets/%' AND image LIKE '/%.jpg'");
            if ($countTeam > 0) {
                echo "Updated {$countTeam} static team images to use /assets/ prefix.\n";
            }
        }
        
        echo "Database references updated successfully.\n";
    } catch (Exception $e) {
        echo "Database error during migration: " . $e->getMessage() . "\n";
    }
} else {
    echo "Database ally.sqlite not found at {$dbPath}. Skipping database updates.\n";
}

echo "Migration finished.\n";

function copyRecursive($source, $dest) {
    if (is_dir($source)) {
        if (!file_exists($dest)) {
            mkdir($dest, 0777, true);
        }
        $dir = opendir($source);
        while (($file = readdir($dir)) !== false) {
            if ($file != '.' && $file != '..') {
                copyRecursive($source . '/' . $file, $dest . '/' . $file);
            }
        }
        closedir($dir);
    } else {
        copy($source, $dest);
    }
}
