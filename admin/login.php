<?php session_start(); ?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Login Admin</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>
<body class="bg-gray-900 text-white h-screen flex items-center justify-center">

<div class="bg-gray-800 p-8 rounded-xl w-80 shadow-lg shadow-black/50">
    <h1 class="text-xl font-bold mb-4 text-center">Panel Admin</h1>

    <form id="loginForm" class="flex flex-col gap-4">
        <input type="text" name="username" placeholder="Usuario"
            class="px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 outline-none">

        <input type="password" name="password" placeholder="Contrase√±a"
            class="px-3 py-2 rounded bg-gray-700 border border-gray-600 focus:border-blue-400 outline-none">

        <button class="py-2 rounded bg-blue-600 hover:bg-blue-700 font-semibold">Entrar</button>

        <p id="error" class="text-red-400 text-sm text-center"></p>
    </form>
</div>

<script>
document.getElementById('loginForm').addEventListener('submit', async (e) => {
  e.preventDefault();

  const fd = new FormData(e.target);

  const res = await fetch('/sbstudio/backend/post-test.php?mode=login', {
    method: 'POST',
    body: fd,
  });

  const text = await res.text();

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error('Respuesta no JSON:', text);
    document.getElementById('error').textContent = 'Respuesta invè´°lida del servidor';
    return;
  }

  if (data.ok) {
    location.href = '/sbstudio/admin/messages.php';
  } else {
    document.getElementById('error').textContent = data.error || 'Credenciales incorrectas';
  }
});

</script>

</body>
</html>
