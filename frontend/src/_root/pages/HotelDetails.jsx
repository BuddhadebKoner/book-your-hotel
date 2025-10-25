import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useHotelDetails } from '../../lib/react-query/hooks/useHotelDetails'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination } from 'swiper/modules'
import { useMemo } from 'react'
import {
   Users,
   Bed,
   Maximize2,
   CheckCircle2,
   XCircle,
   ArrowLeft,
   Loader2,
   Calendar,
   Info,
   Car,
   ChevronDown,
   ChevronUp,
   MapPin,
   Building2,
   Phone,
   Mail
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../../components/ui/dialog'
import { HotelHeader, HotelGallery, BookingInfo, GuestFeedback } from '../../components/hotel-details'
import { useState } from 'react'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'

export default function HotelDetails() {
   const { hotelId } = useParams()
   const navigate = useNavigate()
   const location = useLocation()
   const { data, isLoading, isError, error } = useHotelDetails(hotelId)
   const [showAllFacilities, setShowAllFacilities] = useState(false)
   const [mobileBookingOpen, setMobileBookingOpen] = useState(false)

   // Handle booking button click - scroll to booking or open mobile dialog
   const handleBookingClick = () => {
      if (window.innerWidth < 1024) { // Mobile/tablet
         setMobileBookingOpen(true)
      } else { // Desktop - scroll to booking info
         const bookingSection = document.getElementById('booking-info-section')
         if (bookingSection) {
            bookingSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
         }
      }
   }

   // Get the previous location from state, or default to home
   const previousLocation = location.state?.from || '/'

   // Memoize hotel data with comprehensive fallbacks
   const hotel = useMemo(() => {
      const rawHotel = data?.data
      if (!rawHotel) return null

      // Safely parse star rating
      const parseStarRating = (rating) => {
         const parsed = Number(rating)
         if (!Number.isFinite(parsed) || parsed < 0) return 3
         return Math.min(Math.max(parsed, 0), 5)
      }

      return {
         ...rawHotel,
         name: rawHotel.name || 'Hotel Name Not Available',
         starRating: parseStarRating(rawHotel.starRating || rawHotel.stars),
         address: rawHotel.address || 'Address not available',
         city: rawHotel.city || 'City not available',
         hotelType: rawHotel.hotelType || 'Hotel',
         hotelImages: Array.isArray(rawHotel.hotelImages) && rawHotel.hotelImages.length > 0
            ? rawHotel.hotelImages
            : [],
         hotelFacilities: Array.isArray(rawHotel.hotelFacilities) && rawHotel.hotelFacilities.length > 0
            ? rawHotel.hotelFacilities
            : [],
         rooms: Array.isArray(rawHotel.rooms) && rawHotel.rooms.length > 0
            ? rawHotel.rooms
            : [],
         reviewCount: Number(rawHotel.reviewCount || rawHotel.review_count) || 0,
         rating: Number(rawHotel.rating) || 0,
         isDeleted: !!rawHotel.deletedAt,
         policies: Array.isArray(rawHotel.policies) && rawHotel.policies.length > 0
            ? rawHotel.policies
            : [],
         groupRoomMin: Number(rawHotel.groupRoomMin) || 0
      }
   }, [data])   // Memoize displayed facilities
   const displayedFacilities = useMemo(() => {
      if (!hotel?.hotelFacilities || hotel.hotelFacilities.length === 0) return []
      return showAllFacilities ? hotel.hotelFacilities : hotel.hotelFacilities.slice(0, 12)
   }, [hotel?.hotelFacilities, showAllFacilities])

   // Fallback images
   const fallbackImages = useMemo(() => [
      { url: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&q=80', caption: 'Hotel View' },
      { url: 'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=1200&q=80', caption: 'Luxury Room' },
      { url: 'https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=1200&q=80', caption: 'Hotel Lobby' }
   ], [])

   // Get images with fallback
   const hotelImages = useMemo(() => {
      if (hotel?.hotelImages && hotel.hotelImages.length > 0) {
         return hotel.hotelImages
      }
      return fallbackImages
   }, [hotel?.hotelImages, fallbackImages])

   // Handle back navigation
   const handleBackNavigation = () => {
      if (previousLocation && previousLocation !== '/') {
         // Navigate back to the previous location (which includes search params)
         navigate(previousLocation)
      } else {
         // Fallback to browser back
         navigate(-1)
      }
   }

   if (isLoading) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <div className="text-center">
               <Loader2 className="mx-auto mb-4 h-12 w-12 animate-spin text-primary" />
               <p className="text-lg text-muted-foreground">Loading hotel details...</p>
            </div>
         </div>
      )
   }

   if (isError) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md">
               <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-destructive">
                     <XCircle className="h-5 w-5" />
                     Error Loading Hotel
                  </CardTitle>
                  <CardDescription>{error?.message || 'Failed to load hotel details'}</CardDescription>
               </CardHeader>
               <CardContent>
                  <Button onClick={handleBackNavigation} variant="outline" className="w-full">
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Go Back
                  </Button>
               </CardContent>
            </Card>
         </div>
      )
   }

   if (!hotel) {
      return (
         <div className="min-h-screen flex items-center justify-center">
            <Card className="max-w-md">
               <CardHeader>
                  <CardTitle>Hotel Not Found</CardTitle>
                  <CardDescription>The requested hotel could not be found.</CardDescription>
               </CardHeader>
               <CardContent>
                  <Button onClick={handleBackNavigation} variant="outline" className="w-full">
                     <ArrowLeft className="mr-2 h-4 w-4" />
                     Go Back
                  </Button>
               </CardContent>
            </Card>
         </div>
      )
   }

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
         {/* Header */}
         <HotelHeader hotel={hotel} onBackClick={handleBackNavigation} />

         <div className="container mx-auto px-4 py-8 pb-24 lg:pb-8">
            {/* Deleted Property Warning */}
            {hotel.isDeleted && (
               <Card className="mb-6 border-amber-500 bg-amber-50 dark:bg-amber-950/20">
                  <CardContent className="pt-6">
                     <div className="flex items-start gap-3">
                        <Info className="h-5 w-5 text-amber-600 flex-shrink-0 mt-0.5" />
                        <div>
                           <h3 className="font-semibold text-amber-900 dark:text-amber-200 mb-1">
                              Property Status Notice
                           </h3>
                           <p className="text-sm text-amber-800 dark:text-amber-300">
                              This property listing may be outdated or no longer available for booking.
                              Please verify availability before making travel arrangements. We recommend contacting
                              the property directly or checking alternative accommodations.
                           </p>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            )}

            {/* Image Gallery */}
            <HotelGallery hotel={hotel} hotelImages={hotelImages} />

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column - Details */}
               <div className="lg:col-span-2 space-y-6">
                  {/* Hotel Overview Card - Always shown */}
                  <Card>
                     <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                           <Building2 className="h-5 w-5 text-primary" />
                           Hotel Overview
                        </CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {hotel.hotelDescription ? (
                           <div
                              className="prose prose-sm max-w-none text-muted-foreground"
                              dangerouslySetInnerHTML={{ __html: hotel.hotelDescription }}
                           />
                        ) : (
                           <div className="space-y-3">
                              <p className="text-muted-foreground">
                                 Welcome to <span className="font-semibold text-foreground">{hotel.name}</span>,
                                 {hotel.starRating > 0 && ` a ${hotel.starRating}-star`} property located in {hotel.city}{hotel.country ? `, ${hotel.country}` : ''}.
                              </p>
                              <div className="bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950/20 dark:to-purple-950/20 p-4 rounded-lg border border-blue-200 dark:border-blue-800">
                                 <p className="text-sm text-muted-foreground flex items-start gap-2">
                                    <Info className="h-4 w-4 mt-0.5 flex-shrink-0 text-blue-600" />
                                    <span>
                                       Detailed property information is being updated. Please contact the hotel directly or check back later for complete details about amenities, services, and accommodation options.
                                    </span>
                                 </p>
                              </div>
                           </div>
                        )}

                        {/* Location Info */}
                        {hotel.location && (hotel.location.latitude || hotel.location.longitude) && (
                           <div className="pt-4 border-t">
                              <h4 className="font-semibold mb-2 flex items-center gap-2">
                                 <MapPin className="h-4 w-4 text-primary" />
                                 Location
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                 Coordinates: {hotel.location.latitude?.toFixed(5)}, {hotel.location.longitude?.toFixed(5)}
                              </p>
                              {hotel.airportCode && (
                                 <p className="text-sm text-muted-foreground mt-1">
                                    Nearest Airport: {hotel.airportCode}
                                 </p>
                              )}
                           </div>
                        )}
                     </CardContent>
                  </Card>

                  {/* Facilities */}
                  {displayedFacilities.length > 0 ? (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                              Hotel Facilities
                           </CardTitle>
                           <CardDescription>Amenities and services available at this property</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {displayedFacilities.map((facility, index) => (
                                 <div key={index} className="flex items-center gap-2 p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                    <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0" />
                                    <span className="text-sm">{facility}</span>
                                 </div>
                              ))}
                           </div>
                           {hotel.hotelFacilities && hotel.hotelFacilities.length > 12 && (
                              <Button
                                 variant="outline"
                                 onClick={() => setShowAllFacilities(!showAllFacilities)}
                                 className="mt-4 w-full hover:bg-primary hover:text-white transition-colors"
                              >
                                 {showAllFacilities ? (
                                    <>
                                       <ChevronUp className="mr-2 h-4 w-4" />
                                       Show Less
                                    </>
                                 ) : (
                                    <>
                                       <ChevronDown className="mr-2 h-4 w-4" />
                                       Show All {hotel.hotelFacilities.length} Facilities
                                    </>
                                 )}
                              </Button>
                           )}
                        </CardContent>
                     </Card>
                  ) : (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Info className="h-5 w-5 text-muted-foreground" />
                              Facilities Information
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground">
                              Facility information is not currently available for this property. Please contact the hotel directly for more details.
                           </p>
                        </CardContent>
                     </Card>
                  )}

                  {/* Rooms */}
                  {hotel.rooms && hotel.rooms.length > 0 ? (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Bed className="h-5 w-5 text-primary" />
                              Available Rooms
                           </CardTitle>
                           <CardDescription>{hotel.rooms.length} room type{hotel.rooms.length > 1 ? 's' : ''} available</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <Tabs defaultValue="0" className="w-full">
                              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(Math.max(hotel.rooms.length, 1), 4)}, 1fr)` }}>
                                 {hotel.rooms.slice(0, 4).map((room, index) => (
                                    <TabsTrigger key={index} value={String(index)}>
                                       Room {index + 1}
                                    </TabsTrigger>
                                 ))}
                              </TabsList>
                              {hotel.rooms.map((room, index) => (
                                 <TabsContent key={index} value={String(index)} className="space-y-4">
                                    <div>
                                       <h3 className="text-xl font-semibold mb-2">{room.roomName || `Room ${index + 1}`}</h3>
                                       {room.description ? (
                                          <div
                                             className="text-muted-foreground text-sm prose prose-sm max-w-none"
                                             dangerouslySetInnerHTML={{ __html: room.description }}
                                          />
                                       ) : (
                                          <p className="text-muted-foreground text-sm">Comfortable room with modern amenities.</p>
                                       )}
                                    </div>

                                    {room.photos && room.photos.length > 0 && (
                                       <Swiper
                                          modules={[Navigation, Pagination]}
                                          navigation
                                          pagination={{ clickable: true }}
                                          className="rounded-lg overflow-hidden h-64 bg-slate-100 dark:bg-slate-800"
                                       >
                                          {room.photos.map((photo, photoIndex) => (
                                             <SwiperSlide key={photoIndex}>
                                                <img
                                                   src={photo.hd_url || photo.url}
                                                   alt={photo.imageDescription || room.roomName || `Room ${index + 1}`}
                                                   className="w-full h-full object-cover"
                                                   onError={(e) => {
                                                      e.target.style.display = 'none'
                                                      e.target.parentElement.style.background = 'linear-gradient(to bottom right, rgb(59 130 246), rgb(147 51 234))'
                                                      e.target.parentElement.innerHTML = '<div class="flex items-center justify-center h-full"><svg class="h-16 w-16 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>'
                                                   }}
                                                />
                                             </SwiperSlide>
                                          ))}
                                       </Swiper>
                                    )}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                       {room.maxOccupancy && (
                                          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                             <Users className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                             <div>
                                                <p className="text-xs text-muted-foreground">Max Guests</p>
                                                <p className="font-semibold">{room.maxOccupancy}</p>
                                             </div>
                                          </div>
                                       )}
                                       {room.bedTypes && room.bedTypes.length > 0 && (
                                          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                             <Bed className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                             <div>
                                                <p className="text-xs text-muted-foreground">Beds</p>
                                                <p className="font-semibold">{room.bedTypes.length}</p>
                                             </div>
                                          </div>
                                       )}
                                       {room.roomSizeSquare && (
                                          <div className="flex items-center gap-2 p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                                             <Maximize2 className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                                             <div>
                                                <p className="text-xs text-muted-foreground">Size</p>
                                                <p className="font-semibold">{room.roomSizeSquare} {room.roomSizeUnit || 'm²'}</p>
                                             </div>
                                          </div>
                                       )}
                                    </div>

                                    {room.roomAmenities && room.roomAmenities.length > 0 && (
                                       <div>
                                          <h4 className="font-semibold mb-3 flex items-center gap-2">
                                             <CheckCircle2 className="h-4 w-4 text-primary" />
                                             Room Amenities
                                          </h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                             {room.roomAmenities.slice(0, 8).map((amenity, amenityIndex) => (
                                                <div key={amenityIndex} className="flex items-center gap-2 text-sm p-2 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors">
                                                   <CheckCircle2 className="h-3 w-3 text-primary flex-shrink-0" />
                                                   <span>{amenity.name || amenity}</span>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    )}

                                    <Button
                                       className="w-full"
                                       size="lg"
                                       onClick={handleBookingClick}
                                    >
                                       <Calendar className="mr-2 h-4 w-4" />
                                       Book This Room
                                    </Button>
                                 </TabsContent>
                              ))}
                           </Tabs>
                        </CardContent>
                     </Card>
                  ) : (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Bed className="h-5 w-5 text-muted-foreground" />
                              Room Information
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm text-muted-foreground mb-4">
                              Detailed room information is not currently available. Please contact the hotel for room options and availability.
                           </p>
                           <Button
                              className="w-full"
                              size="lg"
                              onClick={handleBookingClick}
                           >
                              <Calendar className="mr-2 h-4 w-4" />
                              View Rates & Book
                           </Button>
                        </CardContent>
                     </Card>
                  )}

                  {/* Important Information */}
                  {hotel.hotelImportantInformation ? (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2 text-amber-600">
                              <Info className="h-5 w-5" />
                              Important Information
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <p className="text-sm whitespace-pre-line">{hotel.hotelImportantInformation}</p>
                        </CardContent>
                     </Card>
                  ) : (
                     displayedFacilities.length === 0 && (!hotel.rooms || hotel.rooms.length === 0) && (
                        <Card className="border-2 border-dashed">
                           <CardHeader>
                              <CardTitle className="flex items-center gap-2">
                                 <Mail className="h-5 w-5 text-primary" />
                                 Need More Information?
                              </CardTitle>
                              <CardDescription>
                                 Property details are currently limited
                              </CardDescription>
                           </CardHeader>
                           <CardContent className="space-y-4">
                              <p className="text-sm text-muted-foreground">
                                 We're working on updating comprehensive information for this property.
                                 In the meantime, you can reach out to us or the property directly for:
                              </p>
                              <ul className="space-y-2 text-sm text-muted-foreground">
                                 <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Room availability and pricing</span>
                                 </li>
                                 <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Amenities and facilities details</span>
                                 </li>
                                 <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Special requests and packages</span>
                                 </li>
                                 <li className="flex items-start gap-2">
                                    <CheckCircle2 className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                                    <span>Property policies and guidelines</span>
                                 </li>
                              </ul>
                              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                                 <Button variant="outline" className="w-full">
                                    <Mail className="mr-2 h-4 w-4" />
                                    Email Inquiry
                                 </Button>
                                 <Button className="w-full">
                                    <Phone className="mr-2 h-4 w-4" />
                                    Call Us
                                 </Button>
                              </div>
                           </CardContent>
                        </Card>
                     )
                  )}

                  {/* Hotel Policies */}
                  {hotel.policies && hotel.policies.length > 0 && (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Info className="h-5 w-5 text-primary" />
                              Hotel Policies
                           </CardTitle>
                           <CardDescription>Please review these policies before booking</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <div className="space-y-4">
                              {hotel.policies.map((policy, index) => {
                                 // Handle both string and object policies
                                 const policyName = typeof policy === 'string' ? policy : (policy.name || policy.policy_type || 'Policy');
                                 const policyDescription = typeof policy === 'object' ? policy.description : null;
                                 const policyId = typeof policy === 'object' ? policy.id : index;

                                 return (
                                    <div
                                       key={policyId || index}
                                       className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors border border-slate-200 dark:border-slate-700"
                                    >
                                       <div className="flex items-start gap-3">
                                          <div className="h-2 w-2 rounded-full bg-primary flex-shrink-0 mt-2" />
                                          <div className="flex-1">
                                             <h4 className="text-sm font-semibold text-foreground mb-1 capitalize">
                                                {policyName}
                                             </h4>
                                             {policyDescription && (
                                                <p className="text-sm text-muted-foreground">
                                                   {policyDescription}
                                                </p>
                                             )}
                                             {/* Additional policy details if object */}
                                             {typeof policy === 'object' && (
                                                <div className="mt-2 flex flex-wrap gap-2">
                                                   {policy.child_allowed !== undefined && (
                                                      <Badge variant="secondary" className="text-xs">
                                                         <Users className="h-3 w-3 mr-1" />
                                                         {policy.child_allowed ? 'Children Allowed' : 'Adults Only'}
                                                      </Badge>
                                                   )}
                                                   {policy.pets_allowed !== undefined && (
                                                      <Badge variant="secondary" className="text-xs">
                                                         {policy.pets_allowed ? '✓ Pets Allowed' : '✗ No Pets'}
                                                      </Badge>
                                                   )}
                                                   {policy.parking && (
                                                      <Badge variant="secondary" className="text-xs">
                                                         <Car className="h-3 w-3 mr-1" />
                                                         {policy.parking}
                                                      </Badge>
                                                   )}
                                                </div>
                                             )}
                                          </div>
                                       </div>
                                    </div>
                                 );
                              })}
                           </div>
                        </CardContent>
                     </Card>
                  )}
               </div>

               {/* Right Column - Booking Info */}
               <div className="space-y-6" id="booking-info-section">
                  {/* Quick Information */}
                  <BookingInfo hotel={hotel} />
               </div>
            </div>

            {/* Guest Feedback Section - Full Width at Bottom */}
            {hotel.sentiment_analysis && (hotel.sentiment_analysis.pros?.length > 0 || hotel.sentiment_analysis.cons?.length > 0) && (
               <div className="mt-8">
                  <GuestFeedback sentimentAnalysis={hotel.sentiment_analysis} />
               </div>
            )}
         </div>

         {/* Sticky Bottom Booking Button for Mobile */}
         <div className="lg:hidden fixed bottom-0 left-0 right-0 z-30 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/90 border-t p-4 shadow-lg">
            <div className="container mx-auto">
               <Button
                  className="w-full"
                  size="lg"
                  onClick={handleBookingClick}
               >
                  <Calendar className="mr-2 h-4 w-4" />
                  View Rates & Book Now
               </Button>
            </div>
         </div>

         {/* Mobile Booking Dialog */}
         <Dialog open={mobileBookingOpen} onOpenChange={setMobileBookingOpen}>
            <DialogContent className="max-w-[95vw] sm:max-w-md max-h-[90vh] overflow-y-auto">
               <DialogHeader>
                  <DialogTitle>Select Rate & Book</DialogTitle>
                  <DialogDescription>
                     {hotel.name}
                  </DialogDescription>
               </DialogHeader>
               <div className="mt-4">
                  <BookingInfo hotel={hotel} />
               </div>
            </DialogContent>
         </Dialog>
      </div>
   )
}
