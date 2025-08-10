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


// BUTTON RIPPLE EFFECT
document.querySelectorAll('.btn').forEach(btn => {
  btn.addEventListener('click', function (e) {
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
});


// THEME SWITCHER
const themes = ['red-black', 'gray-white', 'blue-yellow'];
let currentThemeIndex = 0;

const themeBtn = document.createElement('button');
themeBtn.textContent = 'Change Theme';
themeBtn.className = 'btn theme-switcher';
document.querySelector('main').appendChild(themeBtn);

function applyTheme(index) {
  document.body.classList.remove(...themes.map(t => `theme-${t}`));
  document.body.classList.add(`theme-${themes[index]}`);
  currentThemeIndex = index;
}

themeBtn.addEventListener('click', () => {
  const nextIndex = (currentThemeIndex + 1) % themes.length;
  applyTheme(nextIndex);
});

applyTheme(currentThemeIndex);
