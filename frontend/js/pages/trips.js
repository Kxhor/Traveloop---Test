import { api } from '../api.js';
import { router } from '../router.js';
import { showToast, renderAppShell, bindAppShellEvents, formatDate, formatCurrency, daysBetween, renderLoading, renderError, showModal, closeModal } from '../components.js';

export async function renderTrips() {
  const app = document.getElementById('app');
  app.innerHTML = renderAppShell('trips') + `
    <main class="lg:ml-[260px] min-h-screen pb-32 lg:pb-16 bg-surface">
      <!-- Header -->
      <header class="sticky top-0 z-40 w-full h-16 flex justify-between items-center px-6 lg:px-10 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <div>
          <h2 class="font-headline-md text-headline-md text-primary font-bold">My Trips</h2>
          <p class="text-label-sm text-on-surface-variant">Your adventure portfolio</p>
        </div>
        <div class="flex items-center gap-4">
          <div class="relative hidden md:block">
            <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-outline text-lg">search</span>
            <input id="search-trips" class="w-full pl-10 pr-4 py-2 bg-surface border border-outline-variant rounded-full text-sm focus:outline-none focus:border-secondary" placeholder="Search trips..." type="text"/>
          </div>
          <button id="btn-new-trip" class="btn-primary px-5 py-2 text-sm">
            <span class="material-symbols-outlined text-lg">add</span>
            New Trip
          </button>
        </div>
      </header>

      <div class="px-6 lg:px-10 py-8">
        <!-- Stats Row -->
        <section class="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10" id="stats-row">
          <div class="glass-panel p-5 bg-surface-container-lowest">
            <span class="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg mb-3 inline-flex">flight</span>
            <p class="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Trips</p>
            <h3 class="text-headline-md font-bold text-on-surface" id="stat-total">-</h3>
          </div>
          <div class="glass-panel p-5 bg-surface-container-lowest">
            <span class="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg mb-3 inline-flex">payments</span>
            <p class="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Total Budget</p>
            <h3 class="text-headline-md font-bold text-on-surface" id="stat-budget">-</h3>
          </div>
          <div class="glass-panel p-5 bg-surface-container-lowest">
            <span class="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg mb-3 inline-flex">event_upcoming</span>
            <p class="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Upcoming</p>
            <h3 class="text-headline-md font-bold text-on-surface" id="stat-upcoming">-</h3>
          </div>
          <div class="glass-panel p-5 bg-surface-container-lowest">
            <span class="material-symbols-outlined text-secondary bg-secondary-container/20 p-2 rounded-lg mb-3 inline-flex">check_circle</span>
            <p class="text-label-sm text-on-surface-variant uppercase tracking-wider mb-1">Completed</p>
            <h3 class="text-headline-md font-bold text-on-surface" id="stat-completed">-</h3>
          </div>
        </section>

        <!-- Trips List -->
        <div id="trips-container">${renderLoading()}</div>
      </div>
    </main>
  `;

  bindAppShellEvents();

  document.getElementById('btn-new-trip').addEventListener('click', () => router.navigate('/plan-trip'));

  let allTrips = [];

  async function loadTrips() {
    const container = document.getElementById('trips-container');
    try {
      allTrips = await api.trips.list();
      renderTripsList(allTrips);
      updateStats(allTrips);
    } catch (err) {
      container.innerHTML = renderError(err.message);
    }
  }

  function updateStats(trips) {
    const now = new Date();
    const totalBudget = trips.reduce((s, t) => s + (t.total_budget || 0), 0);
    const upcoming = trips.filter(t => t.start_date && new Date(t.start_date) >= now).length;
    const completed = trips.filter(t => t.end_date && new Date(t.end_date) < now).length;

    document.getElementById('stat-total').textContent = trips.length;
    document.getElementById('stat-budget').textContent = formatCurrency(totalBudget);
    document.getElementById('stat-upcoming').textContent = upcoming;
    document.getElementById('stat-completed').textContent = completed;
  }

  function renderTripsList(trips) {
    const container = document.getElementById('trips-container');
    if (trips.length === 0) {
      container.innerHTML = `
        <div class="empty-state py-20 bg-surface-container-lowest rounded-xl border border-outline-variant">
          <span class="material-symbols-outlined text-7xl text-on-surface-variant/40 mb-4">explore</span>
          <h3 class="font-headline-md text-headline-md text-primary mb-2">No trips yet</h3>
          <p class="text-on-surface-variant mb-6">Start planning your first adventure</p>
          <button onclick="location.hash='#/plan-trip'" class="btn-primary">
            <span class="material-symbols-outlined">add</span> Plan Your First Trip
          </button>
        </div>
      `;
      return;
    }

    const now = new Date();
    const ongoing = trips.filter(t => {
      if (!t.start_date || !t.end_date) return false;
      const s = new Date(t.start_date), e = new Date(t.end_date);
      return s <= now && e >= now;
    });
    const upcoming = trips.filter(t => {
      if (!t.start_date) return false;
      return new Date(t.start_date) > now;
    });
    const past = trips.filter(t => {
      if (!t.end_date) return false;
      return new Date(t.end_date) < now;
    });

    let html = '';

    if (ongoing.length > 0) {
      html += `<section class="mb-10 animate-fade-in">
        <div class="flex items-center gap-3 mb-5">
          <span class="w-3 h-3 bg-secondary rounded-full animate-pulse-glow"></span>
          <h3 class="font-headline-md text-headline-md text-primary">Ongoing</h3>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${ongoing.map(t => tripCard(t, 'ongoing')).join('')}</div>
      </section>`;
    }

    if (upcoming.length > 0) {
      html += `<section class="mb-10 animate-fade-in" style="animation-delay:0.1s">
        <h3 class="font-headline-md text-headline-md text-primary mb-5">Upcoming</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${upcoming.map(t => tripCard(t, 'upcoming')).join('')}</div>
      </section>`;
    }

    if (past.length > 0) {
      html += `<section class="animate-fade-in" style="animation-delay:0.2s">
        <h3 class="font-headline-md text-headline-md text-primary mb-5">Past Trips</h3>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">${past.map(t => tripCard(t, 'past')).join('')}</div>
      </section>`;
    }

    container.innerHTML = html;
    bindTripEvents();
  }

  function tripCard(trip, status) {
    const days = trip.start_date && trip.end_date ? daysBetween(trip.start_date, trip.end_date) : 0;
    const now = new Date();
    const daysUntil = trip.start_date ? Math.ceil((new Date(trip.start_date) - now) / (1000 * 60 * 60 * 24)) : 0;

    const statusBadge = status === 'ongoing'
      ? `<span class="absolute top-4 right-4 px-3 py-1 bg-secondary text-white text-[10px] font-bold rounded-full uppercase">Ongoing</span>`
      : status === 'upcoming'
      ? `<span class="absolute top-4 right-4 px-3 py-1 bg-secondary-container text-on-secondary-container text-[10px] font-bold rounded-full uppercase">${daysUntil > 0 ? `In ${daysUntil}d` : 'Soon'}</span>`
      : `<span class="absolute top-4 right-4 px-3 py-1 bg-surface-container-high text-on-surface-variant text-[10px] font-bold rounded-full uppercase">Completed</span>`;

    // Teal to Navy/Slate gradients matching light aesthetic
    const gradients = [
      'from-secondary-container/30 to-secondary/20',
      'from-secondary/15 to-surface-container/50',
      'from-secondary-container/20 to-surface-container-high/40',
    ];
    const gradient = gradients[trip.id % gradients.length];

    return `
      <div class="glass-panel overflow-hidden group cursor-pointer bg-surface-container-lowest border border-outline-variant trip-card shadow-sm flex flex-col justify-between" data-id="${trip.id}">
        <div>
          <div class="h-32 relative bg-gradient-to-br ${gradient} border-b border-outline-variant">
            ${statusBadge}
            <div class="absolute inset-0 flex items-center justify-center opacity-10">
              <span class="material-symbols-outlined text-[72px] text-primary">flight</span>
            </div>
          </div>
          <div class="p-6 space-y-3">
            <div class="flex justify-between items-start">
              <h4 class="font-bold text-body-lg text-primary truncate">${escapeHtml(trip.title)}</h4>
              <button class="trip-menu-btn text-on-surface-variant hover:text-secondary p-1 rounded-lg" data-id="${trip.id}">
                <span class="material-symbols-outlined text-lg">more_vert</span>
              </button>
            </div>
            ${trip.description ? `<p class="text-on-surface-variant text-sm line-clamp-2">${escapeHtml(trip.description)}</p>` : ''}
            <div class="flex items-center gap-4 text-label-sm text-on-surface-variant">
              ${trip.start_date ? `<span class="flex items-center gap-1"><span class="material-symbols-outlined text-sm">calendar_today</span>${formatDate(trip.start_date)}${trip.end_date ? ' - ' + formatDate(trip.end_date) : ''}</span>` : ''}
              ${days > 0 ? `<span>${days} days</span>` : ''}
            </div>
          </div>
        </div>
        <div class="px-6 pb-6 pt-2 space-y-4">
          <div class="flex justify-between text-label-sm items-center border-t border-outline-variant/30 pt-3">
            <span class="text-on-surface-variant">Budget</span>
            <span class="text-secondary font-bold text-base">${formatCurrency(trip.total_budget)}</span>
          </div>
          <button class="w-full btn-secondary py-2.5 text-sm view-itinerary-btn flex items-center justify-center gap-2 border border-secondary text-secondary rounded-lg" data-id="${trip.id}">
            <span class="material-symbols-outlined text-base">map</span>
            View Itinerary
          </button>
        </div>
      </div>
    `;
  }

  function bindTripEvents() {
    document.querySelectorAll('.trip-card').forEach(card => {
      card.addEventListener('click', (e) => {
        if (e.target.closest('.trip-menu-btn') || e.target.closest('.view-itinerary-btn')) return;
        const id = card.dataset.id;
        router.navigate(`/itinerary/${id}`);
      });
    });

    document.querySelectorAll('.view-itinerary-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        router.navigate(`/itinerary/${btn.dataset.id}`);
      });
    });

    document.querySelectorAll('.trip-menu-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const id = btn.dataset.id;
        showTripMenu(id);
      });
    });
  }

  function showTripMenu(tripId) {
    showModal(`
      <div class="space-y-3">
        <h3 class="font-headline-md text-headline-md text-primary mb-4">Trip Options</h3>
        <button id="menu-edit" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low text-left transition-all text-on-surface">
          <span class="material-symbols-outlined text-secondary">edit</span>
          <span>Edit Trip</span>
        </button>
        <button id="menu-itinerary" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-surface-container-low text-left transition-all text-on-surface">
          <span class="material-symbols-outlined text-secondary">map</span>
          <span>View Itinerary</span>
        </button>
        <hr class="border-outline-variant my-2"/>
        <button id="menu-delete" class="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-error-container/20 text-error text-left transition-all">
          <span class="material-symbols-outlined">delete</span>
          <span>Delete Trip</span>
        </button>
        <button id="menu-close" class="w-full btn-secondary py-2.5 mt-2">Cancel</button>
      </div>
    `);

    document.getElementById('menu-close').addEventListener('click', closeModal);
    document.getElementById('menu-itinerary').addEventListener('click', () => { closeModal(); router.navigate(`/itinerary/${tripId}`); });
    document.getElementById('menu-edit').addEventListener('click', () => { closeModal(); router.navigate(`/itinerary/${tripId}`); });
    document.getElementById('menu-delete').addEventListener('click', async () => {
      if (!confirm('Are you sure you want to delete this trip? This action cannot be undone.')) return;
      try {
        await api.trips.delete(tripId);
        closeModal();
        showToast('Trip deleted', 'success');
        loadTrips();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  // Search filter
  document.getElementById('search-trips').addEventListener('input', (e) => {
    const q = e.target.value.toLowerCase();
    const filtered = allTrips.filter(t =>
      t.title.toLowerCase().includes(q) || (t.description && t.description.toLowerCase().includes(q))
    );
    renderTripsList(filtered);
  });

  loadTrips();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
