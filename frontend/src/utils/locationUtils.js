/**
 * City Management Utilities
 * Handles city selection, search, and local storage management
 * Integrated with RapidAPI GeoDB Cities API
 */

import { GEODB_CONFIG, DEBUG_MODE, CACHE_CONFIG } from '../config/apiConfig';

const CITY_STORAGE_KEY = 'user_preferred_city';
const CITY_SELECTION_KEY = 'city_selection_shown';

// In-memory cache for search results
const searchCache = new Map();
let cacheTimestamps = new Map();

// Request tracking for rate limiting
let requestCount = 0;
let lastRequestTime = Date.now();

/**
 * Debug logger - only logs when DEBUG_MODE is true
 */
function debugLog(message, data = null) {
   if (DEBUG_MODE) {
      console.log(`[CityUtils] ${message}`, data || '');
   }
}

/**
 * Check if cache is valid
 */
function isCacheValid(key) {
   const timestamp = cacheTimestamps.get(key);
   if (!timestamp) return false;

   const age = Date.now() - timestamp;
   return age < CACHE_CONFIG.citySearchTTL;
}

/**
 * Clean old cache entries
 */
function cleanCache() {
   if (searchCache.size > CACHE_CONFIG.maxCacheSize) {
      debugLog('Cleaning cache, current size:', searchCache.size);

      // Remove oldest entries
      const entries = Array.from(cacheTimestamps.entries())
         .sort((a, b) => a[1] - b[1])
         .slice(0, Math.floor(CACHE_CONFIG.maxCacheSize / 2));

      entries.forEach(([key]) => {
         searchCache.delete(key);
         cacheTimestamps.delete(key);
      });

      debugLog('Cache cleaned, new size:', searchCache.size);
   }
}

/**
 * Check rate limiting
 */
function checkRateLimit() {
   const now = Date.now();
   const timeSinceLastRequest = now - lastRequestTime;

   // Reset counter every minute
   if (timeSinceLastRequest > 60000) {
      requestCount = 0;
      lastRequestTime = now;
   }

   // Check if we've exceeded rate limit
   if (requestCount >= GEODB_CONFIG.rateLimit.requestsPerMinute) {
      debugLog('Rate limit exceeded, using fallback');
      return false;
   }

   return true;
}

/**
 * Search for Indian cities using GeoDB Cities API with RapidAPI
 * @param {string} searchQuery - City name to search for
 * @returns {Promise<Array>} Array of city suggestions
 */
export async function searchIndianCities(searchQuery) {
   if (!searchQuery || searchQuery.length < 2) {
      debugLog('Search query too short:', searchQuery);
      return [];
   }

   const normalizedQuery = searchQuery.trim().toLowerCase();
   const cacheKey = `search_${normalizedQuery}`;

   // Check cache first
   if (isCacheValid(cacheKey)) {
      debugLog('Returning cached results for:', searchQuery);
      return searchCache.get(cacheKey);
   }

   // Check rate limiting
   if (!checkRateLimit()) {
      debugLog('Rate limit hit, using fallback');
      return getFallbackCities(searchQuery);
   }

   try {
      debugLog('Fetching cities from API for:', searchQuery);

      const url = `${GEODB_CONFIG.baseUrl}/geo/cities?countryIds=IN&namePrefix=${encodeURIComponent(searchQuery)}&limit=10&sort=-population&types=CITY`;

      const response = await fetch(url, {
         method: 'GET',
         headers: {
            'X-RapidAPI-Key': GEODB_CONFIG.apiKey,
            'X-RapidAPI-Host': GEODB_CONFIG.apiHost
         }
      });

      requestCount++;
      debugLog('API request count:', requestCount);

      if (!response.ok) {
         debugLog('API response not OK:', response.status);

         // Check if it's a rate limit error
         if (response.status === 429) {
            console.warn('⚠️ RapidAPI rate limit reached. Using fallback cities.');
         }

         return getFallbackCities(searchQuery);
      }

      const data = await response.json();
      debugLog('API response received:', data);

      const cities = data.data?.map(city => ({
         name: city.name,
         region: city.region || city.regionCode,
         country: city.country,
         displayName: `${city.name}, ${city.region || city.regionCode}`
      })) || [];

      // Cache the results
      searchCache.set(cacheKey, cities);
      cacheTimestamps.set(cacheKey, Date.now());
      cleanCache();

      debugLog('Cities found and cached:', cities.length);

      return cities;

   } catch (error) {
      console.error('❌ Error fetching cities from API:', error.message);
      debugLog('Full error:', error);

      // Return fallback cities on error
      return getFallbackCities(searchQuery);
   }
}

/**
 * Fallback list of major Indian cities
 * Used when API is unavailable
 */
