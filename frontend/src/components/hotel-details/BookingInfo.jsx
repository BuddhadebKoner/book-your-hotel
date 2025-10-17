import {
   Clock,
   Phone,
   Mail,
   Star,
   Info,
   Calendar,
   Building2,
   Car,
   Wifi,
   Users,
   CheckCircle2
} from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'
import { Separator } from '../ui/separator'
import HotelRates from './HotelRates'

export default function BookingInfo({ hotel }) {
   return (
      <Card>
         <CardHeader>
            <CardTitle>Quick Information</CardTitle>
         </CardHeader>
         <CardContent className="space-y-4">
            {/* Check-in/Check-out */}
            {hotel.checkinCheckoutTimes ? (
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <Clock className="h-4 w-4 text-primary" />
                     <span className="font-semibold text-sm">Check-in / Check-out</span>
                  </div>
                  <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                     <p>Check-in: {hotel.checkinCheckoutTimes.checkin || 'Contact hotel'}</p>
                     <p>Check-out: {hotel.checkinCheckoutTimes.checkout || 'Contact hotel'}</p>
                  </div>
               </div>
            ) : (
               <div>
                  <div className="flex items-center gap-2 mb-2">
                     <Clock className="h-4 w-4 text-muted-foreground" />
                     <span className="font-semibold text-sm">Check-in / Check-out</span>
                  </div>
                  <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                     <p>Please contact the hotel for check-in and check-out times</p>
                  </div>
               </div>
            )}

            <Separator />

            {/* Contact */}
            {(hotel.phone && hotel.phone.trim()) || (hotel.email && hotel.email.trim()) ? (
               <div className="space-y-3">
                  {hotel.phone && hotel.phone.trim() && (
                     <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <a href={`tel:${hotel.phone}`} className="text-sm hover:underline hover:text-primary transition-colors">
                           {hotel.phone}
                        </a>
                     </div>
                  )}
                  {hotel.email && hotel.email.trim() && (
                     <div className="flex items-center gap-2">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <a href={`mailto:${hotel.email}`} className="text-sm hover:underline hover:text-primary transition-colors break-all">
                           {hotel.email}
                        </a>
                     </div>
                  )}
                  {hotel.fax && hotel.fax.trim() && (
                     <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                        <span className="text-sm text-muted-foreground">Fax: {hotel.fax}</span>
                     </div>
                  )}
               </div>
            ) : (
               <div className="text-sm text-muted-foreground p-3 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Info className="h-4 w-4 inline mr-2" />
                  Contact information available upon booking
               </div>
            )}

            <Separator />

            {/* Brand/Chain Info */}
            {hotel.chain && hotel.chain.trim() && (
               <>
                  <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 rounded-lg border border-blue-200 dark:border-blue-800">
                     <div className="flex items-center gap-2 mb-1">
                        <Building2 className="h-4 w-4 text-blue-600" />
                        <span className="text-sm font-semibold text-blue-900 dark:text-blue-200">Part of {hotel.chain}</span>
                     </div>
                     <p className="text-xs text-blue-700 dark:text-blue-300">Trusted hotel chain</p>
                  </div>
                  <Separator />
               </>
            )}

            {/* Quick Features */}
            <div className="space-y-3">
               {hotel.parking && hotel.parking.trim() && (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                     <Car className="h-4 w-4 text-primary flex-shrink-0" />
                     <span className="text-sm">Parking: {hotel.parking}</span>
                  </div>
               )}
               {hotel.hotelFacilities?.some(f => f.toLowerCase().includes('wifi')) && (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                     <Wifi className="h-4 w-4 text-primary flex-shrink-0" />
                     <span className="text-sm">Free WiFi</span>
                  </div>
               )}
               {hotel.childAllowed !== undefined && (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                     <Users className="h-4 w-4 text-primary flex-shrink-0" />
                     <span className="text-sm">{hotel.childAllowed ? 'Children Allowed' : 'Adults Only'}</span>
                  </div>
               )}
               {hotel.petsAllowed !== undefined && (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                     <CheckCircle2 className="h-4 w-4 text-primary flex-shrink-0" />
                     <span className="text-sm">{hotel.petsAllowed ? 'Pets Allowed' : 'No Pets'}</span>
                  </div>
               )}
               {hotel.groupRoomMin > 0 && (
                  <div className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                     <Users className="h-4 w-4 text-primary flex-shrink-0" />
                     <span className="text-sm">Min. {hotel.groupRoomMin} rooms for group booking</span>
                  </div>
               )}
            </div>

            <Separator />

            {/* Reviews */}
            {hotel.reviewCount > 0 ? (
               <div>
                  <div className="flex items-center justify-between mb-2">
                     <span className="font-semibold text-sm">Guest Reviews</span>
                     <Badge variant="secondary">{hotel.reviewCount} review{hotel.reviewCount > 1 ? 's' : ''}</Badge>
                  </div>
                  {hotel.rating > 0 && (
                     <div className="flex items-center gap-2">
                        <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                        <span className="text-2xl font-bold">{hotel.rating.toFixed(1)}</span>
                        <span className="text-sm text-muted-foreground">out of 5</span>
                     </div>
                  )}
               </div>
            ) : (
               <div className="text-center p-4 bg-slate-50 dark:bg-slate-800 rounded-lg">
                  <Star className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                  <p className="text-sm text-muted-foreground">No reviews yet</p>
                  <p className="text-xs text-muted-foreground mt-1">Be the first to review!</p>
               </div>
            )}

            <Separator />

            {/* Available Rates */}
            <HotelRates hotelId={hotel.id} hotelName={hotel.name} />

            <Separator />

            <Button className="w-full" size="lg">
               <Calendar className="mr-2 h-4 w-4" />
               Book Now
            </Button>
         </CardContent>
      </Card>
   )
}
