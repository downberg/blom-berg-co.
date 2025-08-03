/*
 * Simple front‑end login handler for the CryptoHub demo site.
 *
 * This script listens for the login form submission, stores the
 * username in localStorage (purely for client‑side demonstration
 * purposes), and displays a confirmation message. No actual
 * authentication or backend communication takes place. Never store
 * real passwords like this in production.
 */

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('login-form');
  const statusEl = document.getElementById('login-status');

  if (!form) return;

  // If a user is already "logged in", show a greeting
  const savedUser = localStorage.getItem('cryptohubUser');
  if (savedUser) {
    statusEl.textContent = `Willkommen zurück, ${savedUser}!`;
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (!username || !password) {
      statusEl.textContent = 'Bitte geben Sie Benutzername und Passwort ein.';
      return;
    }
    // Store username in localStorage for demo purposes
    localStorage.setItem('cryptohubUser', username);
    // Show confirmation message
    statusEl.textContent = `Erfolgreich angemeldet als ${username}. (Demo‑Login)`;
    // Clear the form fields
    form.reset();
  });
});