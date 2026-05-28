/**
 * Plan New Trip Page
 * Uses Stitch screen design with real backend form handling
 */

import { api } from '../api.js';
import { router } from '../router.js';
import { showToast } from '../components.js';
import { renderer } from '../template-renderer.js';

export async function renderPlanTrip() {
  const app = document.getElementById('app');

  try {
    console.log('📥 Loading plan trip template...');
    // Load Stitch template
    const template = await renderer.loadTemplate('Traveloop - Plan New Trip');
    const bodyContent = renderer.extractBody(template);
    console.log('✅ Template loaded');

    // Inject into DOM
    app.innerHTML = bodyContent;
    console.log('✅ DOM updated');

    // Bind form
    console.log('🔗 Binding form...');
    bindPlanTripForm();
    console.log('✅ Plan trip page rendered successfully');
  } catch (error) {
    console.error('❌ Error loading plan trip page:', error);
    showToast(`Failed to load plan trip page: ${error.message}`, 'error');
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

function bindPlanTripForm() {
  // Find form
  const form = document.querySelector('form');
  const submitButton = document.querySelector('button[type="submit"]') ||
                       Array.from(document.querySelectorAll('button')).find(b =>
                         b.textContent.includes('Create') ||
                         b.textContent.includes('Plan') ||
                         b.textContent.includes('Next')
                       );

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();

    console.log('📝 Form submitted');

    // Find all input fields in the page
    const inputs = document.querySelectorAll('input, textarea');
    let tripTitle = '';
    let tripDescription = '';
    let startDate = '';
    let endDate = '';
    let budget = 0;

    // Try to extract from inputs by looking at their order and placeholder text
    inputs.forEach((input, idx) => {
      const placeholder = input.placeholder?.toLowerCase() || '';
      const value = input.value?.trim() || '';

      // First text input is usually title
      if (!tripTitle && input.type === 'text' && (placeholder.includes('destination') || placeholder.includes('title') || placeholder.includes('name'))) {
        tripTitle = value;
      }
      // Look for date inputs
      if (input.type === 'date') {
        if (!startDate) {
          startDate = value;
        } else if (!endDate) {
          endDate = value;
        }
      }
      // Textarea is usually description
      if (input.tagName === 'TEXTAREA') {
        tripDescription = value;
      }
      // Number/currency input
      if (input.type === 'number' || input.type === 'tel' || placeholder.includes('budget') || placeholder.includes('price')) {
        budget = parseFloat(value) || 0;
      }
    });

    // Fallback: if still no title, get first non-date input
    if (!tripTitle) {
      const firstInput = Array.from(inputs).find(i => i.type !== 'date' && i.tagName !== 'TEXTAREA');
      if (firstInput) tripTitle = firstInput.value?.trim() || '';
    }

    console.log('📋 Form data:', { tripTitle, startDate, endDate, budget });

    // Validate
    if (!tripTitle) {
      showToast('Please enter a trip title/destination', 'error');
      return;
    }

    if (!startDate || !endDate) {
      showToast('Please enter start and end dates', 'error');
      return;
    }

    try {
      console.log('📤 Creating trip...');
      // Create trip via API
      const newTrip = await api.trips.create({
        title: tripTitle,
        description: tripDescription || tripTitle,
        start_date: startDate,
        end_date: endDate,
        total_budget: budget,
      });

      console.log('✅ Trip created:', newTrip.id);
      showToast('Trip created successfully!', 'success');

      // Navigate to new trip's itinerary
      setTimeout(() => {
        router.navigate(`/itinerary/${newTrip.id}`);
      }, 500);
    } catch (error) {
      console.error('❌ Error creating trip:', error);
      showToast(`Failed to create trip: ${error.message}`, 'error');
    }
  };

  // Bind to form
  if (form) {
    form.addEventListener('submit', handleSubmit);
  }
  // Also bind to submit button if no form
  if (submitButton && !form) {
    submitButton.addEventListener('click', handleSubmit);
  }

  // Auto-focus first input
  const firstInput = document.querySelector('input');
  if (firstInput) firstInput.focus();
}
