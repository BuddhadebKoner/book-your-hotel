import { MapPin } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * ChangeCityButton - Button to change/update selected city
 * Can be placed in navbar or anywhere in the app
 */
export function ChangeCityButton({ currentCity, onClick, variant = 'ghost', size = 'sm' }) {
   return (
      <Button
         onClick={onClick}
         variant={variant}
         size={size}
         className="gap-2"
      >
         <MapPin className="h-4 w-4" />
         {currentCity ? (
            <span className="hidden sm:inline">{currentCity}</span>
         ) : (
            <span className="hidden sm:inline">Select City</span>
         )}
      </Button>
   );
}
