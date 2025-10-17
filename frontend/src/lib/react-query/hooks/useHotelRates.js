import { useQuery } from '@tanstack/react-query'
import { HotelSearchAPI } from '../../../services/liteApiService'
import { QUERY_KEYS } from '../QueryKeys'

/**
 * useHotelRates
 * Retrieve detailed rate information for hotels with multi-room support
 * 
 * @param {Object} params - Search parameters
 * @param {string} params.hotelId - Single hotel ID (will be converted to array)
 * @param {string[]} params.hotelIds - Array of hotel IDs (max 200 default, up to 5000)
 * @param {string} params.checkin - Check-in date (YYYY-MM-DD)
 * @param {string} params.checkout - Check-out date (YYYY-MM-DD)
 * @param {string} params.currency - Currency code (default: INR)
 * @param {string} params.guestNationality - Guest nationality code (default: IN)
 * @param {Array} params.occupancies - Array of room occupancies
 * @param {number} params.limit - Number of hotels to return (max 5000)
 * @param {boolean} enabled - Whether to enable the query
 */
export function useHotelRates(params, enabled = true) {
   const {
      hotelId,
      hotelIds,
      checkin,
      checkout,
      currency = 'INR',
      guestNationality = 'IN',
      occupancies = [{ adults: 2, childrenAges: [] }],
      limit
   } = params || {}

   // Convert single hotelId to array if provided
   const hotelIdsArray = hotelId ? [hotelId] : hotelIds

   return useQuery({
      queryKey: [
         ...QUERY_KEYS.HOTEL_RATES,
         hotelIdsArray,
         checkin,
         checkout,
         currency,
         guestNationality,
         JSON.stringify(occupancies)
      ],
      queryFn: async () => {
         if (!hotelIdsArray?.length || !checkin || !checkout) {
            return { data: [] }
         }

         const res = await HotelSearchAPI.searchHotelsWithRates({
            hotelIds: hotelIdsArray,
            checkin,
            checkout,
            currency,
            guestNationality,
            occupancies,
            limit,
            timeout: 12000 // 12 seconds for high load
         })

         return res
      },
      enabled: enabled && !!hotelIdsArray?.length && !!checkin && !!checkout,
      staleTime: 1000 * 60 * 2, // 2 minutes (rates change frequently)
      cacheTime: 1000 * 60 * 5, // 5 minutes
      retry: 1,
      refetchOnMount: true, // Always refetch on mount for fresh rates
   })
}
