import { useState, useEffect } from 'react'
import { useHotelRates } from '../../lib/react-query/hooks'
import { Calendar as CalendarIcon, Users, Loader2, AlertCircle, DollarSign } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog'
import { ScrollArea } from '../ui/scroll-area'
import { Calendar } from '../ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { format, addDays, differenceInDays } from 'date-fns'
import { cn } from '@/lib/utils'

/**
 * HotelRates Component
 * Displays available room rates for a hotel in a dialog
 */
export default function HotelRates({ hotelId, hotelName, onRateSelect, selectedRate }) {
   // Default dates: today + 7 days for checkin, +9 days for checkout (2 nights)
   const defaultCheckin = format(addDays(new Date(), 7), 'yyyy-MM-dd')
   const defaultCheckout = format(addDays(new Date(), 9), 'yyyy-MM-dd')

   const [open, setOpen] = useState(false)
   const [checkInDate, setCheckInDate] = useState(new Date(defaultCheckin))
   const [checkOutDate, setCheckOutDate] = useState(new Date(defaultCheckout))
   const [isDatePickerOpen, setIsDatePickerOpen] = useState(false)

   const [searchParams, setSearchParams] = useState({
      hotelId,
      checkin: defaultCheckin,
      checkout: defaultCheckout,
      currency: 'INR',
      guestNationality: 'IN',
      occupancies: [{ adults: 2, childrenAges: [] }]
   })

   // Update search params when dates change
   const handleDateChange = (newCheckIn, newCheckOut) => {
      if (newCheckIn && newCheckOut) {
         setCheckInDate(newCheckIn)
         setCheckOutDate(newCheckOut)
         setSearchParams(prev => ({
            ...prev,
            checkin: format(newCheckIn, 'yyyy-MM-dd'),
            checkout: format(newCheckOut, 'yyyy-MM-dd')
         }))
         setIsDatePickerOpen(false)
      }
   }

   // Update searchParams when hotelId prop changes
   useEffect(() => {
      if (hotelId) {
         setSearchParams(prev => ({
            ...prev,
            hotelId
         }))
      }
   }, [hotelId])

   // Only fetch when dialog is open
   const { data, isLoading, isError, error } = useHotelRates(searchParams, open && !!hotelId)

   // Extract data from response
   // Response structure: { data: [{ hotelId, roomTypes: [...] }], sandbox: boolean }
   const hotelData = data?.data?.[0] // First hotel in response
   const roomTypes = hotelData?.roomTypes || []

   // Flatten all rates from all room types
   const allRooms = roomTypes.flatMap(roomType =>
      roomType.rates.map(rate => ({
         ...rate,
         roomTypeId: roomType.roomTypeId,
         offerId: roomType.offerId,
         supplier: roomType.supplier,
         offerRetailRate: roomType.offerRetailRate,
         suggestedSellingPrice: roomType.suggestedSellingPrice,
         rateType: roomType.rateType,
         paymentTypes: roomType.paymentTypes
      }))
   )

   // Calculate nights
   const nights = Math.ceil((new Date(searchParams.checkout) - new Date(searchParams.checkin)) / (1000 * 60 * 60 * 24))

   // Handle rate selection
   const handleRateSelect = (rate) => {
      if (onRateSelect) {
         onRateSelect(rate)
      }
      setOpen(false) // Close dialog after selection
   }

   return (
      <Dialog open={open} onOpenChange={setOpen}>
         <DialogTrigger asChild>
            <Button className="w-full" size="lg" variant="default">
               <DollarSign className="mr-2 h-4 w-4" />
               View Available Rates
            </Button>
         </DialogTrigger>
         <DialogContent className="max-w-4xl max-h-[90vh] p-0">
            <DialogHeader className="p-6 pb-4 space-y-4">
               <DialogTitle className="flex items-center gap-2 text-2xl">
                  <DollarSign className="h-6 w-6 text-primary" />
                  Available Rates
               </DialogTitle>
               <DialogDescription className="text-base">
                  {hotelName && <span className="font-semibold">{hotelName}</span>}
                  {' • '}
                  {nights} night{nights > 1 ? 's' : ''}
               </DialogDescription>

               {/* Date Picker in Header */}
               <div className="pt-2">
                  <Popover open={isDatePickerOpen} onOpenChange={setIsDatePickerOpen}>
                     <PopoverTrigger asChild>
                        <Button
                           variant="outline"
                           className="w-full justify-start text-left font-normal bg-background hover:bg-accent"
                        >
                           <CalendarIcon className="mr-2 h-4 w-4" />
                           <span className="font-semibold">
                              {format(checkInDate, 'MMM dd')} - {format(checkOutDate, 'MMM dd, yyyy')}
                           </span>
                        </Button>
                     </PopoverTrigger>
                     <PopoverContent className="w-auto p-0 bg-background" align="start" side="bottom">
                        <div className="p-4 space-y-4 bg-background">
                           <div className="space-y-2">
                              <h4 className="font-medium text-sm text-foreground">Check-in Date</h4>
                              <Calendar
                                 mode="single"
                                 selected={checkInDate}
                                 onSelect={(date) => {
                                    if (date) {
                                       setCheckInDate(date)
                                       // Auto-adjust checkout if it's before new checkin
                                       if (differenceInDays(checkOutDate, date) < 1) {
                                          setCheckOutDate(addDays(date, 1))
                                       }
                                    }
                                 }}
                                 disabled={(date) => date < new Date()}
                                 initialFocus
                                 className="bg-background"
                              />
                           </div>
                           <Separator />
                           <div className="space-y-2">
                              <h4 className="font-medium text-sm text-foreground">Check-out Date</h4>
                              <Calendar
                                 mode="single"
                                 selected={checkOutDate}
                                 onSelect={(date) => {
                                    if (date) {
                                       setCheckOutDate(date)
                                    }
                                 }}
                                 disabled={(date) => date <= checkInDate}
                                 className="bg-background"
                              />
                           </div>
                           <Separator />
                           <div className="flex gap-2">
                              <Button
                                 variant="outline"
                                 className="flex-1"
                                 onClick={() => setIsDatePickerOpen(false)}
                              >
                                 Cancel
                              </Button>
                              <Button
                                 className="flex-1"
                                 onClick={() => handleDateChange(checkInDate, checkOutDate)}
                              >
                                 Apply Changes
                              </Button>
                           </div>
                        </div>
                     </PopoverContent>
                  </Popover>
               </div>
            </DialogHeader>

            <ScrollArea className="max-h-[calc(90vh-250px)]">
               <div className="p-6 pt-2">
                  {isLoading && (
                     <div className="flex items-center justify-center py-12">
                        <div className="text-center">
                           <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
                           <p className="text-sm text-muted-foreground">Loading rates...</p>
                        </div>
                     </div>
                  )}

                  {isError && (
                     <div className="py-12 text-center">
                        <AlertCircle className="mx-auto mb-4 h-12 w-12 text-destructive" />
                        <h3 className="text-lg font-semibold mb-2">Error Loading Rates</h3>
                        <p className="text-sm text-muted-foreground">
                           {error?.message || 'Unable to fetch rates. Please try again later.'}
                        </p>
                     </div>
                  )}

                  {!isLoading && !isError && (!allRooms || allRooms.length === 0) && (
                     <div className="py-12 text-center">
                        <DollarSign className="mx-auto mb-4 h-12 w-12 text-muted-foreground" />
                        <h3 className="text-lg font-semibold mb-2">No Rates Available</h3>
                        <p className="text-sm text-muted-foreground">
                           No rates available for the selected dates. Try different dates or contact the hotel directly.
                        </p>
                     </div>
                  )}

                  {!isLoading && !isError && allRooms && allRooms.length > 0 && (
                     <div className="space-y-4">
                        {/* Room Rates List */}
                        <div className="space-y-3">
                           {allRooms.map((rate, index) => {
                              // Room details
                              const roomName = rate.name || `Room ${index + 1}`
                              const maxOccupancy = rate.maxOccupancy || 2
                              const boardName = rate.boardName || rate.boardType || 'Room Only'

                              // Price information from retailRate
                              const retailRate = rate.retailRate || {}
                              const totalPrice = retailRate.total?.[0]?.amount || rate.offerRetailRate?.amount || 0
                              const currency = retailRate.total?.[0]?.currency || rate.offerRetailRate?.currency || searchParams.currency
                              const suggestedPrice = retailRate.suggestedSellingPrice?.[0]?.amount || rate.suggestedSellingPrice?.amount
                              const pricePerNight = totalPrice / nights

                              // Tax information
                              const taxes = retailRate.taxesAndFees || []
                              const vatAmount = taxes.find(t => t.description === 'vat')?.amount || 0
                              const taxIncluded = taxes.find(t => t.description === 'vat')?.included || false

                              // Cancellation info
                              const cancellationPolicies = rate.cancellationPolicies || {}
                              const refundableTag = cancellationPolicies.refundableTag
                              const isRefundable = refundableTag === 'RFN' || refundableTag === 'RFNF'
                              const cancelPolicyInfos = cancellationPolicies.cancelPolicyInfos || []
                              const firstCancelPolicy = cancelPolicyInfos[0]

                              // Commission info
                              const commission = rate.commission?.[0]?.amount || 0
                              const priceType = rate.priceType

                              return (
                                 <div
                                    key={rate.rateId || index}
                                    className={cn(
                                       "p-4 rounded-lg border transition-colors bg-background",
                                       selectedRate?.rateId === rate.rateId
                                          ? "border-primary bg-primary/5"
                                          : "border-slate-200 dark:border-slate-800 hover:border-primary"
                                    )}
                                 >
                                    <div className="space-y-3">
                                       {/* Room Header */}
                                       <div className="flex items-start justify-between gap-3">
                                          <div className="flex-1">
                                             <h4 className="font-semibold text-foreground leading-snug">{roomName}</h4>
                                             <p className="text-sm text-muted-foreground mt-1">{boardName}</p>
                                          </div>
                                          <div className="flex flex-col gap-1 items-end">
                                             {isRefundable && (
                                                <Badge variant="secondary" className="text-xs">
                                                   Refundable
                                                </Badge>
                                             )}
                                             {priceType === 'commission' && commission > 0 && (
                                                <Badge variant="outline" className="text-xs">
                                                   Commission: {currency} {commission.toFixed(0)}
                                                </Badge>
                                             )}
                                          </div>
                                       </div>

                                       {/* Room Details */}
                                       <div className="flex items-center gap-4 text-sm text-muted-foreground flex-wrap">
                                          <div className="flex items-center gap-1">
                                             <Users className="h-4 w-4" />
                                             <span>Up to {maxOccupancy} guests</span>
                                          </div>
                                          {rate.adultCount > 0 && (
                                             <div className="flex items-center gap-1">
                                                <span>•</span>
                                                <span>{rate.adultCount} adults</span>
                                             </div>
                                          )}
                                          {rate.childCount > 0 && (
                                             <div className="flex items-center gap-1">
                                                <span>•</span>
                                                <span>{rate.childCount} children</span>
                                             </div>
                                          )}
                                       </div>

                                       {/* Cancellation Policy */}
                                       {firstCancelPolicy && (
                                          <div className="p-2 rounded bg-slate-50 dark:bg-slate-900/50 border border-slate-200 dark:border-slate-800">
                                             <p className="text-xs text-muted-foreground">
                                                {isRefundable ? '✓' : '✗'} Free cancellation until {format(new Date(firstCancelPolicy.cancelTime), 'MMM dd, yyyy h:mm a')}
                                             </p>
                                          </div>
                                       )}

                                       {/* Price */}
                                       <div className="flex items-end justify-between gap-3 pt-2 border-t">
                                          <div className="flex-1">
                                             <div className="flex items-baseline gap-2 flex-wrap">
                                                <span className="text-2xl font-bold text-foreground">
                                                   {currency} {totalPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                </span>
                                                {suggestedPrice && suggestedPrice > totalPrice && (
                                                   <span className="text-sm text-muted-foreground line-through">
                                                      {currency} {suggestedPrice.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                                                   </span>
                                                )}
                                             </div>
                                             <p className="text-xs text-muted-foreground mt-1">
                                                {currency} {pricePerNight.toLocaleString('en-IN', { maximumFractionDigits: 0 })} per night
                                             </p>
                                             {taxIncluded && vatAmount > 0 && (
                                                <p className="text-xs text-muted-foreground">
                                                   Includes taxes ({currency} {vatAmount.toLocaleString('en-IN', { maximumFractionDigits: 0 })})
                                                </p>
                                             )}
                                          </div>
                                          <Button
                                             size="sm"
                                             className="flex-shrink-0"
                                             variant={selectedRate?.rateId === rate.rateId ? "default" : "outline"}
                                             onClick={() => handleRateSelect(rate)}
                                          >
                                             {selectedRate?.rateId === rate.rateId ? "Selected" : "Select"}
                                          </Button>
                                       </div>
                                    </div>
                                 </div>
                              )
                           })}
                        </div>
                     </div>
                  )}
               </div>
            </ScrollArea>
         </DialogContent>
      </Dialog>
   )
}
