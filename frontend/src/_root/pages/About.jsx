import { Construction } from 'lucide-react';
import { Card, CardContent } from '../../components/ui/card';

export default function About() {
   return (
      <div className="min-h-screen py-20">
         <div className="container mx-auto px-4">
            <div className="max-w-2xl mx-auto text-center">
               <Card className="border-2 border-dashed">
                  <CardContent className="p-12">
                     <Construction className="h-16 w-16 mx-auto mb-4 text-primary" />
                     <h1 className="text-4xl font-bold mb-4">About Us</h1>
                     <p className="text-xl text-muted-foreground">
                        Coming Soon
                     </p>
                  </CardContent>
               </Card>
            </div>
         </div>
      </div>
   );
}
