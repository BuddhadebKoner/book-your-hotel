/**
 * LiteAPI Service Layer
 * All API calls to LiteAPI organized by category
 */

const API_CONFIG = {
   baseUrl: import.meta.env.VITE_LITEAPI_BASE_URL || 'https://api.liteapi.travel/v3.0',
   sandboxKey: import.meta.env.VITE_LITEAPI_SANDBOX_KEY,
   privateKey: import.meta.env.VITE_LITEAPI_PRIVATE_KEY,
   whitelabelDomain: import.meta.env.VITE_LITEAPI_WHITELABEL_DOMAIN || 'whitelabel.nuitee.link'
};

// India-centric defaults
export const INDIA_CONFIG = {
   currency: import.meta.env.VITE_DEFAULT_CURRENCY || 'INR',
   country: import.meta.env.VITE_DEFAULT_COUNTRY || 'IN',
   nationality: import.meta.env.VITE_DEFAULT_NATIONALITY || 'IN'
};

// Export API config for map widget
export const MAP_CONFIG = {
   domain: API_CONFIG.whitelabelDomain,
   primaryColor: '#7057F0', // Default brand color
   currency: INDIA_CONFIG.currency,
   defaultPlaceId: 'ChIJwe1EZjDG5zsRaYxkjY_tpF0' // Default: London
};

/**
 * Helper function to make API requests
 */
async function makeRequest(endpoint, method = 'GET', body = null, usePrivateKey = false) {
   const url = `${API_CONFIG.baseUrl}${endpoint}`;
   const apiKey = usePrivateKey ? API_CONFIG.privateKey : API_CONFIG.sandboxKey;

   const options = {
      method,
      headers: {
         'Accept': 'application/json',
         'Content-Type': 'application/json',
         'X-API-Key': apiKey
      }
   };

   if (body && method !== 'GET') {
      options.body = JSON.stringify(body);
   }

   const response = await fetch(url, options);
   const data = await response.json();

   if (!response.ok) {
      throw new Error(data.error?.message || `API Error: ${response.status}`);
   }

   return data;
}

/**
 * ===========================================
 * CATEGORY 1: STATIC DATA APIs (Public)
 * ===========================================
 */

export const StaticDataAPI = {
   /**
    * Get list of all countries
    */
   getCountries: async () => {
      return await makeRequest('/data/countries');
   },

   /**
    * Get list of cities by country code
    */
   getCities: async (countryCode = 'IN') => {
      return await makeRequest(`/data/cities?countryCode=${countryCode}`);
   },

   /**
    * Get list of supported currencies
    */
   getCurrencies: async () => {
      return await makeRequest('/data/currencies');
   },

   /**
    * Get list of hotel facilities
    */
   getFacilities: async () => {
      return await makeRequest('/data/facilities');
   },

   /**
    * Get list of IATA codes
    */
   getIATACodes: async () => {
      return await makeRequest('/data/iatacodes');
   },

   /**
    * Get list of hotel types
    */
   getHotelTypes: async () => {
      return await makeRequest('/data/hoteltypes');
   },

   /**
    * Get list of hotel chains
    */
   getHotelChains: async () => {
      return await makeRequest('/data/chains');
   }
};

/**
 * ===========================================
 * CATEGORY 2: HOTEL SEARCH & DETAILS (Public)
 * ===========================================
 */

export const HotelSearchAPI = {
   /**
    * Search hotels by city and country
    */
   searchHotels: async (countryCode, cityName) => {
      return await makeRequest(`/data/hotels?countryCode=${countryCode}&cityName=${cityName}`);
   },

   /**
    * Get detailed information about a specific hotel
    */
   getHotelDetails: async (hotelId) => {
      return await makeRequest(`/data/hotel?hotelId=${hotelId}`);
   },

   /**
    * Search hotels with full rates
    */
   searchHotelsWithRates: async (searchParams) => {
      const { countryCode, cityName, checkin, checkout, adults = 2, children = 0, currency = 'INR', guestNationality = 'IN' } = searchParams;

      const body = {
         countryCode,
         cityName,
         checkin,
         checkout,
         currency,
         guestNationality,
         occupancies: [
            {
               adults,
               children
            }
         ]
      };

      return await makeRequest('/hotels/rates', 'POST', body);
   }
};

/**
 * ===========================================
 * CATEGORY 3: RATES & AVAILABILITY (Private)
 * ===========================================
 */

export const RatesAPI = {
   /**
    * Get available rates for specific hotels (Pre-booking step)
    */
   getPreBookRates: async (searchParams) => {
      const { hotelIds, checkin, checkout, adults = 2, children = 0, currency = 'INR', guestNationality = 'IN' } = searchParams;

      const body = {
         hotelIds,
         checkin,
         checkout,
         currency,
         guestNationality,
         occupancies: [
            {
               adults,
               children
            }
         ]
      };

      return await makeRequest('/rates/prebook', 'POST', body, true);
   }
};

/**
 * ===========================================
 * CATEGORY 4: BOOKING MANAGEMENT (Private)
 * ===========================================
 */

