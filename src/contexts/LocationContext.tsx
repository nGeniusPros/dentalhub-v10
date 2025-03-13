import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth } from './AuthContext';

// Define the Location type
export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postalCode: string;
  contactPhone: string;
  contactEmail?: string;
}

// Define the context type
interface LocationContextType {
  currentLocation: Location | null;
  isLoading: boolean;
  loading: boolean; // Alias for backward compatibility
  locations: Location[];
  setCurrentLocation: (locationId: string) => void;
}

// Create the context
const LocationContext = createContext<LocationContextType | null>(null);

// LocationProvider component
export const LocationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [locations, setLocations] = useState<Location[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Load locations and set current location based on user
  useEffect(() => {
    const loadLocations = async () => {
      setIsLoading(true);
      try {
        if (user) {
          // For production: Fetch locations from API
          // const response = await fetch('/api/locations');
          // const data = await response.json();
          // setLocations(data);

          // For development: Use local storage or mock data
          const storedLocations = localStorage.getItem('locations');
          let locationsList: Location[] = [];
          
          if (storedLocations) {
            locationsList = JSON.parse(storedLocations);
          } else {
            // If no locations in localStorage, create demo locations
            locationsList = [
              {
                id: 'dev-location-id',
                name: 'Development Office',
                address: '123 Dev Street',
                city: 'San Francisco',
                state: 'CA',
                postalCode: '94103',
                contactPhone: '555-123-4567',
                contactEmail: 'dev@dentalhub.com'
              },
              {
                id: 'loc-2',
                name: 'Downtown Dental',
                address: '456 Market St',
                city: 'San Francisco',
                state: 'CA',
                postalCode: '94105',
                contactPhone: '555-987-6543',
                contactEmail: 'downtown@dentalhub.com'
              },
              {
                id: 'loc-3',
                name: 'Eastside Clinic',
                address: '789 Mission St',
                city: 'San Francisco',
                state: 'CA',
                postalCode: '94107',
                contactPhone: '555-456-7890',
                contactEmail: 'eastside@dentalhub.com'
              }
            ];
            localStorage.setItem('locations', JSON.stringify(locationsList));
          }
          
          setLocations(locationsList);

          // If user has a locationId, set it as current
          if (user.locationId) {
            const userLocation = locationsList.find(loc => loc.id === user.locationId);
            if (userLocation) {
              setCurrentLocation(userLocation);
            } else if (locationsList.length > 0) {
              // Fallback to first location if user's location doesn't exist
              setCurrentLocation(locationsList[0]);
            }
          } else if (locationsList.length > 0) {
            // No location ID in user, default to first location
            setCurrentLocation(locationsList[0]);
          }
        }
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadLocations();
  }, [user]);

  // Handle changing the current location
  const handleSetCurrentLocation = (locationId: string) => {
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setCurrentLocation(location);
      // In a real app, you might want to update the user's preference in the backend
      localStorage.setItem('lastUsedLocationId', locationId);
    }
  };

  return (
    <LocationContext.Provider 
      value={{ 
        currentLocation, 
        isLoading, 
        loading: isLoading, // Alias for backward compatibility
        locations, 
        setCurrentLocation: handleSetCurrentLocation 
      }}
    >
      {children}
    </LocationContext.Provider>
  );
};

// Custom hook to use the location context
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (!context) {
    throw new Error('useLocation must be used within a LocationProvider');
  }
  return context;
};
