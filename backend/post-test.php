<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');

$mode = $_GET['mode'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

// Credenciales admin (luego las movemos a config)
define('ADMIN_USER', 'santiago23t');
define('ADMIN_PASS', 'Rowise-11');


/**
 * ====== LOGIN ======
 * POST /sbstudio/backend/post-test.php?mode=login
 */
if ($mode === 'login' && $method === 'POST') {
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


/**
 * ====== LOGOUT ======
 * DELETE /sbstudio/backend/post-test.php?mode=logout
 */
if ($mode === 'logout' && $method === 'DELETE') {
  session_destroy();
  json_response(['ok' => true]);
}


/**
 * ====== LISTAR MENSAJES (admin) ======
 * GET /sbstudio/backend/post-test.php?mode=messages
 */
if ($mode === 'messages' && $method === 'GET') {
  require_admin();
  $st = $pdo->query('SELECT * FROM messages ORDER BY created_at DESC');
  json_response($st->fetchAll());
}


/**
 * ====== BORRAR MENSAJE (admin) ======
 * DELETE /sbstudio/backend/post-test.php?mode=messages&id=123
 */
if ($mode === 'messages' && $method === 'DELETE') {
  require_admin();
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_response(['error' => 'ID inválido'], 400);

  $st = $pdo->prepare('DELETE FROM messages WHERE id = ?');
  $st->execute([$id]);

  json_response(['ok' => true]);
}


/**
 * ====== CONTACTO (guardar mensaje) ======
 * POST /sbstudio/backend/post-test.php   (sin mode)
 */
if ($mode === '' && $method === 'POST') {
  $name = trim($_POST['name'] ?? '');
  $email = trim($_POST['email'] ?? '');
  $subject = trim($_POST['subject'] ?? '');
  $message = trim($_POST['message'] ?? '');

  if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $message === '') {
    json_response(['error' => 'Invalid data'], 422);
  }

  $st = $pdo->prepare('INSERT INTO messages (name,email,subject,message) VALUES (?,?,?,?)');
  $st->execute([$name, $email, $subject, $message]);

  json_response(['ok' => true, 'message' => 'Message sent successfully']);
}

json_response(['error' => 'Disallowed method'], 405);
