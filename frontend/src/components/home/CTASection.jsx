import { Search } from 'lucide-react';
import { Button } from '../ui/button';

/**
 * CTASection - Call-to-action section
 * Encourages users to start booking with prominent buttons
 */
export function CTASection({ onBrowseClick, onDownloadClick }) {
   return (
      <section className="py-20 bg-gradient-to-r from-primary to-orange-600 text-white">
         <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
               Ready to Start Your Journey?
            </h2>
            <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
               Join millions of travelers who trust us for their perfect stay. Book now and save up to 50%!
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
               <Button
                  size="lg"
                  variant="secondary"
                  className="font-semibold"
                  onClick={onBrowseClick}
               >
                  <Search className="mr-2 h-5 w-5" />
                  Browse Hotels
               </Button>
               <Button
                  size="lg"
                  variant="outline"
                  className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold"
                  onClick={onDownloadClick}
               >
                  Download App
               </Button>
            </div>
         </div>
      </section>
   );
}
