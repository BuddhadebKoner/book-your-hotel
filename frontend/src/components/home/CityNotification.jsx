import { useState } from 'react';
import { MapPin, X } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * CityNotification - Small notification badge for first-time visitors
 * Non-intrusive way to suggest city selection
 */
export function CityNotification({ onSelectCity, onDismiss }) {
   const [isVisible, setIsVisible] = useState(true);

   const handleDismiss = () => {
      setIsVisible(false);
      if (onDismiss) {
         onDismiss();
      }
   };

   const handleSelect = () => {
      setIsVisible(false);
      onSelectCity();
   };

   if (!isVisible) return null;

   return (
      <div className="fixed top-20 right-6 z-50 animate-in slide-in-from-top-5 duration-500">
         <div className="relative overflow-hidden rounded-lg border bg-card shadow-lg max-w-sm">
            {/* Gradient accent */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-primary via-primary/80 to-primary" />

            {/* Close button */}
            <button
               onClick={handleDismiss}
               className="absolute top-3 right-3 rounded-full p-1 hover:bg-muted/80 transition-colors"
               aria-label="Dismiss"
            >
               <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="p-4 pr-10">
               <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                     <MapPin className="h-5 w-5 text-primary" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 space-y-2">
                     <h3 className="font-semibold text-sm">
                        Select Your City
                     </h3>
                     <p className="text-xs text-muted-foreground leading-relaxed">
                        Get personalized hotel recommendations for your area
                     </p>

                     {/* Action button */}
                     <Button
                        onClick={handleSelect}
                        size="sm"
                        className="w-full mt-2"
                     >
                        <MapPin className="mr-2 h-3.5 w-3.5" />
                        Choose City
                     </Button>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
