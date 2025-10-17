import { createContext, useContext, useState, useEffect } from 'react';
import {
   savePreferredCity,
   getPreferredCity,
   wasCitySelectionShown,
   markCitySelectionShown,
   isCityDataValid,
   clearPreferredCity
} from '../utils/locationUtils';

/**
 * CityContext - Global state management for user's preferred city
 * Handles city selection, storage, and provides city data across the app
 */
const LocationContext = createContext(undefined);

export function LocationProvider({ children }) {
   const [cityData, setCityData] = useState(null);
   const [isLoading, setIsLoading] = useState(true);
   const [showCitySelectionDialog, setShowCitySelectionDialog] = useState(false);
   const [showSuggestionBar, setShowSuggestionBar] = useState(false);
   const [showNotification, setShowNotification] = useState(false);
   const [citySelectionShown, setCitySelectionShown] = useState(false);

   // Initialize city on mount
   useEffect(() => {
      initializeCity();
   }, []);

   const initializeCity = () => {
      // Check if city selection was already shown
      const alreadyShown = wasCitySelectionShown();
      setCitySelectionShown(alreadyShown);

      // Try to get saved city
      const savedCity = getPreferredCity();

      if (savedCity && isCityDataValid(savedCity)) {
         // We have valid saved city
         setCityData(savedCity);

         // Show suggestion bar for returning users
         if (alreadyShown) {
            setShowSuggestionBar(true);
         }

         setIsLoading(false);
      } else {
         // No valid city saved - show notification for first-time visitors
         if (!alreadyShown) {
            setTimeout(() => {
               setShowNotification(true);
               setIsLoading(false);
            }, 2000); // 2s delay for better UX
         } else {
            setIsLoading(false);
         }
      }
   };

   /**
    * Save user's selected city
    */
   const selectCity = (cityName) => {
      try {
         const cityInfo = {
            city: cityName,
            timestamp: new Date().toISOString()
         };

         // Save to state and storage
         setCityData(cityInfo);
         savePreferredCity(cityName);
         markCitySelectionShown();
         setCitySelectionShown(true);

         return cityInfo;
      } catch (error) {
         console.error('Error selecting city:', error);
         throw error;
      }
   };

   /**
    * Handle city selection from dialog
    */
   const handleCitySelect = (cityName) => {
      selectCity(cityName);
      setShowCitySelectionDialog(false);
      return { city: cityName };
   };

   /**
    * Handle skip city selection
    */
   const handleSkipCitySelection = () => {
      markCitySelectionShown();
      setCitySelectionShown(true);
      setShowCitySelectionDialog(false);
   };

   /**
    * Dismiss suggestion bar
    */
   const dismissSuggestionBar = () => {
      setShowSuggestionBar(false);
   };

   /**
    * Dismiss notification
    */
   const dismissNotification = () => {
      setShowNotification(false);
      markCitySelectionShown();
      setCitySelectionShown(true);
   };

   /**
    * Open city dialog from notification
    */
   const openCityDialogFromNotification = () => {
      setShowNotification(false);
      setShowCitySelectionDialog(true);
   };

   /**
    * Clear saved city data
    */
   const clearCity = () => {
      clearPreferredCity();
      setCityData(null);
      setShowSuggestionBar(false);
   };

   /**
    * Manually trigger city selection dialog (e.g., from change city button)
    */
   const showCityDialog = () => {
      setShowCitySelectionDialog(true);
   };

   const value = {
      // State
      cityData,
      locationData: cityData, // Alias for backward compatibility
      isLoading,
      showCitySelectionDialog,
      showPermissionDialog: showCitySelectionDialog, // Alias for backward compatibility
      showSuggestionBar,
      showNotification,
      citySelectionShown,
      permissionAsked: citySelectionShown, // Alias for backward compatibility

      // Actions
      selectCity,
      handleCitySelect,
      handleSkipCitySelection,
      handleAllowLocation: handleCitySelect, // Alias for backward compatibility
      handleDenyLocation: handleSkipCitySelection, // Alias for backward compatibility
      dismissSuggestionBar,
      dismissNotification,
      openCityDialogFromNotification,
      clearCity,
      clearLocation: clearCity, // Alias for backward compatibility
      showCityDialog,
      showLocationPermissionDialog: showCityDialog, // Alias for backward compatibility
      setShowCitySelectionDialog,
      setShowPermissionDialog: setShowCitySelectionDialog, // Alias for backward compatibility
      setShowSuggestionBar,
      setShowNotification
   };

   return (
      <LocationContext.Provider value={value}>
         {children}
      </LocationContext.Provider>
   );
}

/**
 * Custom hook to use location context
 */
export function useLocation() {
   const context = useContext(LocationContext);

   if (context === undefined) {
      throw new Error('useLocation must be used within a LocationProvider');
   }

   return context;
}

/**
 * Hook to get just the city name (convenience)
 */
export function useLocationCity() {
   const { cityData } = useLocation();
   return cityData?.city || null;
}

/**
 * Hook to check if user has city selected
 */
export function useHasLocation() {
   const { cityData } = useLocation();
   return cityData !== null;
}
