// public/components/contact-form.js
import { LitElement, html, css } from 'lit';

export class ContactForm extends LitElement {
  // Ã¢Å“â€¦ Tailwind dentro del componente
  createRenderRoot() { return this; }

  static styles = css`
    :host { display: block; }
  `;

  // estado
    status = '';
    _statusType = 'ok';
    
    submit = async (e) => {
      e.preventDefault();

      const form = e.currentTarget;
      const formData = new FormData(form);

      // ✅ funciona en local (BASE_URL="") y en cPanel (BASE_URL="/sbstudio")
      const base = window.BASE_URL ?? '';
      const url = `${base}/backend/post-test.php`;

      try {
        const res = await fetch(url, {
          method: 'POST',
          body: formData,
          credentials: 'same-origin',
          headers: { 'Accept': 'application/json' },
        });

        const text = await res.text();

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          console.error('Respuesta no JSON:', text);
          throw new Error('Respuesta inválida del servidor');
        }

        if (!res.ok) {
          throw new Error(data.error || `Error HTTP ${res.status}`);
        }

        this.status = data.message || 'Gracias por tu mensaje 👋';
        this._statusType = 'ok';
        form.reset();
      } catch (err) {
        console.error(err);
        this.status = err.message || 'Hubo un error al enviar el mensaje 😟';
        this._statusType = 'error';
      }

      this.requestUpdate();
    };





  render() {
    return html`
      <section class="py-20 bg-white">
        <div class="mx-auto max-w-5xl px-4 grid md:grid-cols-2 gap-8 items-start">
          <!-- Lado izquierdo -->
          <div class="text-center md:text-left">
            <h2 class="text-3xl font-bold text-gray-800">Vamos conversar</h2>
            <p class="text-gray-700 mt-2 mb-[1rem]">
              Conte-nos a sua ideia e entraremos em contacto consigo em menos de 24 horas.
            </p>
            <div class="w-82 md:w-full mx-auto h-80 rounded-xl overflow-hidden">
             <iframe 
             src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d24114.151935243874!2d-8.568880045589045!3d40.93177148950994!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xd2380dd89655459%3A0x8ea3240b8174a23a!2sSanta%20Maria%20da%20Feira!5e0!3m2!1ses!2spt!4v1764944610403!5m2!1ses!2spt" 
             class="block w-[90%] mx-auto md:w-full h-full"
             style="border-0"
             allowfullscreen="" 
             loading="lazy" 
             referrerpolicy="no-referrer-when-downgrade"></iframe>
            </div>

          </div>

          <!-- Formulario -->
          <form
            @submit=${this.submit}
            class="card-glass p-6 grid gap-4 rounded-2xl"
          >
            <input
              name="name"
              required
              placeholder="Nombre"
              class="px-4 py-3 rounded-xl bg-white/5 border border-gray-700"
            />

            <input
              type="email"
              name="email"
              required
              placeholder="Email"
              class="px-4 py-3 rounded-xl bg-white/5 border border-gray-700"
            />

            <input
              name="subject"
              placeholder="Asunto"
              class="px-4 py-3 rounded-xl bg-white/5 border border-gray-700"
            />

            <textarea
              name="message"
              required
              rows="5"
              placeholder="Mensaje"
              class="px-4 py-3 rounded-xl bg-white/5 border border-gray-700"
            ></textarea>

            <button
              class="px-5 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-500 transition"
            >
              Enviar
            </button>

            ${this.status
              ? html`
                  <p class="text-sm mt-2 ${this._statusType === 'ok' ? 'text-emerald-400' : 'text-red-400'}">
                    ${this.status}
                  </p>`
              : ''}

          </form>
        </div>
      </section>
    `;
  }
}

customElements.define('contact-form', ContactForm);
