import '../components/hero-section.js';
import '../components/services-grid.js';
import '../components/projects-gallery.js';
import '../components/contact-form.js';
import '../components/glb-icon.js'
import '../components/interactive-bg.js'
import './three-logo.js'; 

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#nav-menu');
  const iconMenu = document.querySelector('#icon-menu');
  const iconClose = document.querySelector('#icon-close');

  if (!btn || !menu) return;

  const openClasses = ['opacity-100', 'translate-y-0', 'pointer-events-auto', 'max-h-80'];
  const closeClasses = ['opacity-0', '-translate-y-3', 'pointer-events-none', 'max-h-0'];

  function openMenu() {
    menu.classList.remove(...closeClasses);
    menu.classList.add(...openClasses);

    iconMenu.classList.remove('opacity-100', 'scale-100', 'rotate-0');
    iconMenu.classList.add('opacity-0', 'scale-75', '-rotate-90');

    iconClose.classList.remove('opacity-0', 'scale-75', 'rotate-90');
    iconClose.classList.add('opacity-100', 'scale-100', 'rotate-0');

    btn.setAttribute('aria-expanded', 'true');
    btn.dataset.open = 'true';
  }

  function closeMenu() {
    menu.classList.remove(...openClasses);
    menu.classList.add(...closeClasses);

    iconMenu.classList.remove('opacity-0', 'scale-75', '-rotate-90');
    iconMenu.classList.add('opacity-100', 'scale-100', 'rotate-0');

    iconClose.classList.remove('opacity-100', 'scale-100', 'rotate-0');
    iconClose.classList.add('opacity-0', 'scale-75', 'rotate-90');

    btn.setAttribute('aria-expanded', 'false');
    btn.dataset.open = 'false';
  }

  btn.addEventListener('click', () => {
    const isOpen = btn.dataset.open === 'true';
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  // Cerrar al hacer click en un enlace (en móvil)
  menu.querySelectorAll('a').forEach(link => {
    link.addEventListener('click', () => {
      if (window.innerWidth < 768) {
        closeMenu();
      }
    });
  });
});
