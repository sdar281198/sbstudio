<?php
if (session_status() === PHP_SESSION_NONE) session_start();
require_once __DIR__ . '/config.php';


try {
$pdo = new PDO(
'mysql:host=' . DB_HOST . ';dbname=' . DB_NAME . ';charset=utf8mb4',
DB_USER,
DB_PASS,
[
PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
]
);
} catch (Throwable $e) {
http_response_code(500);
header('Content-Type: application/json');
echo json_encode(['error' => 'DB connection failed', 'detail'=>$e->getMessage()]);
exit;
}


function json_response($data, int $code = 200): void {
http_response_code($code);
header('Content-Type: application/json; charset=utf-8');
echo json_encode($data);
exit;
}


function require_login(): void {
if (empty($_SESSION['user'])) json_response(['error' => 'Auth required'], 401);
}


function require_admin(): void {
require_login();
if (($_SESSION['user']['role'] ?? '') !== 'admin') json_response(['error' => 'Admin only'], 403);
}


function body_json(): array {
$raw = file_get_contents('php://input');
$data = json_decode($raw, true);
return is_array($data) ? $data : [];
}


// CORS (opcional)
if (defined('CORS_ORIGIN')) {
header('Access-Control-Allow-Origin: ' . CORS_ORIGIN);
header('Access-Control-Allow-Credentials: true');
header('Access-Control-Allow-Headers: Content-Type');
header('Access-Control-Allow-Methods: GET,POST,PUT,DELETE,OPTIONS');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') exit; // preflight
}