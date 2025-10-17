/**
 * API Configuration
 * Centralized API keys and endpoints
 */

// RapidAPI GeoDB Cities Configuration
export const GEODB_CONFIG = {
   apiKey: '8b0990832dmshadc1025f540c959p19bc2djsn5f87fa15aaa8',
   apiHost: 'wft-geo-db.p.rapidapi.com',
   baseUrl: 'https://wft-geo-db.p.rapidapi.com/v1',

   // Rate limiting (RapidAPI free tier typically allows 500-1000 requests/day)
   rateLimit: {
      requestsPerDay: 500,
      requestsPerMinute: 10
   }
};

// Debug mode - set to false in production
export const DEBUG_MODE = true;

// Cache configuration
export const CACHE_CONFIG = {
   citySearchTTL: 3600000, // 1 hour in milliseconds
   maxCacheSize: 100 // Maximum number of cached search results
};
