import { Award, Search, MapPin, Calendar, Users } from 'lucide-react';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Card, CardContent } from '../ui/card';

/**
 * HeroSection - Premium hero section with search functionality
 * India-centric design with gradient backgrounds and search card
 */
export function HeroSection({
   searchQuery,
   onSearchQueryChange,
   checkin,
   onCheckinChange,
   checkout,
   onCheckoutChange,
   guests,
   onGuestsChange,
   onSearch,
   loading = false
}) {
   const stats = [
      { value: '50,000+', label: 'Hotels' },
      { value: '100+', label: 'Cities' },
      { value: '5M+', label: 'Happy Customers' },
      { value: '4.8', label: 'Average Rating' }
   ];

   return (
      <section className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 lg:py-32">
         <div className="container mx-auto px-4">
            {/* Header */}
            <div className="max-w-4xl mx-auto text-center mb-12 animate-fade-in">
               <Badge className="mb-4 bg-primary/10 text-primary hover:bg-primary/20 border-primary/20">
                  <Award className="h-3 w-3 mr-1" />
                  India's #1 Hotel Booking Platform
               </Badge>
               <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-slate-900 via-primary to-orange-600 dark:from-white dark:via-primary dark:to-orange-400 bg-clip-text text-transparent">
                  Discover Your Perfect Stay Across India
               </h1>
               <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                  Book from 50,000+ hotels nationwide with best prices guaranteed. Pay in INR, get instant confirmation.
               </p>
            </div>

            {/* Search Card */}
            <Card className="max-w-5xl mx-auto shadow-2xl border-0 bg-white/80 dark:bg-slate-900/80 backdrop-blur">
               <CardContent className="p-6 lg:p-8">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                     <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                           <MapPin className="h-4 w-4 text-primary" />
                           Destination
                        </label>
                        <Input
                           placeholder="Where are you going?"
                           value={searchQuery}
                           onChange={(e) => onSearchQueryChange(e.target.value)}
                           className="h-12"
                           onKeyDown={(e) => e.key === 'Enter' && onSearch()}
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-primary" />
                           Check-in
                        </label>
                        <Input
                           type="date"
                           value={checkin}
                           onChange={(e) => onCheckinChange(e.target.value)}
                           min={new Date().toISOString().split('T')[0]}
                           className="h-12"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-primary" />
                           Check-out
                        </label>
                        <Input
                           type="date"
                           value={checkout}
                           onChange={(e) => onCheckoutChange(e.target.value)}
                           min={checkin || new Date().toISOString().split('T')[0]}
                           className="h-12"
                        />
                     </div>

                     <div className="space-y-2">
                        <label className="text-sm font-medium flex items-center gap-2">
                           <Users className="h-4 w-4 text-primary" />
                           Guests
                        </label>
                        <Input
                           type="number"
                           min="1"
                           max="10"
                           value={guests}
                           onChange={(e) => onGuestsChange(e.target.value)}
                           className="h-12"
                        />
                     </div>
                  </div>

                  <Button
                     onClick={onSearch}
                     disabled={loading}
                     className="w-full mt-6 h-12 text-base font-semibold bg-gradient-to-r from-primary to-orange-600 hover:from-primary/90 hover:to-orange-600/90"
                  >
                     {loading ? (
                        <>
                           <div className="animate-spin mr-2 h-5 w-5 border-2 border-white border-t-transparent rounded-full" />
                           Searching...
                        </>
                     ) : (
                        <>
                           <Search className="mr-2 h-5 w-5" />
                           Search Hotels
                        </>
                     )}
                  </Button>
               </CardContent>
            </Card>

            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mt-12 max-w-5xl mx-auto">
               {stats.map((stat, index) => (
                  <div key={index} className="text-center animate-fade-in" style={{ animationDelay: `${index * 100}ms` }}>
                     <div className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-primary to-orange-600 bg-clip-text text-transparent">
                        {stat.value}
                     </div>
                     <div className="text-sm text-muted-foreground mt-1">{stat.label}</div>
                  </div>
               ))}
            </div>
         </div>
      </section>
   );
}
