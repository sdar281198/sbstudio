<?php
// backend/config.php

$host = $_SERVER['HTTP_HOST'] ?? '';
$host = explode(':', $host)[0]; // quita puerto
$appEnv = getenv('APP_ENV') ?: '';
$appEnv = is_string($appEnv) ? $appEnv : '';


$isLocalHost = in_array($host, ['localhost', '127.0.0.1'], true);
$isLocalEnv  = ($appEnv === 'local');

if ($isLocalHost || $isLocalEnv) {
  require_once __DIR__ . '/config-local.php';
} else {
  require_once __DIR__ . '/config-prod.php';
}
foreach (['DB_HOST','DB_NAME','DB_USER','DB_PASS'] as $k) {
  if (!defined($k)) {
    http_response_code(500);
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(['error' => "Missing config: {$k}"]);
    exit;
  }
}
