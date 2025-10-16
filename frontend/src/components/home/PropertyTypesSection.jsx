import { Card, CardContent } from '../ui/card';

/**
 * PropertyTypesSection - Display available property types
 * Configurable property categories with counts
 */
export function PropertyTypesSection({ propertyTypes: customTypes, onTypeClick }) {
   const defaultPropertyTypes = [
      { type: 'Hotels', icon: '🏨', count: '50K+' },
      { type: 'Resorts', icon: '🏖️', count: '10K+' },
      { type: 'Apartments', icon: '🏢', count: '30K+' },
      { type: 'Villas', icon: '🏡', count: '15K+' },
      { type: 'Homestays', icon: '🏠', count: '25K+' }
   ];

   const propertyTypes = customTypes || defaultPropertyTypes;

   return (
      <section className="py-20 bg-white dark:bg-slate-900">
         <div className="container mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Book by Property Type</h2>
               <p className="text-muted-foreground">
                  Find the perfect accommodation for your needs
               </p>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
               {propertyTypes.map((category) => (
                  <Card
                     key={category.type}
                     onClick={() => onTypeClick?.(category.type)}
                     className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-primary"
                  >
                     <CardContent className="p-6 text-center">
                        <div className="text-4xl mb-2">{category.icon}</div>
                        <h4 className="font-bold">{category.type}</h4>
                        <p className="text-sm text-muted-foreground">{category.count}</p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </section>
   );
}
