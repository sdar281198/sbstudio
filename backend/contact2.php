<?php
header('Content-Type: application/json; charset=utf-8');
echo json_encode([
  'method' => $_SERVER['REQUEST_METHOD'],
  'post' => $_POST,
  'raw' => file_get_contents('php://input'),
]);
