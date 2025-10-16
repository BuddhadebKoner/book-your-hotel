import { useQuery } from '@tanstack/react-query'
import { HotelSearchAPI } from '../../../services/liteApiService'
import { QUERY_KEYS } from '../QueryKeys'

/**
 * useHotelDetails
 * Fetch detailed information for a specific hotel by ID
 * @param {string} hotelId - The hotel ID to fetch details for
 * @param {boolean} enabled - Whether the query should run
 */
export function useHotelDetails(hotelId, enabled = true) {
   return useQuery({
      queryKey: [...QUERY_KEYS.HOTEL_DETAILS, hotelId],
      queryFn: async () => {
         if (!hotelId) return null
         const res = await HotelSearchAPI.getHotelDetails(hotelId)
         return res
      },
      enabled: enabled && !!hotelId,
      staleTime: 1000 * 60 * 10, // 10 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
   })
}
