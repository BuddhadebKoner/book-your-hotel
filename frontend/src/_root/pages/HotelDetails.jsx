import { useParams, useNavigate, useLocation } from 'react-router-dom'
import { useHotelDetails } from '../../lib/react-query/hooks/useHotelDetails'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Navigation, Pagination, Autoplay, Thumbs } from 'swiper/modules'
import { useState, useMemo } from 'react'
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
   ChevronUp,
   Building2,
   Image as ImageIcon
} from 'lucide-react'
import { Button } from '../../components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Badge } from '../../components/ui/badge'
import { Separator } from '../../components/ui/separator'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../components/ui/tabs'

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
   const [imageError, setImageError] = useState({})

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

   // Handle image error
   const handleImageError = (index) => {
      setImageError(prev => ({ ...prev, [index]: true }))
   }

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
         <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40">
            <div className="container mx-auto px-4 py-4">
               <Button variant="outline" onClick={handleBackNavigation} className="mb-2 hover:bg-primary hover:text-white transition-colors">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Search
               </Button>
               <div className="flex items-start justify-between flex-wrap gap-4">
                  <div className="flex-1">
                     <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">{hotel.name}</h1>
                     <div className="flex items-center gap-4 mt-2 flex-wrap">
                        {hotel.starRating > 0 && Number.isFinite(hotel.starRating) && (
                           <div className="flex items-center gap-1">
                              {[...Array(Math.min(Math.floor(hotel.starRating), 5))].map((_, i) => (
                                 <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                              ))}
                           </div>
                        )}
                        <div className="flex items-center gap-1 text-muted-foreground">
                           <MapPin className="h-4 w-4" />
                           <span className="text-sm">{hotel.address}{hotel.address && hotel.city ? ', ' : ''}{hotel.city}</span>
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
            <div className="mb-8">
               {hotelImages.length > 0 ? (
                  <>
                     <Swiper
                        modules={[Navigation, Pagination, Autoplay, Thumbs]}
                        navigation
                        pagination={{ clickable: true }}
                        autoplay={{ delay: 5000, disableOnInteraction: false }}
                        thumbs={{ swiper: thumbsSwiper && !thumbsSwiper.destroyed ? thumbsSwiper : null }}
                        className="rounded-xl overflow-hidden mb-4 shadow-2xl"
                        style={{ height: '500px' }}
                     >
                        {hotelImages.map((image, index) => (
                           <SwiperSlide key={index}>
                              <div className="relative w-full h-full bg-slate-100 dark:bg-slate-800">
                                 {!imageError[index] ? (
                                    <img
                                       src={image.urlHd || image.url}
                                       alt={image.caption || `${hotel.name} - Image ${index + 1}`}
                                       className="w-full h-full object-cover"
                                       loading={index === 0 ? 'eager' : 'lazy'}
                                       onError={() => handleImageError(index)}
                                    />
                                 ) : (
                                    <div className="w-full h-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                                       <Building2 className="h-32 w-32 text-white/80" />
                                    </div>
                                 )}
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
                     {hotelImages.length > 1 && (
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
                           {hotelImages.slice(0, 12).map((image, index) => (
                              <SwiperSlide key={index} className="cursor-pointer">
                                 <div className="aspect-video rounded-md overflow-hidden border-2 border-transparent hover:border-primary transition-all">
                                    {!imageError[`thumb-${index}`] ? (
                                       <img
                                          src={image.url}
                                          alt={`Thumbnail ${index + 1}`}
                                          className="w-full h-full object-cover"
                                          onError={() => handleImageError(`thumb-${index}`)}
                                       />
                                    ) : (
                                       <div className="w-full h-full bg-gradient-to-br from-slate-200 to-slate-300 dark:from-slate-700 dark:to-slate-800 flex items-center justify-center">
                                          <ImageIcon className="h-6 w-6 text-slate-400" />
                                       </div>
                                    )}
                                 </div>
                              </SwiperSlide>
                           ))}
                        </Swiper>
                     )}
                  </>
               ) : (
                  <div className="rounded-xl overflow-hidden mb-4 shadow-2xl h-[500px] bg-gradient-to-br from-blue-500 via-purple-600 to-pink-600 flex items-center justify-center relative">
                     <Building2 className="h-32 w-32 text-white/80 z-10" />
                     <div className="absolute inset-0 bg-black/10" />
                  </div>
               )}
            </div>

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

                                    <Button className="w-full" size="lg">
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
                           <Button className="w-full" size="lg">
                              <Phone className="mr-2 h-4 w-4" />
                              Contact Hotel
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
               <div className="space-y-6">
                  {/* Quick Info */}
                  <Card className="sticky top-24">
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

                        <Button className="w-full" size="lg">
                           <Calendar className="mr-2 h-4 w-4" />
                           Book Now
                        </Button>
                     </CardContent>
                  </Card>

                  {/* Sentiment Analysis */}
                  {hotel.sentiment_analysis && (hotel.sentiment_analysis.pros?.length > 0 || hotel.sentiment_analysis.cons?.length > 0) ? (
                     <Card>
                        <CardHeader>
                           <CardTitle className="text-lg">Guest Feedback</CardTitle>
                           <CardDescription>Based on verified guest reviews</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-4">
                           {hotel.sentiment_analysis.pros && hotel.sentiment_analysis.pros.length > 0 && (
                              <div>
                                 <h4 className="font-semibold text-sm mb-3 text-green-600 flex items-center gap-1">
                                    <CheckCircle2 className="h-4 w-4" />
                                    Pros ({hotel.sentiment_analysis.pros.length})
                                 </h4>
                                 <ul className="space-y-2">
                                    {hotel.sentiment_analysis.pros.map((pro, index) => (
                                       <li key={index} className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded-lg hover:bg-green-50 dark:hover:bg-green-950/20 transition-colors">
                                          <span className="text-green-600 font-bold mt-0.5">✓</span>
                                          <span>{pro}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           )}
                           {hotel.sentiment_analysis.cons && hotel.sentiment_analysis.cons.length > 0 && (
                              <div>
                                 <h4 className="font-semibold text-sm mb-3 text-red-600 flex items-center gap-1">
                                    <XCircle className="h-4 w-4" />
                                    Cons ({hotel.sentiment_analysis.cons.length})
                                 </h4>
                                 <ul className="space-y-2">
                                    {hotel.sentiment_analysis.cons.map((con, index) => (
                                       <li key={index} className="text-sm text-muted-foreground flex items-start gap-2 p-2 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/20 transition-colors">
                                          <span className="text-red-600 font-bold mt-0.5">✗</span>
                                          <span>{con}</span>
                                       </li>
                                    ))}
                                 </ul>
                              </div>
                           )}
                        </CardContent>
                     </Card>
                  ) : null}
               </div>
            </div>
         </div>
      </div>
   )
}
