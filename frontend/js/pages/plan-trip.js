import { api } from '../api.js';
import { router } from '../router.js';
import { showToast, renderAppShell, bindAppShellEvents } from '../components.js';

export async function renderPlanTrip() {
  const app = document.getElementById('app');
  app.innerHTML = renderAppShell('plan-trip') + `
    <main class="lg:ml-[260px] min-h-screen pb-32 lg:pb-16 bg-surface">
      <!-- Header -->
      <header class="sticky top-0 z-40 w-full h-16 flex items-center gap-4 px-6 lg:px-10 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <button id="btn-back" class="text-on-surface-variant hover:text-secondary transition-colors p-1 rounded-lg hover:bg-surface-container">
          <span class="material-symbols-outlined">arrow_back</span>
        </button>
        <div>
          <h2 class="font-headline-md text-headline-md text-primary font-bold">Plan a new trip</h2>
          <p class="text-label-sm text-on-surface-variant">Your next adventure begins with a single step.</p>
        </div>
      </header>

      <div class="px-6 lg:px-10 py-8 max-w-container-max mx-auto">
        <div class="grid grid-cols-1 lg:grid-cols-12 gap-gutter">
          <!-- Main Form Card -->
          <div class="lg:col-span-8">
            <div class="bg-surface-container-lowest p-8 rounded-xl border border-outline-variant shadow-sm animate-fade-in">
              <h3 class="font-headline-md text-headline-md text-primary mb-8">Trip Details</h3>

              <form id="plan-form" class="space-y-8">
                <!-- Title -->
                <div>
                  <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">TRIP TITLE</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary">title</span>
                    <input id="trip-title" class="w-full pl-12 pr-4 py-4 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white transition-all shadow-sm placeholder:text-outline" placeholder="e.g. Summer in Kerala" type="text" required/>
                  </div>
                </div>

                <!-- Description -->
                <div>
                  <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">DESCRIPTION</label>
                  <textarea id="trip-desc" class="w-full px-4 py-4 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white transition-all shadow-sm placeholder:text-outline" rows="3" placeholder="A brief description of your trip..."></textarea>
                </div>

                <!-- Dates Row -->
                <div class="grid grid-cols-1 md:grid-cols-2 gap-gutter">
                  <div>
                    <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">START DATE</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_today</span>
                      <input id="trip-start" class="w-full pl-12 pr-4 py-4 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white transition-all shadow-sm" type="date"/>
                    </div>
                  </div>
                  <div>
                    <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">END DATE</label>
                    <div class="relative">
                      <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">calendar_month</span>
                      <input id="trip-end" class="w-full pl-12 pr-4 py-4 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white transition-all shadow-sm" type="date"/>
                    </div>
                  </div>
                </div>

                <!-- Budget -->
                <div>
                  <label class="block font-label-sm text-label-sm text-on-surface-variant mb-2 uppercase tracking-wider">ESTIMATED BUDGET (USD)</label>
                  <div class="relative">
                    <span class="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-on-surface-variant">payments</span>
                    <input id="trip-budget" class="w-full pl-12 pr-4 py-4 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white transition-all shadow-sm placeholder:text-outline" type="number" min="0" step="100" placeholder="0.00"/>
                  </div>
                </div>

                <!-- Stops Section -->
                <div>
                  <div class="flex items-center justify-between mb-4">
                    <label class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider font-semibold">STOPS (CITIES)</label>
                    <button type="button" id="btn-add-stop" class="flex items-center gap-2 py-2 px-4 text-sm border border-secondary text-secondary rounded-lg hover:bg-secondary-container/20 transition-all font-semibold">
                      <span class="material-symbols-outlined text-base">add</span>
                      Add Stop
                    </button>
                  </div>
                  <div id="stops-container" class="space-y-4">
                    <!-- Stops will be dynamically added here -->
                  </div>
                </div>

                <!-- Actions -->
                <div class="flex gap-4 pt-4">
                  <button type="submit" id="btn-create-trip" class="bg-primary text-on-primary px-8 py-4 rounded-lg font-label-md text-label-md hover:opacity-90 active:scale-[0.98] transition-all shadow-lg flex items-center gap-2">
                    Initialize Trip Plan
                    <span class="material-symbols-outlined text-[20px]">flight_takeoff</span>
                  </button>
                  <button type="button" id="btn-save-draft" class="text-secondary border border-secondary px-8 py-4 rounded-lg font-label-md text-label-md hover:bg-secondary-container/20 transition-all">
                    Save as Draft
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- Side Panel -->
          <div class="lg:col-span-4 space-y-6">
            <!-- Summary Card -->
            <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm animate-fade-in" style="animation-delay:0.1s">
              <h3 class="font-headline-md text-headline-md text-primary mb-4">Planning Stats</h3>
              <div class="space-y-4">
                <div>
                  <div class="flex justify-between mb-2">
                    <span class="font-label-sm text-label-sm text-on-surface-variant uppercase">Estimated Budget</span>
                    <span class="font-label-sm text-label-sm text-secondary font-bold" id="summary-budget">$0.00</span>
                  </div>
                  <div class="w-full bg-surface-container-high h-2 rounded-full overflow-hidden">
                    <div class="bg-secondary h-full rounded-full transition-all" id="summary-bar" style="width: 0%"></div>
                  </div>
                </div>
                <div class="flex justify-between">
                  <span class="text-label-sm text-on-surface-variant">Stops</span>
                  <span class="text-label-sm text-primary font-bold" id="summary-stops">0</span>
                </div>
                <div class="flex justify-between">
                  <span class="text-label-sm text-on-surface-variant">Duration</span>
                  <span class="text-label-sm text-primary font-bold" id="summary-duration">---</span>
                </div>
              </div>
            </div>

            <!-- Tip Card -->
            <div class="bg-secondary-container/20 p-6 rounded-xl border border-secondary/20 animate-fade-in" style="animation-delay:0.2s">
              <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-secondary">info</span>
                <h4 class="font-semibold text-secondary text-sm">Pro Tip</h4>
              </div>
              <p class="text-on-surface-variant text-sm">Add multiple stops to create a multi-city itinerary. Each stop can have its own activities and schedule.</p>
            </div>

            <!-- Info Card -->
            <div class="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant shadow-sm animate-fade-in" style="animation-delay:0.3s">
              <div class="flex items-center gap-2 mb-3">
                <span class="material-symbols-outlined text-primary">info</span>
                <h4 class="font-semibold text-primary text-sm">Getting Started</h4>
              </div>
              <p class="text-on-surface-variant text-sm">After creating your trip, you can add activities, set budgets, and manage expenses from the itinerary planner.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  `;

  bindAppShellEvents();

  document.getElementById('btn-back').addEventListener('click', () => router.navigate('/trips'));

  let stops = [];
  let stopCounter = 0;

  function addStop() {
    stopCounter++;
    const id = stopCounter;
    stops.push({ id, city: '', country: '', arrival_date: '', departure_date: '', order_index: stops.length });
    renderStops();
  }

  function removeStop(id) {
    stops = stops.filter(s => s.id !== id);
    stops.forEach((s, i) => s.order_index = i);
    renderStops();
    updateSummary();
  }

  function renderStops() {
    const container = document.getElementById('stops-container');
    if (stops.length === 0) {
      container.innerHTML = `
        <div class="border-2 border-dashed border-outline-variant rounded-xl p-8 text-center text-on-surface-variant">
          <span class="material-symbols-outlined text-4xl mb-2 block text-secondary opacity-40">location_on</span>
          <p class="text-sm">No stops added yet. Click "Add Stop" to begin.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = stops.map((stop, i) => `
      <div class="bg-surface-container-low p-5 rounded-xl border border-outline-variant animate-slide-in" data-stop-id="${stop.id}">
        <div class="flex items-center justify-between mb-4">
          <div class="flex items-center gap-2">
            <span class="w-7 h-7 rounded-full bg-secondary/10 text-secondary flex items-center justify-center text-sm font-bold border border-secondary/20">${i + 1}</span>
            <span class="font-semibold text-primary text-sm">Stop ${i + 1}</span>
          </div>
          <button type="button" class="remove-stop text-on-surface-variant hover:text-error transition-colors p-1 rounded" data-id="${stop.id}">
            <span class="material-symbols-outlined text-lg">close</span>
          </button>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">City *</label>
            <input class="w-full px-3 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-white placeholder:text-outline stop-city" data-id="${stop.id}" placeholder="e.g. Chennai" value="${escapeHtml(stop.city)}" required/>
          </div>
          <div>
            <label class="text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Country</label>
            <input class="w-full px-3 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-white placeholder:text-outline stop-country" data-id="${stop.id}" placeholder="e.g. India" value="${escapeHtml(stop.country)}"/>
          </div>
          <div>
            <label class="text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Arrival</label>
            <input class="w-full px-3 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-white stop-arrival" data-id="${stop.id}" type="date" value="${stop.arrival_date}"/>
          </div>
          <div>
            <label class="text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Departure</label>
            <input class="w-full px-3 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-sm bg-white stop-departure" data-id="${stop.id}" type="date" value="${stop.departure_date}"/>
          </div>
        </div>
      </div>
    `).join('');

    // Bind events
    container.querySelectorAll('.remove-stop').forEach(btn => {
      btn.addEventListener('click', () => removeStop(parseInt(btn.dataset.id)));
    });

    container.querySelectorAll('.stop-city').forEach(input => {
      input.addEventListener('input', (e) => {
        const stop = stops.find(s => s.id === parseInt(e.target.dataset.id));
        if (stop) stop.city = e.target.value;
      });
    });

    container.querySelectorAll('.stop-country').forEach(input => {
      input.addEventListener('input', (e) => {
        const stop = stops.find(s => s.id === parseInt(e.target.dataset.id));
        if (stop) stop.country = e.target.value;
      });
    });

    container.querySelectorAll('.stop-arrival').forEach(input => {
      input.addEventListener('change', (e) => {
        const stop = stops.find(s => s.id === parseInt(e.target.dataset.id));
        if (stop) stop.arrival_date = e.target.value;
        updateSummary();
      });
    });

    container.querySelectorAll('.stop-departure').forEach(input => {
      input.addEventListener('change', (e) => {
        const stop = stops.find(s => s.id === parseInt(e.target.dataset.id));
        if (stop) stop.departure_date = e.target.value;
        updateSummary();
      });
    });
  }

  function updateSummary() {
    const budget = parseFloat(document.getElementById('trip-budget').value) || 0;
    document.getElementById('summary-budget').textContent = budget > 0 ? `$${budget.toLocaleString()}` : '$0.00';
    document.getElementById('summary-stops').textContent = stops.length;

    const startDate = document.getElementById('trip-start').value;
    const endDate = document.getElementById('trip-end').value;
    if (startDate && endDate) {
      const days = Math.ceil((new Date(endDate) - new Date(startDate)) / (1000 * 60 * 60 * 24)) + 1;
      document.getElementById('summary-duration').textContent = days > 0 ? `${days} days` : '---';
    } else {
      document.getElementById('summary-duration').textContent = '---';
    }
  }

  document.getElementById('btn-add-stop').addEventListener('click', addStop);
  document.getElementById('trip-budget').addEventListener('input', updateSummary);
  document.getElementById('trip-start').addEventListener('change', updateSummary);
  document.getElementById('trip-end').addEventListener('change', updateSummary);

  // Form submission
  document.getElementById('plan-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    await createTrip(false);
  });

  document.getElementById('btn-save-draft').addEventListener('click', async () => {
    await createTrip(true);
  });

  async function createTrip(isDraft) {
    const title = document.getElementById('trip-title').value.trim();
    const description = document.getElementById('trip-desc').value.trim();
    const startDate = document.getElementById('trip-start').value || null;
    const endDate = document.getElementById('trip-end').value || null;
    const budget = parseFloat(document.getElementById('trip-budget').value) || 0;

    if (!title) {
      showToast('Please enter a trip title', 'error');
      return;
    }

    const btn = document.getElementById('btn-create-trip');
    btn.disabled = true;
    btn.innerHTML = '<div class="spinner"></div> Creating...';

    try {
      const tripData = {
        title,
        description: description || undefined,
        start_date: startDate || undefined,
        end_date: endDate || undefined,
        total_budget: budget,
      };

      const trip = await api.trips.create(tripData);

      // Create stops
      for (let i = 0; i < stops.length; i++) {
        const stop = stops[i];
        if (stop.city.trim()) {
          await api.stops.create({
            city: stop.city.trim(),
            country: stop.country.trim() || undefined,
            arrival_date: stop.arrival_date || undefined,
            departure_date: stop.departure_date || undefined,
            order_index: i,
            trip_id: trip.id,
          });
        }
      }

      showToast(isDraft ? 'Draft saved!' : 'Trip created!', 'success');
      router.navigate(`/itinerary/${trip.id}`);
    } catch (err) {
      showToast(err.message, 'error');
      btn.disabled = false;
      btn.innerHTML = 'Initialize Trip Plan <span class="material-symbols-outlined text-[20px]">flight_takeoff</span>';
    }
  }

  // Initialize with one stop
  addStop();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
