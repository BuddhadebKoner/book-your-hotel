import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Calendar, Users, Star, Award, Shield, Sparkles, TrendingUp, MapPinned, Building2, Loader2 } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Input } from '../../components/ui/input';
import { Badge } from '../../components/ui/badge';
import { Card, CardContent } from '../../components/ui/card';
import {
   Dialog,
   DialogContent,
   DialogDescription,
   DialogHeader,
   DialogTitle,
} from "../../components/ui/dialog";
import {
   Pagination,
   PaginationContent,
   PaginationEllipsis,
   PaginationItem,
   PaginationLink,
   PaginationNext,
   PaginationPrevious,
} from "../../components/ui/pagination";
import { HotelSearchAPI, INDIA_CONFIG } from '../../services/liteApiService';

function Home() {
   const [searchQuery, setSearchQuery] = useState('');
   const [checkin, setCheckin] = useState('');
   const [checkout, setCheckout] = useState('');
   const [guests, setGuests] = useState(2);
   const [loading, setLoading] = useState(false);
   const [searchResults, setSearchResults] = useState(null);
   const [dialogOpen, setDialogOpen] = useState(false);
   const [currentPage, setCurrentPage] = useState(1);
   const itemsPerPage = 12;

   // Handle search
   const handleSearch = async () => {
      if (!searchQuery) {
         alert('Please enter a destination');
         return;
      }

      setLoading(true);
      try {
         // Search hotels by city name (defaulting to India)
         const result = await HotelSearchAPI.searchHotels(INDIA_CONFIG.country, searchQuery);
         setSearchResults(result.data);
         setDialogOpen(true);
         setCurrentPage(1);
      } catch (error) {
         console.error('Error searching hotels:', error);
         alert('Failed to search hotels. Please try again.');
      } finally {
         setLoading(false);
      }
   };

   // Pagination logic
   const totalPages = searchResults ? Math.ceil(searchResults.length / itemsPerPage) : 0;
   const startIndex = (currentPage - 1) * itemsPerPage;
   const endIndex = startIndex + itemsPerPage;
   const currentHotels = searchResults ? searchResults.slice(startIndex, endIndex) : [];

   const handlePageChange = (page) => {
      setCurrentPage(page);
      // Scroll to top of dialog
      document.querySelector('.dialog-content')?.scrollTo(0, 0);
   };

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

   return (
      <div className="min-h-screen">
         {/* Hero Section */}
         <section className="relative bg-gradient-to-br from-orange-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 py-20 lg:py-32">
            <div className="container mx-auto px-4">
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
                              onChange={(e) => setSearchQuery(e.target.value)}
                              className="h-12"
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
                              onChange={(e) => setCheckin(e.target.value)}
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
                              onChange={(e) => setCheckout(e.target.value)}
                              min={new Date().toISOString().split('T')[0]}
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
                              value={guests}
                              onChange={(e) => setGuests(e.target.value)}
                              className="h-12"
                           />
                        </div>
                     </div>

                     <Button
                        onClick={handleSearch}
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
                  {[
                     { value: '50,000+', label: 'Hotels' },
                     { value: '100+', label: 'Cities' },
                     { value: '5M+', label: 'Happy Customers' },
                     { value: '4.8', label: 'Average Rating' }
                  ].map((stat, index) => (
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

         {/* Features Section */}
         <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Us</h2>
                  <p className="text-muted-foreground max-w-2xl mx-auto">
                     Experience hassle-free hotel booking with India's most trusted platform
                  </p>
               </div>

               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
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
                  ].map((feature, index) => (
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

         {/* Popular Destinations */}
         <section className="py-20 bg-slate-50 dark:bg-slate-800">
            <div className="container mx-auto px-4">
               <div className="flex items-center justify-between mb-12">
                  <div>
                     <h2 className="text-3xl md:text-4xl font-bold mb-2">Popular Destinations</h2>
                     <p className="text-muted-foreground">Explore India's most loved travel destinations</p>
                  </div>
                  <Button variant="outline" className="hidden md:flex">
                     <TrendingUp className="mr-2 h-4 w-4" />
                     View All
                  </Button>
               </div>

               <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {popularCities.map((city, index) => (
                     <Card
                        key={city.name}
                        className="group cursor-pointer hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-2 hover:border-primary overflow-hidden"
                     >
                        <CardContent className="p-6 text-center">
                           <div className="text-5xl mb-3 group-hover:scale-110 transition-transform duration-300">
                              {city.image}
                           </div>
                           <h4 className="text-lg font-bold mb-1">
                              {city.name}
                           </h4>
                           <p className="text-sm text-muted-foreground">{city.description}</p>
                        </CardContent>
                     </Card>
                  ))}
               </div>
            </div>
         </section>

         {/* Property Types */}
         <section className="py-20 bg-white dark:bg-slate-900">
            <div className="container mx-auto px-4">
               <div className="text-center mb-12">
                  <h2 className="text-3xl md:text-4xl font-bold mb-4">Book by Property Type</h2>
                  <p className="text-muted-foreground">
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

         {/* CTA Section */}
         <section className="py-20 bg-gradient-to-r from-primary to-orange-600 text-white">
            <div className="container mx-auto px-4 text-center">
               <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Ready to Start Your Journey?
               </h2>
               <p className="text-lg mb-8 text-white/90 max-w-2xl mx-auto">
                  Join millions of travelers who trust us for their perfect stay. Book now and save up to 50%!
               </p>
               <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="secondary" className="font-semibold">
                     <Search className="mr-2 h-5 w-5" />
                     Browse Hotels
                  </Button>
                  <Button size="lg" variant="outline" className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-primary font-semibold">
                     Download App
                  </Button>
               </div>
            </div>
         </section>

         {/* Search Results Dialog */}
         <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
            <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto dialog-content">
               <DialogHeader>
                  <DialogTitle className="text-2xl font-bold flex items-center gap-2">
                     <Building2 className="h-6 w-6 text-primary" />
                     Search Results for "{searchQuery}"
                  </DialogTitle>
                  <DialogDescription>
                     Found {searchResults?.length || 0} hotels in {searchQuery}
                  </DialogDescription>
               </DialogHeader>

               {searchResults && searchResults.length > 0 ? (
                  <>
                     {/* Hotels Grid */}
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 py-6">
                        {currentHotels.map((hotel) => (
                           <Card key={hotel.id} className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden">
                              <div className="relative h-48 overflow-hidden">
                                 <img
                                    src={hotel.thumbnail || hotel.main_photo || 'https://via.placeholder.com/400x300?text=Hotel'}
                                    alt={hotel.name}
                                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                                    onError={(e) => {
                                       e.target.src = 'https://via.placeholder.com/400x300?text=Hotel';
                                    }}
                                 />
                                 <div className="absolute top-2 right-2">
                                    <Badge className="bg-primary text-white">
                                       {hotel.stars} ⭐
                                    </Badge>
                                 </div>
                              </div>

                              <CardContent className="p-4">
                                 <h3 className="font-bold text-lg mb-2 line-clamp-1">{hotel.name}</h3>

                                 <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                                    <MapPinned className="h-4 w-4 text-primary" />
                                    <span className="line-clamp-1">{hotel.address}, {hotel.city}</span>
                                 </div>

                                 {hotel.rating > 0 && (
                                    <div className="flex items-center gap-2 mb-3">
                                       <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                       <span className="font-semibold">{hotel.rating.toFixed(1)}</span>
                                       <span className="text-xs text-muted-foreground">
                                          ({hotel.reviewCount} reviews)
                                       </span>
                                    </div>
                                 )}

                                 <div
                                    className="text-sm text-muted-foreground line-clamp-2 mb-4"
                                    dangerouslySetInnerHTML={{
                                       __html: hotel.hotelDescription?.replace(/<[^>]*>/g, '').slice(0, 100) + '...' || 'No description available'
                                    }}
                                 />

                                 <div className="flex items-center justify-between">
                                    <div className="text-sm">
                                       <span className="text-xs text-muted-foreground">From</span>
                                       <div className="font-bold text-lg text-primary">
                                          ₹ {Math.floor(Math.random() * 5000) + 1000}
                                       </div>
                                       <span className="text-xs text-muted-foreground">per night</span>
                                    </div>
                                    <Button size="sm" className="bg-primary hover:bg-primary/90">
                                       View Details
                                    </Button>
                                 </div>
                              </CardContent>
                           </Card>
                        ))}
                     </div>

                     {/* Pagination */}
                     {totalPages > 1 && (
                        <Pagination className="mt-6">
                           <PaginationContent>
                              <PaginationItem>
                                 <PaginationPrevious
                                    onClick={() => currentPage > 1 && handlePageChange(currentPage - 1)}
                                    className={currentPage === 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                 />
                              </PaginationItem>

                              {[...Array(totalPages)].map((_, index) => {
                                 const pageNumber = index + 1;
                                 // Show first page, last page, current page, and pages around current
                                 if (
                                    pageNumber === 1 ||
                                    pageNumber === totalPages ||
                                    (pageNumber >= currentPage - 1 && pageNumber <= currentPage + 1)
                                 ) {
                                    return (
                                       <PaginationItem key={pageNumber}>
                                          <PaginationLink
                                             onClick={() => handlePageChange(pageNumber)}
                                             isActive={currentPage === pageNumber}
                                             className="cursor-pointer"
                                          >
                                             {pageNumber}
                                          </PaginationLink>
                                       </PaginationItem>
                                    );
                                 } else if (
                                    pageNumber === currentPage - 2 ||
                                    pageNumber === currentPage + 2
                                 ) {
                                    return (
                                       <PaginationItem key={pageNumber}>
                                          <PaginationEllipsis />
                                       </PaginationItem>
                                    );
                                 }
                                 return null;
                              })}

                              <PaginationItem>
                                 <PaginationNext
                                    onClick={() => currentPage < totalPages && handlePageChange(currentPage + 1)}
                                    className={currentPage === totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'}
                                 />
                              </PaginationItem>
                           </PaginationContent>
                        </Pagination>
                     )}
                  </>
               ) : (
                  <div className="py-12 text-center">
                     <p className="text-muted-foreground">No hotels found. Try a different search.</p>
                  </div>
               )}
            </DialogContent>
         </Dialog>
      </div>
   );
}

export default Home;
