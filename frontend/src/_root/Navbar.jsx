import { Link } from 'react-router-dom';
import { Hotel, Phone, Mail, MapPin, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import { useLocation } from '../context';
import { ChangeCityButton } from '../components/home';

export default function Navbar() {
   const { cityData, showCityDialog } = useLocation();
   return (
      <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
         <div className="container mx-auto px-4">
            {/* Top Bar */}
            {/* <div className="hidden md:flex items-center justify-between py-2 text-sm text-muted-foreground">
               <div className="flex items-center gap-6">
                  <div className="flex items-center gap-2">
                     <Phone className="h-3.5 w-3.5" />
                     <span>+91 1800-123-4567</span>
                  </div>
                  <div className="flex items-center gap-2">
                     <Mail className="h-3.5 w-3.5" />
                     <span>support@bookyourhotel.in</span>
                  </div>
               </div>
               <div className="flex items-center gap-4">
                  <Link to="/dev" className="hover:text-primary transition-colors">
                     Dev Console
                  </Link>
               </div>
            </div> */}

            <Separator className="hidden md:block" />

            {/* Main Navbar */}
            <div className="flex h-16 items-center justify-between">
               <Link to="/" className="flex items-center gap-2">
                  <div className="flex items-center justify-center h-10 w-10 rounded-lg overflow-hidden bg-white">
                     <img
                        src="/logo.png"
                        alt="BookYourHotel Logo"
                        className="h-full w-full object-contain"
                     />
                  </div>
                  <div className="flex flex-col">
                     <span className="font-bold text-xl bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                        BookYourHotel
                     </span>
                     <span className="text-[10px] text-muted-foreground -mt-1">India's Premier Hotel Booking</span>
                  </div>
               </Link>

               <div className="flex items-center gap-6">
                  <div className="hidden lg:flex items-center gap-6">
                     <Link to="/" className="text-sm font-medium hover:text-primary transition-colors">
                        Home
                     </Link>
                     <Link to="/hotels" className="text-sm font-medium hover:text-primary transition-colors">
                        Hotels
                     </Link>
                     <Link to="/destinations" className="text-sm font-medium hover:text-primary transition-colors">
                        Destinations
                     </Link>
                     <Link to="/about" className="text-sm font-medium hover:text-primary transition-colors">
                        About
                     </Link>
                     <Link to="/contact" className="text-sm font-medium hover:text-primary transition-colors">
                        Contact
                     </Link>
                  </div>

                  {/* Change City Button */}
                  <ChangeCityButton
                     currentCity={cityData?.city}
                     onClick={showCityDialog}
                     variant="outline"
                     size="sm"
                  />
               </div>
            </div>
         </div>
      </nav>
   );
}
