/**
 * Interactive Login Page
 * Uses Stitch screen design with real authentication
 */

import { api } from '../api.js';
import { router } from '../router.js';
import { showToast } from '../components.js';
import { renderer } from '../template-renderer.js';

export async function renderLogin() {
  const app = document.getElementById('app');

  try {
    // Load Stitch template
    const template = await renderer.loadTemplate('Traveloop - Interactive Login');
    const bodyContent = renderer.extractBody(template);

    // Render template into DOM
    app.innerHTML = bodyContent;

    // Bind login form
    bindLoginForm();
  } catch (error) {
    app.innerHTML = `
      <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <p class="text-error mb-4">Failed to load login page</p>
          <button class="btn-primary" onclick="location.reload()">Retry</button>
        </div>
      </div>
    `;
  }
}

function bindLoginForm() {
  // Find form or login button
  const form = document.querySelector('form');
  const loginButton = document.querySelector('[onclick*="login"]') || 
                      Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Login') || b.textContent.includes('Sign'));

  const handleLogin = async (e) => {
    if (e) e.preventDefault();

    // Get values from input IDs (Stitch screens use IDs, not names)
    const usernameInput = document.getElementById('username');
    const passwordInput = document.getElementById('password');
    
    const username = usernameInput?.value || '';
    const password = passwordInput?.value || '';

    if (!username || !password) {
      showToast('Please fill in all fields', 'error');
      return;
    }

    try {
      const response = await api.auth.login(username, password);

      // Store token and user
      localStorage.setItem('token', response.access_token);
      localStorage.setItem('user', JSON.stringify(response.user || { username }));

      showToast('Login successful!', 'success');
      setTimeout(() => router.navigate('/trips'), 500);
    } catch (error) {
      showToast(`Login failed: ${error.message}`, 'error');
    }
  };

  // Bind to form or button
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
  if (loginButton) {
    loginButton.addEventListener('click', handleLogin);
  }

  // Auto-focus first input
  const firstInput = document.querySelector('input[type="text"], input[type="email"]');
  if (firstInput) firstInput.focus();
}
