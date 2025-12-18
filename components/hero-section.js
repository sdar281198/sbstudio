// public/components/hero-section.js
import { LitElement, html, css } from 'lit';

export class HeroSection extends LitElement {
  // Tailwind dentro del componente
  createRenderRoot() { return this; }

  static styles = css`
    :host { display: block; }
  `;
  
    firstUpdated() {
      const canvas = this.querySelector('#logoCanvas');
    
      import('/sbstudio/js/three-logo.js?v=20251216a')
        .then((mod) => mod.initThreeLogo(canvas))
        .catch((e) => console.error('No se pudo cargar three-logo.js', e));
    }


  render() {
    return html`
      <section class="hero-gradient relative">
        <div class="mx-auto max-w-7xl px-4 py-28 grid md:grid-cols-2 items-center gap-10">
          <div>
            <h1 class="text-4xl md:text-6xl font-extrabold leading-tight text-center md:text-left">
              Soluções <b>Web</b> + <b>Branding</b> com atitude
            </h1>

            <p class="mt-4 text-white/80 max-w-prose text-center md:text-left text-lg md:text-xl">
              Desenvolvemos websites e sistemas personalizados, e criamos identidades visuais que se destacam.
            </p>

            <div class="mt-8 flex flex-col md:flex-row gap-4 items-center md:items-start">
              <a href="#proyectos"
                class="px-4 py-2 md:px-5 md:py-3 rounded-xl bg-white text-black font-semibold text-sm md:text-base">
                Ver projetos
              </a>

              <a href="#contacto"
                class="px-4 py-2 md:px-5 md:py-3 rounded-xl border border-white/40 text-sm md:text-base">
                Contacte-nos
              </a>
            </div>
          </div>
          <div class="relative w-full max-w-[560px] mx-auto md:mx-0 aspect-[16/9] md:aspect-[16/9] card-glass overflow-hidden">
          <canvas id="logoCanvas" class="absolute inset-0 w-full h-full block"></canvas>
        </div>

        </div>
      </section>
    `;
  }
}

customElements.define('hero-section', HeroSection);
