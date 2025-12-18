<?php
require_once __DIR__ . '/db.php';

$method = $_SERVER['REQUEST_METHOD'];

define('ADMIN_USER', 'root');  
define('ADMIN_PASS', '');   

// LOGIN
if ($method === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = trim($_POST['password'] ?? '');

    if ($username === ADMIN_USER && $password === ADMIN_PASS) {
        $_SESSION['user'] = [
            'username' => $username,
            'role' => 'admin'
        ];
        json_response(['ok' => true, 'message' => 'Logged in']);
    }

    json_response(['error' => 'Credenciales incorrectas'], 401);
}

// LOGOUT
if ($method === 'DELETE') {
    session_destroy();
    json_response(['ok' => true]);
}

json_response(['error' => 'Método no permitido'], 405);
