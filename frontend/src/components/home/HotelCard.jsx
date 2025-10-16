import { Star, MapPinned } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';

/**
 * HotelCard - Reusable hotel card component
 * Displays hotel information with image, rating, location, and pricing
 */
export function HotelCard({ hotel, onViewDetails }) {
   const navigate = useNavigate();
   const location = useLocation();

   const handleViewDetails = () => {
      if (onViewDetails) {
         onViewDetails(hotel);
      }
      // Navigate to hotel details page with hotel ID, preserving current search params
      navigate(`/hotels/${hotel.id}`, {
         state: { from: location.pathname + location.search }
      });
   };

   return (
      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
         <div className="relative h-48 overflow-hidden">
            <img
               src={hotel.thumbnail || hotel.main_photo || 'https://via.placeholder.com/400x300?text=Hotel'}
               alt={hotel.name}
               className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
               onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x300?text=Hotel';
               }}
            />
            <div className="absolute top-2 right-2">
               <Badge className="bg-primary text-white shadow-lg">
                  {hotel.stars} ⭐
               </Badge>
            </div>
         </div>

         <CardContent className="p-4">
            <h3 className="font-bold text-lg mb-2 line-clamp-1" title={hotel.name}>
               {hotel.name}
            </h3>

            <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
               <MapPinned className="h-4 w-4 text-primary flex-shrink-0" />
               <span className="line-clamp-1">
                  {hotel.address && hotel.city ? `${hotel.address}, ${hotel.city}` : hotel.city || hotel.address || 'Location not available'}
               </span>
            </div>

            {hotel.rating > 0 && (
               <div className="flex items-center gap-2 mb-3">
                  <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                  <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
                  <span className="text-xs text-muted-foreground">
                     ({hotel.reviewCount || 0} reviews)
                  </span>
               </div>
            )}

            <div
               className="text-sm text-muted-foreground line-clamp-2 mb-4"
               dangerouslySetInnerHTML={{
                  __html: hotel.hotelDescription?.replace(/<[^>]*>/g, '').slice(0, 100) + '...' || 'No description available'
               }}
            />

            <div className="flex items-center justify-between">
               <div className="text-sm">
                  <span className="text-xs text-muted-foreground">From</span>
                  <div className="font-bold text-lg text-primary">
                     ₹ {hotel.price || Math.floor(Math.random() * 5000) + 1000}
                  </div>
                  <span className="text-xs text-muted-foreground">per night</span>
               </div>
               <Button
                  size="sm"
                  className="bg-primary hover:bg-primary/90"
                  onClick={handleViewDetails}
               >
                  View Details
               </Button>
            </div>
         </CardContent>
      </Card>
   );
}
