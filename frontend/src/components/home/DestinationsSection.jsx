import { TrendingUp } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';

/**
 * DestinationsSection - Display popular travel destinations
 * Configurable city list with hover effects
 */
export function DestinationsSection({ cities: customCities, onCityClick }) {
   const defaultCities = [
      { name: 'Mumbai', image: '🏙️', description: 'Financial Capital' },
      { name: 'Delhi', image: '🏛️', description: 'National Capital' },
      { name: 'Bangalore', image: '💼', description: 'IT Hub' },
      { name: 'Goa', image: '🏖️', description: 'Beach Paradise' },
      { name: 'Jaipur', image: '🕌', description: 'Pink City' },
      { name: 'Kolkata', image: '🎭', description: 'Cultural Capital' },
      { name: 'Hyderabad', image: '🍛', description: 'City of Pearls' },
      { name: 'Chennai', image: '🌊', description: 'Gateway to South' }
   ];

   const cities = customCities || defaultCities;

   return (
      <section className="py-20 bg-slate-50 dark:bg-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Destinations</h2>
                  <p className="text-muted-foreground">Explore India's most loved travel destinations</p>
               </div>
               <Button variant="outline" className="hidden md:flex">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View All
               </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
               {cities.map((city, index) => (
                  <Card
                     key={city.name}
                     onClick={() => onCityClick?.(city.name)}
                     className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary overflow-hidden"
                  >
                     <CardContent className="p-6 text-center">
                        <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                           {city.image}
                        </div>
                        <h4 className="text-lg font-bold mb-1">
                           {city.name}
                        </h4>
                        <p className="text-sm text-muted-foreground">{city.description}</p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </section>
   );
}
