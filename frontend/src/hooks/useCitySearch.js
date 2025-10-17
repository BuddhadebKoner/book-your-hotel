import { useState, useEffect, useRef } from 'react';
import { searchIndianCities } from '../utils/locationUtils';

/**
 * Custom hook for debounced city search
 * Optimizes API calls and provides loading states
 * 
 * @param {number} delay - Debounce delay in milliseconds (default: 300)
 * @returns {Object} Search state and functions
 */
export function useCitySearch(delay = 300) {
   const [searchQuery, setSearchQuery] = useState('');
   const [cities, setCities] = useState([]);
   const [loading, setLoading] = useState(false);
   const [error, setError] = useState(null);

   const searchTimeoutRef = useRef(null);
   const abortControllerRef = useRef(null);

   useEffect(() => {
      // Clear cities if query is too short
      if (!searchQuery.trim() || searchQuery.length < 2) {
         setCities([]);
         setLoading(false);
         return;
      }

      setLoading(true);
      setError(null);

      // Clear previous timeout
      if (searchTimeoutRef.current) {
         clearTimeout(searchTimeoutRef.current);
      }

      // Abort previous request if still pending
      if (abortControllerRef.current) {
         abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      // Debounce search
      searchTimeoutRef.current = setTimeout(async () => {
         try {
            const results = await searchIndianCities(searchQuery);

            // Only update if component is still mounted and this is the latest search
            if (!abortControllerRef.current?.signal.aborted) {
               setCities(results);
               setLoading(false);
            }
         } catch (err) {
            if (!abortControllerRef.current?.signal.aborted) {
               setError(err.message);
               setLoading(false);
               console.error('City search error:', err);
            }
         }
      }, delay);

      // Cleanup function
      return () => {
         if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
         }
         if (abortControllerRef.current) {
            abortControllerRef.current.abort();
         }
      };
   }, [searchQuery, delay]);

   const clearSearch = () => {
      setSearchQuery('');
      setCities([]);
      setError(null);
      setLoading(false);
   };

   return {
      searchQuery,
      setSearchQuery,
      cities,
      loading,
      error,
      clearSearch,
      hasResults: cities.length > 0
   };
}
