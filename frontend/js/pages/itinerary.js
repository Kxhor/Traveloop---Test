import { api } from '../api.js';
import { router } from '../router.js';
import {
  showToast, renderAppShell, bindAppShellEvents, formatDate, formatCurrency,
  daysBetween, renderLoading, renderError, showModal, closeModal
} from '../components.js';
import { EXPENSE_CATEGORIES, ACTIVITY_CATEGORIES } from '../constants.js';

export async function renderItinerary(tripId) {
  const app = document.getElementById('app');
  app.innerHTML = renderAppShell('trips') + `
    <main class="lg:ml-[260px] min-h-screen pb-32 lg:pb-16 bg-surface">
      <!-- Header -->
      <header class="sticky top-0 z-40 w-full h-16 flex justify-between items-center px-6 lg:px-10 bg-surface/90 backdrop-blur-md border-b border-outline-variant">
        <div class="flex items-center gap-4">
          <button id="btn-back" class="text-on-surface-variant hover:text-secondary transition-colors p-1 rounded-lg hover:bg-surface-container">
            <span class="material-symbols-outlined">arrow_back</span>
          </button>
          <div id="trip-header">
            <div class="h-5 w-48 bg-surface-container-high rounded animate-pulse"></div>
            <div class="h-4 w-32 bg-surface-container-high rounded mt-1 animate-pulse"></div>
          </div>
        </div>
        <div class="flex items-center gap-3" id="header-actions"></div>
      </header>

      <div class="px-6 lg:px-10 py-8 max-w-container-max mx-auto" id="itinerary-content">
        ${renderLoading()}
      </div>
    </main>
  `;

  bindAppShellEvents();
  document.getElementById('btn-back').addEventListener('click', () => router.navigate('/trips'));

  let trip, stops, activities, expenses;

  async function loadData() {
    const content = document.getElementById('itinerary-content');
    try {
      [trip, stops, activities, expenses] = await Promise.all([
        api.trips.get(tripId),
        api.stops.listByTrip(tripId),
        api.activities.listByTrip(tripId),
        api.expenses.listByTrip(tripId),
      ]);

      renderHeader();
      renderPage();
    } catch (err) {
      content.innerHTML = renderError(err.message);
    }
  }

  function renderHeader() {
    const header = document.getElementById('trip-header');
    header.innerHTML = `
      <h2 class="font-headline-md text-headline-md text-primary font-bold">${escapeHtml(trip.title)}</h2>
      <p class="text-label-sm text-on-surface-variant">
        ${trip.start_date ? formatDate(trip.start_date) + (trip.end_date ? ' → ' + formatDate(trip.end_date) : '') : 'No dates set'}
        ${trip.start_date && trip.end_date ? ` · ${daysBetween(trip.start_date, trip.end_date)} days` : ''}
      </p>
    `;

    document.getElementById('header-actions').innerHTML = `
      <button id="btn-add-expense" class="flex items-center gap-2 py-2 px-4 text-sm border border-outline-variant text-on-surface-variant rounded-lg hover:bg-surface-container transition-all">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="hidden md:inline">Log Expense</span>
      </button>
      <button id="btn-add-stop" class="flex items-center gap-2 py-2 px-4 text-sm bg-primary text-on-primary rounded-lg hover:opacity-90 transition-all font-semibold shadow-sm">
        <span class="material-symbols-outlined text-base">add</span>
        <span class="hidden md:inline">Add Stop</span>
      </button>
    `;

    document.getElementById('btn-add-stop').addEventListener('click', showAddStopModal);
    document.getElementById('btn-add-expense').addEventListener('click', showAddExpenseModal);
  }

  function renderPage() {
    const totalBudget = trip.total_budget || 0;
    const totalExpenses = expenses.reduce((s, e) => s + e.amount, 0);
    const totalActivityCost = activities.reduce((s, a) => s + (a.estimated_cost || 0), 0);
    const totalSpent = totalExpenses + totalActivityCost;
    const budgetPct = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;
    const remaining = totalBudget - totalSpent;

    // Group expenses by category
    const expensesByCategory = {};
    expenses.forEach(e => {
      const cat = e.category || 'uncategorized';
      expensesByCategory[cat] = (expensesByCategory[cat] || 0) + e.amount;
    });

    const content = document.getElementById('itinerary-content');
    content.innerHTML = `
      <!-- Budget Overview Cards (Stitch-inspired bento) -->
      <section class="grid grid-cols-1 md:grid-cols-3 gap-gutter mb-10 animate-fade-in">
        <div class="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <span class="material-symbols-outlined text-secondary bg-secondary-container/30 p-2 rounded-lg">account_balance_wallet</span>
            <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Budget</p>
          </div>
          <h3 class="text-headline-md font-bold text-primary">${formatCurrency(totalBudget)}</h3>
          <div class="w-full bg-surface-container-high h-1.5 rounded-full mt-3 overflow-hidden">
            <div class="bg-secondary h-full rounded-full transition-all" style="width: ${budgetPct}%"></div>
          </div>
          <p class="font-label-sm text-label-sm text-on-surface-variant mt-2">${budgetPct.toFixed(0)}% utilized</p>
        </div>
        <div class="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <span class="material-symbols-outlined text-primary bg-primary-container/30 p-2 rounded-lg">receipt_long</span>
            <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Total Spent</p>
          </div>
          <h3 class="text-headline-md font-bold text-primary">${formatCurrency(totalSpent)}</h3>
          <p class="font-label-sm text-label-sm text-on-surface-variant mt-2">${expenses.length} expense${expenses.length !== 1 ? 's' : ''} logged</p>
        </div>
        <div class="bg-surface-container-lowest rounded-xl p-6 border border-outline-variant shadow-sm">
          <div class="flex items-center gap-3 mb-3">
            <span class="material-symbols-outlined ${remaining >= 0 ? 'text-tertiary bg-tertiary-container/20' : 'text-error bg-error-container/20'} p-2 rounded-lg">
              ${remaining >= 0 ? 'savings' : 'warning'}
            </span>
            <p class="font-label-sm text-label-sm text-on-surface-variant uppercase tracking-wider">Remaining</p>
          </div>
          <h3 class="text-headline-md font-bold ${remaining >= 0 ? 'text-tertiary' : 'text-error'}">${formatCurrency(remaining)}</h3>
          <p class="font-label-sm text-label-sm text-on-surface-variant mt-2">${stops.length} stop${stops.length !== 1 ? 's' : ''} planned</p>
        </div>
      </section>

      <!-- Expense Breakdown -->
      ${Object.keys(expensesByCategory).length > 0 ? `
      <section class="mb-10 animate-fade-in" style="animation-delay:0.1s">
        <h3 class="font-headline-md text-headline-md text-primary mb-5">Expense Breakdown</h3>
        <div class="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-gutter">
          ${Object.entries(expensesByCategory).map(([cat, amount]) => `
            <div class="bg-surface-container-lowest rounded-xl p-4 border border-outline-variant shadow-sm">
              <div class="flex items-center gap-2 mb-2">
                <span class="material-symbols-outlined text-secondary text-lg">${getCategoryIcon(cat)}</span>
                <span class="font-label-sm text-label-sm text-on-surface-variant capitalize">${cat}</span>
              </div>
              <p class="font-bold text-primary">${formatCurrency(amount)}</p>
            </div>
          `).join('')}
        </div>
      </section>
      ` : ''}

      <!-- Stops Timeline -->
      <section class="mb-10 animate-fade-in" style="animation-delay:0.15s">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-headline-md text-headline-md text-primary">Itinerary Stops</h3>
        </div>
        ${stops.length === 0 ? `
          <div class="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant shadow-sm">
            <span class="material-symbols-outlined text-5xl text-secondary/30 mb-3 block">location_on</span>
            <p class="text-on-surface-variant mb-4">No stops added yet</p>
            <button id="btn-add-stop-empty" class="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all shadow-sm inline-flex items-center gap-2">
              <span class="material-symbols-outlined text-base">add</span> Add First Stop
            </button>
          </div>
        ` : `
          <div class="space-y-4">
            ${stops.map((stop, i) => renderStopCard(stop, i)).join('')}
          </div>
        `}
      </section>

      <!-- Expenses Table -->
      <section class="animate-fade-in" style="animation-delay:0.2s">
        <div class="flex items-center justify-between mb-5">
          <h3 class="font-headline-md text-headline-md text-primary">Expenses</h3>
        </div>
        ${expenses.length === 0 ? `
          <div class="bg-surface-container-lowest rounded-xl p-12 text-center border border-outline-variant shadow-sm">
            <span class="material-symbols-outlined text-5xl text-secondary/30 mb-3 block">receipt_long</span>
            <p class="text-on-surface-variant mb-4">No expenses logged yet</p>
            <button id="btn-add-expense-empty" class="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all shadow-sm inline-flex items-center gap-2">
              <span class="material-symbols-outlined text-base">add</span> Log First Expense
            </button>
          </div>
        ` : `
          <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden">
            <table class="w-full">
              <thead>
                <tr class="border-b border-outline-variant bg-surface-container-low">
                  <th class="text-left font-label-sm text-label-sm text-on-surface-variant uppercase px-5 py-3 tracking-wider">Title</th>
                  <th class="text-left font-label-sm text-label-sm text-on-surface-variant uppercase px-5 py-3 tracking-wider hidden md:table-cell">Category</th>
                  <th class="text-right font-label-sm text-label-sm text-on-surface-variant uppercase px-5 py-3 tracking-wider">Amount</th>
                  <th class="text-right font-label-sm text-label-sm text-on-surface-variant uppercase px-5 py-3 tracking-wider w-20">Actions</th>
                </tr>
              </thead>
              <tbody>
                ${expenses.map(exp => `
                  <tr class="border-b border-outline-variant hover:bg-surface-container-low transition-colors">
                    <td class="px-5 py-3.5">
                      <p class="text-primary font-medium">${escapeHtml(exp.title)}</p>
                      <p class="font-label-sm text-label-sm text-on-surface-variant">${formatDate(exp.created_at)}</p>
                    </td>
                    <td class="px-5 py-3.5 hidden md:table-cell">
                      <span class="bg-secondary-container/20 text-secondary text-xs px-2 py-1 rounded-full capitalize border border-secondary/20">${exp.category || 'uncategorized'}</span>
                    </td>
                    <td class="px-5 py-3.5 text-right font-bold text-primary">${formatCurrency(exp.amount)}</td>
                    <td class="px-5 py-3.5 text-right">
                      <button class="delete-expense text-on-surface-variant hover:text-error transition-colors p-1 rounded" data-id="${exp.id}">
                        <span class="material-symbols-outlined text-lg">delete</span>
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>
        `}
      </section>
    `;

    // Bind events
    document.getElementById('btn-add-stop-empty')?.addEventListener('click', showAddStopModal);
    document.getElementById('btn-add-expense-empty')?.addEventListener('click', showAddExpenseModal);

    document.querySelectorAll('.delete-expense').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this expense?')) return;
        try {
          await api.expenses.delete(btn.dataset.id);
          showToast('Expense deleted', 'success');
          loadData();
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    });

    bindStopEvents();
  }

  function renderStopCard(stop, index) {
    const stopActivities = activities.filter(a => a.stop_id === stop.id);
    return `
      <div class="bg-surface-container-lowest rounded-xl border border-outline-variant shadow-sm overflow-hidden stop-card" data-stop-id="${stop.id}">
        <div class="flex items-center justify-between px-5 py-4 border-b border-outline-variant bg-surface-container-low">
          <div class="flex items-center gap-3">
            <span class="w-9 h-9 rounded-full bg-secondary-container/30 text-secondary flex items-center justify-center font-bold text-sm border border-secondary/20">${index + 1}</span>
            <div>
              <h4 class="font-bold text-primary">${escapeHtml(stop.city)}${stop.country ? ', ' + escapeHtml(stop.country) : ''}</h4>
              <p class="font-label-sm text-label-sm text-on-surface-variant">
                ${stop.arrival_date ? formatDate(stop.arrival_date) : 'No dates'}
                ${stop.arrival_date && stop.departure_date ? ' → ' + formatDate(stop.departure_date) : ''}
              </p>
            </div>
          </div>
          <div class="flex items-center gap-2">
            <button class="add-activity-btn text-secondary hover:text-primary transition-colors p-2 rounded-lg hover:bg-surface-container" data-stop-id="${stop.id}" title="Add Activity">
              <span class="material-symbols-outlined text-lg">add_circle</span>
            </button>
            <button class="delete-stop text-on-surface-variant hover:text-error transition-colors p-2 rounded-lg hover:bg-error-container/20" data-id="${stop.id}" title="Delete Stop">
              <span class="material-symbols-outlined text-lg">delete</span>
            </button>
          </div>
        </div>
        <div class="p-5">
          ${stopActivities.length === 0 ? `
            <p class="text-on-surface-variant text-sm text-center py-4 italic">No activities yet. Click + to add one.</p>
          ` : `
            <div class="space-y-3">
              ${stopActivities.map(act => `
                <div class="flex items-center justify-between p-3 bg-surface-container-low rounded-lg border border-outline-variant">
                  <div class="flex items-center gap-3">
                    <span class="material-symbols-outlined text-tertiary text-lg">${getActivityIcon(act.category)}</span>
                    <div>
                      <p class="text-primary font-medium text-sm">${escapeHtml(act.name)}</p>
                      <p class="font-label-sm text-label-sm text-on-surface-variant">
                        ${act.category || 'general'}
                        ${act.duration_minutes ? ` · ${act.duration_minutes}min` : ''}
                      </p>
                    </div>
                  </div>
                  <div class="flex items-center gap-3">
                    ${act.estimated_cost ? `<span class="font-label-sm text-label-sm text-secondary font-bold">${formatCurrency(act.estimated_cost)}</span>` : ''}
                    <button class="delete-activity text-on-surface-variant hover:text-error transition-colors p-1 rounded" data-id="${act.id}">
                      <span class="material-symbols-outlined text-sm">close</span>
                    </button>
                  </div>
                </div>
              `).join('')}
            </div>
          `}
        </div>
      </div>
    `;
  }

  function bindStopEvents() {
    document.querySelectorAll('.add-activity-btn').forEach(btn => {
      btn.addEventListener('click', () => showAddActivityModal(btn.dataset.stopId));
    });

    document.querySelectorAll('.delete-stop').forEach(btn => {
      btn.addEventListener('click', async () => {
        if (!confirm('Delete this stop and all its activities?')) return;
        try {
          await api.stops.delete(btn.dataset.id);
          showToast('Stop deleted', 'success');
          loadData();
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    });

    document.querySelectorAll('.delete-activity').forEach(btn => {
      btn.addEventListener('click', async () => {
        try {
          await api.activities.delete(btn.dataset.id);
          showToast('Activity removed', 'success');
          loadData();
        } catch (err) {
          showToast(err.message, 'error');
        }
      });
    });
  }

  function showAddStopModal() {
    showModal(`
      <h3 class="font-headline-md text-headline-md text-primary mb-6">Add a Stop</h3>
      <form id="add-stop-form" class="space-y-5">
        <div>
          <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">City *</label>
          <input id="modal-stop-city" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white placeholder:text-outline" placeholder="e.g. Chennai" required/>
        </div>
        <div>
          <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Country</label>
          <input id="modal-stop-country" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white placeholder:text-outline" placeholder="e.g. India"/>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Arrival Date</label>
            <input id="modal-stop-arrival" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white" type="date"/>
          </div>
          <div>
            <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Departure Date</label>
            <input id="modal-stop-departure" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white" type="date"/>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" class="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all shadow-sm flex-1">Add Stop</button>
          <button type="button" id="modal-cancel" class="border border-outline-variant text-on-surface-variant px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">Cancel</button>
        </div>
      </form>
    `);

    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('add-stop-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const city = document.getElementById('modal-stop-city').value.trim();
      const country = document.getElementById('modal-stop-country').value.trim();
      const arrival = document.getElementById('modal-stop-arrival').value || null;
      const departure = document.getElementById('modal-stop-departure').value || null;

      if (!city) { showToast('City is required', 'error'); return; }

      try {
        await api.stops.create({
          city,
          country: country || undefined,
          arrival_date: arrival || undefined,
          departure_date: departure || undefined,
          order_index: stops.length,
          trip_id: parseInt(tripId),
        });
        closeModal();
        showToast('Stop added!', 'success');
        loadData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  function showAddActivityModal(stopId) {
    showModal(`
      <h3 class="font-headline-md text-headline-md text-primary mb-6">Add Activity</h3>
      <form id="add-activity-form" class="space-y-5">
        <div>
          <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Activity Name *</label>
          <input id="modal-act-name" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white placeholder:text-outline" placeholder="e.g. Beach Walk" required/>
        </div>
        <div>
          <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Category</label>
          <select id="modal-act-category" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white">
            <option value="">Select category</option>
            ${ACTIVITY_CATEGORIES.map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
          </select>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Scheduled Date/Time</label>
            <input id="modal-act-scheduled" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white" type="datetime-local"/>
          </div>
          <div>
            <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Duration (min)</label>
            <input id="modal-act-duration" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white placeholder:text-outline" type="number" min="0" placeholder="60"/>
          </div>
        </div>
        <div>
          <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Estimated Cost (USD)</label>
          <input id="modal-act-cost" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white placeholder:text-outline" type="number" min="0" step="0.01" placeholder="0.00"/>
        </div>
        <div>
          <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Notes</label>
          <textarea id="modal-act-notes" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white placeholder:text-outline" rows="2" placeholder="Any notes..."></textarea>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" class="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all shadow-sm flex-1">Add Activity</button>
          <button type="button" id="modal-cancel" class="border border-outline-variant text-on-surface-variant px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">Cancel</button>
        </div>
      </form>
    `);

    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('add-activity-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const name = document.getElementById('modal-act-name').value.trim();
      if (!name) { showToast('Activity name is required', 'error'); return; }

      const scheduled = document.getElementById('modal-act-scheduled').value;

      try {
        await api.activities.create({
          name,
          category: document.getElementById('modal-act-category').value || undefined,
          scheduled_at: scheduled ? new Date(scheduled).toISOString() : undefined,
          duration_minutes: parseInt(document.getElementById('modal-act-duration').value) || undefined,
          estimated_cost: parseFloat(document.getElementById('modal-act-cost').value) || 0,
          notes: document.getElementById('modal-act-notes').value.trim() || undefined,
          stop_id: parseInt(stopId),
        });
        closeModal();
        showToast('Activity added!', 'success');
        loadData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  function showAddExpenseModal() {
    showModal(`
      <h3 class="font-headline-md text-headline-md text-primary mb-6">Log Expense</h3>
      <form id="add-expense-form" class="space-y-5">
        <div>
          <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Title *</label>
          <input id="modal-exp-title" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white placeholder:text-outline" placeholder="e.g. Hotel Booking" required/>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Amount (USD) *</label>
            <input id="modal-exp-amount" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white placeholder:text-outline" type="number" min="0" step="0.01" placeholder="0.00" required/>
          </div>
          <div>
            <label class="font-label-sm text-label-sm text-on-surface-variant mb-1 block uppercase tracking-wider text-xs">Category</label>
            <select id="modal-exp-category" class="w-full px-4 py-3 rounded-lg border border-outline-variant focus:border-secondary focus:ring-1 focus:ring-secondary text-body-md bg-white">
              <option value="">Select category</option>
              ${EXPENSE_CATEGORIES.map(c => `<option value="${c}">${c.charAt(0).toUpperCase() + c.slice(1)}</option>`).join('')}
            </select>
          </div>
        </div>
        <div class="flex gap-3 pt-2">
          <button type="submit" class="bg-primary text-on-primary px-6 py-3 rounded-lg font-label-md text-label-md hover:opacity-90 transition-all shadow-sm flex-1">Log Expense</button>
          <button type="button" id="modal-cancel" class="border border-outline-variant text-on-surface-variant px-6 py-3 rounded-lg font-label-md text-label-md hover:bg-surface-container transition-all">Cancel</button>
        </div>
      </form>
    `);

    document.getElementById('modal-cancel').addEventListener('click', closeModal);
    document.getElementById('add-expense-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const title = document.getElementById('modal-exp-title').value.trim();
      const amount = parseFloat(document.getElementById('modal-exp-amount').value);

      if (!title || !amount) { showToast('Title and amount are required', 'error'); return; }

      try {
        await api.expenses.create({
          title,
          amount,
          currency: 'USD',
          category: document.getElementById('modal-exp-category').value || undefined,
          trip_id: parseInt(tripId),
        });
        closeModal();
        showToast('Expense logged!', 'success');
        loadData();
      } catch (err) {
        showToast(err.message, 'error');
      }
    });
  }

  loadData();
}

function escapeHtml(str) {
  if (!str) return '';
  return str.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}

function getCategoryIcon(cat) {
  const icons = {
    transport: 'train', lodging: 'hotel', food: 'restaurant',
    activities: 'sports_esports', shopping: 'shopping_bag', miscellaneous: 'receipt'
  };
  return icons[cat] || 'receipt';
}

function getActivityIcon(cat) {
  const icons = {
    sightseeing: 'photo_camera', food: 'restaurant', adventure: 'hiking',
    culture: 'museum', nightlife: 'nightlife', shopping: 'shopping_bag', relaxation: 'spa'
  };
  return icons[cat] || 'star';
}
