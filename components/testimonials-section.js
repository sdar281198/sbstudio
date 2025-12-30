// public/components/testimonials-section.js
import { LitElement, html, css } from 'lit';

class TestimonialsSection extends LitElement {
  createRenderRoot() { return this; } // Tailwind OK

  static styles = css`
    :host { display: block; }
  `;

  // Datos dinámicos (PT-PT). Cambia nombres/roles y textos cuando quieras.
  testimonials = [
    {
      quote:
        'A SB Studio entregou um website profissional, rápido e com uma estética incrível. O processo foi simples e o resultado superou as expectativas.',
      name: 'Maria Beatriz',
      role: 'Fundadora, Bakery SMF',
      avatar: './assets/images/bebe.jpg',
    },
    {
      quote:
        'Excelente comunicação e atenção ao detalhe. Senti acompanhamento real do início ao fim,isso faz toda a diferença.',
      name: 'Harold Ormeño',
      role: 'CEO, Prato Entertainment',
      avatar: './assets/images/harold.jpg',
    },
    {
      quote:
        'Depois das melhorias no site, notámos mais pedidos de contacto. Recomendo a SB Studio a qualquer negócio que queira crescer no digital.',
      name: 'Vincenzo Canale',
      role: 'CEO, Tool Peru',
      avatar: './assets/images/bri.jpg',
    },
  ];

  render() {
    return html`
      <section class="py-20 bg-white text-gray-700">
        <div class="mx-auto max-w-7xl px-4">
          <!-- Cabeçalho -->
          <div class="mb-10">
            <p class="text-xs tracking-[0.18em] uppercase text-white/60">
              O que dizem os clientes
            </p>
            <h2 class="text-4xl text-gray-800 md:text-5xl font-bold mt-2">
              Testemunhos<span class="text-white/60">.</span>
            </h2>
          </div>

          <!-- “Painel” elegante (fundo escuro + cartão interno) -->
          <div
            class="bg-gray-300 rounded-3xl border border-white/10 from-white/5 to-white/0 p-6 md:p-10 shadow-[0_30px_120px_rgba(0,0,0,.55)]"
          >
            <div class="grid md:grid-cols-3 gap-6">
              ${this.testimonials.map(
                (t) => html`
                  <article
                    class="rounded-3xl border border-white/10 bg-white/10 backdrop-blur p-6 md:p-7 shadow-[0_20px_60px_rgba(0,0,0,.35)] hover:bg-white/15 transition"
                  >
                    <!-- Aspas -->
                    <div class="text-gray-800 text-3xl leading-none">“</div>

                    <!-- Texto -->
                    <p class="mt-3 text-gray-600 leading-relaxed">
                      ${t.quote}
                    </p>

                    <!-- Rodapé -->
                    <div class="mt-6 flex items-center justify-between gap-4">
                      <div>
                        <p class="font-semibold text-gray-800">${t.name}</p>
                        <p class="text-xs text-gray.700">${t.role}</p>
                      </div>

                      <div
                        class="h-11 w-11 rounded-full overflow-hidden border border-white/15 bg-white/5 flex items-center justify-center"
                        title="${t.name}"
                      >
                        ${t.avatar
                          ? html`<img
                              src="${t.avatar}"
                              alt="${t.name}"
                              class="h-full w-full object-cover"
                              loading="lazy"
                            />`
                          : html`<span class="text-white/70 text-sm font-bold">
                              ${t.name?.[0] ?? 'S'}
                            </span>`}
                      </div>
                    </div>
                  </article>
                `
              )}
            </div>

            <!-- CTA pequeno (liga com o embudo) -->
            <div class="mt-10 flex flex-col lg:flex-row items-start md:items-center justify-between gap-4">
              <p class="text-gray-700">
                Quer um resultado assim no seu negócio? Conte-nos a sua ideia.
              </p>

              <a
                href="#contacto"
                class="inline-flex items-center gap-2 mx-auto md:m-0 rounded-2xl border bg-gray-800 px-5 py-3 font-semibold  text-white hover:bg-gray-500 transition"
              >
                Pedir orçamento
                <span class="text-white/70">→</span>
              </a>
            </div>
          </div>
        </div>
      </section>
    `;
  }
}

customElements.define('testimonials-section', TestimonialsSection);
export { TestimonialsSection };
