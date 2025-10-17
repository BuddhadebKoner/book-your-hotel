import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { useHotelSearch } from '../../lib/react-query/hooks/useHotelSearch';
import { INDIA_CONFIG } from '../../services/liteApiService';
import { useLocation } from '../../context';
import {
   HeroSection,
   SearchResultsDialog,
   FeaturesSection,
   DestinationsSection,
   PropertyTypesSection,
   CTASection,
   CitySelectionDialog,
   LocationSuggestionBar,
   CityNotification
} from '../../components/home';

/**
 * Home Page - Main landing page
 * Refactored for scalability with modular components
 * URL Parameters: search, checkin, checkout, guests
 * Integrates with LocationContext for automatic city detection
 */
function Home() {
   const navigate = useNavigate();
   const [searchParams, setSearchParams] = useSearchParams();

   // City context
   const {
      cityData,
      locationData,
      showCitySelectionDialog,
      showSuggestionBar,
      showNotification,
      handleCitySelect,
      handleSkipCitySelection,
      dismissSuggestionBar,
      dismissNotification,
      openCityDialogFromNotification,
      setShowCitySelectionDialog,
      setShowSuggestionBar
   } = useLocation();

   // Initialize state from URL parameters
   const [searchQuery, setSearchQuery] = useState('');
   const [checkin, setCheckin] = useState('');
   const [checkout, setCheckout] = useState('');
   const [guests, setGuests] = useState(2);
   const [dialogOpen, setDialogOpen] = useState(false);

   // Initialize form values from URL on mount (but don't auto-open dialog)
   useEffect(() => {
      // Only set initial values, don't trigger any actions
      if (searchParams.get('search')) setSearchQuery(searchParams.get('search'));
      if (searchParams.get('checkin')) setCheckin(searchParams.get('checkin'));
      if (searchParams.get('checkout')) setCheckout(searchParams.get('checkout'));
      if (searchParams.get('guests')) setGuests(parseInt(searchParams.get('guests')));

      // Clear URL parameters on mount to prevent auto-opening on refresh
      if (searchParams.toString()) {
         setSearchParams({});
      }
   }, []); // Run only once on mount

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

   // Handle city selection from dialog
   const handleCitySelection = (cityName) => {
      handleCitySelect(cityName);
      // Set search query and open dialog immediately
      setSearchQuery(cityName);
      updateURLParams({
         search: cityName,
         guests: guests.toString()
      });
      setDialogOpen(true);
      setShowSuggestionBar(false);
   };

   // Handle suggestion bar explore click
   const handleExploreSuggestion = () => {
      if (cityData?.city || locationData?.city) {
         const cityName = cityData?.city || locationData?.city;
         setSearchQuery(cityName);

         updateURLParams({
            search: cityName,
            guests: guests.toString()
         });

         setDialogOpen(true);
         dismissSuggestionBar();
      }
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

         {/* City Selection Dialog (First-time visitors) */}
         <CitySelectionDialog
            open={showCitySelectionDialog}
            onOpenChange={setShowCitySelectionDialog}
            onCitySelect={handleCitySelection}
            onSkip={handleSkipCitySelection}
         />

         {/* City Suggestion Bar (Returning visitors) */}
         {(cityData?.city || locationData?.city) && showSuggestionBar && (
            <LocationSuggestionBar
               cityName={cityData?.city || locationData?.city}
               onExplore={handleExploreSuggestion}
               onDismiss={dismissSuggestionBar}
            />
         )}

         {/* City Notification (First-time visitors - non-intrusive) */}
         {showNotification && (
            <CityNotification
               onSelectCity={openCityDialogFromNotification}
               onDismiss={dismissNotification}
            />
         )}
      </div>
   );
}

export default Home;
