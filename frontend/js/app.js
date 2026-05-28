import { api } from './api.js';
import { router } from './router.js';
import { renderLogin } from './pages/stitch-login.js';
import { renderTrips } from './pages/stitch-trips.js';
import { renderPlanTrip } from './pages/stitch-plan-trip.js';
import { renderItinerary } from './pages/stitch-itinerary.js';

console.log('🚀 App.js loaded');

// Global error handler
window.addEventListener('error', (e) => {
  console.error('❌ Global error:', e.error);
});

window.addEventListener('unhandledrejection', (e) => {
  console.error('❌ Unhandled promise rejection:', e.reason);
});

// Auth guard
router.setGuard((path) => {
  const publicRoutes = ['/login'];
  if (!publicRoutes.includes(path) && !api.auth.isAuthenticated()) {
    router.navigate('/login');
    return false;
  }
  if (path === '/login' && api.auth.isAuthenticated()) {
    router.navigate('/trips');
    return false;
  }
  return true;
});

// Register routes
router
  .register('/login', () => {
    console.log('📄 Rendering login page');
    renderLogin();
  })
  .register('/trips', () => {
    console.log('📄 Rendering trips page');
    renderTrips();
  })
  .register('/plan-trip', () => {
    console.log('📄 Rendering plan trip page');
    renderPlanTrip();
  })
  .register('/itinerary', (id) => {
    console.log('📄 Rendering itinerary page for trip:', id);
    renderItinerary(id);
  });

// Start
console.log('🎯 Starting router');
router.start();
console.log('✅ App initialized');
