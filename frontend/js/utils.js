/**
 * Utility Functions & Helpers
 */

// Debounce function for input handlers
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function for scroll/resize events
export function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Cache for API responses
const cache = new Map();

export function setCache(key, value, ttl = 60000) {
  cache.set(key, {
    value,
    timestamp: Date.now(),
    ttl,
  });
}

export function getCache(key) {
  const cached = cache.get(key);
  if (!cached) return null;
  if (Date.now() - cached.timestamp > cached.ttl) {
    cache.delete(key);
    return null;
  }
  return cached.value;
}

export function clearCache(pattern) {
  if (!pattern) {
    cache.clear();
    return;
  }
  const regex = new RegExp(pattern);
  for (const key of cache.keys()) {
    if (regex.test(key)) {
      cache.delete(key);
    }
  }
}

// Lazy load images
export function lazyLoadImages(container) {
  if ('IntersectionObserver' in window) {
    const images = container.querySelectorAll('img[data-src]');
    const imageObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.removeAttribute('data-src');
          imageObserver.unobserve(img);
        }
      });
    });
    images.forEach(img => imageObserver.observe(img));
  }
}

// Sanitize HTML to prevent XSS
export function sanitizeHTML(html) {
  const div = document.createElement('div');
  div.textContent = html;
  return div.innerHTML;
}

// Format relative time (e.g., "2 hours ago")
export function formatRelativeTime(date) {
  const now = new Date();
  const diff = now - new Date(date);
  const seconds = Math.floor(diff / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);

  if (seconds < 60) return 'just now';
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;
  return new Date(date).toLocaleDateString();
}

// Request animation frame wrapper
export function requestAnimationFramePromise() {
  return new Promise(resolve => requestAnimationFrame(resolve));
}

// Measure performance
export const performance = {
  marks: {},

  start(label) {
    this.marks[label] = performance.now();
  },

  end(label) {
    if (!this.marks[label]) {
      console.warn(`No start mark for ${label}`);
      return 0;
    }
    const duration = performance.now() - this.marks[label];
    console.log(`⏱️ ${label}: ${duration.toFixed(2)}ms`);
    return duration;
  },
};
