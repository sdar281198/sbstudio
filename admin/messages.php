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
    <div class="flex items-start justify-between gap-4">
      <div>
        <p class="text-white/80 text-sm">
          <b class="text-white">#${m.id}</b>
          <span class="mx-2">•</span>
          <span>${m.created_at ?? ''}</span>
        </p>

        <p class="mt-2"><b>Nome:</b> ${m.name ?? ''}</p>
        <p><b>Email:</b> ${m.email ?? ''}</p>

        <div class="mt-2 flex flex-wrap gap-2 text-sm">
          ${m.service ? `<span class="px-2 py-1 rounded bg-gray-700/60">Serviço: ${m.service}</span>` : ''}
          ${m.budget ? `<span class="px-2 py-1 rounded bg-gray-700/60">Orçamento: ${m.budget}</span>` : ''}
          ${m.subject ? `<span class="px-2 py-1 rounded bg-gray-700/60">Assunto: ${m.subject}</span>` : ''}
        </div>

        <p class="mt-3 whitespace-pre-wrap text-white/90">${m.message ?? ''}</p>

        <details class="mt-3 text-sm text-white/70">
          <summary class="cursor-pointer hover:text-white">Detalhes técnicos</summary>
          <div class="mt-2">
            <p><b>IP:</b> ${m.ip ?? '-'}</p>
            <p class="break-all"><b>User-Agent:</b> ${m.user_agent ?? '-'}</p>
          </div>
        </details>

        <button onclick="openModal(${m.id})"
          class="mt-4 px-3 py-2 bg-red-600 rounded hover:bg-red-700">
          Eliminar
        </button>
      </div>

      <button
        class="shrink-0 px-3 py-2 rounded bg-gray-700 hover:bg-gray-600"
        onclick="navigator.clipboard.writeText('${(m.email ?? '').replace(/'/g, "\\'")}')">
        Copiar email
      </button>
    </div>
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

  const fd = new FormData();
  fd.append('id', deleteId);

  await fetch(`${base}/backend/post-test.php?mode=messages`, {
    method: "POST",
    body: fd,
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
