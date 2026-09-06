
(function ambientNetwork() {
  const canvas = document.getElementById("bg-network");
  if (!canvas) return;

  const ctx = canvas.getContext("2d");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let width, height, dpr;
  let nodes = [];

  function resize() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    width = window.innerWidth;
    height = window.innerHeight;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = width + "px";
    canvas.style.height = height + "px";
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    initNodes();
  }

  function initNodes() {
    const density = Math.min(70, Math.floor((width * height) / 22000));
    nodes = Array.from({ length: density }, () => ({
      x: Math.random() * width,
      y: Math.random() * height * 0.85,
      vx: (Math.random() - 0.5) * 0.18,
      vy: (Math.random() - 0.5) * 0.18,
      r: Math.random() * 1.4 + 0.6,
    }));
  }

  function step() {
    ctx.clearRect(0, 0, width, height);

    for (const n of nodes) {
      n.x += n.vx;
      n.y += n.vy;
      if (n.x < 0 || n.x > width) n.vx *= -1;
      if (n.y < 0 || n.y > height * 0.85) n.vy *= -1;
    }

    const maxDist = Math.min(150, width * 0.14);

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const alpha = (1 - dist / maxDist) * 0.16;
          ctx.strokeStyle = `rgba(205, 164, 94, ${alpha})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }

    for (const n of nodes) {
      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(224, 51, 74, 0.55)";
      ctx.fill();
    }

    if (!prefersReducedMotion) requestAnimationFrame(step);
  }

  window.addEventListener("resize", resize);
  resize();
  step();
})();

(function registrationForm() {
  const form = document.getElementById("registration-form");
  if (!form) return;

  const formCard = document.getElementById("registration-form");
  const successCard = document.getElementById("success-card");

  const fields = {
    name: { el: document.getElementById("field-name"), validate: (v) => v.trim().length > 0, message: "Please enter your full name." },
    roll: {
      el: document.getElementById("field-roll"),
      validate: (v) => v.trim().length === 9,
      message: "Roll number must be exactly 9 characters (e.g. 26XX10001).",
    },
    email: {
      el: document.getElementById("field-email"),
      validate: (v) => v.trim().length > 0 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim()),
      message: "Please enter a valid email address.",
    },
    department: { el: document.getElementById("field-department"), validate: (v) => v.trim().length > 0, message: "Please select your department." },
  };

  function showError(key, show) {
    const wrapper = fields[key].el.closest(".field");
    wrapper.classList.toggle("invalid", show);
  }

  Object.keys(fields).forEach((key) => {
    fields[key].el.addEventListener("input", () => {
      const value = fields[key].el.value;
      if (fields[key].validate(value)) showError(key, false);
    });
  });

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    let allValid = true;
    Object.keys(fields).forEach((key) => {
      const value = fields[key].el.value;
      const valid = fields[key].validate(value);
      showError(key, !valid);
      if (!valid) allValid = false;
    });

    if (!allValid) {
      const firstInvalid = form.querySelector(".field.invalid input, .field.invalid select");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    document.getElementById("out-name").textContent = fields.name.el.value.trim();
    document.getElementById("out-roll").textContent = fields.roll.el.value.trim();
    document.getElementById("out-dept").textContent = fields.department.el.options[fields.department.el.selectedIndex].text;

    formCard.style.display = "none";
    successCard.classList.add("show");
    successCard.setAttribute("tabindex", "-1");
    successCard.focus();
  });

}
)
();