<?php

class Database {
    private static $pdo = null;

    public static function connect() {
        if (self::$pdo !== null) {
            return self::$pdo;
        }

        try {
            $dbPath = __DIR__ . '/../database/ally.sqlite';
            $dbDir = dirname($dbPath);

            if (!file_exists($dbDir)) {
                @mkdir($dbDir, 0777, true);
            }

            self::$pdo = new PDO('sqlite:' . $dbPath);
            self::$pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
            self::$pdo->exec("PRAGMA busy_timeout = 5000;");

            self::checkMigrations(self::$pdo);

            return self::$pdo;
        } catch (PDOException $e) {
            die('Database Connection failed: ' . $e->getMessage());
        }
    }

    private static function checkMigrations($pdo) {
        try {
            // Check if tables exist. If users table doesn't exist, create it.
            $stmt = $pdo->prepare("SELECT name FROM sqlite_master WHERE type='table' AND name='users'");
            $stmt->execute();
            if (!$stmt->fetch()) {
                // Initial migration runner
                $tables = [
                    "CREATE TABLE IF NOT EXISTS users (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        email TEXT UNIQUE,
                        password TEXT,
                        role TEXT DEFAULT 'admin',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS navbar_section (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        logo TEXT,
                        btn_text TEXT,
                        btn_href TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS hero_section (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        tag TEXT,
                        title_line1 TEXT,
                        title_line2 TEXT,
                        title_line3 TEXT,
                        description TEXT,
                        btn1_text TEXT,
                        btn1_href TEXT,
                        btn2_text TEXT,
                        btn2_href TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS services_settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        badge TEXT,
                        title TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS services (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        icon TEXT,
                        title TEXT,
                        desc TEXT,
                        sort_order INTEGER DEFAULT 0,
                        status_toggle TEXT DEFAULT 'Active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS work_settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        badge TEXT,
                        title TEXT,
                        description TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS projects (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        slug TEXT UNIQUE,
                        title TEXT,
                        category TEXT,
                        image TEXT,
                        description TEXT,
                        tags TEXT, -- JSON Array representation
                        link TEXT,
                        features TEXT, -- JSON Array representation
                        pricing TEXT, -- JSON Array representation
                        sort_order INTEGER DEFAULT 0,
                        status_toggle TEXT DEFAULT 'Active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS stack_settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        badge TEXT,
                        title TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS stack (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        icon TEXT,
                        title TEXT,
                        items TEXT,
                        sort_order INTEGER DEFAULT 0,
                        status_toggle TEXT DEFAULT 'Active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS why_ally_section (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        badge TEXT,
                        title TEXT,
                        image TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS why_ally_points (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        desc TEXT,
                        sort_order INTEGER DEFAULT 0,
                        status_toggle TEXT DEFAULT 'Active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS how_we_work_settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        badge TEXT,
                        title TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS how_we_work_steps (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        n TEXT,
                        title TEXT,
                        desc TEXT,
                        milestones TEXT, -- JSON or Comma-separated
                        sort_order INTEGER DEFAULT 0,
                        status_toggle TEXT DEFAULT 'Active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS why_choose_us_settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        badge TEXT,
                        title TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS why_choose_us (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        icon TEXT,
                        title TEXT,
                        desc TEXT,
                        sort_order INTEGER DEFAULT 0,
                        status_toggle TEXT DEFAULT 'Active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS about_section (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        badge TEXT,
                        title TEXT,
                        desc1 TEXT,
                        desc2 TEXT,
                        experience_num TEXT,
                        experience_label TEXT,
                        image TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS about_bullets (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        icon TEXT,
                        title TEXT,
                        sort_order INTEGER DEFAULT 0,
                        status_toggle TEXT DEFAULT 'Active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS team_settings (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        badge TEXT,
                        title TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS team (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        role TEXT,
                        bio TEXT,
                        tag TEXT,
                        image TEXT,
                        object_position TEXT DEFAULT 'center',
                        scale REAL DEFAULT 1.0,
                        transform_origin TEXT DEFAULT 'center',
                        sort_order INTEGER DEFAULT 0,
                        status_toggle TEXT DEFAULT 'Active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS contact_section (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        title TEXT,
                        desc TEXT,
                        address TEXT,
                        address_icon TEXT DEFAULT 'MapPin',
                        phone1 TEXT,
                        phone2 TEXT,
                        phone_icon TEXT DEFAULT 'Phone',
                        email TEXT,
                        email_icon TEXT DEFAULT 'Mail',
                        hours TEXT,
                        hours_icon TEXT DEFAULT 'Clock',
                        owner_email TEXT DEFAULT NULL,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS footer_section (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        brand_name TEXT,
                        brand_tagline TEXT,
                        copyright TEXT,
                        links_text TEXT,
                        facebook_url TEXT DEFAULT '#',
                        instagram_url TEXT DEFAULT '#',
                        linkedin_url TEXT DEFAULT '#',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS submissions (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        name TEXT,
                        email TEXT,
                        subject TEXT,
                        message TEXT,
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )",
                    "CREATE TABLE IF NOT EXISTS contact_info (
                        id INTEGER PRIMARY KEY AUTOINCREMENT,
                        label TEXT,
                        value TEXT,
                        icon TEXT,
                        sort_order INTEGER DEFAULT 0,
                        status_toggle TEXT DEFAULT 'Active',
                        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
                        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
                    )"
                ];

                foreach ($tables as $sql) {
                    $pdo->exec($sql);
                }
            }
        } catch (Exception $e) {
            error_log("Database Migration check failed: " . $e->getMessage());
        }
    }
}
