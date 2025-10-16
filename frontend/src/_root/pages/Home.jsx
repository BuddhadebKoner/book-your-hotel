import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHotelSearch } from '../../lib/react-query/hooks/useHotelSearch';
import { INDIA_CONFIG } from '../../services/liteApiService';
import {
   HeroSection,
   SearchResultsDialog,
   FeaturesSection,
   DestinationsSection,
   PropertyTypesSection,
   CTASection
} from '../../components/home';

/**
 * Home Page - Main landing page
 * Refactored for scalability with modular components
 * URL Parameters: search, checkin, checkout, guests
 */
function Home() {
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = useSearchParams();

   // Initialize state from URL parameters
   const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
   const [checkin, setCheckin] = useState(searchParams.get('checkin') || '');
   const [checkout, setCheckout] = useState(searchParams.get('checkout') || '');
   const [guests, setGuests] = useState(parseInt(searchParams.get('guests')) || 2);
   const [dialogOpen, setDialogOpen] = useState(false);

   // Open dialog if search parameter exists
   useEffect(() => {
      const searchParam = searchParams.get('search');
      if (searchParam) {
         setSearchQuery(searchParam);
         setDialogOpen(true);
      }
   }, [searchParams]);

   // React Query hook for hotel search (only enabled when dialog is open)
   const { data: searchData, isFetching } = useHotelSearch(
      { countryCode: INDIA_CONFIG.country, cityName: searchQuery },
      dialogOpen && !!searchQuery
   );

   const searchResults = searchData?.data || [];

   // Update URL parameters when search state changes
   const updateURLParams = (params) => {
      const newParams = new URLSearchParams(searchParams);

      Object.entries(params).forEach(([key, value]) => {
         if (value) {
            newParams.set(key, value);
         } else {
            newParams.delete(key);
         }
      });

      setSearchParams(newParams);
   };

   // Handle search button click
   const handleSearch = () => {
      if (!searchQuery) {
         alert('Please enter a destination');
         return;
      }

      // Update URL with search parameters
      updateURLParams({
         search: searchQuery,
         checkin: checkin,
         checkout: checkout,
         guests: guests.toString()
      });

      setDialogOpen(true);
   };

   // Handle city quick select from popular destinations
   const handleCityClick = (cityName) => {
      setSearchQuery(cityName);

      // Update URL with city search
      updateURLParams({
         search: cityName,
         checkin: checkin,
         checkout: checkout,
         guests: guests.toString()
      });

      setDialogOpen(true);
   };

   // Handle dialog close - remove search params
   const handleDialogClose = (open) => {
      setDialogOpen(open);

      if (!open) {
         // Clear URL parameters when dialog closes
         setSearchParams({});
      }
   };

   // Handle hotel card click
   const handleHotelSelect = (hotel) => {
      console.log('Selected hotel:', hotel);
      // Hotel card will navigate directly via useNavigate in HotelCard component
   };

   // Handle map search button click
   const handleMapSearch = () => {
      navigate('/map-search');
   };

   // Handle CTA actions
   const handleBrowseHotels = () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
   };

   const handleDownloadApp = () => {
      // TODO: Implement app download logic
      alert('App download feature coming soon!');
   };

   return (
      <div className="min-h-screen">
         {/* Hero Section with Search */}
         <HeroSection
            searchQuery={searchQuery}
            onSearchQueryChange={setSearchQuery}
            checkin={checkin}
            onCheckinChange={setCheckin}
            checkout={checkout}
            onCheckoutChange={setCheckout}
            guests={guests}
            onGuestsChange={setGuests}
            onSearch={handleSearch}
            onMapSearch={handleMapSearch}
            loading={isFetching}
         />

         {/* Features Section */}
         <FeaturesSection />

         {/* Popular Destinations */}
         <DestinationsSection onCityClick={handleCityClick} />

         {/* Property Types */}
         <PropertyTypesSection />

         {/* Call to Action */}
         <CTASection
            onBrowseClick={handleBrowseHotels}
            onDownloadClick={handleDownloadApp}
         />

         {/* Search Results Dialog */}
         <SearchResultsDialog
            open={dialogOpen}
            onOpenChange={handleDialogClose}
            searchQuery={searchQuery}
            results={searchResults}
            loading={isFetching}
            itemsPerPage={12}
            onHotelSelect={handleHotelSelect}
         />
      </div>
   );
}

export default Home;
