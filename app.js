'use strict';

// Presentation-only credentials. Never use this pattern for real authentication.
const demoEmail = 'demo@sentinel.local';
const demoPassword = 'demo123';
const $ = (id) => document.getElementById(id);

function clearFile() {
  $('file-input').value = '';
  $('file-result').hidden = true;
  for (const id of ['file-name', 'file-size', 'file-type']) $(id).textContent = '';
}

$('fill-demo').addEventListener('click', () => {
  $('email').value = demoEmail;
  $('password').value = demoPassword;
  $('login-error').textContent = '';
});

$('login-form').addEventListener('submit', (event) => {
  event.preventDefault();
  if ($('email').value.trim().toLowerCase() !== demoEmail || $('password').value !== demoPassword) {
    $('login-error').textContent = 'Use the sample account shown below, or click “Fill demo credentials”.';
    return;
  }
  $('login-error').textContent = '';
  localStorage.setItem('sentinel-demo-login', 'yes');
  $('password').value = '';
  $('login-view').hidden = true;
  $('dashboard-view').hidden = false;
  $('logout').focus();
});

$('logout').addEventListener('click', () => {
  localStorage.removeItem('sentinel-demo-login');
  clearFile();
  $('login-form').reset();
  $('dashboard-view').hidden = true;
  $('login-view').hidden = false;
  $('email').focus();
});

$('file-input').addEventListener('change', () => {
  const file = $('file-input').files[0];
  if (!file) return clearFile();
  // Metadata only: no file-content reading, network requests, or execution.
  $('file-name').textContent = file.name;
  const units = ['B', 'KB', 'MB', 'GB'];
  let size = file.size;
  let unit = 0;
  while (size >= 1024 && unit < units.length - 1) { size /= 1024; unit++; }
  $('file-size').textContent = `${size.toFixed(unit ? 2 : 0)} ${units[unit]} (${file.size.toLocaleString()} bytes)`;
  $('file-type').textContent = file.type || 'Unknown / not provided by browser';
  $('file-result').hidden = false;
});
$('clear-file').addEventListener('click', clearFile);

// Remembers only the demo UI state; this is not an authentication token.
if (localStorage.getItem("sentinel-demo-login") === "yes") {
  $("login-view").hidden = true;
  $("dashboard-view").hidden = false;
}
