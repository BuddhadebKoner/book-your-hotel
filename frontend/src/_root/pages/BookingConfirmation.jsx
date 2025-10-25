import { useEffect, useState } from 'react'
import { useSearchParams, useNavigate } from 'react-router-dom'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
   CheckCircle2,
   XCircle,
   Loader2,
   Calendar,
   MapPin,
   Users,
   Mail,
   Phone,
   Download,
   Home,
   Clock,
   CreditCard,
   AlertCircle
} from 'lucide-react'
import { useCreateBooking, useBookingDetails } from '@/lib/react-query/hooks'

export default function BookingConfirmation() {
   const [searchParams] = useSearchParams()
   const navigate = useNavigate()
   const [bookingDetails, setBookingDetails] = useState(null)
   const [isProcessing, setIsProcessing] = useState(true)
   const [error, setError] = useState(null)
   const [createdBookingId, setCreatedBookingId] = useState(null)

   const createBookingMutation = useCreateBooking()

   // Get payment parameters from URL
   const paymentIntent = searchParams.get('payment_intent')
   const paymentIntentClientSecret = searchParams.get('payment_intent_client_secret')
   const redirectStatus = searchParams.get('redirect_status')

   // Fetch booking details from API if bookingId is available
   const { data: apiBookingData, isLoading: isLoadingBookingDetails, refetch: refetchBookingDetails } = useBookingDetails(createdBookingId)

   // Merge API booking details with localStorage data
   useEffect(() => {
      if (apiBookingData?.data && bookingDetails) {
         console.log('Merging API booking data:', apiBookingData.data)

         const mergedDetails = {
            ...bookingDetails,
            // Override with API data if available
            status: apiBookingData.data.status || bookingDetails.status,
            confirmationNumber: apiBookingData.data.bookingReference || apiBookingData.data.confirmationNumber,
            hotelName: apiBookingData.data.hotel?.name || bookingDetails.hotelName,
            hotelAddress: apiBookingData.data.hotel?.address,
            hotelCity: apiBookingData.data.hotel?.city,
            hotelCountry: apiBookingData.data.hotel?.country,
            hotelPhone: apiBookingData.data.hotel?.telephone,
            checkInTime: apiBookingData.data.checkInTime,
            checkOutTime: apiBookingData.data.checkOutTime,
            checkIn: apiBookingData.data.checkin || bookingDetails.checkIn,
            checkOut: apiBookingData.data.checkout || bookingDetails.checkOut,
            totalPrice: apiBookingData.data.price || bookingDetails.totalPrice,
            currency: apiBookingData.data.currency || bookingDetails.currency,
            // Additional API fields
            supplierBookingId: apiBookingData.data.supplierBookingId,
            supplierBookingName: apiBookingData.data.supplierBookingName,
         }

         setBookingDetails(mergedDetails)

         // Update localStorage with merged data
         const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
         if (bookingHistory.length > 0 && bookingHistory[0].bookingId === mergedDetails.bookingId) {
            bookingHistory[0] = mergedDetails
            localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory))
         }
      }
   }, [apiBookingData])

   useEffect(() => {
      // Check if payment was successful
      if (redirectStatus === 'succeeded' && paymentIntent) {
         processBooking()
      } else if (redirectStatus === 'failed') {
         setError('Payment failed. Please try again.')
         setIsProcessing(false)
      } else {
         setError('Invalid payment status')
         setIsProcessing(false)
      }
   }, [redirectStatus, paymentIntent])

   const processBooking = async () => {
      try {
         // Get booking data from localStorage
         const storedBookingData = localStorage.getItem('pendingBooking')

         if (!storedBookingData) {
            setError('No booking data found. Please start a new booking.')
            setIsProcessing(false)
            return
         }

         const bookingData = JSON.parse(storedBookingData)

         console.log('Processing booking with data:', bookingData)
         console.log('Payment Intent:', paymentIntent)

         // Validate required fields
         if (!bookingData.prebookId || !bookingData.transactionId) {
            setError('Invalid booking data. Missing prebookId or transactionId.')
            setIsProcessing(false)
            return
         }

         if (!bookingData.holder || !bookingData.guests || bookingData.guests.length === 0) {
            setError('Invalid booking data. Missing guest information.')
            setIsProcessing(false)
            return
         }

         // Create the final booking
         const result = await createBookingMutation.mutateAsync({
            prebookId: bookingData.prebookId,
            holder: bookingData.holder,
            payment: {
               method: 'TRANSACTION_ID',
               transactionId: bookingData.transactionId
            },
            guests: bookingData.guests
         })

         console.log('Booking created successfully:', result)

         // Extract booking ID from response
         const bookingId = result.data?.bookingId || result.data?.booking_id || result.data?.id

         if (bookingId) {
            // Set booking ID to trigger API fetch
            setCreatedBookingId(bookingId)

            // Wait a bit for the API to be ready, then fetch full booking details
            setTimeout(() => {
               refetchBookingDetails()
            }, 1000)
         }

         // Prepare complete booking details for display (fallback if API fails)
         const completeBookingDetails = {
            // Booking confirmation data
            bookingId: bookingId || 'N/A',
            status: result.data?.status || 'confirmed',
            confirmationNumber: result.data?.confirmationNumber || result.data?.confirmation_number,

            // Hotel details
            hotelName: bookingData.hotelName,
            hotelId: bookingData.hotelId,
            roomName: bookingData.roomName,
            boardName: bookingData.boardName,

            // Guest details
            holder: bookingData.holder,
            guests: bookingData.guests,

            // Pricing
            totalPrice: bookingData.totalPrice,
            currency: bookingData.currency,
            commission: bookingData.commission,

            // Dates and occupancy
            checkIn: bookingData.checkIn,
            checkOut: bookingData.checkOut,
            nights: bookingData.nights,
            adultCount: bookingData.adultCount,
            childCount: bookingData.childCount,

            // Payment info
            paymentIntent,
            paymentStatus: redirectStatus,
            transactionId: bookingData.transactionId,

            // Policies
            cancellationPolicies: bookingData.cancellationPolicies,

            // Additional info from API
            hotelAddress: result.data?.hotel?.address,
            hotelCity: result.data?.hotel?.city,
            hotelCountry: result.data?.hotel?.country,
            checkInTime: result.data?.checkInTime,
            checkOutTime: result.data?.checkOutTime,

            // Timestamp
            bookedAt: new Date().toISOString()
         }

         // Save to localStorage for booking history
         const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
         bookingHistory.unshift(completeBookingDetails)
         localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory))

         // Clear pending booking
         localStorage.removeItem('pendingBooking')

         setBookingDetails(completeBookingDetails)
         setIsProcessing(false)

      } catch (err) {
         console.error('Booking processing failed:', err)
         console.error('Error details:', {
            message: err.message,
            stack: err.stack,
            response: err.response
         })

         // Check if we have booking data to display anyway
         const storedBookingData = localStorage.getItem('pendingBooking')

         if (storedBookingData && redirectStatus === 'succeeded') {
            // Payment succeeded, but API call failed - still show booking details
            const bookingData = JSON.parse(storedBookingData)

            const fallbackBookingDetails = {
               bookingId: 'PENDING_CONFIRMATION',
               status: 'payment_received',
               confirmationNumber: 'PENDING',
               hotelName: bookingData.hotelName,
               hotelId: bookingData.hotelId,
               roomName: bookingData.roomName,
               boardName: bookingData.boardName,
               holder: bookingData.holder,
               guests: bookingData.guests,
               totalPrice: bookingData.totalPrice,
               currency: bookingData.currency,
               commission: bookingData.commission,
               checkIn: bookingData.checkIn,
               checkOut: bookingData.checkOut,
               nights: bookingData.nights,
               adultCount: bookingData.adultCount,
               childCount: bookingData.childCount,
               paymentIntent,
               paymentStatus: redirectStatus,
               transactionId: bookingData.transactionId,
               cancellationPolicies: bookingData.cancellationPolicies,
               bookedAt: new Date().toISOString(),
               apiError: true // Flag to show warning
            }

            // Save to history
            const bookingHistory = JSON.parse(localStorage.getItem('bookingHistory') || '[]')
            bookingHistory.unshift(fallbackBookingDetails)
            localStorage.setItem('bookingHistory', JSON.stringify(bookingHistory))

            setBookingDetails(fallbackBookingDetails)
            setIsProcessing(false)

            // Show warning but don't completely fail
            console.warn('Booking details saved locally, but API confirmation failed')
            return
         }

         // Provide more specific error message
         let errorMessage = 'Failed to process booking. '

         if (err.message?.includes('NetworkError') || err.message?.includes('fetch')) {
            errorMessage += 'Network connection error. Please check your internet connection and try again.'
         } else if (err.message?.includes('API')) {
            errorMessage += 'API service error. ' + err.message
         } else {
            errorMessage += err.message || 'Please contact support with your payment reference.'
         }

         setError(errorMessage)
         setIsProcessing(false)
      }
   }

   const handleDownloadVoucher = () => {
      // Generate a simple text voucher (you can enhance this to PDF)
      const voucherText = `
BOOKING CONFIRMATION
====================

Booking ID: ${bookingDetails.bookingId}
Confirmation Number: ${bookingDetails.confirmationNumber || 'N/A'}
Status: ${bookingDetails.status}

HOTEL DETAILS
-------------
Hotel: ${bookingDetails.hotelName}
Room: ${bookingDetails.roomName}
Board: ${bookingDetails.boardName}

GUEST DETAILS
-------------
Name: ${bookingDetails.holder.firstName} ${bookingDetails.holder.lastName}
Email: ${bookingDetails.holder.email}

BOOKING DETAILS
---------------
Check-in: ${bookingDetails.checkIn || 'N/A'}
Check-out: ${bookingDetails.checkOut || 'N/A'}
Nights: ${bookingDetails.nights || 'N/A'}
Guests: ${bookingDetails.adultCount} adults${bookingDetails.childCount > 0 ? `, ${bookingDetails.childCount} children` : ''}

PAYMENT
-------
Total: ${bookingDetails.currency} ${bookingDetails.totalPrice?.toLocaleString()}
Payment Status: ${bookingDetails.paymentStatus}
Transaction ID: ${bookingDetails.transactionId}

Booked on: ${new Date(bookingDetails.bookedAt).toLocaleString()}
      `

      const blob = new Blob([voucherText], { type: 'text/plain' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = `booking-${bookingDetails.bookingId}.txt`
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      URL.revokeObjectURL(url)
   }

   // Loading state
   if (isProcessing) {
      return (
         <div className="container max-w-2xl mx-auto py-12 px-4">
            <Card>
               <CardContent className="py-12">
                  <div className="text-center space-y-4">
                     <Loader2 className="h-16 w-16 mx-auto animate-spin text-primary" />
                     <h2 className="text-2xl font-bold">Processing Your Booking</h2>
                     <p className="text-muted-foreground">
                        Please wait while we confirm your reservation...
                     </p>
                     <div className="max-w-md mx-auto space-y-2 text-sm text-muted-foreground">
                        <p>✓ Payment verified</p>
                        <p>⏳ Creating your booking...</p>
                        <p>📧 Preparing confirmation email...</p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      )
   }

   // Error state
   if (error) {
      return (
         <div className="container max-w-2xl mx-auto py-12 px-4">
            <Card>
               <CardContent className="py-12">
                  <div className="text-center space-y-4">
                     <XCircle className="h-16 w-16 mx-auto text-red-500" />
                     <h2 className="text-2xl font-bold">Booking Error</h2>
                     <p className="text-muted-foreground">{error}</p>
                     <div className="flex gap-3 justify-center">
                        <Button onClick={() => navigate('/')} variant="outline">
                           <Home className="mr-2 h-4 w-4" />
                           Go Home
                        </Button>
                        <Button onClick={() => window.location.reload()}>
                           Try Again
                        </Button>
                     </div>
                  </div>
               </CardContent>
            </Card>
         </div>
      )
   }

   // Success state
   if (!bookingDetails) {
      return null
   }

   return (
      <div className="container max-w-4xl mx-auto py-8 px-4">
         {/* API Error Warning */}
         {bookingDetails?.apiError && (
            <Card className="mb-6 border-yellow-200 bg-yellow-50 dark:bg-yellow-950/20">
               <CardContent className="py-4">
                  <div className="flex items-start gap-3">
                     <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                     <div className="text-sm">
                        <p className="font-medium mb-1 text-yellow-800 dark:text-yellow-200">
                           Payment Received - Confirmation Pending
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300">
                           Your payment of {bookingDetails.currency} {bookingDetails.totalPrice?.toLocaleString()} was successful!
                           However, we're experiencing technical difficulties confirming your booking with the hotel.
                           Don't worry - we have your payment reference and will complete your booking shortly.
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 mt-2">
                           <strong>Payment Reference:</strong> {bookingDetails.paymentIntent}
                        </p>
                        <p className="text-yellow-700 dark:text-yellow-300 mt-1">
                           Please contact support if you don't receive a confirmation email within 24 hours.
                        </p>
                     </div>
                  </div>
               </CardContent>
            </Card>
         )}

         {/* Success Header */}
         <Card className="mb-6 border-green-200 bg-green-50 dark:bg-green-950/20">
            <CardContent className="py-8">
               <div className="text-center space-y-4">
                  <CheckCircle2 className="h-20 w-20 mx-auto text-green-500" />
                  <div>
                     <h1 className="text-3xl font-bold mb-2">Booking Confirmed!</h1>
                     <p className="text-lg text-muted-foreground">
                        Your reservation has been successfully confirmed
                     </p>
                  </div>
                  <div className="flex items-center justify-center gap-4 flex-wrap">
                     <Badge variant="success" className="text-base px-4 py-2">
                        <CheckCircle2 className="mr-2 h-4 w-4" />
                        {bookingDetails.status?.toUpperCase() || 'CONFIRMED'}
                     </Badge>
                     <div className="text-sm text-muted-foreground">
                        Booking ID: <span className="font-mono font-bold">{bookingDetails.bookingId}</span>
                     </div>
                  </div>
               </div>
            </CardContent>
         </Card>

         <div className="grid md:grid-cols-2 gap-6">
            {/* Hotel & Room Details */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <MapPin className="h-5 w-5" />
                     Hotel Details
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div>
                     <h3 className="font-bold text-xl mb-1">{bookingDetails.hotelName}</h3>
                     <p className="text-sm text-muted-foreground">Hotel ID: {bookingDetails.hotelId}</p>
                     {bookingDetails.hotelAddress && (
                        <div className="mt-2 text-sm text-muted-foreground">
                           <p>{bookingDetails.hotelAddress}</p>
                           {(bookingDetails.hotelCity || bookingDetails.hotelCountry) && (
                              <p>{bookingDetails.hotelCity}{bookingDetails.hotelCity && bookingDetails.hotelCountry && ', '}{bookingDetails.hotelCountry}</p>
                           )}
                        </div>
                     )}
                     {bookingDetails.hotelPhone && (
                        <div className="flex items-center gap-2 mt-2 text-sm">
                           <Phone className="h-4 w-4 text-primary" />
                           <a href={`tel:${bookingDetails.hotelPhone}`} className="hover:underline">
                              {bookingDetails.hotelPhone}
                           </a>
                        </div>
                     )}
                  </div>

                  <Separator />

                  <div className="space-y-2">
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Room Type:</span>
                        <span className="font-medium">{bookingDetails.roomName}</span>
                     </div>
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Board:</span>
                        <span>{bookingDetails.boardName}</span>
                     </div>
                     {bookingDetails.confirmationNumber && (
                        <div className="flex justify-between">
                           <span className="text-muted-foreground">Confirmation #:</span>
                           <span className="font-mono font-medium">{bookingDetails.confirmationNumber}</span>
                        </div>
                     )}
                     {bookingDetails.checkIn && bookingDetails.checkOut && (
                        <>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Check-in:</span>
                              <span className="font-medium">
                                 {new Date(bookingDetails.checkIn).toLocaleDateString()}
                                 {bookingDetails.checkInTime && ` (${bookingDetails.checkInTime})`}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Check-out:</span>
                              <span className="font-medium">
                                 {new Date(bookingDetails.checkOut).toLocaleDateString()}
                                 {bookingDetails.checkOutTime && ` (${bookingDetails.checkOutTime})`}
                              </span>
                           </div>
                           <div className="flex justify-between">
                              <span className="text-muted-foreground">Nights:</span>
                              <span className="font-medium">{bookingDetails.nights}</span>
                           </div>
                        </>
                     )}
                     <div className="flex justify-between">
                        <span className="text-muted-foreground">Guests:</span>
                        <span>{bookingDetails.adultCount} adults{bookingDetails.childCount > 0 && `, ${bookingDetails.childCount} children`}</span>
                     </div>
                     {bookingDetails.supplierBookingId && (
                        <div className="flex justify-between text-xs">
                           <span className="text-muted-foreground">Supplier Booking ID:</span>
                           <span className="font-mono">{bookingDetails.supplierBookingId}</span>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Guest Information */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <Users className="h-5 w-5" />
                     Guest Information
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div>
                     <p className="text-sm text-muted-foreground mb-2">Booking Holder</p>
                     <div className="space-y-2">
                        <p className="font-medium">
                           {bookingDetails.holder.firstName} {bookingDetails.holder.lastName}
                        </p>
                        <div className="flex items-center gap-2 text-sm">
                           <Mail className="h-4 w-4 text-muted-foreground" />
                           <span>{bookingDetails.holder.email}</span>
                        </div>
                     </div>
                  </div>

                  <Separator />

                  <div>
                     <p className="text-sm text-muted-foreground mb-2">Guests Staying</p>
                     {bookingDetails.guests.map((guest, index) => (
                        <div key={index} className="mb-2 p-2 bg-slate-50 dark:bg-slate-900 rounded">
                           <p className="font-medium text-sm">
                              Guest {index + 1}: {guest.firstName} {guest.lastName}
                           </p>
                           {guest.remarks && (
                              <p className="text-xs text-muted-foreground mt-1">
                                 Note: {guest.remarks}
                              </p>
                           )}
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>

            {/* Payment Details */}
            <Card>
               <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                     <CreditCard className="h-5 w-5" />
                     Payment Details
                  </CardTitle>
               </CardHeader>
               <CardContent className="space-y-4">
                  <div className="space-y-2">
                     <div className="flex justify-between text-lg">
                        <span className="font-medium">Total Amount:</span>
                        <span className="font-bold text-primary">
                           {bookingDetails.currency} {bookingDetails.totalPrice?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                        </span>
                     </div>

                     <Separator />

                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment Status:</span>
                        <Badge variant="success">{bookingDetails.paymentStatus}</Badge>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Transaction ID:</span>
                        <span className="font-mono text-xs">{bookingDetails.transactionId}</span>
                     </div>
                     <div className="flex justify-between text-sm">
                        <span className="text-muted-foreground">Payment Intent:</span>
                        <span className="font-mono text-xs truncate max-w-[200px]">{bookingDetails.paymentIntent}</span>
                     </div>
                     {bookingDetails.commission > 0 && (
                        <div className="flex justify-between text-sm">
                           <span className="text-muted-foreground">Commission:</span>
                           <span>{bookingDetails.currency} {bookingDetails.commission?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                        </div>
                     )}
                  </div>
               </CardContent>
            </Card>

            {/* Cancellation Policy */}
            {bookingDetails.cancellationPolicies && (
               <Card>
                  <CardHeader>
                     <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Cancellation Policy
                     </CardTitle>
                  </CardHeader>
                  <CardContent>
                     {bookingDetails.cancellationPolicies.cancelPolicyInfos?.length > 0 ? (
                        <div className="space-y-2">
                           {bookingDetails.cancellationPolicies.cancelPolicyInfos.map((policy, index) => (
                              <div key={index} className="p-2 bg-slate-50 dark:bg-slate-900 rounded text-sm">
                                 <p className="font-medium">
                                    {bookingDetails.cancellationPolicies.refundableTag === 'RFN' ? '✓ Refundable' : '✗ Non-refundable'}
                                 </p>
                                 <p className="text-muted-foreground">
                                    Cancel before: {new Date(policy.cancelTime).toLocaleString()}
                                 </p>
                                 <p className="text-muted-foreground">
                                    Penalty: {policy.currency} {policy.amount?.toLocaleString()}
                                 </p>
                              </div>
                           ))}
                        </div>
                     ) : (
                        <p className="text-sm text-muted-foreground">No cancellation policy available</p>
                     )}
                  </CardContent>
               </Card>
            )}
         </div>

         {/* Action Buttons */}
         <div className="mt-6 flex gap-3 justify-center flex-wrap">
            <Button onClick={handleDownloadVoucher} variant="outline" size="lg">
               <Download className="mr-2 h-4 w-4" />
               Download Voucher
            </Button>
            <Button onClick={() => navigate('/')} size="lg">
               <Home className="mr-2 h-4 w-4" />
               Back to Home
            </Button>
         </div>

         {/* Confirmation Message */}
         <Card className="mt-6 border-blue-200 bg-blue-50 dark:bg-blue-950/20">
            <CardContent className="py-4">
               <div className="flex items-start gap-3">
                  <Mail className="h-5 w-5 text-blue-500 flex-shrink-0 mt-0.5" />
                  <div className="text-sm">
                     <p className="font-medium mb-1">Confirmation Email Sent</p>
                     <p className="text-muted-foreground">
                        A confirmation email with your booking details has been sent to {bookingDetails.holder.email}.
                        Please check your inbox and spam folder.
                     </p>
                  </div>
               </div>
            </CardContent>
         </Card>

         {/* Booking Time */}
         <p className="text-center text-sm text-muted-foreground mt-4">
            Booked on {new Date(bookingDetails.bookedAt).toLocaleString()}
         </p>
      </div>
   )
}
