// PARTICLE BACKGROUND
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particlesArray = [];
let w, h;

function initCanvas() {
  w = window.innerWidth;
  h = window.innerHeight;
  canvas.width = w;
  canvas.height = h;
}
initCanvas();

window.addEventListener('resize', () => {
  initCanvas();
  particlesArray = [];
  createParticles();
});

function Particle() {
  this.x = Math.random() * w;
  this.y = Math.random() * h;
  this.size = Math.random() * 2 + 1;
  this.speedX = (Math.random() - 0.5) * 0.4;
  this.speedY = (Math.random() - 0.5) * 0.4;
  this.color = 'rgba(255,255,255,0.15)';
}

Particle.prototype.update = function () {
  this.x += this.speedX;
  this.y += this.speedY;

  if (this.x < 0) this.x = w;
  if (this.x > w) this.x = 0;
  if (this.y < 0) this.y = h;
  if (this.y > h) this.y = 0;
};

Particle.prototype.draw = function () {
  ctx.beginPath();
  ctx.fillStyle = this.color;
  ctx.shadowColor = 'rgba(255, 255, 255, 0.3)';
  ctx.shadowBlur = 4;
  ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
  ctx.fill();
};

function createParticles() {
  const count = Math.floor((w * h) / 12000);
  for (let i = 0; i < count; i++) {
    particlesArray.push(new Particle());
  }
}
createParticles();

function animateParticles() {
  ctx.clearRect(0, 0, w, h);
  particlesArray.forEach(p => {
    p.update();
    p.draw();
  });
  requestAnimationFrame(animateParticles);
}
animateParticles();

// BRIGHTNESS SLIDER
const brightnessSlider = document.getElementById('brightnessSlider');
if (brightnessSlider) {
  brightnessSlider.value = 100; // default 100%
  brightnessSlider.addEventListener('input', (e) => {
    const val = e.target.value / 100;
    document.documentElement.style.setProperty('--brightness', val);
  });
}

// BUTTON RIPPLE EFFECT HELPER
function addRippleEffect(element) {
  element.addEventListener('click', function (e) {
    const oldRipple = this.querySelector('.ripple');
    if (oldRipple) oldRipple.remove();

    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);

    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = (e.clientX - rect.left - size / 2) + 'px';
    ripple.style.top = (e.clientY - rect.top - size / 2) + 'px';

    ripple.addEventListener('animationend', () => ripple.remove());
  });
}

// THEME SWITCHER
const themes = ['red-black', 'gray-white', 'blue-yellow'];
let currentThemeIndex = 0;

function applyTheme(index) {
  document.body.classList.remove(...themes.map(t => `theme-${t}`));
  document.body.classList.add(`theme-${themes[index]}`);
  currentThemeIndex = index;
}

// Create theme switcher button once, add ripple
const themeBtn = document.createElement('button');
themeBtn.textContent = 'Change Theme';
themeBtn.className = 'btn theme-switcher';

// PAGE MANAGEMENT
const pageContainer = document.getElementById('page-container');

function renderMainMenu() {
  pageContainer.innerHTML = '';

  // Methods button
  const btnMethods = document.createElement('button');
  btnMethods.textContent = 'Methods';
  btnMethods.className = 'btn';
  addRippleEffect(btnMethods);
  btnMethods.addEventListener('click', () => {
    renderMethodsPage();
  });
  pageContainer.appendChild(btnMethods);

  // Our Discord button with SVG
  const btnDiscord = document.createElement('a');
  btnDiscord.href = 'https://discord.gg/skDSzwCScu';
  btnDiscord.target = '_blank';
  btnDiscord.className = 'btn discord';
  btnDiscord.innerHTML = `
    <svg aria-hidden="true" focusable="false" data-prefix="fab" data-icon="discord"
      class="svg-inline--fa fa-discord fa-w-14" role="img" xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 640 512" width="20" height="20" fill="#3b6bb0" style="margin-right:8px;">
      <path
        d="M297.216 243.2c-13.248 0-24 11.552-24 25.856 0 14.08 10.688 25.6 24 25.6 13.184 0 24-11.52 24-25.6 0-14.304-10.688-25.856-24-25.856zm146.624-52.8c-6.208-6.464-16-7.296-23.04-2.816-34.432 20.736-70.016 32.448-107.84 32.448-37.824 0-73.408-11.712-107.84-32.448-7.04-4.48-16.896-3.648-23.04 2.816-22.08 22.528-33.984 50.112-38.4 75.584-2.88 15.04-3.136 29.696-.96 43.84 28.288 21.12 69.44 34.048 111.04 34.048 42.048 0 83.008-13.024 111.04-34.048 2.176-14.144 1.92-28.8-.96-43.84-4.416-25.472-16.32-53.056-38.4-75.584zM210.048 298.496c-15.872 0-28.672-14.72-28.672-32.832s12.8-32.832 28.672-32.832c15.104 0 27.456 14.72 27.456 32.832s-12.352 32.832-27.456 32.832zm160 0c-15.872 0-28.672-14.72-28.672-32.832s12.8-32.832 28.672-32.832c15.104 0 27.456 14.72 27.456 32.832s-12.352 32.832-27.456 32.832z" />
    </svg>
    Our Discord
  `;
  addRippleEffect(btnDiscord);
  pageContainer.appendChild(btnDiscord);
}

function renderMethodsPage() {
  pageContainer.innerHTML = '';

  // Back button
  const backBtn = document.createElement('button');
  backBtn.textContent = '← Back';
  backBtn.className = 'btn back-btn';
  addRippleEffect(backBtn);
  backBtn.addEventListener('click', () => {
    renderMainMenu();
  });
  pageContainer.appendChild(backBtn);

  // Methods buttons data
  const methods = [
    { name: 'Splunk', url: 'https://app.splunk.gg/u/exmadeGG' },
    { name: 'Injuries', url: 'https://www.logged.tg/auth/exmade' },
    { name: 'Cookie Bypasser', url: 'https://app.splunk.gg/u/exmadeGG' },
    { name: 'Hyperlink Gen', url: 'https://dsprs.vercel.app/hyperlink' },
  ];

  methods.forEach(m => {
    const btn = document.createElement('a');
    btn.href = m.url;
    btn.target = '_blank';
    btn.className = 'btn';
    btn.textContent = m.name;
    addRippleEffect(btn);
    pageContainer.appendChild(btn);
  });
}

// Initialize app
renderMainMenu();
applyTheme(currentThemeIndex);
document.querySelector('main').appendChild(themeBtn);
addRippleEffect(themeBtn);

themeBtn.addEventListener('click', () => {
  const nextIndex = (currentThemeIndex + 1) % themes.length;
  applyTheme(nextIndex);
});