export const BookingAPI = {
   /**
    * Create a new booking
    */
   createBooking: async (bookingData) => {
      return await makeRequest('/rates/book', 'POST', bookingData, true);
   },

   /**
    * Get list of all bookings
    */
   listBookings: async () => {
      return await makeRequest('/bookings/list', 'GET', null, true);
   },

   /**
    * Get booking details by ID
    */
   getBookingDetails: async (bookingId) => {
      return await makeRequest(`/bookings/${bookingId}`, 'GET', null, true);
   },

   /**
    * Cancel a booking
    */
   cancelBooking: async (bookingId) => {
      return await makeRequest(`/bookings/${bookingId}`, 'DELETE', null, true);
   }
};

/**
 * ===========================================
 * CATEGORY 5: GUEST MANAGEMENT (Private)
 * ===========================================
 */

export const GuestAPI = {
   /**
    * Get guest information
    */
   getGuests: async () => {
      return await makeRequest('/guests', 'GET', null, true);
   },

   /**
    * Add guest information
    */
   addGuest: async (guestData) => {
      return await makeRequest('/guests', 'POST', guestData, true);
   }
};

/**
 * API Categories for UI Display
 */
export const API_CATEGORIES = {
   staticData: {
      name: 'Static Data APIs',
      description: 'Get countries, cities, currencies, facilities, and other static data',
      icon: '📊',
      requiresAuth: false,
      apis: [
         {
            id: 'countries',
            name: 'Get Countries',
            endpoint: 'GET /data/countries',
            description: 'Get list of all available countries',
            sampleParams: null,
            execute: StaticDataAPI.getCountries
         },
         {
            id: 'cities',
            name: 'Get Cities',
            endpoint: 'GET /data/cities',
            description: 'Get list of cities by country code',
            sampleParams: { countryCode: 'IN' },
            execute: (params) => StaticDataAPI.getCities(params?.countryCode)
         },
         {
            id: 'currencies',
            name: 'Get Currencies',
            endpoint: 'GET /data/currencies',
            description: 'Get list of supported currencies',
            sampleParams: null,
            execute: StaticDataAPI.getCurrencies
         },
         {
            id: 'facilities',
            name: 'Get Facilities',
            endpoint: 'GET /data/facilities',
            description: 'Get list of hotel facilities',
            sampleParams: null,
            execute: StaticDataAPI.getFacilities
         },
         {
            id: 'iatacodes',
            name: 'Get IATA Codes',
            endpoint: 'GET /data/iatacodes',
            description: 'Get list of IATA airport codes',
            sampleParams: null,
            execute: StaticDataAPI.getIATACodes
         },
         {
            id: 'hoteltypes',
            name: 'Get Hotel Types',
            endpoint: 'GET /data/hoteltypes',
            description: 'Get list of hotel types',
            sampleParams: null,
            execute: StaticDataAPI.getHotelTypes
         },
         {
            id: 'chains',
            name: 'Get Hotel Chains',
            endpoint: 'GET /data/chains',
            description: 'Get list of hotel chains',
            sampleParams: null,
            execute: StaticDataAPI.getHotelChains
         }
      ]
   },
   hotelSearch: {
      name: 'Hotel Search & Details',
      description: 'Search for hotels and get detailed information',
      icon: '🏨',
      requiresAuth: false,
      apis: [
         {
            id: 'search-hotels',
            name: 'Search Hotels',
            endpoint: 'GET /data/hotels',
            description: 'Search hotels by city and country',
            sampleParams: { countryCode: 'FR', cityName: 'paris' },
            execute: (params) => HotelSearchAPI.searchHotels(params.countryCode, params.cityName)
         },
         {
            id: 'hotel-details',
            name: 'Get Hotel Details',
            endpoint: 'GET /data/hotel',
            description: 'Get detailed information about a specific hotel',
            sampleParams: { hotelId: 'lp3803c' },
            execute: (params) => HotelSearchAPI.getHotelDetails(params.hotelId)
         }
      ]
   },
   rates: {
      name: 'Rates & Availability',
      description: 'Get hotel rates and availability',
      icon: '💰',
      requiresAuth: true,
      apis: [
         {
            id: 'prebook-rates',
            name: 'Get Pre-book Rates',
            endpoint: 'POST /rates/prebook',
            description: 'Get available rates for hotels (requires private key)',
            sampleParams: {
               hotelIds: ['lp3803c'],
               checkin: '2025-10-17',
               checkout: '2025-10-19',
               adults: 2,
               children: 0,
               currency: 'INR',
               guestNationality: 'IN'
            },
            execute: (params) => RatesAPI.getPreBookRates(params)
         }
      ]
   },
   booking: {
      name: 'Booking Management',
      description: 'Create, view, and manage bookings',
      icon: '📅',
      requiresAuth: true,
      apis: [
         {
            id: 'list-bookings',
            name: 'List Bookings',
            endpoint: 'GET /bookings/list',
            description: 'Get list of all bookings',
            sampleParams: null,
            execute: BookingAPI.listBookings
         }
      ]
   },
   guest: {
      name: 'Guest Management',
      description: 'Manage guest information',
      icon: '👤',
      requiresAuth: true,
      apis: [
         {
            id: 'get-guests',
            name: 'Get Guests',
            endpoint: 'GET /guests',
            description: 'Get guest information',
            sampleParams: null,
            execute: GuestAPI.getGuests
         }
      ]
   }
};

export default {
   StaticDataAPI,
   HotelSearchAPI,
   RatesAPI,
   BookingAPI,
   GuestAPI,
   API_CATEGORIES
};
