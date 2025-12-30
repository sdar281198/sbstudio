import '../components/hero-section.js';
import '../components/services-grid.js';
import '../components/projects-gallery.js';
import '../components/contact-form.js';
import '../components/glb-icon.js'
import '../components/interactive-bg.js'
import './three-logo.js'; 
import '../components/testimonials-section.js';

document.addEventListener('DOMContentLoaded', () => {
  const btn = document.querySelector('#menu-toggle');
  const menu = document.querySelector('#nav-menu');
  const iconMenu = document.querySelector('#icon-menu');
  const iconClose = document.querySelector('#icon-close');

  const hasMenu = btn && menu;

  // -------------------------
  // MENU (só se existir)
  // -------------------------
  if (hasMenu) {
    const openClasses = ['opacity-100', 'translate-y-0', 'pointer-events-auto', 'max-h-80'];
    const closeClasses = ['opacity-0', '-translate-y-3', 'pointer-events-none', 'max-h-0'];

    function openMenu() {
      menu.classList.remove(...closeClasses);
      menu.classList.add(...openClasses);

      if (iconMenu) {
        iconMenu.classList.remove('opacity-100', 'scale-100', 'rotate-0');
        iconMenu.classList.add('opacity-0', 'scale-75', '-rotate-90');
      }

      if (iconClose) {
        iconClose.classList.remove('opacity-0', 'scale-75', 'rotate-90');
        iconClose.classList.add('opacity-100', 'scale-100', 'rotate-0');
      }

      btn.setAttribute('aria-expanded', 'true');
      btn.dataset.open = 'true';
    }

    function closeMenu() {
      menu.classList.remove(...openClasses);
      menu.classList.add(...closeClasses);

      if (iconMenu) {
        iconMenu.classList.remove('opacity-0', 'scale-75', '-rotate-90');
        iconMenu.classList.add('opacity-100', 'scale-100', 'rotate-0');
      }

      if (iconClose) {
        iconClose.classList.remove('opacity-100', 'scale-100', 'rotate-0');
        iconClose.classList.add('opacity-0', 'scale-75', 'rotate-90');
      }

      btn.setAttribute('aria-expanded', 'false');
      btn.dataset.open = 'false';
    }

    btn.addEventListener('click', () => {
      const isOpen = btn.dataset.open === 'true';
      if (isOpen) closeMenu();
      else openMenu();
    });

    menu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        if (window.innerWidth < 768) closeMenu();
      });
    });
  }

  // -------------------------
  // FLOATING CTA (independente do menu)
  // -------------------------
  const floatingCta = document.querySelector('#floatingCta');
  const whatsappCta = document.querySelector('#whatsappCta');
  const contactEl = document.querySelector('#contacto');

  if (floatingCta) {
    const toggleFloating = () => {
      const y = window.scrollY || document.documentElement.scrollTop;
      if (y > 180) floatingCta.classList.add('is-visible');
      else floatingCta.classList.remove('is-visible');
      if (y > 180) {
      floatingCta.classList.add('is-visible');
      whatsappCta?.classList.add('is-visible');
      } else {
        floatingCta.classList.remove('is-visible');
        whatsappCta?.classList.remove('is-visible');
      }

    };

    toggleFloating();
    window.addEventListener('scroll', toggleFloating, { passive: true });

    floatingCta.addEventListener('click', (e) => {
      if (contactEl) {
        e.preventDefault();
        const headerOffset = 90;
        const rect = contactEl.getBoundingClientRect();
        const targetY = rect.top + window.pageYOffset - headerOffset;
        window.scrollTo({ top: targetY, behavior: 'smooth' });
      }
    });
  }
});
