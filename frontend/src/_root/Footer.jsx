import { Link } from 'react-router-dom';
import { Hotel, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin, Youtube } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

export default function Footer() {
   return (
      <footer className="border-t bg-slate-50 dark:bg-slate-900">
         <div className="container mx-auto px-4 py-12">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
               {/* Brand Section */}
               <div className="space-y-4">
                  <Link to="/" className="flex items-center gap-2">
                     <div className="flex items-center justify-center h-10 w-10 rounded-lg overflow-hidden bg-white">
                        <img
                           src="/logo.png"
                           alt="BookYourHotel Logo"
                           className="h-full w-full object-contain"
                           onError={(e) => {
                              e.target.style.display = 'none'
                              e.target.parentElement.innerHTML = '<svg class="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" /></svg>'
                           }}
                        />
                     </div>
                     <div className="flex flex-col">
                        <span className="font-bold text-lg bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                           BookYourHotel
                        </span>
                     </div>
                  </Link>
                  <p className="text-sm text-muted-foreground">
                     India's most trusted hotel booking platform. Book hotels across India with the best prices and exclusive deals.
                  </p>
                  <div className="flex items-center gap-3">
                     <a href="#" className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                        <Facebook className="h-4 w-4" />
                     </a>
                     <a href="#" className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                        <Twitter className="h-4 w-4" />
                     </a>
                     <a href="#" className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                        <Instagram className="h-4 w-4" />
                     </a>
                     <a href="#" className="h-8 w-8 rounded-full bg-primary/10 hover:bg-primary hover:text-primary-foreground flex items-center justify-center transition-colors">
                        <Youtube className="h-4 w-4" />
                     </a>
                  </div>
               </div>

               {/* Quick Links */}
               <div>
                  <h3 className="font-semibold text-lg mb-4">Quick Links</h3>
                  <ul className="space-y-2.5">
                     <li>
                        <Link to="/hotels" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                           Browse Hotels
                        </Link>
                     </li>
                     <li>
                        <Link to="/destinations" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                           Popular Destinations
                        </Link>
                     </li>
                     <li>
                        <Link to="/offers" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                           Special Offers
                        </Link>
                     </li>
                     <li>
                        <Link to="/bookings" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                           My Bookings
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* Popular Cities */}
               <div>
                  <h3 className="font-semibold text-lg mb-4">Popular Cities</h3>
                  <ul className="space-y-2.5">
                     <li>
                        <Link to="/hotels/mumbai" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                           Hotels in Mumbai
                        </Link>
                     </li>
                     <li>
                        <Link to="/hotels/delhi" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                           Hotels in Delhi
                        </Link>
                     </li>
                     <li>
                        <Link to="/hotels/bangalore" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                           Hotels in Bangalore
                        </Link>
                     </li>
                     <li>
                        <Link to="/hotels/goa" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                           Hotels in Goa
                        </Link>
                     </li>
                     <li>
                        <Link to="/hotels/jaipur" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                           Hotels in Jaipur
                        </Link>
                     </li>
                  </ul>
               </div>

               {/* Contact Info */}
               <div>
                  <h3 className="font-semibold text-lg mb-4">Contact Us</h3>
                  <ul className="space-y-3">
                     <li className="flex items-start gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0 text-primary" />
                        <span>123, MG Road, Bangalore, Karnataka - 560001, India</span>
                     </li>
                     <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Phone className="h-4 w-4 flex-shrink-0 text-primary" />
                        <span>+91 1800-123-4567</span>
                     </li>
                     <li className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Mail className="h-4 w-4 flex-shrink-0 text-primary" />
                        <span>support@bookyourhotel.in</span>
                     </li>
                  </ul>
               </div>
            </div>

            <Separator className="my-8" />

            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
               <p className="text-sm text-muted-foreground">
                  © 2025 BookYourHotel. All rights reserved. Made with ❤️ in India
               </p>
               <div className="flex items-center gap-6 text-sm text-muted-foreground">
                  <Link to="/privacy" className="hover:text-primary transition-colors">
                     Privacy Policy
                  </Link>
                  <Link to="/terms" className="hover:text-primary transition-colors">
                     Terms of Service
                  </Link>
               </div>
            </div>
         </div>
      </footer>
   );
}
