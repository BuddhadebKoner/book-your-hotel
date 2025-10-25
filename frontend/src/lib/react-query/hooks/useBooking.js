/**
 * React Query hooks for booking flow
 */
import { useMutation, useQuery } from '@tanstack/react-query'
import { RatesAPI, BookingAPI } from '@/services/liteApiService'

/**
 * Step 1: Create prebook session
 * Returns prebookId, secretKey, and transactionId
 */
export function usePrebookSession() {
   return useMutation({
      mutationFn: (prebookData) => RatesAPI.createPrebookSession(prebookData),
      onSuccess: (data) => {
         console.log('Prebook session created:', data)
      },
      onError: (error) => {
         console.error('Prebook session failed:', error)
      }
   })
}

/**
 * Step 3: Create final booking (after payment)
 */
export function useCreateBooking() {
   return useMutation({
      mutationFn: (bookingData) => BookingAPI.createBooking(bookingData),
      onSuccess: (data) => {
         console.log('Booking created successfully:', data)
      },
      onError: (error) => {
         console.error('Booking creation failed:', error)
      }
   })
}

/**
 * Get booking details by ID
 */
export function useBookingDetails(bookingId) {
   return useQuery({
      queryKey: ['booking', bookingId],
      queryFn: () => BookingAPI.getBookingDetails(bookingId),
      enabled: !!bookingId,
      staleTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
         console.log('Booking details fetched:', data)
      },
      onError: (error) => {
         console.error('Failed to fetch booking details:', error)
      }
   })
}

/**
 * List all bookings
 */
export function useBookingList() {
   return useQuery({
      queryKey: ['bookings'],
      queryFn: () => BookingAPI.listBookings(),
      staleTime: 5 * 60 * 1000, // 5 minutes
      onSuccess: (data) => {
         console.log('Bookings list fetched:', data)
      },
      onError: (error) => {
         console.error('Failed to fetch bookings:', error)
      }
   })
}
