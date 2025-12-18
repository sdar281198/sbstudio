// public/components/contact-form.js
import { LitElement, html, css } from 'lit';

export class ContactForm extends LitElement {
  // Ã¢Å“â€¦ Tailwind dentro del componente
  createRenderRoot() { return this; }

  static styles = css`
    :host { display: block; }
  `;

    toast(message, type = 'ok') {
    const bg =
      type === 'ok'
        ? 'rgba(34,197,94,.90)'   // verde
        : type === 'warn'
        ? 'rgba(31,41,55,.90)'   // amarillo
        : 'rgba(239,68,68,.92)';   // rojo

    // Toastify viene del script global (window.Toastify)
    if (!window.Toastify) {
      console.warn('Toastify no está cargado');
      alert(message);
      return;
    }

    window.Toastify({
      text: message,
      duration: 3200,
      gravity: 'top',
      position: 'center',
      close: true,
      stopOnFocus: true,
      style: {
        background: bg,
        borderRadius: '14px',
        padding: '12px 14px',
        boxShadow: '0 10px 30px rgba(0,0,0,.15)',
        backdropFilter: 'blur(8px)',
        WebkitBackdropFilter: 'blur(8px)',
        fontWeight: '600',
      },
    }).showToast();
  }

    
    // submit = async (e) => {
    //   e.preventDefault();

    //   const form = e.currentTarget;
    //   const formData = new FormData(form);

    //   // ✅ funciona en local (BASE_URL="") y en cPanel (BASE_URL="/sbstudio")
    //   const base = window.BASE_URL ?? '';
    //   const url = `${base}/backend/post-test.php`;

    //   try {
    //     const res = await fetch(url, {
    //       method: 'POST',
    //       body: formData,
    //       credentials: 'same-origin',
    //       headers: { 'Accept': 'application/json' },
    //     });

    //     const text = await res.text();

    //     let data;
    //     try {
    //       data = JSON.parse(text);
    //     } catch {
    //       console.error('Respuesta no JSON:', text);
    //       throw new Error('Respuesta inválida del servidor');
    //     }

    //     if (!res.ok) {
    //       throw new Error(data.error || `Error HTTP ${res.status}`);
    //     }

    //     this.status = data.message || 'Gracias por tu mensaje 👋';
    //     this._statusType = 'ok';
    //     form.reset();
    //   } catch (err) {
    //     console.error(err);
    //     this.status = err.message || 'Hubo un error al enviar el mensaje 😟';
    //     this._statusType = 'error';
    //   }

    //   this.requestUpdate();
    // };
    submit = async (e) => {
  e.preventDefault();

  const form = e.currentTarget;

  // 1) Crear FormData primero
  const formData = new FormData(form);

  // 2) Validación manual (antes del fetch)
  const name = formData.get('name')?.toString().trim();
  const email = formData.get('email')?.toString().trim();
  const message = formData.get('message')?.toString().trim();

  if (!name) {
    this.toast('Write your name', 'warn');
    return;
  }

  if (!email) {
    this.toast('Complete your email', 'warn');
    return;
  }

  const emailOk = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  if (!emailOk) {
    this.toast('Incorrect email', 'error');
    return;
  }

  if (!message) {
    this.toast('Let us your message', 'warn');
    return;
  }

  // 3) Fetch al backend
  const base =
  (typeof window.BASE_URL === 'string' && window.BASE_URL.length)
    ? window.BASE_URL
    : (location.pathname.startsWith('/sbstudio') ? '/sbstudio' : '');
  const url = `${base}/backend/post-test.php`;

  try {
    const res = await fetch(url, {
      method: 'POST',
      body: formData,
      credentials: 'same-origin',
      headers: { Accept: 'application/json' },
    });

    const text = await res.text();

    let data;
    try {
      data = JSON.parse(text);
    } catch {
      console.error('Respuesta no JSON:', text);
      this.toast('Respuesta inválida del servidor', 'error');
      return;
    }

    if (!res.ok) {
      this.toast(data.error || `Error HTTP ${res.status}`, 'error');
      return;
    }

    this.toast(data.message || 'Gracias por tu mensaje 👋', 'ok');
    form.reset();
  } catch (err) {
    console.error(err);
    this.toast(err.message || 'Hubo un error al enviar el mensaje 😟', 'error');
  }
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
            novalidate
            @submit=${this.submit}
            class="card-glass p-6 grid gap-4 rounded-2xl text-gray-800"
          >
            <input
              name="name"
              placeholder="Nombre"
              class="px-4 py-3 rounded-xl bg-white/5 border border-gray-700"
            />

            <input
              type="email"
              name="email"
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
              rows="5"
              placeholder="Mensaje"
              class="px-4 py-3 rounded-xl bg-white/5 border border-gray-700"
            ></textarea>

            <button
              class="px-5 py-3 rounded-xl bg-gray-800 text-white font-semibold hover:bg-gray-500 transition"
            >
              Enviar
            </button>

          </form>
        </div>
      </section>
    `;
  }
}

customElements.define('contact-form', ContactForm);
