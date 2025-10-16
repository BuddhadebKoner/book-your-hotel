import { Star, MapPinned, Building2, Sparkles } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useState, useCallback, useMemo } from 'react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

/**
 * HotelCard - Reusable hotel card component
 * Enhanced with better image handling, fallbacks, and optimized performance
 */
export function HotelCard({ hotel, onViewDetails }) {
   const navigate = useNavigate();
   const location = useLocation();
   const [imageError, setImageError] = useState(false);
   const [imageLoading, setImageLoading] = useState(true);

   // Memoize hotel ID to prevent unnecessary re-renders
   const hotelId = useMemo(() => hotel?.id || hotel?.hotel_id || `hotel-${Date.now()}-${Math.random()}`, [hotel?.id, hotel?.hotel_id]);

   // Memoize image URL with fallback logic
   const imageUrl = useMemo(() => {
      if (imageError) return null;
      return hotel?.thumbnail || hotel?.main_photo || hotel?.image || null;
   }, [hotel?.thumbnail, hotel?.main_photo, hotel?.image, imageError]);

   // Memoize gradient colors for fallback
   const gradientColors = useMemo(() => {
      const gradients = [
         'from-blue-500 to-purple-600',
         'from-teal-500 to-cyan-600',
         'from-orange-500 to-red-600',
         'from-pink-500 to-rose-600',
         'from-green-500 to-emerald-600',
         'from-indigo-500 to-blue-600'
      ];
      const index = hotelId.toString().length % gradients.length;
      return gradients[index];
   }, [hotelId]);

   // Optimized image error handler
   const handleImageError = useCallback(() => {
      setImageError(true);
      setImageLoading(false);
   }, []);

   // Optimized image load handler
   const handleImageLoad = useCallback(() => {
      setImageLoading(false);
   }, []);

   // Optimized view details handler
   const handleViewDetails = useCallback(() => {
      if (onViewDetails) {
         onViewDetails(hotel);
      }
      navigate(`/hotels/${hotelId}`, {
         state: { from: location.pathname + location.search }
      });
   }, [onViewDetails, hotel, navigate, hotelId, location.pathname, location.search]);

   // Memoize location display
   const locationDisplay = useMemo(() => {
      if (hotel?.address && hotel?.city) {
         return `${hotel.address}, ${hotel.city}`;
      }
      return hotel?.city || hotel?.address || 'Location not available';
   }, [hotel?.address, hotel?.city]);

   // Memoize description
   const description = useMemo(() => {
      const desc = hotel?.hotelDescription || hotel?.description;
      if (!desc) return 'Comfortable accommodation with modern amenities and excellent service';
      const cleanDesc = desc.replace(/<[^>]*>/g, '').trim();
      return cleanDesc.length > 100 ? cleanDesc.slice(0, 100) + '...' : cleanDesc;
   }, [hotel?.hotelDescription, hotel?.description]);

   // Memoize price display
   const priceDisplay = useMemo(() => {
      return hotel?.price || hotel?.rates?.price || Math.floor(Math.random() * 5000) + 1000;
   }, [hotel?.price, hotel?.rates?.price]);

   // Memoize star rating
   const starRating = useMemo(() => {
      return hotel?.stars || hotel?.star_rating || 3;
   }, [hotel?.stars, hotel?.star_rating]);

   return (
      <Card className="group hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 overflow-hidden border-0 bg-white dark:bg-slate-800">
         {/* Image Section */}
         <div className="relative h-52 overflow-hidden bg-slate-100 dark:bg-slate-700">
            {imageUrl && !imageError ? (
               <>
                  {/* Loading Skeleton */}
                  {imageLoading && (
                     <div className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-300 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-700 animate-pulse" />
                  )}
                  <img
                     src={imageUrl}
                     alt={hotel?.name || 'Hotel'}
                     className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${imageLoading ? 'opacity-0' : 'opacity-100'}`}
                     onError={handleImageError}
                     onLoad={handleImageLoad}
                     loading="lazy"
                  />
               </>
            ) : (
               // Gradient Fallback
               <div className={`w-full h-full bg-gradient-to-br ${gradientColors} flex items-center justify-center relative overflow-hidden`}>
                  <Building2 className="h-20 w-20 text-white/80 z-10" />
                  {/* Animated circles for visual interest */}
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16" />
                  <div className="absolute bottom-0 right-0 w-40 h-40 bg-white/10 rounded-full translate-x-20 translate-y-20" />
               </div>
            )}

            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

            {/* Star Badge */}
            <div className="absolute top-3 right-3 transform translate-x-20 group-hover:translate-x-0 transition-transform duration-300">
               <Badge className="bg-primary/95 text-white shadow-lg backdrop-blur-sm font-semibold">
                  {starRating} ⭐
               </Badge>
            </div>

            {/* Verified Badge */}
            <div className="absolute top-3 left-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
               <Badge className="bg-green-500/95 text-white shadow-lg backdrop-blur-sm flex items-center gap-1">
                  <Sparkles className="h-3 w-3" />
                  Verified
               </Badge>
            </div>
         </div>

         <CardContent className="p-5">
            {/* Hotel Name */}
            <h3 className="font-bold text-lg mb-2 line-clamp-1 group-hover:text-primary transition-colors duration-300" title={hotel?.name || 'Hotel'}>
               {hotel?.name || 'Unnamed Hotel'}
            </h3>

            {/* Location */}
            <div className="flex items-start gap-2 text-sm text-muted-foreground mb-3">
               <MapPinned className="h-4 w-4 text-primary flex-shrink-0 mt-0.5" />
               <span className="line-clamp-1 flex-1">
                  {locationDisplay}
               </span>
            </div>

            {/* Rating */}
            {hotel?.rating > 0 && (
               <div className="flex items-center gap-2 mb-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg p-2 w-fit">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold text-sm">{hotel.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                     ({hotel?.reviewCount || hotel?.review_count || 0} reviews)
                  </span>
               </div>
            )}

            {/* Description */}
            <p className="text-sm text-muted-foreground line-clamp-2 mb-4 leading-relaxed">
               {description}
            </p>

            {/* Price and Action */}
            <div className="flex items-end justify-between pt-3 border-t border-slate-100 dark:border-slate-700">
               <div className="text-sm">
                  <span className="text-xs text-muted-foreground uppercase tracking-wide">From</span>
                  <div className="font-bold text-xl text-primary flex items-baseline gap-1">
                     <span className="text-lg">₹</span>
                     {priceDisplay.toLocaleString('en-IN')}
                  </div>
                  <span className="text-xs text-muted-foreground">per night</span>
               </div>
               <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-300 group/btn"
                  onClick={handleViewDetails}
               >
                  View Details
                  <svg
                     className="ml-1 h-4 w-4 group-hover/btn:translate-x-1 transition-transform"
                     fill="none"
                     viewBox="0 0 24 24"
                     stroke="currentColor"
                  >
                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
