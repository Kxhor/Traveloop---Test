/**
 * My Trips Page
 * Uses Stitch "Preplanned Trips View" with live backend data
 */

import { api } from '../api.js';
import { router } from '../router.js';
import { showToast } from '../components.js';
import { renderer } from '../template-renderer.js';
import { formatCurrency, formatDate } from '../components.js';

export async function renderTrips() {
  const app = document.getElementById('app');
  app.innerHTML = '<div class="flex items-center justify-center min-h-screen"><div class="spinner"></div></div>';

  try {
    console.log('📥 Fetching trips...');
    const trips = await api.trips.list();
    console.log('✅ Trips fetched:', trips.length, 'trips');

    console.log('📥 Loading template: Traveloop - Preplanned Trips View');
    const template = await renderer.loadTemplate('Traveloop - Preplanned Trips View');
    console.log('✅ Template loaded');

    let bodyContent = renderer.extractBody(template);
    console.log('✅ Body extracted, length:', bodyContent.length);

    // Generate trip cards with backend data
    const tripsHTML = trips.length > 0
      ? trips.map((trip) => generateTripCard(trip)).join('')
      : '<div class="text-center py-12"><p class="text-on-surface-variant mb-4">No trips yet. Create your first trip!</p></div>';

    console.log('✅ Trip cards generated:', tripsHTML.length, 'bytes');

    // Find and replace the trip sections - use a more specific pattern
    const sectionPattern = /<div class="space-y-section-gap">([\s\S]*?)<\/section>\s*<\/div>/;

    if (sectionPattern.test(bodyContent)) {
      console.log('✅ Found section pattern, replacing...');
      bodyContent = bodyContent.replace(
        sectionPattern,
        `<div class="space-y-section-gap">
          <section>
            <h2 class="font-headline-md text-headline-md mb-6 text-primary">Your Trips</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              ${tripsHTML}
            </div>
          </section>
        </div>`
      );
    } else {
      console.log('⚠️ Pattern not found, using fallback...');
      // Fallback: inject after the toolbar
      const toolbarPattern = /(<div class="flex flex-col md:flex-row gap-4 mb-8 justify-between items-start md:items-center">[\s\S]*?<\/div>)/;
      if (toolbarPattern.test(bodyContent)) {
        bodyContent = bodyContent.replace(
          toolbarPattern,
          `$1
          <div class="mt-8">
            <h2 class="font-headline-md text-headline-md mb-6 text-primary">Your Trips</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-gutter">
              ${tripsHTML}
            </div>
          </div>`
        );
      }
    }

    console.log('✅ Content prepared, injecting into DOM...');
    app.innerHTML = bodyContent;
    console.log('✅ DOM updated');

    console.log('🔗 Binding interactions...');
    bindTripsPage(trips);
    console.log('✅ Trips page rendered successfully');
  } catch (error) {
    console.error('❌ Error rendering trips:', error);
    showToast(`Failed to load trips: ${error.message}`, 'error');
    app.innerHTML = `
      <div class="flex items-center justify-center min-h-screen">
        <div class="text-center">
          <p class="text-error mb-4">${error.message}</p>
          <button class="btn-primary" onclick="location.reload()">Retry</button>
        </div>
      </div>
    `;
  }
}

function generateTripCard(trip) {
  const startDate = new Date(trip.start_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const endDate = new Date(trip.end_date).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  const days = Math.ceil(
    (new Date(trip.end_date) - new Date(trip.start_date)) / (1000 * 60 * 60 * 24)
  ) + 1;

  return `
    <div class="bg-surface-container rounded-xl p-6 shadow-lg hover:shadow-xl transition-all cursor-pointer hover:-translate-y-1 trip-card"
         data-trip-id="${trip.id}">
      <div class="flex justify-between items-start mb-4">
        <div class="flex-1">
          <h3 class="text-headline-md font-bold text-primary truncate">${trip.title}</h3>
          <p class="text-body-md text-on-surface-variant mt-1 line-clamp-2">${trip.description || 'Your next adventure'}</p>
        </div>
      </div>
      <div class="flex justify-between items-center mt-6 pt-4 border-t border-outline-variant">
        <div class="text-on-surface-variant text-label-md">
          <div>${days} days</div>
          <div class="text-xs">${startDate} - ${endDate}</div>
        </div>
        <div class="text-right">
          <div class="text-secondary font-bold">${formatCurrency(trip.total_budget || 0)}</div>
          <div class="text-label-sm text-on-surface-variant">Budget</div>
        </div>
      </div>
    </div>
  `;
}

function bindTripsPage(trips) {
  // Trip card click handler using event delegation on the app container
  const app = document.getElementById('app');

  // Remove any existing listeners by cloning and replacing the node
  const appClone = app.cloneNode(true);
  app.parentNode.replaceChild(appClone, app);

  // Add single delegated event listener
  appClone.addEventListener('click', (e) => {
    const tripCard = e.target.closest('.trip-card');
    if (tripCard) {
      const tripId = tripCard.dataset.tripId;
      if (tripId) {
        console.log('🔗 Navigating to trip:', tripId);
        router.navigate(`/itinerary/${tripId}`);
      }
    }
  });

  // New trip button
  const newTripBtn = appClone.querySelector('[onclick*="newTrip"]') ||
                     Array.from(appClone.querySelectorAll('button')).find(b =>
                       b.textContent.includes('New') ||
                       b.textContent.includes('Plan') ||
                       b.textContent.includes('Create')
                     );

  if (newTripBtn) {
    newTripBtn.addEventListener('click', (e) => {
      e.preventDefault();
      router.navigate('/plan-trip');
    });
  }
}
