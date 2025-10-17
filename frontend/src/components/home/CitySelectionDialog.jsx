import { useState } from 'react';
import { MapPin, Search, Loader2, Sparkles, TrendingUp, AlertCircle } from 'lucide-react';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { ScrollArea } from '../ui/scroll-area';
import { useCitySearch } from '../../hooks';
import { getPopularCities } from '../../utils/locationUtils';

/**
 * CitySelectionDialog - Premium dialog for manual city selection
 * Shows on first visit with search and popular cities
 * Uses optimized search with caching and debouncing
 */
export function CitySelectionDialog({ open, onOpenChange, onCitySelect, onSkip }) {
   const [selectedCity, setSelectedCity] = useState('');

   // Use optimized city search hook
   const {
      searchQuery,
      setSearchQuery,
      cities,
      loading,
      error,
      hasResults
   } = useCitySearch(300); // 300ms debounce

   const popularCities = getPopularCities();

   const handleCityClick = (cityName) => {
      setSelectedCity(cityName);
   };

   const handleContinue = () => {
      if (selectedCity) {
         onCitySelect(selectedCity);
         onOpenChange(false);
      }
   };

   const handleSkip = () => {
      onSkip();
      onOpenChange(false);
   };

   const handleQuickSelect = (cityName) => {
      onCitySelect(cityName);
      onOpenChange(false);
   };

   return (
      <Dialog open={open} onOpenChange={onOpenChange}>
         <DialogContent className="sm:max-w-xl max-h-[85vh] overflow-hidden flex flex-col">
            <DialogHeader>
               <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-primary/20 to-primary/10">
                  <MapPin className="h-7 w-7 text-primary" />
               </div>
               <DialogTitle className="text-center text-2xl font-bold">
                  Choose Your City
               </DialogTitle>
               <DialogDescription className="text-center">
                  Select your city to get personalized hotel recommendations
               </DialogDescription>
            </DialogHeader>

            <div className="space-y-4 flex-1 overflow-hidden flex flex-col">
               {/* Search Input */}
               <div className="relative">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                  <Input
                     type="text"
                     placeholder="Search for a city..."
                     value={searchQuery}
                     onChange={(e) => setSearchQuery(e.target.value)}
                     className="pl-10 pr-10"
                  />
                  {loading && (
                     <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
                  )}
               </div>

               {/* Error Message */}
               {error && (
                  <div className="flex items-center gap-2 p-3 rounded-md bg-destructive/10 text-destructive text-sm">
                     <AlertCircle className="h-4 w-4 flex-shrink-0" />
                     <p>{error}</p>
                  </div>
               )}

               {/* Search Results */}
               {searchQuery && hasResults && (
                  <div className="flex-1 overflow-hidden">
                     <p className="text-sm font-medium mb-2 text-foreground">
                        Search Results ({cities.length})
                     </p>
                     <ScrollArea className="h-[200px] rounded-md border bg-background">
                        <div className="p-2 space-y-1">
                           {cities.map((city, index) => (
                              <button
                                 key={`${city.name}-${index}`}
                                 onClick={() => handleCityClick(city.name)}
                                 className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-md text-left transition-all ${selectedCity === city.name
                                    ? 'bg-primary text-primary-foreground shadow-sm'
                                    : 'bg-card hover:bg-accent hover:shadow-sm border border-transparent hover:border-primary/20'
                                    }`}
                              >
                                 <div className={`flex h-8 w-8 items-center justify-center rounded-full flex-shrink-0 ${selectedCity === city.name
                                    ? 'bg-primary-foreground/20'
                                    : 'bg-primary/10'
                                    }`}>
                                    <MapPin className="h-4 w-4" />
                                 </div>
                                 <div className="flex-1 min-w-0">
                                    <p className="font-semibold text-sm truncate">{city.name}</p>
                                    <p className={`text-xs truncate ${selectedCity === city.name ? 'opacity-90' : 'text-muted-foreground'
                                       }`}>
                                       {city.region}
                                    </p>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </ScrollArea>
                  </div>
               )}

               {/* Popular Cities */}
               {!searchQuery && (
                  <div className="flex-1 overflow-hidden">
                     <div className="flex items-center gap-2 mb-3">
                        <TrendingUp className="h-4 w-4 text-primary" />
                        <p className="text-sm font-medium text-foreground">
                           Popular Cities
                        </p>
                     </div>
                     <ScrollArea className="h-[280px]">
                        <div className="grid grid-cols-2 gap-2 pr-4">
                           {popularCities.map((city, index) => (
                              <button
                                 key={`popular-${city.name}-${index}`}
                                 onClick={() => handleQuickSelect(city.name)}
                                 className="flex items-center gap-2 px-3 py-3 rounded-lg border bg-card hover:bg-accent hover:border-primary/50 transition-all group"
                              >
                                 <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 group-hover:bg-primary/20 transition-colors">
                                    <MapPin className="h-4 w-4 text-primary" />
                                 </div>
                                 <div className="flex-1 text-left min-w-0">
                                    <p className="font-medium text-sm truncate">{city.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{city.region}</p>
                                 </div>
                              </button>
                           ))}
                        </div>
                     </ScrollArea>
                  </div>
               )}

               {/* No Results */}
               {searchQuery && !loading && cities.length === 0 && (
                  <div className="flex-1 flex items-center justify-center py-8">
                     <div className="text-center">
                        <p className="text-sm text-muted-foreground">
                           No cities found for "{searchQuery}"
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                           Try searching for a different city
                        </p>
                     </div>
                  </div>
               )}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-2 pt-4 border-t">
               {selectedCity ? (
                  <>
                     <Button
                        onClick={handleContinue}
                        className="flex-1 bg-primary hover:bg-primary/90 text-white"
                        size="lg"
                     >
                        <Sparkles className="mr-2 h-4 w-4" />
                        Continue with {selectedCity}
                     </Button>
                     <Button
                        variant="outline"
                        onClick={handleSkip}
                        className="sm:w-auto"
                     >
                        Skip
                     </Button>
                  </>
               ) : (
                  <Button
                     variant="outline"
                     onClick={handleSkip}
                     className="w-full"
                     size="lg"
                  >
                     Skip for now
                  </Button>
               )}
            </div>

            <p className="text-center text-xs text-muted-foreground">
               You can change your city preference anytime
            </p>
         </DialogContent>
      </Dialog>
   );
}
