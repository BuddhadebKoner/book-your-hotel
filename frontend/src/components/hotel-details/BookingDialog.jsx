import { useState, useEffect } from 'react'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Separator } from '../ui/separator'
import { Badge } from '../ui/badge'
import { Loader2, AlertCircle, CheckCircle2, User, Users, Mail, CreditCard } from 'lucide-react'
import { usePrebookSession, useCreateBooking } from '@/lib/react-query/hooks'

/**
 * BookingDialog - Comprehensive booking flow component
 * Handles the complete booking process:
 * 1. Prebook session creation
 * 2. Payment processing (LiteAPI Payment SDK)
 * 3. Guest information collection
 * 4. Final booking confirmation
 */
export default function BookingDialog({ open, onOpenChange, hotel, selectedRate }) {
   const [step, setStep] = useState(1) // 1: Guest Info, 2: Payment, 3: Confirmation
   const [prebookData, setPrebookData] = useState(null)
   const [bookingResult, setBookingResult] = useState(null)

   // Form data
   const [holder, setHolder] = useState({
      firstName: '',
      lastName: '',
      email: ''
   })

   const [guests, setGuests] = useState([{
      occupancyNumber: 1,
      firstName: '',
      lastName: '',
      email: '',
      remarks: ''
   }])

   // Mutations
   const prebookMutation = usePrebookSession()
   const bookingMutation = useCreateBooking()

   // Reset state when dialog opens/closes
   useEffect(() => {
      if (!open) {
         setStep(1)
         setPrebookData(null)
         setBookingResult(null)
         setHolder({ firstName: '', lastName: '', email: '' })
         setGuests([{
            occupancyNumber: 1,
            firstName: '',
            lastName: '',
            email: '',
            remarks: ''
         }])
      }
   }, [open])

   // Step 1: Initialize prebook session
   const handleStartBooking = async () => {
      if (!selectedRate?.offerId) {
         console.error('No offerId available')
         return
      }

      const prebookPayload = {
         offerId: selectedRate.offerId,
         usePaymentSdk: true
      }

      console.log('Creating prebook session...', prebookPayload)

      try {
         const result = await prebookMutation.mutateAsync(prebookPayload)
         console.log('Prebook response:', result)

         if (result.data) {
            const prebookInfo = {
               prebookId: result.data.prebookId,
               secretKey: result.data.secretKey,
               transactionId: result.data.transactionId,
               sessionId: result.data.sessionId
            }

            setPrebookData(prebookInfo)

            // Save complete booking data to localStorage for confirmation page
            const completeBookingData = {
               prebookId: prebookInfo.prebookId,
               transactionId: prebookInfo.transactionId,
               hotelId: hotel.id,
               hotelName: hotel.name,
               roomName: selectedRate.name,
               boardName: selectedRate.boardName || selectedRate.boardType,
               totalPrice: selectedRate.retailRate?.total?.[0]?.amount || selectedRate.offerRetailRate?.amount,
               currency: selectedRate.retailRate?.total?.[0]?.currency || selectedRate.offerRetailRate?.currency,
               commission: selectedRate.commission?.[0]?.amount || 0,
               adultCount: selectedRate.adultCount,
               childCount: selectedRate.childCount || 0,
               cancellationPolicies: selectedRate.cancellationPolicies,
               holder: holder,
               guests: guests
            }

            localStorage.setItem('pendingBooking', JSON.stringify(completeBookingData))
            console.log('Booking data saved to localStorage:', completeBookingData)

            setStep(2) // Move to payment step
         }
      } catch (error) {
         console.error('Prebook failed:', error)
      }
   }

   // Step 2: Initialize payment SDK
   useEffect(() => {
      if (step === 2 && prebookData?.secretKey) {
         // Load LiteAPI Payment SDK
         const script = document.createElement('script')
         script.src = 'https://payment-wrapper.liteapi.travel/dist/liteAPIPayment.js?v=a1'
         script.async = true
         script.onload = () => {
            initializePaymentSDK()
         }
         document.body.appendChild(script)

         return () => {
            document.body.removeChild(script)
         }
      }
   }, [step, prebookData])

   const initializePaymentSDK = () => {
      if (!window.LiteAPIPayment || !prebookData) return

      const liteAPIConfig = {
         publicKey: 'sandbox', // Use 'live' for production
         appearance: {
            theme: 'flat',
            variables: {
               colorPrimary: '#0070f3',
               colorBackground: '#ffffff',
               colorText: '#ffffff',
               colorDanger: '#df1b41',
               fontFamily: 'system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
               spacingUnit: '4px',
               borderRadius: '8px',
            },
            rules: {
               '.Button': {
                  backgroundColor: '#0070f3',
                  color: '#ffffff',
                  border: 'none',
                  padding: '12px 24px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  borderRadius: '8px',
                  transition: 'all 0.2s ease',
               },
               '.Button:hover': {
                  backgroundColor: '#0051cc',
                  transform: 'translateY(-1px)',
                  boxShadow: '0 4px 12px rgba(0, 112, 243, 0.3)',
               },
               '.Button:active': {
                  transform: 'translateY(0)',
               },
            },
         },
         options: {
            business: {
               name: 'Book Your Hotel',
            },
         },
         targetElement: '#payment-container',
         secretKey: prebookData.secretKey,
         returnUrl: window.location.origin + '/booking-confirmation', // This should be your confirmation page
      }

      console.log('Initializing Payment SDK with config:', liteAPIConfig)

      try {
         const liteAPIPayment = new window.LiteAPIPayment(liteAPIConfig)
         liteAPIPayment.handlePayment()
         console.log('Payment SDK initialized successfully')
      } catch (error) {
         console.error('Payment SDK initialization failed:', error)
      }
   }

   // Step 3: Handle guest info and final booking
   const handleGuestInputChange = (index, field, value) => {
      const updatedGuests = [...guests]
      updatedGuests[index][field] = value
      setGuests(updatedGuests)
   }

   const handleFinalBooking = async () => {
      if (!prebookData?.prebookId || !prebookData?.transactionId) {
         console.error('Missing prebook data')
         return
      }

      const bookingPayload = {
         prebookId: prebookData.prebookId,
         holder: {
            firstName: holder.firstName,
            lastName: holder.lastName,
            email: holder.email
         },
         payment: {
            method: 'TRANSACTION_ID',
            transactionId: prebookData.transactionId
         },
         guests: guests
      }

      console.log('Creating final booking...', bookingPayload)

      try {
         const result = await bookingMutation.mutateAsync(bookingPayload)
         console.log('Booking confirmed:', result)
         setBookingResult(result)
         setStep(3) // Move to confirmation step
      } catch (error) {
         console.error('Booking failed:', error)
      }
   }

   const isHolderValid = holder.firstName && holder.lastName && holder.email
   const areGuestsValid = guests.every(g => g.firstName && g.lastName && g.email)

   if (!selectedRate) return null

   const totalPrice = selectedRate.retailRate?.total?.[0]?.amount || selectedRate.offerRetailRate?.amount
   const currency = selectedRate.retailRate?.total?.[0]?.currency || selectedRate.offerRetailRate?.currency

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
            <DialogHeader>
               <DialogTitle className="flex items-center gap-2">
                  {step === 1 && '📝 Guest Information'}
                  {step === 2 && '💳 Payment'}
                  {step === 3 && '✅ Booking Confirmed'}
               </DialogTitle>
               <DialogDescription>
                  {hotel?.name} • {selectedRate.name}
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-6">
               {/* Booking Summary */}
               <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg">
                  <h3 className="font-semibold mb-2">Booking Summary</h3>
                  <div className="space-y-1 text-sm">
                     <div className="flex justify-between">
                        <span>Room:</span>
                        <span className="font-medium">{selectedRate.name}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Board:</span>
                        <span>{selectedRate.boardName || selectedRate.boardType}</span>
                     </div>
                     <div className="flex justify-between">
                        <span>Guests:</span>
                        <span>{selectedRate.adultCount} adults{selectedRate.childCount > 0 && `, ${selectedRate.childCount} children`}</span>
                     </div>
                     <Separator className="my-2" />
                     <div className="flex justify-between font-bold text-base">
                        <span>Total:</span>
                        <span className="text-primary">{currency} {totalPrice?.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
                     </div>
                  </div>
               </div>

               {/* Step 1: Guest Information */}
               {step === 1 && (
                  <div className="space-y-4">
                     <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                           <User className="h-4 w-4" />
                           Booking Holder Information
                        </h3>
                        <div className="grid grid-cols-2 gap-3">
                           <Input
                              placeholder="First Name *"
                              value={holder.firstName}
                              onChange={(e) => setHolder({ ...holder, firstName: e.target.value })}
                           />
                           <Input
                              placeholder="Last Name *"
                              value={holder.lastName}
                              onChange={(e) => setHolder({ ...holder, lastName: e.target.value })}
                           />
                           <Input
                              type="email"
                              placeholder="Email *"
                              className="col-span-2"
                              value={holder.email}
                              onChange={(e) => setHolder({ ...holder, email: e.target.value })}
                           />
                        </div>
                     </div>

                     <Separator />

                     <div>
                        <h3 className="font-semibold mb-3 flex items-center gap-2">
                           <Users className="h-4 w-4" />
                           Guest Information
                        </h3>
                        {guests.map((guest, index) => (
                           <div key={index} className="mb-4 p-3 border rounded-lg">
                              <p className="text-sm font-medium mb-2">Guest {index + 1}</p>
                              <div className="grid grid-cols-2 gap-3">
                                 <Input
                                    placeholder="First Name *"
                                    value={guest.firstName}
                                    onChange={(e) => handleGuestInputChange(index, 'firstName', e.target.value)}
                                 />
                                 <Input
                                    placeholder="Last Name *"
                                    value={guest.lastName}
                                    onChange={(e) => handleGuestInputChange(index, 'lastName', e.target.value)}
                                 />
                                 <Input
                                    type="email"
                                    placeholder="Email *"
                                    className="col-span-2"
                                    value={guest.email}
                                    onChange={(e) => handleGuestInputChange(index, 'email', e.target.value)}
                                 />
                                 <Input
                                    placeholder="Special requests (optional)"
                                    className="col-span-2"
                                    value={guest.remarks}
                                    onChange={(e) => handleGuestInputChange(index, 'remarks', e.target.value)}
                                 />
                              </div>
                           </div>
                        ))}
                     </div>

                     <Button
                        className="w-full"
                        size="lg"
                        disabled={!isHolderValid || !areGuestsValid || prebookMutation.isPending}
                        onClick={handleStartBooking}
                     >
                        {prebookMutation.isPending ? (
                           <>
                              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                              Processing...
                           </>
                        ) : (
                           'Continue to Payment'
                        )}
                     </Button>

                     {prebookMutation.isError && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-lg border border-red-200 dark:border-red-800">
                           <p className="text-sm text-red-800 dark:text-red-200 flex items-center gap-2">
                              <AlertCircle className="h-4 w-4" />
                              {prebookMutation.error?.message || 'Failed to initialize booking. Please try again.'}
                           </p>
                        </div>
                     )}
                  </div>
               )}

               {/* Step 2: Payment */}
               {step === 2 && (
                  <div className="space-y-4">
                     <div className="p-4 bg-blue-50 dark:bg-blue-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                        <p className="text-sm text-blue-800 dark:text-blue-200 flex items-center gap-2">
                           <CreditCard className="h-4 w-4" />
                           Enter your payment details below. For testing, use card: 4242424242424242
                        </p>
                     </div>

                     {/* Payment SDK Container */}
                     <div id="payment-container" className="min-h-[300px]"></div>

                     <div className="p-3 bg-gray-50 dark:bg-gray-900 rounded text-sm text-muted-foreground">
                        <p>After successful payment, you'll be redirected to complete your booking.</p>
                     </div>
                  </div>
               )}

               {/* Step 3: Confirmation */}
               {step === 3 && bookingResult && (
                  <div className="space-y-4 text-center">
                     <div className="flex justify-center">
                        <CheckCircle2 className="h-16 w-16 text-green-500" />
                     </div>
                     <h2 className="text-2xl font-bold">Booking Confirmed!</h2>
                     <p className="text-muted-foreground">
                        Your booking has been successfully confirmed. A confirmation email has been sent to {holder.email}.
                     </p>

                     {bookingResult.data && (
                        <div className="p-4 bg-slate-50 dark:bg-slate-900 rounded-lg text-left">
                           <h3 className="font-semibold mb-2">Booking Details</h3>
                           <div className="space-y-1 text-sm">
                              <div className="flex justify-between">
                                 <span>Booking ID:</span>
                                 <span className="font-mono">{bookingResult.data.bookingId}</span>
                              </div>
                              <div className="flex justify-between">
                                 <span>Status:</span>
                                 <Badge variant="success">{bookingResult.data.status}</Badge>
                              </div>
                           </div>
                        </div>
                     )}

                     <Button className="w-full" onClick={() => onOpenChange(false)}>
                        Close
                     </Button>
                  </div>
               )}
            </div>
         </DialogContent>
      </Dialog>
   )
}
