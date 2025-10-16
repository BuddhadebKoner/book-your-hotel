import { useQuery } from '@tanstack/react-query'
import { HotelSearchAPI } from '../../../services/liteApiService'
import { QUERY_KEYS } from '../QueryKeys'

/**
 * useHotelSearch
 * params: { countryCode, cityName }
 */
export function useHotelSearch(params, enabled = true) {
   const { countryCode = 'IN', cityName = '' } = params || {}

   return useQuery({
      queryKey: [...QUERY_KEYS.HOTEL_SEARCH, countryCode, cityName],
      queryFn: async () => {
         if (!cityName) return { data: [] }
         const res = await HotelSearchAPI.searchHotels(countryCode, cityName)
         return res
      },
      enabled: enabled && !!cityName,
      staleTime: 1000 * 60 * 5, // 5 minutes
      cacheTime: 1000 * 60 * 30, // 30 minutes
      retry: 1,
   })
}
