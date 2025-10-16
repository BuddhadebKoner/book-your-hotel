import { Award, Shield, Star, Sparkles } from 'lucide-react';
import { Card, CardContent } from '../ui/card';

/**
 * FeaturesSection - Display key platform features
 * Configurable feature list with icons and descriptions
 */
export function FeaturesSection({ features: customFeatures }) {
   const defaultFeatures = [
      {
         icon: Award,
         title: 'Best Price Guarantee',
         description: 'Find the lowest prices or we\'ll refund the difference'
      },
      {
         icon: Shield,
         title: 'Secure Booking',
         description: '100% secure payment with encrypted transactions'
      },
      {
         icon: Star,
         title: 'Premium Hotels',
         description: 'Access to 50,000+ verified hotels across India'
      },
      {
         icon: Sparkles,
         title: '24/7 Support',
         description: 'Round-the-clock customer service in your language'
      }
   ];

   const features = customFeatures || defaultFeatures;

   return (
      <section className="py-20 bg-white dark:bg-slate-900">
         <div className="container mx-auto px-4">
            <div className="text-center mb-12">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
               <p className="text-muted-foreground max-w-2xl mx-auto">
                  Experience hassle-free hotel booking with India's most trusted platform
               </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
               {features.map((feature, index) => (
                  <Card key={index} className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
                     <CardContent className="p-6 text-center">
                        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                           <feature.icon className="h-8 w-8 text-primary" />
                        </div>
                        <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                        <p className="text-sm text-muted-foreground">{feature.description}</p>
                     </CardContent>
                  </Card>
               ))}
            </div>
         </div>
      </section>
   );
}
