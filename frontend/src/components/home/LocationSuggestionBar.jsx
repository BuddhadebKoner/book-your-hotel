import { useState } from 'react';
import { MapPin, X, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * LocationSuggestionBar - Premium hover bar for returning users
 * Suggests exploring hotels in their saved location
 */
export function LocationSuggestionBar({ cityName, onExplore, onDismiss }) {
   const [isVisible, setIsVisible] = useState(true);
   const [isHovered, setIsHovered] = useState(false);

   const handleDismiss = () => {
      setIsVisible(false);
      if (onDismiss) {
         onDismiss();
      }
   };

   const handleExplore = () => {
      setIsVisible(false);
      onExplore();
   };

   if (!isVisible) return null;

   return (
      <div
         className="fixed bottom-6 right-6 z-50 animate-in slide-in-from-bottom-5 duration-500"
         onMouseEnter={() => setIsHovered(true)}
         onMouseLeave={() => setIsHovered(false)}
      >
         <div
            className={`
               relative overflow-hidden rounded-lg border bg-card shadow-lg
               transition-all duration-300 ease-in-out
               ${isHovered ? 'shadow-2xl scale-105' : 'shadow-lg'}
            `}
            style={{ maxWidth: '380px' }}
         >
            {/* Gradient Background Effect */}
            <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-primary/5" />

            {/* Close Button */}
            <button
               onClick={handleDismiss}
               className="absolute top-2 right-2 z-10 rounded-full p-1 bg-muted/80 transition-colors"
               aria-label="Dismiss"
            >
               <X className="h-4 w-4 text-muted-foreground" />
            </button>

            <div className="relative p-4 pr-10">
               {/* Content */}
               <div className="flex items-start gap-3">
                  {/* Icon */}
                  <div className="mt-1 flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-primary/10">
                     <MapPin className="h-5 w-5 text-primary" />
                  </div>

                  {/* Text Content */}
                  <div className="flex-1 space-y-2">
                     <div className="flex items-center gap-2">
                        <h3 className="font-semibold text-sm">
                           Welcome back!
                        </h3>
                        <Sparkles className="h-3.5 w-3.5 text-yellow-500" />
                     </div>
                     <p className="text-sm text-muted-foreground leading-relaxed">
                        Do you want to explore hotels in{' '}
                        <span className="font-semibold text-foreground">{cityName}</span>?
                     </p>

                     {/* Action Button */}
                     <Button
                        onClick={handleExplore}
                        size="sm"
                        className="w-full mt-2 group"
                     >
                        <MapPin className="mr-2 h-3.5 w-3.5 transition-transform group-hover:scale-110" />
                        Explore {cityName} Hotels
                     </Button>
                  </div>
               </div>
            </div>

            {/* Bottom Accent Line */}
            <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-primary/50 via-primary to-primary/50" />
         </div>
      </div>
   );
}
