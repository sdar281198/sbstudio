// public/components/projects-gallery.js
import { LitElement, html, css } from 'lit';

class ProjectsGallery extends LitElement {
  
  // ✅ que Tailwind funcione dentro
  createRenderRoot() { return this; }

  static properties = {
    projects: { state: true },
    expanded: { state: true },
    _maxH: { state: true },
  };

  static styles = css`
    :host { display: block; }
  `;

  constructor() {
    super();
    this.projects = [];
    this.expanded = false;
    this._maxH = null;
    this._pid = `pg-${Math.random().toString(36).slice(2)}`; // id único wrapper
    this._ro = null;

    // id único por instancia para aislar el selector de GLightbox
    this._gid = `gl-${Math.random().toString(36).slice(2)}`;
    this._gl = null;
  }

  connectedCallback() {
    super.connectedCallback();
    // ✅ ruta relativa al /public
    fetch('./data/projects.json')
      .then((r) => r.json())
      .then((d) => { this.projects = d || []; })
      .catch((e) => console.error('Error cargando projects.json', e));
  }

  // Re-inicializa GLightbox cuando cambie "projects"
  async updated(changed) {
    if (changed.has('projects') && this.projects?.length) {
      const mod = await import('https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js');
      const GLightbox = mod.default || mod.GLightbox || window.GLightbox;

      if (typeof GLightbox !== 'function') {
        console.error('GLightbox no cargó bien', mod);
        return;
      }

      if (this._gl) this._gl.destroy();
      this._gl = GLightbox({ selector: `.${this._gid}` });
    }
    // ✅ altura recortada mobile + recalculo reactivo
    if (changed.has('projects')) {
      requestAnimationFrame(() => this._recalcCollapsedHeight());

      if (!this._ro) {
        this._ro = new ResizeObserver(() => this._recalcCollapsedHeight());
        const wrap = this.querySelector(`#${this._pid}`);
        if (wrap) this._ro.observe(wrap);
        window.addEventListener('resize', () => this._recalcCollapsedHeight());
      }
    }

    if (changed.has('expanded')) {
      requestAnimationFrame(() => this._recalcCollapsedHeight());
    }

  }
  toggleExpand() {
  this.expanded = !this.expanded;
}

  _isMobile() {
    return window.matchMedia('(max-width: 767px)').matches;
  }

  _recalcCollapsedHeight() {
    const wrap = this.querySelector(`#${this._pid}`);
    const grid = wrap?.querySelector('[data-grid]');
    if (!wrap || !grid) return;

    if (!this._isMobile() || this.expanded) {
      this._maxH = null;
      return;
    }

    const cards = Array.from(grid.querySelectorAll('article'));
    if (cards.length < 2) {
      this._maxH = null;
      return;
    }

    const h1 = cards[0].getBoundingClientRect().height;
    const h2 = cards[1].getBoundingClientRect().height;
    const h3 = cards[2]?.getBoundingClientRect().height ?? h2;

    const style = getComputedStyle(grid);
    const gap = parseFloat(style.rowGap || style.gap || '0') || 0;

    const previewThird = Math.max(70, h3 * 0.25);
    this._maxH = Math.ceil(h1 + gap + h2 + previewThird + 8);
  }
  renderCard(p) {
  return html`
    <article class="group relative card-glass overflow-hidden rounded-2xl shadow text-gray-800">
      
      <!-- Imagen -->
      <img
        src="${p.thumb}"
        class="w-full h-48 object-cover"
        loading="lazy"
        alt="${p.title}"
      />

      <!-- Contenido -->
      <div class="p-5 relative z-10">
        <h3 class="font-semibold">${p.title}</h3>
        <p class="text-sm text-gray-700">${p.desc}</p>

        <div class="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
          ${p.tech?.map(
            (t) => html`<span class="px-2 py-1 rounded-full border border-white">${t}</span>`
          )}
        </div>

        <!-- Enlaces ocultos -->
        ${p.images?.slice(1).map(
          (src) => html`<a class="hidden ${this._gid}" data-gallery="${p.title}" href="${src}">.</a>`
        )}
      </div>

      <!-- OVERLAY HOVER -->
      <div
        class="
          absolute inset-0 z-20 flex items-center justify-center
          bg-black/60 opacity-0
          transition-opacity duration-300
          group-hover:opacity-100
        "
      >
        <div class="flex gap-3">
          <!-- Botón Visitar (si tienes URL en tu JSON: p.url) -->
          ${p.url ? html`
            <a
              href="${p.url}"
              target="_blank"
              rel="noopener"
              class="px-5 py-2 rounded-xl bg-white text-black font-semibold text-sm"
            >
              Visitar
            </a>
          ` : ''}

          <!-- Botón Ver más (abre lightbox) -->
          <a
            href="${p.images?.[0] ?? '#'}"
            class="px-5 py-2 rounded-xl border border-white text-white font-semibold text-sm ${this._gid}"
            data-gallery="${p.title}"
          >
            Ver mais
          </a>
        </div>
      </div>

    </article>
  `;
}


  render() {
  const maxHStyle =
    this._maxH && !this.expanded ? `max-height:${this._maxH}px;` : '';

  return html`
    <section class="py-20 bg-gray-300">
      <div class="mx-auto max-w-7xl px-4">
        <h2 class="text-3xl text-gray-800 font-bold mb-8 text-center md:text-left">
          Projectos
        </h2>

        <!-- Wrapper colapsable -->
        <div
          id="${this._pid}"
          class="relative transition-[max-height] duration-500 ease-in-out overflow-hidden md:overflow-visible"
          style="${maxHStyle}"
        >
          <div data-grid class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${this.projects?.map((p) => this.renderCard(p))}
          </div>

          <!-- Fade/sombra SOLO en mobile cuando está colapsado -->
          <div
            class="
              pointer-events-none absolute left-0 right-0 bottom-0 h-28
              bg-gradient-to-b from-transparent to-gray-300
              transition-opacity duration-300
              md:hidden
              ${this.expanded ? 'opacity-0' : 'opacity-100'}
            "
          ></div>
        </div>

        <!-- Botón Ver más / Ver menos (solo mobile) -->
        <div class="mt-6 flex justify-center md:hidden">
          <button
            @click=${this.toggleExpand}
            class="
              px-5 py-2 rounded-xl
              border border-gray-700/30
              bg-white/60 backdrop-blur
              text-gray-800 font-semibold text-sm
              hover:bg-white/80 transition
            "
          >
            ${this.expanded ? 'Ver menos' : 'Ver más'}
          </button>
        </div>
      </div>
    </section>
  `;
}

}

customElements.define('projects-gallery', ProjectsGallery);
export { ProjectsGallery };
