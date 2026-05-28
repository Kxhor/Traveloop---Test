import { api } from './api.js';
import { router } from './router.js';

export function showToast(message, type = 'info') {
  const container = document.getElementById('toast-container');
  const toast = document.createElement('div');
  toast.className = `toast toast-${type}`;
  const icon = type === 'success' ? 'check_circle' : type === 'error' ? 'error' : 'info';
  toast.innerHTML = `<span class="material-symbols-outlined">${icon}</span><span>${message}</span>`;
  container.appendChild(toast);
  setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 0.3s'; }, 3000);
  setTimeout(() => toast.remove(), 3500);
}

export function showModal(content) {
  const overlay = document.getElementById('modal-overlay');
  overlay.innerHTML = `<div class="bg-surface-container-lowest border border-outline-variant rounded-xl p-8 max-w-lg w-full mx-4 shadow-2xl animate-fade-in">${content}</div>`;
  overlay.classList.remove('hidden');
  overlay.classList.add('flex');
  overlay.addEventListener('click', (e) => {
    if (e.target === overlay) closeModal();
  }, { once: true });
}

export function closeModal() {
  const overlay = document.getElementById('modal-overlay');
  overlay.classList.add('hidden');
  overlay.classList.remove('flex');
  overlay.innerHTML = '';
}

export function formatDate(dateStr) {
  if (!dateStr) return '---';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export function formatCurrency(amount) {
  if (amount == null) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export function daysBetween(d1, d2) {
  if (!d1 || !d2) return 0;
  const a = new Date(d1), b = new Date(d2);
  return Math.ceil((b - a) / (1000 * 60 * 60 * 24)) + 1;
}

export function renderAppShell(activePage) {
  const user = api.auth.getUser();
  const username = user?.username || 'Explorer';

  return `
    <!-- Desktop Sidebar -->
    <aside class="sidebar-desktop fixed left-0 top-0 w-[260px] h-screen border-r border-outline-variant bg-surface-container-lowest flex flex-col py-6 px-4 z-50">
      <div class="mb-8 px-2 flex items-center gap-3">
        <div class="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <span class="material-symbols-outlined text-white">flight_takeoff</span>
        </div>
        <div>
          <h1 class="text-headline-md font-headline-md font-bold text-primary">Traveloop</h1>
          <p class="text-label-sm text-on-surface-variant">Premium Travel</p>
        </div>
      </div>
      <nav class="flex-1 space-y-2" id="sidebar-nav">
        <a href="#/trips" class="sidebar-link ${activePage === 'trips' ? 'active' : ''}">
          <span class="material-symbols-outlined">explore</span>
          <span class="font-body-md">My Trips</span>
        </a>
        <a href="#/plan-trip" class="sidebar-link ${activePage === 'plan-trip' ? 'active' : ''}">
          <span class="material-symbols-outlined">add_trip</span>
          <span class="font-body-md">Plan New Trip</span>
        </a>
      </nav>
      <div class="mt-auto space-y-2 border-t border-outline-variant pt-4">
        <a href="#" id="btn-new-trip-sidebar" class="btn-primary w-full justify-center">
          <span class="material-symbols-outlined">add</span>
          New Trip
        </a>
        <div class="flex items-center gap-3 px-4 py-3 text-on-surface">
          <span class="material-symbols-outlined">person</span>
          <span class="font-body-md truncate">${username}</span>
        </div>
        <button id="btn-logout" class="sidebar-link w-full text-error hover:bg-error-container/20">
          <span class="material-symbols-outlined">logout</span>
          <span class="font-body-md">Sign Out</span>
        </button>
      </div>
    </aside>

    <!-- Mobile Bottom Nav -->
    <nav class="lg:hidden fixed bottom-0 left-0 w-full z-50 flex justify-around items-center px-4 pt-3 pb-5 bg-surface-container-lowest border-t border-outline-variant rounded-t-3xl shadow-[0_-4px_20px_rgba(0,0,0,0.03)]">
      <a href="#/trips" class="flex flex-col items-center justify-center ${activePage === 'trips' ? 'text-secondary font-bold' : 'text-on-surface-variant'}">
        <span class="material-symbols-outlined ${activePage === 'trips' ? 'filled' : ''}">explore</span>
        <span class="text-label-sm mt-1">Trips</span>
      </a>
      <a href="#/plan-trip" class="flex flex-col items-center justify-center ${activePage === 'plan-trip' ? 'text-secondary font-bold' : 'text-on-surface-variant'}">
        <span class="material-symbols-outlined ${activePage === 'plan-trip' ? 'filled' : ''}">add_circle</span>
        <span class="text-label-sm mt-1">Plan</span>
      </a>
      <button id="btn-logout-mobile" class="flex flex-col items-center justify-center text-on-surface-variant">
        <span class="material-symbols-outlined">logout</span>
        <span class="text-label-sm mt-1">Sign Out</span>
      </button>
    </nav>
  `;
}

export function bindAppShellEvents() {
  document.getElementById('btn-logout')?.addEventListener('click', () => {
    api.auth.logout();
    router.navigate('/login');
  });
  document.getElementById('btn-logout-mobile')?.addEventListener('click', () => {
    api.auth.logout();
    router.navigate('/login');
  });
  document.getElementById('btn-new-trip-sidebar')?.addEventListener('click', (e) => {
    e.preventDefault();
    router.navigate('/plan-trip');
  });
}

export function renderLoading() {
  return `<div class="flex items-center justify-center py-20"><div class="spinner"></div></div>`;
}

export function renderError(message) {
  return `
    <div class="empty-state">
      <span class="material-symbols-outlined text-6xl text-error mb-4">error</span>
      <p class="text-lg mb-4">${message}</p>
      <button onclick="location.reload()" class="btn-secondary">Retry</button>
    </div>
  `;
}
