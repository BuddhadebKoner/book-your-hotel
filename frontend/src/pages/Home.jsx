import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Badge } from '../components/ui/badge';
import { Card, CardContent } from '../components/ui/card';
import { StaticDataAPI, HotelSearchAPI, INDIA_CONFIG } from '../services/liteApiService';

function Home() {
   const [cities, setCities] = useState([]);
   const [searchQuery, setSearchQuery] = useState('');
   const [loading, setLoading] = useState(true);

   // Popular Indian cities for quick search
   const popularCities = [
      { name: 'Mumbai', image: '🏙️', description: 'Financial Capital' },
      { name: 'Delhi', image: '🏛️', description: 'National Capital' },
      { name: 'Bangalore', image: '💼', description: 'IT Hub' },
      { name: 'Goa', image: '🏖️', description: 'Beach Paradise' },
      { name: 'Jaipur', image: '🕌', description: 'Pink City' },
      { name: 'Kolkata', image: '🎭', description: 'Cultural Capital' },
      { name: 'Hyderabad', image: '🍛', description: 'City of Pearls' },
      { name: 'Chennai', image: '🌊', description: 'Gateway to South' }
   ];

   // Fetch Indian cities on mount
   useEffect(() => {
      const fetchData = async () => {
         try {
            const citiesData = await StaticDataAPI.getCities('IN');
            // Filter to get only cities (not airports/heliports)
            const actualCities = citiesData.data.filter(city =>
               city.city && !city.city.includes('Heliport') && !city.city.includes('Airport')
            ).slice(0, 50);
            setCities(actualCities);
         } catch (error) {
            console.error('Error fetching cities:', error);
         } finally {
            setLoading(false);
         }
      };

      fetchData();
   }, []);

   return (
      <div className="min-h-screen bg-gradient-to-b from-orange-50 via-white to-green-50">
         {/* Header */}
         <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50 shadow-sm">
            <div className="container mx-auto px-4 py-4">
               <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                     <h1 className="text-2xl font-bold bg-gradient-to-r from-orange-500 via-white to-green-500 bg-clip-text text-transparent">
                        🇮🇳 BookMyHotel
                     </h1>
                     <Badge variant="outline" className="bg-orange-100 text-orange-700 border-orange-300">
                        India
                     </Badge>
                  </div>
                  <nav className="hidden md:flex items-center gap-6">
                     <Link to="/" className="text-slate-700 hover:text-orange-600 font-medium">Home</Link>
                     <Link to="/dev" className="text-slate-700 hover:text-orange-600 font-medium">Dev Console</Link>
                     <Button size="sm" className="bg-orange-600 hover:bg-orange-700">
                        Sign In
                     </Button>
                  </nav>
               </div>
            </div>
         </header>

         {/* Hero Section */}
         <section className="relative py-20 px-4">
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500/10 via-white/50 to-green-500/10 -z-10" />
            <div className="container mx-auto max-w-6xl">
               <div className="text-center mb-12">
                  <h2 className="text-5xl md:text-6xl font-bold mb-4 text-slate-900">
                     Discover Your Perfect Stay
                  </h2>
                  <p className="text-xl text-slate-600 mb-2">
                     Explore 2M+ hotels across India and worldwide
                  </p>
                  <p className="text-lg text-orange-600 font-semibold">
                     Prices in ₹ INR • Trusted by millions of Indians
                  </p>
               </div>

               {/* Search Bar */}
               <Card className="max-w-4xl mx-auto shadow-2xl border-2 border-orange-200">
                  <CardContent className="p-8">
                     <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                           {/* Destination */}
                           <div className="md:col-span-2">
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                 📍 Where to?
                              </label>
                              <Input
                                 type="text"
                                 placeholder="Search destination (e.g., Goa, Mumbai...)"
                                 className="h-12 text-lg"
                                 value={searchQuery}
                                 onChange={(e) => setSearchQuery(e.target.value)}
                              />
                           </div>

                           {/* Check-in */}
                           <div>
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                 📅 Check-in
                              </label>
                              <Input
                                 type="date"
                                 className="h-12"
                                 min={new Date().toISOString().split('T')[0]}
                              />
                           </div>

                           {/* Check-out */}
                           <div>
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                 📅 Check-out
                              </label>
                              <Input
                                 type="date"
                                 className="h-12"
                                 min={new Date().toISOString().split('T')[0]}
                              />
                           </div>
                        </div>

                        {/* Guests */}
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                           <div>
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                 👥 Adults
                              </label>
                              <Input
                                 type="number"
                                 min="1"
                                 max="10"
                                 defaultValue="2"
                                 className="h-12"
                              />
                           </div>
                           <div>
                              <label className="text-sm font-semibold text-slate-700 mb-2 block">
                                 👶 Children
                              </label>
                              <Input
                                 type="number"
                                 min="0"
                                 max="10"
                                 defaultValue="0"
                                 className="h-12"
                              />
                           </div>
                           <div className="flex items-end">
                              <Button className="w-full h-12 bg-orange-600 hover:bg-orange-700 text-lg font-semibold">
                                 🔍 Search Hotels
                              </Button>
                           </div>
                        </div>
                     </div>
                  </CardContent>
               </Card>
            </div>
         </section>

         {/* Popular Destinations */}
         <section className="py-16 px-4 bg-white">
            <div className="container mx-auto max-w-6xl">
               <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                     Popular Destinations in India
                  </h3>
                  <p className="text-slate-600">
                     Explore the most loved cities across the country
                  </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {popularCities.map((city) => (
                     <Card
                        key={city.name}
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-orange-400"
                     >
                        <CardContent className="p-6 text-center">
                           <div className="text-5xl mb-3 group-hover:scale-110 transition-transform">
                              {city.image}
                           </div>
                           <h4 className="text-lg font-bold text-slate-900 mb-1">
                              {city.name}
                           </h4>
                           <p className="text-sm text-slate-600">{city.description}</p>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* Why Choose Us */}
         <section className="py-16 px-4 bg-gradient-to-r from-orange-50 to-green-50">
            <div className="container mx-auto max-w-6xl">
               <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                     Why Book With Us?
                  </h3>
                  <p className="text-slate-600">
                     India's most trusted hotel booking platform
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <Card className="text-center border-2 border-orange-200">
                     <CardContent className="p-8">
                        <div className="text-5xl mb-4">💰</div>
                        <h4 className="text-xl font-bold mb-2">Best Prices</h4>
                        <p className="text-slate-600">
                           Transparent pricing in ₹ INR with no hidden charges
                        </p>
                     </CardContent>
                  </Card>

                  <Card className="text-center border-2 border-green-200">
                     <CardContent className="p-8">
                        <div className="text-5xl mb-4">🏨</div>
                        <h4 className="text-xl font-bold mb-2">2M+ Properties</h4>
                        <p className="text-slate-600">
                           Access to millions of hotels across India and globally
                        </p>
                     </CardContent>
                  </Card>

                  <Card className="text-center border-2 border-blue-200">
                     <CardContent className="p-8">
                        <div className="text-5xl mb-4">⚡</div>
                        <h4 className="text-xl font-bold mb-2">Instant Booking</h4>
                        <p className="text-slate-600">
                           Quick confirmation with instant booking support
                        </p>
                     </CardContent>
                  </Card>
               </div>
            </div>
         </section>

         {/* Hotel Categories */}
         <section className="py-16 px-4 bg-white">
            <div className="container mx-auto max-w-6xl">
               <div className="text-center mb-12">
                  <h3 className="text-3xl font-bold text-slate-900 mb-2">
                     Book by Property Type
                  </h3>
                  <p className="text-slate-600">
                     Find the perfect accommodation for your needs
                  </p>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  {[
                     { type: 'Hotels', icon: '🏨', count: '50K+' },
                     { type: 'Resorts', icon: '🏖️', count: '10K+' },
                     { type: 'Apartments', icon: '🏢', count: '30K+' },
                     { type: 'Villas', icon: '🏡', count: '15K+' },
                     { type: 'Homestays', icon: '🏠', count: '25K+' }
                  ].map((category) => (
                     <Card
                        key={category.type}
                        className="cursor-pointer hover:shadow-lg transition-all hover:-translate-y-1 border-2 hover:border-orange-400"
                     >
                        <CardContent className="p-6 text-center">
                           <div className="text-4xl mb-2">{category.icon}</div>
                           <h4 className="font-bold text-slate-900">{category.type}</h4>
                           <p className="text-sm text-slate-500">{category.count}</p>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* Footer */}
         <footer className="bg-slate-900 text-white py-12 px-4">
            <div className="container mx-auto max-w-6xl">
               <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                  <div>
                     <h4 className="text-xl font-bold mb-4 bg-gradient-to-r from-orange-400 to-green-400 bg-clip-text text-transparent">
                        🇮🇳 BookMyHotel
                     </h4>
                     <p className="text-slate-400 text-sm">
                        India's trusted hotel booking platform. Book with confidence.
                     </p>
                  </div>
                  <div>
                     <h5 className="font-bold mb-3">Quick Links</h5>
                     <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-orange-400">About Us</a></li>
                        <li><a href="#" className="hover:text-orange-400">Contact</a></li>
                        <li><a href="#" className="hover:text-orange-400">Careers</a></li>
                     </ul>
                  </div>
                  <div>
                     <h5 className="font-bold mb-3">Support</h5>
                     <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-orange-400">Help Center</a></li>
                        <li><a href="#" className="hover:text-orange-400">FAQs</a></li>
                        <li><a href="#" className="hover:text-orange-400">Cancellation</a></li>
                     </ul>
                  </div>
                  <div>
                     <h5 className="font-bold mb-3">Connect</h5>
                     <ul className="space-y-2 text-sm text-slate-400">
                        <li><a href="#" className="hover:text-orange-400">Facebook</a></li>
                        <li><a href="#" className="hover:text-orange-400">Twitter</a></li>
                        <li><a href="#" className="hover:text-orange-400">Instagram</a></li>
                     </ul>
                  </div>
               </div>
               <div className="border-t border-slate-800 pt-6 text-center text-sm text-slate-400">
                  <p>© 2025 BookMyHotel. Made with ❤️ for India. Powered by LiteAPI.</p>
               </div>
            </div>
         </footer>
      </div>
   );
}

export default Home;
