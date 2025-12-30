import { LitElement, html, css } from 'lit';

class ServicesGrid extends LitElement {
  createRenderRoot() { return this; } // Necesario para Tailwind

  static styles = css`
    :host { display: block; }
  `;

  services = [
    { title: 'Website à medida', desc: 'Para empresas que querem presença profissional online', icon: './assets/icons/web2.png' },
    { title: 'Design UI/UX',        desc: 'Interfaces pensadas para converter utilizadores em clientes', icon: './assets/icons/ux.png' },
    { title: 'Branding',     desc: 'Identidade visual clara e memorável para a sua marca',    icon: './assets/icons/brand.png' },
    { title: 'E-commerce',    desc: 'Lojas online prontas para vender 24/7',       icon: './assets/icons/ecomm.png' }
  ];

  render() {
    return html`
      <section class="py-20 bg-white">
        <div class="mx-auto max-w-7xl px-4">
          <h2 class="text-3xl text-gray-800 font-bold mb-8 text-center md:text-left">Serviços</h2>

          <div class="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            ${this.services.map(
              (s) => html`
                <article
                  class="card-glass p-6 text-center group rounded-2xl transition-all duration-300"
                >
                  <div class="mx-auto w-20 h-20 perspective-1000">
                    <div class="w-full h-full">
                      <img
                        src="${s.icon}"
                        alt="${s.title}"
                        loading="lazy"
                        class="
                          w-full h-full object-contain
                          transition-transform duration-300 ease-out
                          group-hover:scale-110 cursor-pointer
                        "
                      />
                    </div>
                  </div>

                  <h3 class="mt-4 font-semibold text-lg text-gray-700">${s.title}</h3>
                  <p class="text-sm text-gray-700">${s.desc}</p>
                </article>
              `
            )}
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('services-grid', ServicesGrid);
export { ServicesGrid };
