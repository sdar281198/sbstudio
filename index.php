<?php
// Detectar entorno (local vs producción)
$isLocal = in_array($_SERVER['HTTP_HOST'], ['localhost', '127.0.0.1']);

$BASE_URL = $isLocal ? '' : '/sbstudio';
?>
<!DOCTYPE html>
<html lang="es">

  <head>
    <script>
      window.BASE_URL = "<?= $BASE_URL ?>";
    </script>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>SB Studio</title>
    <!-- Tailwind (CDN dev) -->
    <script src="https://cdn.tailwindcss.com"></script>
    <script
      src="https://kit.fontawesome.com/4738132790.js"
      crossorigin="anonymous"
    ></script>
    <link
      rel="stylesheet"
      href="https://cdn.jsdelivr.net/npm/glightbox/dist/css/glightbox.min.css"
    />
    <link rel="stylesheet" href="https://sdardev.com/sbstudio/css/styles.css" />
    <link rel="icon" type="image/png" href="./assets/images/favicon.png" />

    <!-- 3D y Lit -->
    <script type="importmap">
      {
      "imports": {
          "three": "https://unpkg.com/three@0.161.0/build/three.module.js",
          "three/addons/": "https://unpkg.com/three@0.161.0/examples/jsm/",
          "lit": "https://esm.sh/lit@3"
      }
      }
    </script>
  </head>
  <body class="min-h-screen text-gray-100 bg-[#0f0f13]">
    <!-- Navbar con menú hamburguesa bonito -->
    <header
      class="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-gradient-to-b from-black/80 to-black/40 backdrop-blur"
    >
      <nav
        class="mx-auto flex max-w-7xl items-center justify-between px-4 py-3"
      >
        <!-- Logo -->
        <a href="#" class="font-semibold tracking-wide text-white">
          SB Studio
        </a>

        <!-- Botón hamburguesa (solo móvil) -->
        <button
          id="menu-toggle"
          class="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-white/15 bg-black/40 text-white shadow-sm shadow-black/40 backdrop-blur transition-all duration-300 hover:bg-white/10 hover:border-white/30 md:hidden"
          aria-label="Abrir menú de navegación"
          aria-expanded="false"
          data-open="false"
        >
          <!-- Icono hamburguesa -->
          <span
            id="icon-menu"
            class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out opacity-100 scale-100 rotate-0"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M4 7h16M4 12h16M4 17h16"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>

          <!-- Icono X -->
          <span
            id="icon-close"
            class="absolute inset-0 flex items-center justify-center transition-all duration-300 ease-out opacity-0 scale-75 rotate-90"
          >
            <svg class="h-5 w-5" viewBox="0 0 24 24" fill="none">
              <path
                d="M6 6l12 12M18 6L6 18"
                stroke="currentColor"
                stroke-width="2"
                stroke-linecap="round"
              />
            </svg>
          </span>
        </button>

        <!-- Menú -->
        <ul
          id="nav-menu"
          class="md:static md:flex md:flex-row md:items-center md:gap-6 md:bg-transparent absolute left-4 right-4 top-full mt-2 flex flex-col gap-1 rounded-2xl border border-white/10 bg-black/90 px-3 py-3 shadow-xl shadow-black/40 md:mt-0 md:border-none md:px-0 md:py-0 md:shadow-none max-h-0 overflow-hidden opacity-0 -translate-y-3 pointer-events-none md:max-h-none md:opacity-100 md:translate-y-0 md:pointer-events-auto transition-all duration-300 ease-out"
        >
          <li>
            <a
              href="#nos"
              class="block w-full rounded-xl px-4 py-2 text-sm text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white md:w-auto"
              >Nos</a
            >
          </li>
          <li>
            <a
              href="#servicios"
              class="block w-full rounded-xl px-4 py-2 text-sm text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white md:w-auto"
              >Serviços</a
            >
          </li>
          <li>
            <a
              href="#proyectos"
              class="block w-full rounded-xl px-4 py-2 text-sm text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white md:w-auto"
              >Projetos</a
            >
          </li>
          <li>
            <a
              href="#contacto"
              class="block w-full rounded-xl px-4 py-2 text-sm text-white/80 transition-colors duration-200 hover:bg-white/10 hover:text-white md:w-auto"
              >Contacte-nos</a
            >
          </li>

          <li
            class="flex md:hidden items-center justify-center gap-4 px-4 pt-3 md:pt-0"
          >
            <a
              href="https://www.instagram.com/sbstudio.oficial/"
              target="_blank"
              class="text-white/70 hover:text-white text-xl"
            >
              <i class="fa-brands fa-instagram"></i>
            </a>

            <a
              href="https://linkedin.com"
              target="_blank"
              class="text-white/70 hover:text-white text-xl"
            >
              <i class="fa-brands fa-linkedin"></i>
            </a>

            <!-- <a href="https://wa.me/351939441781" target="_blank"
          class="text-white/70 hover:text-white text-xl">
          <i class="fa-brands fa-whatsapp"></i>
        </a> -->
          </li>
        </ul>
      </nav>
    </header>

    <main class="pt-18">
      <hero-section id="nos"></hero-section>
      <services-grid id="servicios"></services-grid>
      <projects-gallery id="proyectos"></projects-gallery>
      <contact-form id="contacto"></contact-form>
    </main>

    <footer class="border-t border-white/10 py-10 text-center text-sm text-gray-700 bg-gray-300">
    © <span id="year"></span> SB Studio — Todos os direitos reservados
    </footer>

    <script type="module" src="./js/main.js?v=1"></script>
  </body>
</html>
