import { TrendingUp, MapPin } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent } from '../ui/card';
import { useState } from 'react';

/**
 * DestinationsSection - Display popular travel destinations
 * Configurable city list with hover effects and proper images
 */
export function DestinationsSection({ cities: customCities, onCityClick }) {
   const [imageErrors, setImageErrors] = useState({});

   const defaultCities = [
      {
         name: 'Mumbai',
         image: 'https://images.unsplash.com/photo-1566552881560-0be862a7c445?w=800&q=80',
         description: 'Financial Capital',
         gradient: 'from-blue-500 to-purple-600'
      },
      {
         name: 'Delhi',
         image: 'https://images.unsplash.com/photo-1587474260584-136574528ed5?w=800&q=80',
         description: 'National Capital',
         gradient: 'from-red-500 to-orange-600'
      },
      {
         name: 'Bangalore',
         image: 'https://images.unsplash.com/photo-1596176530529-78163a4f7af2?w=800&q=80',
         description: 'IT Hub',
         gradient: 'from-green-500 to-teal-600'
      },
      {
         name: 'Goa',
         image: 'https://images.unsplash.com/photo-1512343879784-a960bf40e7f2?w=800&q=80',
         description: 'Beach Paradise',
         gradient: 'from-cyan-500 to-blue-600'
      },
      {
         name: 'Jaipur',
         image: 'https://images.unsplash.com/photo-1599661046289-e31897846e41?w=800&q=80',
         description: 'Pink City',
         gradient: 'from-pink-500 to-rose-600'
      },
      {
         name: 'Kolkata',
         image: 'https://images.unsplash.com/photo-1558431382-27e303142255?w=800&q=80',
         description: 'Cultural Capital',
         gradient: 'from-yellow-500 to-amber-600'
      },
      {
         name: 'Hyderabad',
         image: 'https://images.unsplash.com/photo-1609920658906-8223bd289001?w=800&q=80',
         description: 'City of Pearls',
         gradient: 'from-indigo-500 to-purple-600'
      },
      {
         name: 'Chennai',
         image: 'https://images.unsplash.com/photo-1582510003544-4d00b7f74220?w=800&q=80',
         description: 'Gateway to South',
         gradient: 'from-orange-500 to-red-600'
      }
   ];

   const cities = customCities || defaultCities;

   const handleImageError = (cityName) => {
      setImageErrors(prev => ({ ...prev, [cityName]: true }));
   };

   return (
      <section className="py-20 bg-gradient-to-b from-slate-50 to-white dark:from-slate-900 dark:to-slate-800">
         <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-12">
               <div>
                  <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent">
                     Popular Destinations
                  </h2>
                  <p className="text-muted-foreground flex items-center gap-2">
                     <MapPin className="h-4 w-4" />
                     Explore India's most loved travel destinations
                  </p>
               </div>
               <Button variant="outline" className="hidden md:flex hover:bg-primary hover:text-white transition-colors">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View All
               </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
               {cities.map((city, index) => (
                  <Card
                     key={city.name}
                     onClick={() => onCityClick?.(city.name)}
                     className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden bg-white dark:bg-slate-800"
                     style={{ animationDelay: `${index * 100}ms` }}
                  >
                     <CardContent className="p-0">
                        {/* Image Container with Gradient Overlay */}
                        <div className="relative h-48 overflow-hidden">
                           {!imageErrors[city.name] ? (
                              <img
                                 src={city.image}
                                 alt={`${city.name} destination`}
                                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                 onError={() => handleImageError(city.name)}
                                 loading="lazy"
                              />
                           ) : (
                              <div className={`w-full h-full bg-gradient-to-br ${city.gradient || 'from-blue-500 to-purple-600'} flex items-center justify-center`}>
                                 <MapPin className="h-16 w-16 text-white opacity-80" />
                              </div>
                           )}
                           {/* Gradient Overlay */}
                           <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                           {/* Floating Badge */}
                           <div className="absolute top-3 right-3 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-semibold shadow-lg transform translate-x-20 group-hover:translate-x-0 transition-transform duration-300">
                              🔥 Trending
                           </div>
                        </div>

                        {/* Content */}
                        <div className="p-5 text-center bg-gradient-to-b from-white to-slate-50 dark:from-slate-800 dark:to-slate-900">
                           <h4 className="text-lg font-bold mb-1 group-hover:text-primary transition-colors duration-300">
                              {city.name}
                           </h4>
                           <p className="text-sm text-muted-foreground">{city.description}</p>

                           {/* Explore Button - Shows on Hover */}
                           <div className="mt-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                              <span className="text-xs font-semibold text-primary flex items-center justify-center gap-1">
                                 Explore Now
                                 <svg className="h-3 w-3 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                 </svg>
                              </span>
                           </div>
                        </div>
                     </CardContent>
                  </Card>
               ))}
            </div>

            {/* Mobile View All Button */}
            <div className="flex md:hidden justify-center mt-8">
               <Button variant="outline" className="w-full max-w-xs hover:bg-primary hover:text-white transition-colors">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View All Destinations
               </Button>
            </div>
         </div>
      </section>
   );
}
