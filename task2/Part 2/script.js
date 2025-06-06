// Theme Toggle Functionality
const themeToggleButton = document.getElementById('theme-toggle');
const body = document.body;

themeToggleButton.addEventListener('click', () => {
  body.classList.toggle('dark');
  themeToggleButton.textContent = body.classList.contains('dark') ? 'Light Theme' : 'Dark Theme';
});