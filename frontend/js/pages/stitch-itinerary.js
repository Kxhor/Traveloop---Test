/**
 * Trip Itinerary & Budget Planner Page
 * Uses Stitch Hawaiian Itinerary screen with live data
 */

import { api } from '../api.js';
import { router } from '../router.js';
import { showToast } from '../components.js';
import { renderer } from '../template-renderer.js';
import { formatCurrency, formatDate } from '../components.js';

export async function renderItinerary(tripId) {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="flex items-center justify-center min-h-screen"><div class="spinner"></div></div>';

  console.log('📥 Loading itinerary for trip:', tripId);

  // Validate tripId
  if (!tripId || tripId === 'undefined') {
    console.error('❌ Invalid trip ID:', tripId);
    showToast('Invalid trip ID', 'error');
    app.innerHTML = `
      <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <p class="text-error mb-4">Invalid trip ID</p>
          <button class="btn-primary" onclick="window.location.hash='#/trips'">Back to Trips</button>
        </div>
      </div>
    `;
    return;
  }

  try {
    console.log('📥 Fetching trip details...');
    // Fetch trip with stops and activities
    const trip = await api.trips.get(tripId);
    console.log('✅ Trip fetched:', trip.title);

    console.log('📥 Fetching stops...');
    const stops = await api.stops.list(tripId);
    console.log('✅ Stops fetched:', stops.length, 'stops');

    console.log('📥 Loading template...');
    // Load template
    const template = await renderer.loadTemplate('Traveloop - Hawaiian Itinerary & Budget Planner');
    let bodyContent = renderer.extractBody(template);
    console.log('✅ Template loaded');

    // Generate itinerary timeline
    const timelineHTML = stops
      .sort((a, b) => a.order_index - b.order_index)
      .map((stop, idx) => generateStopItinerary(stop, idx + 1))
      .join('');

    console.log('✅ Timeline generated:', timelineHTML.length, 'bytes');

    // Replace title sections
    bodyContent = bodyContent.replace(
      /(<h1[^>]*>)[^<]*/,
      `$1${trip.title}`
    );
    bodyContent = bodyContent.replace(
      /(<p class="[^"]*text-white[^"]*")[^<]*(<\/p>)/,
      `$1${trip.description || 'Your travel adventure awaits'}$2`
    );

    // Try to replace itinerary timeline
    const dayPattern = /<!-- Day \d+ -->([\s\S]*?)<!-- End Day -->/;
    if (dayPattern.test(bodyContent)) {
      console.log('✅ Found day pattern, replacing...');
      bodyContent = bodyContent.replace(dayPattern, timelineHTML);
    } else {
      console.log('⚠️ Day pattern not found, looking for container...');
      // Find a container and inject
      const containerMatch = bodyContent.match(/<div[^>]*class="[^"]*space-y-6[^"]*"[^>]*>/);
      if (containerMatch) {
        console.log('✅ Found container, injecting timeline...');
        bodyContent = bodyContent.replace(
          containerMatch[0],
          `${containerMatch[0]}\n${timelineHTML || '<p class="text-center py-8 text-on-surface-variant">No stops added yet. Start planning your itinerary!</p>'}`
        );
      } else {
        console.log('⚠️ No container found, appending to body...');
        bodyContent = `${bodyContent}<div class="p-8"><h2 class="text-headline-lg mb-6">Itinerary</h2><div class="space-y-6">${timelineHTML || '<p class="text-center py-8 text-on-surface-variant">No stops added yet.</p>'}</div></div>`;
      }
    }

    console.log('✅ Content prepared, injecting into DOM...');
    // Inject into DOM
    app.innerHTML = bodyContent;
    console.log('✅ DOM updated');

    console.log('🔗 Binding interactions...');
    // Bind interactions
    bindItineraryPage(trip, stops);
    console.log('✅ Itinerary page rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering itinerary:', error);
    showToast(`Failed to load itinerary: ${error.message}`, 'error');
    app.innerHTML = `
      <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <p class="text-error mb-4">${error.message}</p>
          <button class="btn-primary" onclick="window.location.hash='#/trips'">Back to Trips</button>
        </div>
      </div>
    `;
  }
}

function generateStopItinerary(stop, dayNumber) {
  const arrivalDate = stop.arrival_date ? formatDate(stop.arrival_date) : 'TBD';
  const departureDate = stop.departure_date ? formatDate(stop.departure_date) : 'TBD';

  const activitiesHTML = (stop.activities || [])
    .map(
      (activity) => `
    <div class="flex items-center gap-2 bg-secondary/10 text-secondary px-3 py-1.5 rounded-full text-label-sm font-label-md">
      <span class="material-symbols-outlined text-[18px]">location_on</span>
      ${activity.name}
    </div>
  `
    )
    .join('');

  return `
    <div class="flex gap-6">
      <div class="flex flex-col items-center">
        <div class="w-10 h-10 rounded-full bg-primary-container text-white flex items-center justify-center font-bold shadow-lg ring-4 ring-white/30">
          ${dayNumber}
        </div>
        <div class="w-0.5 h-full bg-secondary/40 mt-2"></div>
      </div>
      <div class="flex-1 glass-panel rounded-xl p-6 shadow-xl">
        <div class="flex justify-between items-start mb-4">
          <div>
            <h3 class="font-headline-md text-headline-md text-primary">${stop.city}${stop.country ? ', ' + stop.country : ''}</h3>
            <p class="text-on-surface-variant font-label-md mt-1">📅 ${arrivalDate} → ${departureDate}</p>
          </div>
        </div>
        <div class="flex gap-3 mb-6 flex-wrap">
          ${activitiesHTML || '<p class="text-on-surface-variant text-label-md">No activities added yet</p>'}
        </div>
        <button class="btn-secondary btn-sm add-activity-btn" data-stop-id="${stop.id}">
          <span class="material-symbols-outlined">add</span>
          Add Activity
        </button>
      </div>
    </div>
  `;
}

function bindItineraryPage(trip, stops) {
  const app = document.getElementById('app');

  // Add activity button handler using event delegation
  app.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-activity-btn');
    if (addBtn) {
      const stopId = addBtn.dataset.stopId;
      showToast('Activity creation coming soon', 'info');
    }
  });

  // Back button
  const backBtn = app.querySelector('[onclick*="back"]') ||
                  Array.from(app.querySelectorAll('button')).find(b =>
                    b.textContent.includes('Back') ||
                    b.textContent.includes('← ')
                  );

  if (backBtn) {
    backBtn.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate('/trips');
    });
  }
}
