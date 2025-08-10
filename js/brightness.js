document.addEventListener('DOMContentLoaded', () => {
  const brightnessRange = document.getElementById('brightnessRange');
  brightnessRange.addEventListener('input', e => {
    const val = e.target.value;
    document.documentElement.style.setProperty('--brightness', val / 100);
    brightnessRange.setAttribute('aria-valuenow', val);
  });
});
