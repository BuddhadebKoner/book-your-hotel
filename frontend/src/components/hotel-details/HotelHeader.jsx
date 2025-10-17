import { ArrowLeft, Star, MapPin } from 'lucide-react'
import { Button } from '../ui/button'
import { Badge } from '../ui/badge'

export default function HotelHeader({ hotel, onBackClick }) {
   return (
      <div className="border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-40 shadow-sm">
         <div className="container mx-auto px-4 py-4">
            <Button
               variant="outline"
               onClick={onBackClick}
               className="mb-2 hover:bg-primary hover:text-white transition-colors"
            >
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
   )
}
