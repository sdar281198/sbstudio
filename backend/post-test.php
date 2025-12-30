<?php
require_once __DIR__ . '/db.php';
header('Content-Type: application/json; charset=utf-8');

$mode   = $_GET['mode'] ?? '';
$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

/**
 * ✅ Mover credenciales a config-local.php / config-prod.php:
 * define('ADMIN_USER', '...');
 * define('ADMIN_PASS', '...');
 */
if (!defined('ADMIN_USER')) define('ADMIN_USER', '');
if (!defined('ADMIN_PASS')) define('ADMIN_PASS', '');


/**
 * ====== LOGIN ======
 * POST /backend/post-test.php?mode=login
 */
if ($mode === 'login' && $method === 'POST') {
  $username = trim($_POST['username'] ?? '');
  $password = $_POST['password'] ?? '';

  if ($username === '' || $password === '') {
    json_response(['error' => 'Preencha utilizador e palavra-passe.'], 422);
  }

  $st = $pdo->prepare('SELECT id, username, password_hash, role FROM users WHERE username = ? LIMIT 1');
  $st->execute([$username]);
  $user = $st->fetch();

  if (!$user || !password_verify($password, $user['password_hash'])) {
    json_response(['error' => 'Credenciais inválidas.'], 401);
  }

  $_SESSION['user'] = [
    'id' => $user['id'],
    'username' => $user['username'],
    'role' => $user['role'],
  ];

  json_response(['ok' => true, 'message' => 'Sessão iniciada com sucesso.']);
}



/**
 * ====== LOGOUT ======
 * POST /backend/post-test.php?mode=logout
 * (Melhor que DELETE em muitos hosts / forms)
 */
if ($mode === 'logout' && ($method === 'POST' || $method === 'DELETE')) {
  $_SESSION = [];

  if (ini_get("session.use_cookies")) {
    $params = session_get_cookie_params();
    setcookie(session_name(), '', time() - 42000,
      $params["path"], $params["domain"],
      $params["secure"], $params["httponly"]
    );
  }

  session_destroy();
  json_response(['ok' => true]);
}


/**
 * ====== LISTAR MENSAGENS (admin) ======
 * GET /backend/post-test.php?mode=messages
 */
if ($mode === 'messages' && $method === 'GET') {
  require_admin();
  $st = $pdo->query('
    SELECT id, name, email, service, budget, subject, message, website, ip, user_agent, created_at
    FROM contact_messages
    ORDER BY created_at DESC
  ');
  json_response($st->fetchAll());
}
if ($mode === 'messages' && $method === 'POST') {
  require_admin();
  $id = (int)($_POST['id'] ?? 0);
  if ($id <= 0) json_response(['error' => 'ID inválido.'], 400);

  $st = $pdo->prepare('DELETE FROM contact_messages WHERE id = ?');
  $st->execute([$id]);

  json_response(['ok' => true]);
}



/**
 * ====== APAGAR MENSAGEM (admin) ======
 * DELETE /backend/post-test.php?mode=messages&id=123
 */
if ($mode === 'messages' && $method === 'DELETE') {
  require_admin();
  $id = (int)($_GET['id'] ?? 0);
  if ($id <= 0) json_response(['error' => 'ID inválido.'], 400);

  $st = $pdo->prepare('DELETE FROM contact_messages WHERE id = ?');
  $st->execute([$id]);

  json_response(['ok' => true]);
}


/**
 * ====== CONTACTO (guardar mensagem) ======
 * POST /backend/post-test.php   (sem mode)
 */
if ($mode === '' && $method === 'POST') {
  $name    = trim($_POST['name'] ?? '');
  $email   = trim($_POST['email'] ?? '');
  $subject = trim($_POST['subject'] ?? '');
  $message = trim($_POST['message'] ?? '');

  // ✅ novos campos do embudo
  $service = trim($_POST['service'] ?? '');
  $budget  = trim($_POST['budget'] ?? '');

  // ✅ honeypot anti-spam (campo escondido no form)
  $website = trim($_POST['website'] ?? '');
  if ($website !== '') {
    json_response(['ok' => true]); // “finge sucesso” para bots
  }

  // ✅ validações PT-PT
  if ($name === '') {
    json_response(['error' => 'Indique o seu nome.'], 422);
  }
  if ($email === '' || !filter_var($email, FILTER_VALIDATE_EMAIL)) {
    json_response(['error' => 'Email inválido.'], 422);
  }
  if ($service === '') {
    json_response(['error' => 'Escolha o tipo de serviço.'], 422);
  }
  if ($budget === '') {
    json_response(['error' => 'Indique o orçamento aproximado.'], 422);
  }
  if ($message === '') {
    json_response(['error' => 'Escreva a sua mensagem.'], 422);
  }

  // ✅ inserir com campos novos
  $ip = $_SERVER['REMOTE_ADDR'] ?? null;
  $ua = $_SERVER['HTTP_USER_AGENT'] ?? null;

  $st = $pdo->prepare('
    INSERT INTO contact_messages
      (name, email, service, budget, subject, message, website, ip, user_agent)
    VALUES
      (?, ?, ?, ?, ?, ?, ?, ?, ?)
  ');

  $st->execute([
    $name,
    $email,
    $service !== '' ? $service : null,
    $budget !== '' ? $budget : null,
    $subject !== '' ? $subject : null,
    $message,
    $website !== '' ? $website : null,
    $ip,
    $ua
  ]);

  json_response(['ok' => true, 'message' => 'Obrigado! Vamos responder em até 24 horas.']);
}

json_response(['error' => 'Método não permitido.'], 405);
