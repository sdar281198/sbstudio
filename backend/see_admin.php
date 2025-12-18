<?php
require_once __DIR__ . '/db.php';
$name = 'Admin';
$email = 'admin@studio.local';
$pass = 'admin123';


$st = $pdo->prepare('SELECT id FROM users WHERE email=?');
$st->execute([$email]);
if ($st->fetch()) json_response(['ok'=>true, 'message'=>'Ya existe el admin']);


$st = $pdo->prepare('INSERT INTO users (name,email,password_hash,role) VALUES (?,?,?,"admin")');
$st->execute([$name, $email, password_hash($pass, PASSWORD_DEFAULT)]);
json_response(['ok'=>true, 'message'=>'Admin creado', 'login'=>['email'=>$email,'password'=>$pass]]);