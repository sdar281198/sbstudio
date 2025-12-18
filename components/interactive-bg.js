class InteractiveBG extends HTMLElement {
  connectedCallback() {
    const canvas = document.createElement("canvas");
    canvas.width = this.clientWidth;
    canvas.height = this.clientHeight;
    canvas.style.width = "100%";
    canvas.style.height = "100%";
    this.appendChild(canvas);

    const ctx = canvas.getContext("2d");
    const particles = [];

    const colors = ["#4f46e5", "#06b6d4", "#3b82f6"]; // morado/cian/azul

    for (let i = 0; i < 40; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: 6 + Math.random() * 10,
        dx: (Math.random() - 0.5) * 0.6,
        dy: (Math.random() - 0.5) * 0.6,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // degradado suave del fondo
      const grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      grad.addColorStop(0, "#0f172a"); // azul muy oscuro
      grad.addColorStop(1, "#1e3a8a"); // azul más claro
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // partículas
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;

        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + "88";
        ctx.fill();
      });

      requestAnimationFrame(draw);
    };

    draw();
  }
}

customElements.define("interactive-bg", InteractiveBG);
