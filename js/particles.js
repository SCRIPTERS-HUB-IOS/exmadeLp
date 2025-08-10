(() => {
  const canvas = document.getElementById('particleCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, dpr;

  let particles = [];
  const particleCount = 80;
  const maxDist = 140;

  function random(min, max) {
    return Math.random() * (max - min) + min;
  }

  function createParticles() {
    particles = [];
    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: random(0, w),
        y: random(0, h),
        vx: random(-0.3, 0.3),
        vy: random(-0.3, 0.3),
        radius: random(1.8, 3.5),
        depth: random(0.6, 1),
      });
    }
  }

  function resize() {
    dpr = window.devicePixelRatio || 1;
    w = window.innerWidth;
    h = window.innerHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    canvas.style.width = w + 'px';
    canvas.style.height = h + 'px';
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.scale(dpr, dpr);
    createParticles();
  }

  let mouseX = 0.5;
  let mouseY = 0.5;

  window.addEventListener('mousemove', e => {
    mouseX = e.clientX / w;
    mouseY = e.clientY / h;
  });
  window.addEventListener('touchmove', e => {
    if (e.touches.length > 0) {
      mouseX = e.touches[0].clientX / w;
      mouseY = e.touches[0].clientY / h;
    }
  });

  function draw() {
    ctx.clearRect(0, 0, w, h);
    particles.forEach(p => {
      const offsetX = (mouseX - 0.5) * 20 * p.depth;
      const offsetY = (mouseY - 0.5) * 20 * p.depth;
      const x = p.x + offsetX;
      const y = p.y + offsetY;
      let grad = ctx.createRadialGradient(x, y, 0, x, y, p.radius * 3);
      grad.addColorStop(0, `rgba(255,255,255,0.18)`);
      grad.addColorStop(1, `rgba(255,255,255,0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, p.radius * 3, 0, Math.PI * 2);
      ctx.fill();

      ctx.fillStyle = `rgba(255,255,255,0.35)`;
      ctx.beginPath();
      ctx.arc(x, y, p.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const p1 = particles[i];
        const p2 = particles[j];
        const dx = p1.x - p2.x;
        const dy = p1.y - p2.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < maxDist) {
          const offsetX1 = (mouseX - 0.5) * 20 * p1.depth;
          const offsetY1 = (mouseY - 0.5) * 20 * p1.depth;
          const offsetX2 = (mouseX - 0.5) * 20 * p2.depth;
          const offsetY2 = (mouseY - 0.5) * 20 * p2.depth;

          ctx.strokeStyle = `rgba(255,255,255,${((maxDist - dist) / maxDist) * 0.13})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p1.x + offsetX1, p1.y + offsetY1);
          ctx.lineTo(p2.x + offsetX2, p2.y + offsetY2);
          ctx.stroke();
        }
      }
    }

    // Update positions
    particles.forEach(p => {
      p.x += p.vx;
      p.y += p.vy;

      if (p.x < 0 || p.x > w) p.vx *= -1;
      if (p.y < 0 || p.y > h) p.vy *= -1;
    });

    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  resize();
  draw();
})();
