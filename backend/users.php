<?php
require_once __DIR__ . '/db.php';
$method = $_SERVER['REQUEST_METHOD'];
require_admin();


if ($method === 'GET') {
$st = $pdo->query('SELECT id,name,email,role,created_at FROM users ORDER BY id DESC');
json_response($st->fetchAll());
}


if ($method === 'POST') {
$data = $_POST ?: body_json();
$name = trim($data['name'] ?? '');
$email = trim($data['email'] ?? '');
$password = (string)($data['password'] ?? '');
$role = in_array(($data['role'] ?? 'viewer'), ['admin','viewer']) ? $data['role'] : 'viewer';
if ($name === '' || !filter_var($email, FILTER_VALIDATE_EMAIL) || $password === '')
json_response(['error' => 'Datos inválidos'], 422);
$st = $pdo->prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,?)');
$st->execute([$name,$email,password_hash($password, PASSWORD_DEFAULT),$role]);
json_response(['ok'=>true]);
}


if ($method === 'PUT') {
parse_str($_SERVER['QUERY_STRING'] ?? '', $q);
$id = isset($q['id']) ? (int)$q['id'] : 0;
if ($id <= 0) json_response(['error'=>'ID requerido'], 400);
$data = body_json();
$fields = [];$params=[];
if (isset($data['name'])) { $fields[]='name=?'; $params[] = trim($data['name']); }
if (isset($data['email']) && filter_var($data['email'], FILTER_VALIDATE_EMAIL)) { $fields[]='email=?'; $params[] = $data['email']; }
if (isset($data['password']) && $data['password']!=='') { $fields[]='password_hash=?'; $params[] = password_hash($data['password'], PASSWORD_DEFAULT); }
if (isset($data['role']) && in_array($data['role'], ['admin','viewer'])) { $fields[]='role=?'; $params[] = $data['role']; }
if (!$fields) json_response(['error'=>'Nada para actualizar'], 422);
$params[] = $id;
$sql = 'UPDATE users SET '.implode(',', $fields).' WHERE id=?';
$st = $pdo->prepare($sql); $st->execute($params);
json_response(['ok'=>true]);
}


if ($method === 'DELETE') {
$id = isset($_GET['id']) ? (int)$_GET['id'] : 0;
if ($id <= 0) json_response(['error'=>'ID requerido'], 400);
$st = $pdo->prepare('DELETE FROM users WHERE id=?');
$st->execute([$id]);
json_response(['ok'=>true]);
}


json_response(['error'=>'Método no permitido'], 405);