const INDIAN_CITIES = [
   { name: 'Mumbai', region: 'Maharashtra' },
   { name: 'Delhi', region: 'Delhi' },
   { name: 'Bangalore', region: 'Karnataka' },
   { name: 'Hyderabad', region: 'Telangana' },
   { name: 'Chennai', region: 'Tamil Nadu' },
   { name: 'Kolkata', region: 'West Bengal' },
   { name: 'Pune', region: 'Maharashtra' },
   { name: 'Ahmedabad', region: 'Gujarat' },
   { name: 'Jaipur', region: 'Rajasthan' },
   { name: 'Surat', region: 'Gujarat' },
   { name: 'Lucknow', region: 'Uttar Pradesh' },
   { name: 'Kanpur', region: 'Uttar Pradesh' },
   { name: 'Nagpur', region: 'Maharashtra' },
   { name: 'Indore', region: 'Madhya Pradesh' },
   { name: 'Thane', region: 'Maharashtra' },
   { name: 'Bhopal', region: 'Madhya Pradesh' },
   { name: 'Visakhapatnam', region: 'Andhra Pradesh' },
   { name: 'Pimpri-Chinchwad', region: 'Maharashtra' },
   { name: 'Patna', region: 'Bihar' },
   { name: 'Vadodara', region: 'Gujarat' },
   { name: 'Ghaziabad', region: 'Uttar Pradesh' },
   { name: 'Ludhiana', region: 'Punjab' },
   { name: 'Agra', region: 'Uttar Pradesh' },
   { name: 'Nashik', region: 'Maharashtra' },
   { name: 'Faridabad', region: 'Haryana' },
   { name: 'Meerut', region: 'Uttar Pradesh' },
   { name: 'Rajkot', region: 'Gujarat' },
   { name: 'Varanasi', region: 'Uttar Pradesh' },
   { name: 'Srinagar', region: 'Jammu and Kashmir' },
   { name: 'Aurangabad', region: 'Maharashtra' },
   { name: 'Dhanbad', region: 'Jharkhand' },
   { name: 'Amritsar', region: 'Punjab' },
   { name: 'Allahabad', region: 'Uttar Pradesh' },
   { name: 'Ranchi', region: 'Jharkhand' },
   { name: 'Howrah', region: 'West Bengal' },
   { name: 'Coimbatore', region: 'Tamil Nadu' },
   { name: 'Jabalpur', region: 'Madhya Pradesh' },
   { name: 'Gwalior', region: 'Madhya Pradesh' },
   { name: 'Vijayawada', region: 'Andhra Pradesh' },
   { name: 'Jodhpur', region: 'Rajasthan' },
   { name: 'Madurai', region: 'Tamil Nadu' },
   { name: 'Raipur', region: 'Chhattisgarh' },
   { name: 'Kota', region: 'Rajasthan' },
   { name: 'Guwahati', region: 'Assam' },
   { name: 'Chandigarh', region: 'Chandigarh' },
   { name: 'Solapur', region: 'Maharashtra' },
   { name: 'Hubballi-Dharwad', region: 'Karnataka' },
   { name: 'Mysore', region: 'Karnataka' },
   { name: 'Tiruchirappalli', region: 'Tamil Nadu' },
   { name: 'Bareilly', region: 'Uttar Pradesh' },
   { name: 'Aligarh', region: 'Uttar Pradesh' },
   { name: 'Tiruppur', region: 'Tamil Nadu' },
   { name: 'Moradabad', region: 'Uttar Pradesh' },
   { name: 'Jalandhar', region: 'Punjab' },
   { name: 'Bhubaneswar', region: 'Odisha' },
   { name: 'Salem', region: 'Tamil Nadu' },
   { name: 'Warangal', region: 'Telangana' },
   { name: 'Guntur', region: 'Andhra Pradesh' },
   { name: 'Bhiwandi', region: 'Maharashtra' },
   { name: 'Saharanpur', region: 'Uttar Pradesh' },
   { name: 'Gorakhpur', region: 'Uttar Pradesh' },
   { name: 'Bikaner', region: 'Rajasthan' },
   { name: 'Amravati', region: 'Maharashtra' },
   { name: 'Noida', region: 'Uttar Pradesh' },
   { name: 'Jamshedpur', region: 'Jharkhand' },
   { name: 'Bhilai', region: 'Chhattisgarh' },
   { name: 'Cuttack', region: 'Odisha' },
   { name: 'Firozabad', region: 'Uttar Pradesh' },
   { name: 'Kochi', region: 'Kerala' },
   { name: 'Nellore', region: 'Andhra Pradesh' },
   { name: 'Bhavnagar', region: 'Gujarat' },
   { name: 'Dehradun', region: 'Uttarakhand' },
   { name: 'Durgapur', region: 'West Bengal' },
   { name: 'Asansol', region: 'West Bengal' },
   { name: 'Rourkela', region: 'Odisha' },
   { name: 'Nanded', region: 'Maharashtra' },
   { name: 'Kolhapur', region: 'Maharashtra' },
   { name: 'Ajmer', region: 'Rajasthan' },
   { name: 'Akola', region: 'Maharashtra' },
   { name: 'Gulbarga', region: 'Karnataka' },
   { name: 'Jamnagar', region: 'Gujarat' },
   { name: 'Ujjain', region: 'Madhya Pradesh' },
   { name: 'Loni', region: 'Uttar Pradesh' },
   { name: 'Siliguri', region: 'West Bengal' },
   { name: 'Jhansi', region: 'Uttar Pradesh' },
   { name: 'Mangalore', region: 'Karnataka' },
   { name: 'Erode', region: 'Tamil Nadu' },
   { name: 'Belgaum', region: 'Karnataka' },
   { name: 'Ambattur', region: 'Tamil Nadu' },
   { name: 'Tirunelveli', region: 'Tamil Nadu' },
   { name: 'Malegaon', region: 'Maharashtra' },
   { name: 'Gaya', region: 'Bihar' },
   { name: 'Jalgaon', region: 'Maharashtra' },
   { name: 'Udaipur', region: 'Rajasthan' },
   { name: 'Maheshtala', region: 'West Bengal' },
].map(city => ({
   ...city,
   displayName: `${city.name}, ${city.region}`
}));

