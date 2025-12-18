// public/components/projects-gallery.js
import { LitElement, html, css } from 'lit';

class ProjectsGallery extends LitElement {
  // ✅ que Tailwind funcione dentro
  createRenderRoot() { return this; }

  static properties = {
    projects: { state: true },
  };

  static styles = css`
    :host { display: block; }
  `;

  constructor() {
    super();
    this.projects = [];
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
      const { default: GLightbox } = await import('https://cdn.jsdelivr.net/npm/glightbox/dist/js/glightbox.min.js');
      if (this._gl) this._gl.destroy();
      // ✅ limitar a los anchors de ESTA galería
      this._gl = GLightbox({ selector: `.${this._gid}` });
    }
  }

  // renderCard(p) {
  //   return html`
  //     <article class="card-glass overflow-hidden rounded-2xl shadow text-gray-800">
  //       <img
  //         src="${p.thumb}"
  //         class="w-full h-48 object-cover"
  //         loading="lazy"
  //         alt="${p.title}"
  //       />
  //       <div class="p-5">
  //         <h3 class="font-semibold">${p.title}</h3>
  //         <p class="text-sm text-gray-700">${p.desc}</p>

  //         <div class="mt-3 flex flex-wrap gap-2 text-xs text-gray-700">
  //           ${p.tech?.map(
  //             (t) => html`<span class="px-2 py-1 rounded-full border border-white">${t}</span>`
  //           )}
  //         </div>

  //         <!-- Primer enlace visible -->
  //         <a
  //           href="${p.images?.[0] ?? '#'}"
  //           class="mt-4 inline-block underline ${this._gid}"
  //           data-gallery="${p.title}"
  //         >
  //           Ver mas
  //         </a>

  //         <!-- Enlaces ocultos adicionales del mismo grupo -->
  //         ${p.images?.slice(1).map(
  //           (src) => html`<a class="hidden ${this._gid}" data-gallery="${p.title}" href="${src}">.</a>`
  //         )}
  //       </div>
  //     </article>
  //   `;
  // }
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
            Ver más
          </a>
        </div>
      </div>

    </article>
  `;
}


  render() {
    return html`
      <section class="py-20 bg-gray-300">
        <div class="mx-auto max-w-7xl px-4">
          <h2 class="text-3xl text-gray-800 font-bold mb-8 text-center md:text-left">Projectos</h2>

          <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            ${this.projects?.map((p) => this.renderCard(p))}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('projects-gallery', ProjectsGallery);
export { ProjectsGallery };
