<?php
require_once __DIR__ . '/../backend/db.php';
require_admin();
?>
<!DOCTYPE html>
<html lang="es">
<head>
<meta charset="UTF-8">
<title>Mensajes</title>
<script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="bg-gray-900 text-white min-h-screen p-8">

<h1 class="text-3xl font-bold mb-6">Mensajes recibidos</h1>

<button id="logoutBtn"
    class="mb-6 bg-red-600 px-4 py-2 rounded hover:bg-red-700">
    Cerrar sesión
</button>

<div id="messages" class="flex flex-col gap-4"></div>

<!-- MODAL -->
<div id="modal" class="fixed inset-0 bg-black/70 flex items-center justify-center hidden">
    <div class="bg-gray-800 p-6 rounded-xl w-80">
        <p class="mb-4">¿Eliminar mensaje?</p>
        <div class="flex justify-end gap-2">
            <button onclick="closeModal()" class="px-4 py-2 bg-gray-600 rounded">Cancelar</button>
            <button id="confirmDelete" class="px-4 py-2 bg-red-600 rounded">Eliminar</button>
        </div>
    </div>
</div>


<script>
let deleteId = null;
const base =
  (typeof window.BASE_URL === 'string' && window.BASE_URL.length)
    ? window.BASE_URL
    : (location.pathname.startsWith('/sbstudio') ? '/sbstudio' : '');


async function loadMessages() {
  const base =
    (typeof window.BASE_URL === 'string' && window.BASE_URL.length)
      ? window.BASE_URL
      : (location.pathname.startsWith('/sbstudio') ? '/sbstudio' : '');

  const res = await fetch(`${base}/backend/post-test.php?mode=messages`, {
    method: 'GET',
    credentials: 'same-origin',
    headers: { Accept: 'application/json' },
  });

  const text = await res.text();
  console.log('STATUS:', res.status);
  console.log('RAW:', text);

  let data;
  try {
    data = JSON.parse(text);
  } catch {
    console.error('No JSON:', text);
    return;
  }

  if (!res.ok) {
    console.error('API error:', data);
    return;
  }

  const container = document.getElementById("messages");
  container.innerHTML = "";

  if (!Array.isArray(data) || data.length === 0) {
    container.innerHTML = `<div class="p-4 bg-gray-800 rounded-xl border border-gray-700 text-white/70">
      No hay mensajes todavía.
    </div>`;
    return;
  }

  data.forEach(m => {
    const div = document.createElement("div");
    div.className = "p-4 bg-gray-800 rounded-xl border border-gray-700";

    div.innerHTML = `
      <p><b>Nombre:</b> ${m.name}</p>
      <p><b>Email:</b> ${m.email}</p>
      <p><b>Asunto:</b> ${m.subject ?? ''}</p>
      <p class="mt-2">${m.message}</p>

      <button onclick="openModal(${m.id})"
        class="mt-3 px-3 py-1 bg-red-600 rounded hover:bg-red-700">
        Eliminar
      </button>
    `;

    container.appendChild(div);
  });
}


loadMessages();

function openModal(id) {
  deleteId = id;
  document.getElementById("modal").classList.remove("hidden");
}

function closeModal() {
  deleteId = null;
  document.getElementById("modal").classList.add("hidden");
}

document.getElementById("confirmDelete").onclick = async () => {
  if (!deleteId) return;

  await fetch(`${base}/backend/post-test.php?mode=messages&id=${deleteId}`, {
    method: "DELETE",
    headers: { "Accept": "application/json" },
    credentials: "same-origin"
  });

  closeModal();
  loadMessages();
};

document.getElementById("logoutBtn").onclick = async () => {
  await fetch(`${base}/backend/post-test.php?mode=logout`, {
    method: "DELETE",
    headers: { "Accept": "application/json" },
    credentials: "same-origin"
  });
    location.href = `${base}/admin/login.php`;
};

</script>

</body>
</html>