/**
 * Get fallback cities filtered by search query
 */
function getFallbackCities(searchQuery) {
   const query = searchQuery.toLowerCase().trim();
   return INDIAN_CITIES.filter(city =>
      city.name.toLowerCase().startsWith(query) ||
      city.name.toLowerCase().includes(query)
   ).slice(0, 10);
}

/**
 * Save preferred city to local storage
 * @param {string} cityName - City name to save
 */
export function savePreferredCity(cityName) {
   try {
      const cityData = {
         city: cityName,
         timestamp: new Date().toISOString()
      };
      localStorage.setItem(CITY_STORAGE_KEY, JSON.stringify(cityData));
      localStorage.setItem(CITY_SELECTION_KEY, 'true');
   } catch (error) {
      console.error('Error saving city to storage:', error);
   }
}

/**
 * Get saved preferred city from local storage
 * @returns {Object|null} City data or null
 */
export function getPreferredCity() {
   try {
      const data = localStorage.getItem(CITY_STORAGE_KEY);
      return data ? JSON.parse(data) : null;
   } catch (error) {
      console.error('Error reading city from storage:', error);
      return null;
   }
}

/**
 * Check if city selection was already shown
 * @returns {boolean}
 */
export function wasCitySelectionShown() {
   return localStorage.getItem(CITY_SELECTION_KEY) === 'true';
}

/**
 * Mark city selection as shown
 */
export function markCitySelectionShown() {
   localStorage.setItem(CITY_SELECTION_KEY, 'true');
}

/**
 * Clear saved city data from storage
 */
export function clearPreferredCity() {
   localStorage.removeItem(CITY_STORAGE_KEY);
}

/**
 * Check if city data is still valid (not older than 30 days)
 * @param {Object} cityData 
 * @returns {boolean}
 */
export function isCityDataValid(cityData) {
   if (!cityData || !cityData.timestamp) {
      return false;
   }

   const savedDate = new Date(cityData.timestamp);
   const currentDate = new Date();
   const daysDifference = (currentDate - savedDate) / (1000 * 60 * 60 * 24);

   return daysDifference < 30; // Valid for 30 days
}

/**
 * Get popular cities for quick selection
 * @returns {Array} Array of popular city objects
 */
export function getPopularCities() {
   debugLog('Getting popular cities');
   return INDIAN_CITIES.slice(0, 12); // Top 12 most popular cities
}

/**
 * Clear search cache (useful for development/testing)
 */
export function clearSearchCache() {
   searchCache.clear();
   cacheTimestamps.clear();
   debugLog('Search cache cleared');
}

/**
 * Get cache statistics (for debugging)
 */
export function getCacheStats() {
   const stats = {
      cacheSize: searchCache.size,
      cachedQueries: Array.from(searchCache.keys()),
      requestCount,
      timeSinceLastRequest: Date.now() - lastRequestTime,
      rateLimitStatus: checkRateLimit() ? 'OK' : 'Limited'
   };

   debugLog('Cache statistics:', stats);
   return stats;
}

/**
 * Test API connection (for debugging)
 */
export async function testAPIConnection() {
   try {
      debugLog('Testing API connection...');

      const url = `${GEODB_CONFIG.baseUrl}/geo/cities?countryIds=IN&limit=1`;
      const response = await fetch(url, {
         method: 'GET',
         headers: {
            'X-RapidAPI-Key': GEODB_CONFIG.apiKey,
            'X-RapidAPI-Host': GEODB_CONFIG.apiHost
         }
      });

      const result = {
         status: response.status,
         statusText: response.statusText,
         ok: response.ok,
         headers: Object.fromEntries(response.headers.entries())
      };

      if (response.ok) {
         const data = await response.json();
         result.data = data;
         console.log('✅ API Connection Successful:', result);
      } else {
         const errorText = await response.text();
         result.error = errorText;
         console.error('❌ API Connection Failed:', result);
      }

      return result;
   } catch (error) {
      const result = {
         error: error.message,
         stack: error.stack
      };
      console.error('❌ API Test Error:', result);
      return result;
   }
}
