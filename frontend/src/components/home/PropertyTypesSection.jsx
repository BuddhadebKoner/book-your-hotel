import { Card, CardContent } from '../ui/card';
import { Building2, Palmtree, Building, Home, House, Sparkles } from 'lucide-react';
import { useState } from 'react';

/**
 * PropertyTypesSection - Display available property types
 * Enhanced with real images and improved UX
 */
export function PropertyTypesSection({ propertyTypes: customTypes, onTypeClick }) {
   const [imageErrors, setImageErrors] = useState({});

   const defaultPropertyTypes = [
      {
         type: 'Hotels',
         icon: '🏨',
         IconComponent: Building2,
         count: '50K+',
         image: 'https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80',
         gradient: 'from-blue-500 to-cyan-600',
         description: 'Luxury & Budget'
      },
      {
         type: 'Resorts',
         icon: '🏖️',
         IconComponent: Palmtree,
         count: '10K+',
         image: 'https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80',
         gradient: 'from-teal-500 to-emerald-600',
         description: 'Beachfront & Hills'
      },
      {
         type: 'Apartments',
         icon: '🏢',
         IconComponent: Building,
         count: '30K+',
         image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?w=800&q=80',
         gradient: 'from-purple-500 to-pink-600',
         description: 'Modern Living'
      },
      {
         type: 'Villas',
         icon: '🏡',
         IconComponent: Home,
         count: '15K+',
         image: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800&q=80',
         gradient: 'from-orange-500 to-red-600',
         description: 'Private Luxury'
      },
      {
         type: 'Homestays',
         icon: '🏠',
         IconComponent: House,
         count: '25K+',
         image: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=800&q=80',
         gradient: 'from-green-500 to-teal-600',
         description: 'Local Experience'
      }
   ];

   const propertyTypes = customTypes || defaultPropertyTypes;

   const handleImageError = (propertyType) => {
      setImageErrors(prev => ({ ...prev, [propertyType]: true }));
   };

   return (
      <section className="py-20 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-800">
         <div className="container mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold mb-4 bg-gradient-to-r from-primary via-purple-600 to-pink-600 bg-clip-text text-transparent">
                  Book by Property Type
               </h2>
               <p className="text-muted-foreground flex items-center justify-center gap-2">
                  <Sparkles className="h-4 w-4" />
                  Find the perfect accommodation for your needs
               </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 md:gap-6">
               {propertyTypes.map((category, index) => {
                  const Icon = category.IconComponent;
                  return (
                     <Card
                        key={category.type}
                        onClick={() => onTypeClick?.(category.type)}
                        className="group cursor-pointer hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 border-0 overflow-hidden bg-white dark:bg-slate-800"
                        style={{ animationDelay: `${index * 100}ms` }}
                     >
                        <CardContent className="p-0">
                           {/* Image Container with Gradient Overlay */}
                           <div className="relative h-40 overflow-hidden">
                              {!imageErrors[category.type] ? (
                                 <img
                                    src={category.image}
                                    alt={`${category.type} accommodation`}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                                    onError={() => handleImageError(category.type)}
                                    loading="lazy"
                                 />
                              ) : (
                                 <div className={`w-full h-full bg-gradient-to-br ${category.gradient} flex items-center justify-center`}>
                                    {Icon && <Icon className="h-16 w-16 text-white opacity-80" />}
                                 </div>
                              )}

                              {/* Gradient Overlay */}
                              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent" />

                              {/* Count Badge */}
                              <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold text-white shadow-lg">
                                 {category.count}
                              </div>

                              {/* Title Overlay */}
                              <div className="absolute bottom-0 left-0 right-0 p-4 text-white">
                                 <h4 className="font-bold text-lg mb-0.5 transform group-hover:translate-x-1 transition-transform duration-300">
                                    {category.type}
                                 </h4>
                                 <p className="text-xs text-white/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    {category.description}
                                 </p>
                              </div>
                           </div>

                           {/* Bottom Section */}
                           <div className="p-4 bg-gradient-to-b from-slate-50 to-white dark:from-slate-800 dark:to-slate-900">
                              <div className="flex items-center justify-between">
                                 <span className="text-sm font-medium text-muted-foreground">
                                    Available Now
                                 </span>
                                 <div className="text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                                    <svg className="h-5 w-5 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                 </div>
                              </div>
                           </div>
                        </CardContent>
                     </Card>
                  );
               })}
            </div>

            {/* Feature Stats */}
            <div className="mt-12 text-center">
               <p className="text-sm text-muted-foreground">
                  🌟 <span className="font-semibold">130K+ Properties</span> •
                  🔒 <span className="font-semibold">Secure Booking</span> •
                  💰 <span className="font-semibold">Best Price Guarantee</span>
               </p>
            </div>
         </div>
      </section>
   );
}
