import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
   Calendar,
   MapPin,
   Users,
   CreditCard,
   Home,
   PackageOpen,
   CheckCircle2,
   Clock,
   Loader2
} from 'lucide-react'
import { useBookingList } from '@/lib/react-query/hooks'

export default function BookingHistory() {
   const [bookings, setBookings] = useState([])
   const navigate = useNavigate()

   // Fetch bookings from API
   const { data: apiBookings, isLoading, isError, error } = useBookingList()

   useEffect(() => {
      // Load booking history from localStorage
      const localHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')

      // Merge with API data if available
      if (apiBookings?.data) {
         console.log('API Bookings:', apiBookings.data)

         // Create a map of API bookings by ID for quick lookup
         const apiBookingsMap = new Map(
            apiBookings.data.map(booking => [
               booking.bookingId || booking.booking_id || booking.id,
               booking
            ])
         )

         // Merge local bookings with API data
         const mergedBookings = localHistory.map(localBooking => {
            const apiBooking = apiBookingsMap.get(localBooking.bookingId)
            if (apiBooking) {
               return {
                  ...localBooking,
                  status: apiBooking.status || localBooking.status,
                  confirmationNumber: apiBooking.bookingReference || apiBooking.confirmationNumber,
                  // Add any additional API fields
               }
            }
            return localBooking
         })

         // Add any API bookings that aren't in localStorage
         apiBookings.data.forEach(apiBooking => {
            const bookingId = apiBooking.bookingId || apiBooking.booking_id || apiBooking.id
            if (!localHistory.some(b => b.bookingId === bookingId)) {
               mergedBookings.push({
                  bookingId,
                  status: apiBooking.status || 'confirmed',
                  hotelName: apiBooking.hotel?.name || 'Unknown Hotel',
                  hotelId: apiBooking.hotelId,
                  roomName: apiBooking.roomType || 'Standard Room',
                  boardName: apiBooking.boardType || 'Room Only',
                  totalPrice: apiBooking.price || 0,
                  currency: apiBooking.currency || 'INR',
                  checkIn: apiBooking.checkin,
                  checkOut: apiBooking.checkout,
                  adultCount: apiBooking.adults || 2,
                  childCount: apiBooking.children || 0,
                  holder: apiBooking.holder || {},
                  guests: apiBooking.guests || [],
                  paymentStatus: 'succeeded',
                  transactionId: apiBooking.transactionId || '',
                  bookedAt: apiBooking.createdAt || new Date().toISOString()
               })
            }
         })

         setBookings(mergedBookings)
      } else {
         setBookings(localHistory)
      }
   }, [apiBookings])

   if (isLoading) {
      return (
         <div className="container max-w-4xl mx-auto py-12 px-4">
            <Card>
               <CardContent className="py-12">
                  <div className="text-center space-y-4">
                     <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
                     <h2 className="text-2xl font-bold">Loading Your Bookings</h2>
                     <p className="text-muted-foreground">Please wait...</p>
                  </div>
               </CardContent>
            </Card>
         </div>
      )
   }

   if (bookings.length === 0) {
      return (
         <div className="container max-w-4xl mx-auto py-12 px-4">
            <h1 className="text-3xl font-bold mb-8">Booking History</h1>
            <Card>
               <CardContent className="py-12">
                  <div className="text-center space-y-4">
                     <PackageOpen className="h-16 w-16 mx-auto text-muted-foreground" />
                     <div>
                        <h2 className="text-2xl font-bold mb-2">No Bookings Yet</h2>
                        <p className="text-muted-foreground">
                           You haven't made any bookings. Start exploring hotels!
                        </p>
                     </div>
                     <Button onClick={() => navigate('/')}>
                        <Home className="mr-2 h-4 w-4" />
                        Browse Hotels
                     </Button>
                  </div>
               </CardContent>
            </Card>
         </div>
      )
   }

   return (
      <div className="container max-w-6xl mx-auto py-8 px-4">
         <div className="flex items-center justify-between mb-8">
            <h1 className="text-3xl font-bold">Booking History</h1>
            <Badge variant="secondary" className="text-base px-4 py-2">
               {bookings.length} booking{bookings.length > 1 ? 's' : ''}
            </Badge>
         </div>

         {isError && (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
               <Clock className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
               <div>
                  <p className="text-yellow-800 text-sm font-medium">
                     Unable to sync with server
                  </p>
                  <p className="text-yellow-700 text-xs mt-1">
                     Showing locally saved bookings. {error?.message || 'Please check your connection.'}
                  </p>
               </div>
            </div>
         )}

         <div className="space-y-6">
            {bookings.map((booking, index) => (
               <Card key={index} className="overflow-hidden">
                  <div className="bg-gradient-to-r from-primary/10 to-primary/5 p-4 border-b">
                     <div className="flex items-center justify-between flex-wrap gap-3">
                        <div>
                           <p className="text-sm text-muted-foreground">Booking ID</p>
                           <p className="font-mono font-bold text-lg">{booking.bookingId}</p>
                        </div>
                        <div className="flex items-center gap-2">
                           <Badge variant="success" className="text-sm">
                              <CheckCircle2 className="mr-1 h-3 w-3" />
                              {booking.status?.toUpperCase() || 'CONFIRMED'}
                           </Badge>
                           <Badge variant="outline" className="text-sm">
                              {booking.paymentStatus}
                           </Badge>
                        </div>
                     </div>
                  </div>

                  <CardContent className="p-6">
                     <div className="grid md:grid-cols-2 gap-6">
                        {/* Hotel Details */}
                        <div className="space-y-3">
                           <div className="flex items-start gap-2">
                              <MapPin className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                 <p className="font-bold text-lg">{booking.hotelName}</p>
                                 <p className="text-sm text-muted-foreground">{booking.roomName}</p>
                                 <p className="text-sm text-muted-foreground">{booking.boardName}</p>
                              </div>
                           </div>

                           {booking.checkIn && booking.checkOut && (
                              <div className="flex items-start gap-2">
                                 <Calendar className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                                 <div>
                                    <p className="text-sm">
                                       <span className="font-medium">Check-in:</span> {new Date(booking.checkIn).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm">
                                       <span className="font-medium">Check-out:</span> {new Date(booking.checkOut).toLocaleDateString()}
                                    </p>
                                    <p className="text-sm text-muted-foreground">
                                       {booking.nights} night{booking.nights > 1 ? 's' : ''}
                                    </p>
                                 </div>
                              </div>
                           )}

                           <div className="flex items-start gap-2">
                              <Users className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <div>
                                 <p className="text-sm">
                                    {booking.adultCount} adult{booking.adultCount > 1 ? 's' : ''}
                                    {booking.childCount > 0 && `, ${booking.childCount} child${booking.childCount > 1 ? 'ren' : ''}`}
                                 </p>
                                 <p className="text-sm text-muted-foreground">
                                    {booking.holder.firstName} {booking.holder.lastName}
                                 </p>
                              </div>
                           </div>
                        </div>

                        {/* Payment Details */}
                        <div className="space-y-3">
                           <div className="flex items-start gap-2">
                              <CreditCard className="h-5 w-5 text-primary flex-shrink-0 mt-0.5" />
                              <div className="w-full">
                                 <div className="flex justify-between items-start mb-2">
                                    <span className="text-sm text-muted-foreground">Total Amount:</span>
                                    <span className="font-bold text-lg text-primary">
                                       {booking.currency} {booking.totalPrice?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                    </span>
                                 </div>
                                 <div className="space-y-1">
                                    <div className="flex justify-between text-sm">
                                       <span className="text-muted-foreground">Payment Method:</span>
                                       <span>Credit Card</span>
                                    </div>
                                    <div className="flex justify-between text-sm">
                                       <span className="text-muted-foreground">Transaction ID:</span>
                                       <span className="font-mono text-xs truncate max-w-[150px]">
                                          {booking.transactionId}
                                       </span>
                                    </div>
                                 </div>
                              </div>
                           </div>

                           <div className="flex items-start gap-2 mt-4">
                              <Clock className="h-5 w-5 text-muted-foreground flex-shrink-0 mt-0.5" />
                              <div>
                                 <p className="text-sm text-muted-foreground">
                                    Booked on {new Date(booking.bookedAt).toLocaleDateString('en-IN', {
                                       day: 'numeric',
                                       month: 'short',
                                       year: 'numeric',
                                       hour: '2-digit',
                                       minute: '2-digit'
                                    })}
                                 </p>
                              </div>
                           </div>
                        </div>
                     </div>

                     <Separator className="my-4" />

                     {/* Guest Details */}
                     <div>
                        <p className="text-sm font-medium mb-2">Guests</p>
                        <div className="flex flex-wrap gap-2">
                           {booking.guests.map((guest, gIndex) => (
                              <Badge key={gIndex} variant="outline">
                                 {guest.firstName} {guest.lastName}
                              </Badge>
                           ))}
                        </div>
                     </div>
                  </CardContent>
               </Card>
            ))}
         </div>

         <div className="mt-8 text-center">
            <Button onClick={() => navigate('/')} variant="outline" size="lg">
               <Home className="mr-2 h-4 w-4" />
               Back to Home
            </Button>
         </div>
      </div>
   )
}
