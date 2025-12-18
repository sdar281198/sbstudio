<?php
// backend/config.php

$host = $_SERVER['HTTP_HOST'] ?? '';

if ($host === 'localhost' || str_contains($host, '127.0.0.1')) {
    require_once __DIR__ . '/config.local.php';
} else {
    require_once __DIR__ . '/config.prod.php';
}
