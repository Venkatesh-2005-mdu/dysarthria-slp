/**
 * API Configuration
 * Dynamically sets the API base URL based on environment
 */

const API_BASE = import.meta.env.VITE_API_BASE || (() => {
  // Default to current host if no env var set
  if (typeof window !== 'undefined') {
    return `${window.location.protocol}//${window.location.host}`;
  }
  return 'http://localhost:8000';
})();

export default API_BASE;
