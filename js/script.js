// ==== CONFIG & SELECTORS ====

const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
const pageContainer = document.getElementById('page-container');
const brightnessSlider = document.getElementById('brightness-slider');

let w, h;
function resize() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
}
resize();
window.addEventListener('resize', resize);

// ==== PARTICLES ====

class Particle {
  constructor() {
    this.x = Math.random() * w;
    this.y = Math.random() * h;
    this.radius = Math.random() * 2 + 1.5;
    this.speedX = (Math.random() - 0.5) * 0.6;
    this.speedY = (Math.random() - 0.5) * 0.6;
  }
  update() {
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x < 0) this.x = w;
    else if (this.x > w) this.x = 0;
    if (this.y < 0) this.y = h;
    else if (this.y > h) this.y = 0;
  }
  draw() {
    const gradient = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radius * 4);
    gradient.addColorStop(0, 'rgba(255,0,0,0.85)');
    gradient.addColorStop(1, 'rgba(255,0,0,0)');
    ctx.fillStyle = gradient;
    ctx.shadowColor = 'rgba(255,0,0,0.9)';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

let particles = [];
function initParticles(count = 120) {
  particles = [];
  for (let i = 0; i < count; i++) particles.push(new Particle());
}
initParticles();

function connectParticles(maxDist = 140) {
  for (let i = 0; i < particles.length; i++) {
    for (let j = i + 1; j < particles.length; j++) {
      const dx = particles[i].x - particles[j].x;
      const dy = particles[i].y - particles[j].y;
      const dist = Math.sqrt(dx * dx + dy * dy);
      if (dist < maxDist) {
        ctx.beginPath();
        ctx.strokeStyle = `rgba(255,0,0,${1 - dist / maxDist})`;
        ctx.lineWidth = 1;
        ctx.shadowColor = 'rgba(255,0,0,0.6)';
        ctx.shadowBlur = 10;
        ctx.moveTo(particles[i].x, particles[i].y);
        ctx.lineTo(particles[j].x, particles[j].y);
        ctx.stroke();
      }
    }
  }
}

function animate() {
  ctx.clearRect(0, 0, w, h);
  particles.forEach(p => {
    p.update();
    p.draw();
  });
  connectParticles();
  requestAnimationFrame(animate);
}
animate();

// ==== BRIGHTNESS SLIDER ====

brightnessSlider.addEventListener('input', (e) => {
  const value = e.target.value;
  document.documentElement.style.setProperty('--brightness', value);
});

// ==== RIPPLE EFFECT ====

function addRippleEffect(elem) {
  elem.addEventListener('click', function (e) {
    const oldRipple = this.querySelector('.ripple');
    if (oldRipple) oldRipple.remove();

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = `${e.clientX - rect.left - size / 2}px`;
    ripple.style.top = `${e.clientY - rect.top - size / 2}px`;

    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// ==== THEME SWITCHING & PAGE NAVIGATION ====

const themes = ['red-black', 'gray-white', 'blue-yellow'];
let currentThemeIndex = 0;

function applyTheme(index) {
  document.body.classList.remove(...themes.map(t => `theme-${t}`));
  document.body.classList.add(`theme-${themes[index]}`);
  currentThemeIndex = index;
}

function renderMainMenu() {
  pageContainer.innerHTML = '';

  const btnMethods = document.createElement('button');
  btnMethods.textContent = 'Methods';
  btnMethods.className = 'btn';
  addRippleEffect(btnMethods);
  btnMethods.addEventListener('click', () => renderMethodsPage());
  pageContainer.appendChild(btnMethods);

  const btnDiscord = document.createElement('a');
  btnDiscord.href = 'https://discord.gg/skDSzwCScu';
  btnDiscord.target = '_blank';
  btnDiscord.className = 'btn discord';
  btnDiscord.innerHTML = `
    <svg aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512" width="20" height="20" fill="#3b6bb0" style="margin-right:8px;">
      <path d="M297.216 243.2c-13.248 0-24 11.552-24 25.856 0 14.08 10.688 25.6 24 25.6 13.184 0 24-11.52 24-25.6 0-14.304-10.688-25.856-24-25.856zm146.624-52.8c-6.208-6.464-16-7.296-23.04-2.816-34.432 20.736-70.016 32.448-107.84 32.448-37.824 0-73.408-11.712-107.84-32.448-7.04-4.48-16.896-3.648-23.04 2.816-22.08 22.528-33.984 50.112-38.4 75.584-2.88 15.04-3.136 29.696-.96 43.84 28.288 21.12 69.44 34.048 111.04 34.048 42.048 0 83.008-13.024 111.04-34.048 2.176-14.144 1.92-28.8-.96-43.84-4.416-25.472-16.32-53.056-38.4-75.584zM210.048 298.496c-15.872 0-28.672-14.72-28.672-32.832s12.8-32.832 28.672-32.832c15.104 0 27.456 14.72 27.456 32.832s-12.352 32.832-27.456 32.832zm160 0c-15.872 0-28.672-14.72-28.672-32.832s12.8-32.832 28.672-32.832c15.104 0 27.456 14.72 27.456 32.832s-12.352 32.832-27.456 32.832z"/>
    </svg>
    Our Discord
  `;
  addRippleEffect(btnDiscord);
  pageContainer.appendChild(btnDiscord);
}

function renderMethodsPage() {
  pageContainer.innerHTML = '';

  const backBtn = document.createElement('button');
  backBtn.textContent = '← Back';
  backBtn.className = 'btn back-btn';
  addRippleEffect(backBtn);
  backBtn.addEventListener('click', () => renderMainMenu());
  pageContainer.appendChild(backBtn);

  const methods = [
    { name: 'Splunk', url: 'https://app.splunk.gg/u/exmadeGG' },
    { name: 'Injuries', url: 'https://www.logged.tg/auth/exmade' },
    { name: 'Cookie Bypasser', url: 'https://app.splunk.gg/u/exmadeGG' },
    { name: 'Hyperlink Gen', url: 'https://dsprs.vercel.app/hyperlink' },
  ];

  methods.forEach(({ name, url }) => {
    const btn = document.createElement('a');
    btn.href = url;
    btn.target = '_blank';
    btn.className = 'btn';
    btn.textContent = name;
    addRippleEffect(btn);
    pageContainer.appendChild(btn);
  });
}

// ==== INIT ====

document.addEventListener('DOMContentLoaded', () => {
  renderMainMenu();
  applyTheme(0);

  // Theme switcher button
  const themeBtn = document.createElement('button');
  themeBtn.textContent = 'Change Theme';
  themeBtn.className = 'btn theme-switcher';
  addRippleEffect(themeBtn);

  themeBtn.addEventListener('click', () => {
    const next = (currentThemeIndex + 1) % themes.length;
    applyTheme(next);
  });

  document.querySelector('main').appendChild(themeBtn);
});
