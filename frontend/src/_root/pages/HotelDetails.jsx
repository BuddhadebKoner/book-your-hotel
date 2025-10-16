import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useHotelDetails } from '../../lib/react-query/hooks/useHotelDetails'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, Thumbs } from 'swiper/modules'
import { useState } from 'react'
import {
   MapPin,
   Star,
   Phone,
   Mail,
   Clock,
   Users,
   Bed,
   Maximize2,
   CheckCircle2,
   XCircle,
   ArrowLeft,
   Loader2,
   Calendar,
   Info,
   Wifi,
   Car,
   Coffee,
   ChevronDown,
   ChevronUp
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'
import { ScrollArea } from '../../components/ui/scroll-area'

// Import Swiper styles
import 'swiper/css'
import 'swiper/css/navigation'
import 'swiper/css/pagination'
import 'swiper/css/thumbs'

export default function HotelDetails() {
   const { hotelId } = useParams()
   const navigate = useNavigate()
   const location = useLocation()
   const { data, isLoading, isError, error } = useHotelDetails(hotelId)
   const [thumbsSwiper, setThumbsSwiper] = useState(null)
   const [showAllFacilities, setShowAllFacilities] = useState(false)

   // Get the previous location from state, or default to home
   const previousLocation = location.state?.from || '/'

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

   const hotel = data?.data

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

   const displayedFacilities = showAllFacilities ? hotel.hotelFacilities : hotel.hotelFacilities?.slice(0, 12)

   return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
         {/* Header */}
         <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
               <Button variant="outline" onClick={handleBackNavigation} className="mb-2 hover:bg-primary hover:text-white">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Search
               </Button>
               <div className="flex items-start justify-between">
                  <div>
                     <h1 className="text-3xl md:text-4xl font-bold tracking-tight">{hotel.name}</h1>
                     <div className="flex items-center gap-4 mt-2 flex-wrap">
                        <div className="flex items-center gap-1">
                           {[...Array(hotel.starRating)].map((_, i) => (
                              <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                           ))}
                        </div>
                        <div className="flex items-center gap-1 text-muted-foreground">
                           <MapPin className="h-4 w-4" />
                           <span className="text-sm">{hotel.address}, {hotel.city}</span>
                        </div>
                     </div>
                  </div>
                  <Badge variant="secondary" className="text-lg px-4 py-2">
                     {hotel.hotelType}
                  </Badge>
               </div>
            </div>
         </div>

         <div className="container mx-auto px-4 py-8">
            {/* Image Gallery */}
            <div className="mb-8">
               <Swiper
                  modules={[Navigation, Pagination, Autoplay, Thumbs]}
                  navigation
                  pagination={{ clickable: true }}
                  autoplay={{ delay: 5000, disableOnInteraction: false }}
                  thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                  className="rounded-xl overflow-hidden mb-4 shadow-2xl"
                  style={{ height: '500px' }}
               >
                  {hotel.hotelImages?.map((image, index) => (
                     <SwiperSlide key={index}>
                        <div className="relative w-full h-full">
                           <img
                              src={image.urlHd || image.url}
                              alt={image.caption || `${hotel.name} - Image ${index + 1}`}
                              className="w-full h-full object-cover"
                              loading={index === 0 ? 'eager' : 'lazy'}
                           />
                           {image.caption && (
                              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                                 <p className="text-white text-sm capitalize">{image.caption}</p>
                              </div>
                           )}
                        </div>
                     </SwiperSlide>
                  ))}
               </Swiper>

               {/* Thumbnails */}
               <Swiper
                  onSwiper={setThumbsSwiper}
                  modules={[Thumbs]}
                  spaceBetween={10}
                  slidesPerView={6}
                  watchSlidesProgress
                  className="rounded-lg overflow-hidden"
                  breakpoints={{
                     320: { slidesPerView: 3 },
                     640: { slidesPerView: 4 },
                     768: { slidesPerView: 5 },
                     1024: { slidesPerView: 6 },
                  }}
               >
                  {hotel.hotelImages?.slice(0, 12).map((image, index) => (
                     <SwiperSlide key={index} className="cursor-pointer">
                        <div className="aspect-video rounded-md overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                           <img
                              src={image.url}
                              alt={`Thumbnail ${index + 1}`}
                              className="w-full h-full object-cover"
                           />
                        </div>
                     </SwiperSlide>
                  ))}
               </Swiper>
            </div>

            {/* Main Content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               {/* Left Column - Details */}
               <div className="lg:col-span-2 space-y-6">
                  {/* Description */}
                  {hotel.hotelDescription && (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Info className="h-5 w-5 text-primary" />
                              About This Hotel
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div
                              className="prose prose-sm max-w-none"
                              dangerouslySetInnerHTML={{ __html: hotel.hotelDescription }}
                           />
                        </CardContent>
                     </Card>
                  )}

                  {/* Facilities */}
                  {hotel.hotelFacilities && hotel.hotelFacilities.length > 0 && (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <CheckCircle2 className="h-5 w-5 text-primary" />
                              Hotel Facilities
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                              {displayedFacilities?.map((facility, index) => (
                                 <div key={index} className="flex items-center gap-2">
                                    <div className="h-2 w-2 rounded-full bg-primary" />
                                    <span className="text-sm">{facility}</span>
                                 </div>
                              ))}
                           </div>
                           {hotel.hotelFacilities.length > 12 && (
                              <Button
                                 variant="outline"
                                 onClick={() => setShowAllFacilities(!showAllFacilities)}
                                 className="mt-4 w-full hover:bg-primary hover:text-white"
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
                  )}

                  {/* Rooms */}
                  {hotel.rooms && hotel.rooms.length > 0 && (
                     <Card>
                        <CardHeader>
                           <CardTitle className="flex items-center gap-2">
                              <Bed className="h-5 w-5 text-primary" />
                              Available Rooms
                           </CardTitle>
                        </CardHeader>
                        <CardContent>
                           <Tabs defaultValue="0" className="w-full">
                              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${Math.min(hotel.rooms.length, 4)}, 1fr)` }}>
                                 {hotel.rooms.slice(0, 4).map((room, index) => (
                                    <TabsTrigger key={index} value={String(index)}>
                                       Room {index + 1}
                                    </TabsTrigger>
                                 ))}
                              </TabsList>
                              {hotel.rooms.map((room, index) => (
                                 <TabsContent key={index} value={String(index)} className="space-y-4">
                                    <div>
                                       <h3 className="text-xl font-semibold mb-2">{room.roomName}</h3>
                                       <div
                                          className="text-muted-foreground text-sm prose prose-sm max-w-none"
                                          dangerouslySetInnerHTML={{ __html: room.description }}
                                       />
                                    </div>

                                    {room.photos && room.photos.length > 0 && (
                                       <Swiper
                                          modules={[Navigation, Pagination]}
                                          navigation
                                          pagination={{ clickable: true }}
                                          className="rounded-lg overflow-hidden h-64"
                                       >
                                          {room.photos.map((photo, photoIndex) => (
                                             <SwiperSlide key={photoIndex}>
                                                <img
                                                   src={photo.hd_url || photo.url}
                                                   alt={photo.imageDescription || room.roomName}
                                                   className="w-full h-full object-cover"
                                                />
                                             </SwiperSlide>
                                          ))}
                                       </Swiper>
                                    )}

                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                       <div className="flex items-center gap-2">
                                          <Users className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                             <p className="text-xs text-muted-foreground">Max Guests</p>
                                             <p className="font-semibold">{room.maxOccupancy}</p>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <Bed className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                             <p className="text-xs text-muted-foreground">Beds</p>
                                             <p className="font-semibold">{room.bedTypes?.length || 0}</p>
                                          </div>
                                       </div>
                                       <div className="flex items-center gap-2">
                                          <Maximize2 className="h-4 w-4 text-muted-foreground" />
                                          <div>
                                             <p className="text-xs text-muted-foreground">Size</p>
                                             <p className="font-semibold">{room.roomSizeSquare} {room.roomSizeUnit}</p>
                                          </div>
                                       </div>
                                    </div>

                                    {room.roomAmenities && room.roomAmenities.length > 0 && (
                                       <div>
                                          <h4 className="font-semibold mb-2">Room Amenities</h4>
                                          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                             {room.roomAmenities.slice(0, 8).map((amenity, amenityIndex) => (
                                                <div key={amenityIndex} className="flex items-center gap-2 text-sm">
                                                   <CheckCircle2 className="h-3 w-3 text-primary" />
                                                   <span>{amenity.name}</span>
                                                </div>
                                             ))}
                                          </div>
                                       </div>
                                    )}

                                    <Button className="w-full">Book This Room</Button>
                                 </TabsContent>
                              ))}
                           </Tabs>
                        </CardContent>
                     </Card>
                  )}

                  {/* Important Information */}
                  {hotel.hotelImportantInformation && (
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
                  )}
               </div>

               {/* Right Column - Booking Info */}
               <div className="space-y-6">
                  {/* Quick Info */}
                  <Card className="sticky top-24">
                     <CardHeader>
                        <CardTitle>Quick Information</CardTitle>
                     </CardHeader>
                     <CardContent className="space-y-4">
                        {/* Check-in/Check-out */}
                        {hotel.checkinCheckoutTimes && (
                           <div>
                              <div className="flex items-center gap-2 mb-2">
                                 <Clock className="h-4 w-4 text-primary" />
                                 <span className="font-semibold text-sm">Check-in / Check-out</span>
                              </div>
                              <div className="pl-6 space-y-1 text-sm text-muted-foreground">
                                 <p>Check-in: {hotel.checkinCheckoutTimes.checkin}</p>
                                 <p>Check-out: {hotel.checkinCheckoutTimes.checkout}</p>
                              </div>
                           </div>
                        )}

                        <Separator />

                        {/* Contact */}
                        <div className="space-y-3">
                           {hotel.phone && (
                              <div className="flex items-center gap-2">
                                 <Phone className="h-4 w-4 text-primary" />
                                 <a href={`tel:${hotel.phone}`} className="text-sm hover:underline">
                                    {hotel.phone}
                                 </a>
                              </div>
                           )}
                           {hotel.email && (
                              <div className="flex items-center gap-2">
                                 <Mail className="h-4 w-4 text-primary" />
                                 <a href={`mailto:${hotel.email}`} className="text-sm hover:underline">
                                    {hotel.email}
                                 </a>
                              </div>
                           )}
                        </div>

                        <Separator />

                        {/* Quick Features */}
                        <div className="space-y-3">
                           {hotel.parking && (
                              <div className="flex items-center gap-2">
                                 <Car className="h-4 w-4 text-primary" />
                                 <span className="text-sm">Parking: {hotel.parking}</span>
                              </div>
                           )}
                           {hotel.hotelFacilities?.some(f => f.toLowerCase().includes('wifi')) && (
                              <div className="flex items-center gap-2">
                                 <Wifi className="h-4 w-4 text-primary" />
                                 <span className="text-sm">Free WiFi</span>
                              </div>
                           )}
                           {hotel.childAllowed && (
                              <div className="flex items-center gap-2">
                                 <Users className="h-4 w-4 text-primary" />
                                 <span className="text-sm">Children Allowed</span>
                              </div>
                           )}
                           {hotel.petsAllowed && (
                              <div className="flex items-center gap-2">
                                 <CheckCircle2 className="h-4 w-4 text-primary" />
                                 <span className="text-sm">Pets Allowed</span>
                              </div>
                           )}
                        </div>

                        <Separator />

                        {/* Reviews */}
                        {hotel.reviewCount > 0 && (
                           <div>
                              <div className="flex items-center justify-between mb-2">
                                 <span className="font-semibold text-sm">Guest Reviews</span>
                                 <Badge variant="secondary">{hotel.reviewCount} reviews</Badge>
                              </div>
                              {hotel.rating > 0 && (
                                 <div className="flex items-center gap-2">
                                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                                    <span className="text-2xl font-bold">{hotel.rating.toFixed(1)}</span>
                                 </div>
                              )}
                           </div>
                        )}

                        <Button className="w-full" size="lg">
                           <Calendar className="mr-2 h-4 w-4" />
                           Book Now
                        </Button>
                     </CardContent>
                  </Card>

                  {/* Sentiment Analysis */}
                  {hotel.sentiment_analysis && (
                     <Card>
                        <CardHeader>
                           <CardTitle className="text-lg">Guest Feedback</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {hotel.sentiment_analysis.pros && hotel.sentiment_analysis.pros.length > 0 && (
                              <div>
                                 <h4 className="font-semibold text-sm mb-2 text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Pros
                                 </h4>
                                 <ul className="space-y-1">
                                    {hotel.sentiment_analysis.pros.map((pro, index) => (
                                       <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                          <span className="text-green-600">•</span>
                                          {pro}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           )}
                           {hotel.sentiment_analysis.cons && hotel.sentiment_analysis.cons.length > 0 && (
                              <div>
                                 <h4 className="font-semibold text-sm mb-2 text-red-600 flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    Cons
                                 </h4>
                                 <ul className="space-y-1">
                                    {hotel.sentiment_analysis.cons.map((con, index) => (
                                       <li key={index} className="text-sm text-muted-foreground flex items-start gap-2">
                                          <span className="text-red-600">•</span>
                                          {con}
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  )}
               </div>
            </div>
         </div>
      </div>
   )
}
