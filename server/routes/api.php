<?php

header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization');

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit;

require_once __DIR__ . '/../helpers/FileHelper.php';
require_once __DIR__ . '/../helpers/response.php';
require_once __DIR__ . '/../config/Database.php';

class Router {
    private $routes = [];
    public function add($method, $path, $callback) {
        $this->routes[] = ['method' => $method, 'path' => $path, 'callback' => $callback];
    }
    public function get($path, $callback) { $this->add('GET', $path, $callback); }
    public function post($path, $callback) { $this->add('POST', $path, $callback); }
    public function put($path, $callback) { $this->add('PUT', $path, $callback); }
    public function delete($path, $callback) { $this->add('DELETE', $path, $callback); }

    public function resolve() {
        $uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
        
        // ROBUST SUBDIR DETECTION
        $baseMarkers = ['/server/public', '/public'];
        foreach ($baseMarkers as $marker) {
            $pos = strpos($uri, $marker);
            if ($pos !== false) {
                $uri = substr($uri, $pos + strlen($marker));
                break;
            }
        }
        
        $uri = str_replace('/index.php', '', $uri);
        if (empty($uri)) $uri = '/';
        if ($uri !== '/' && substr($uri, -1) === '/') $uri = rtrim($uri, '/');
        
        // Globally repair frontend path mismatch by prepending /api if missing (excluding auth paths)
        if ($uri !== '/' && strpos($uri, '/api/') !== 0 && strpos($uri, '/auth/') !== 0) {
            $cleanUri = '/' . ltrim($uri, '/');
            if (strpos($cleanUri, '/api/') !== 0 && strpos($cleanUri, '/auth/') !== 0) {
                $uri = '/api' . $cleanUri;
            }
        }
        
        $method = $_SERVER['REQUEST_METHOD'];
        
        // FormData PUT override support
        if ($method === 'POST' && isset($_POST['_method'])) {
            $method = strtoupper($_POST['_method']);
        }
        
        foreach ($this->routes as $route) {
            $pattern = "#^" . preg_replace('/\{([a-zA-Z0-9_]+)\}/', '(?P<$1>[^/]+)', $route['path']) . "$#";
            if ($method === $route['method'] && preg_match($pattern, $uri, $matches)) {
                $params = array_filter($matches, 'is_string', ARRAY_FILTER_USE_KEY);
                return call_user_func_array($route['callback'], array_values($params));
            }
        }
        http_response_code(404);
        echo json_encode(['error' => 'Not Found', 'uri' => $uri]);
    }
}

$router = new Router();

// --- AUTH CONTROLLER & ENDPOINTS ---
require_once __DIR__ . '/../controllers/AuthController.php';
$authCtrl = new AuthController();
$router->post('/api/auth/login', [$authCtrl, 'login']);
$router->post('/auth/login', [$authCtrl, 'login']);
$router->post('/api/auth/forgot-password', [$authCtrl, 'forgotPassword']);
$router->post('/auth/forgot-password', [$authCtrl, 'forgotPassword']);
$router->post('/api/auth/verify-otp', [$authCtrl, 'verifyOtp']);
$router->post('/auth/verify-otp', [$authCtrl, 'verifyOtp']);
$router->post('/api/auth/change-password-old', [$authCtrl, 'changePasswordOld']);
$router->post('/auth/change-password-old', [$authCtrl, 'changePasswordOld']);
$router->get('/api/auth/check', [$authCtrl, 'check']);
$router->get('/auth/check', [$authCtrl, 'check']);

// --- BATCH API FOR ALL ACTIVE SECTION DATA ---
$router->get('/api/batch_active', function() {
    $tables = [
        'navbar_section',
        'hero_section',
        'services_settings',
        'services',
        'work_settings',
        'projects',
        'stack_settings',
        'stack',
        'why_ally_section',
        'why_ally_points',
        'how_we_work_settings',
        'how_we_work_steps',
        'why_choose_us_settings',
        'why_choose_us',
        'about_section',
        'about_bullets',
        'team_settings',
        'team',
        'contact_section',
        'contact_info',
        'footer_section'
    ];
    $db = Database::connect();
    $result = [];
    foreach ($tables as $tbl) {
        $columns = [];
        try {
            $stmt = $db->prepare("PRAGMA table_info(\"$tbl\")");
            $stmt->execute();
            $columns = array_map(fn($col) => $col['name'], $stmt->fetchAll(PDO::FETCH_ASSOC));
        } catch (Exception $e) {}
        
        $order = in_array('sort_order', $columns) ? "ORDER BY sort_order ASC, id ASC" : "ORDER BY id ASC";
        if (in_array('status_toggle', $columns)) {
            $sql = "SELECT * FROM \"$tbl\" WHERE status_toggle = 'Active' $order";
        } else if (in_array('status', $columns)) {
            $sql = "SELECT * FROM \"$tbl\" WHERE status = 'Active' $order";
        } else {
            $sql = "SELECT * FROM \"$tbl\" $order";
        }
        
        $stmt = $db->prepare($sql);
        $stmt->execute();
        $rows = $stmt->fetchAll(PDO::FETCH_ASSOC);
        
        $decodedRows = [];
        foreach ($rows as $row) {
            foreach ($row as $key => $val) {
                if (is_string($val) && (strpos($val, '{') === 0 || strpos($val, '[') === 0)) {
                    $decoded = json_decode($val, true);
                    if (json_last_error() === JSON_ERROR_NONE) {
                        $row[$key] = $decoded;
                    }
                }
            }
            $decodedRows[] = $row;
        }
        $result[$tbl] = $decodedRows;
    }

    return jsonResponse($result);
});

// --- FALLBACK STATIC FILE SERVING FOR UPLOADS & ASSETS ---
$router->get('/api/upload/{dir}/{file}', function($dir, $file) {
    $dir = str_replace(['..', '/'], '', $dir);
    $file = str_replace(['..', '/'], '', $file);
    $filePath = dirname(__DIR__) . '/public/upload/' . $dir . '/' . $file;
    serveStaticImageFile($filePath);
});

$router->get('/api/assets/{dir}/{file}', function($dir, $file) {
    $dir = str_replace(['..', '/'], '', $dir);
    $file = str_replace(['..', '/'], '', $file);
    $filePath = dirname(__DIR__) . '/public/assets/' . $dir . '/' . $file;
    serveStaticImageFile($filePath);
});

function serveStaticImageFile($filePath) {
    if (file_exists($filePath) && is_file($filePath)) {
        $ext = strtolower(pathinfo($filePath, PATHINFO_EXTENSION));
        $contentTypes = [
            'png' => 'image/png',
            'jpg' => 'image/jpeg',
            'jpeg' => 'image/jpeg',
            'gif' => 'image/gif',
            'svg' => 'image/svg+xml',
            'ico' => 'image/x-icon',
            'webp' => 'image/webp'
        ];
        $contentType = $contentTypes[$ext] ?? 'application/octet-stream';
        header("Content-Type: $contentType");
        header("Cache-Control: public, max-age=86400");
        readfile($filePath);
        exit;
    }
    http_response_code(404);
    echo json_encode(['error' => 'File not found']);
    exit;
}

// --- DYNAMICALLY LOAD ALL AUTO-GENERATED ROUTES ---
foreach (glob(__DIR__ . '/*Routes.php') as $filename) {
    require_once $filename;
}

$router->resolve();
