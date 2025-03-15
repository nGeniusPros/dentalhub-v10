import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../store/store';

export interface Location {
  id: string;
  name: string;
  address: string;
  city: string;
  state: string;
  postal_code: string;
  phone: string;
  is_active: boolean;
}

export const useLocation = () => {
  const [locations, setLocations] = useState<Location[]>([]);
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [loading, setLoading] = useState(false);
  
  const user = useSelector((state: RootState) => state.auth.user);
  
  useEffect(() => {
    const loadLocations = async () => {
      setLoading(true);
      try {
        // In a real implementation, you would fetch locations from an API
        // For now, we'll use a mock location
        const mockLocations: Location[] = [
          {
            id: '1',
            name: 'Main Office',
            address: '123 Main St',
            city: 'Anytown',
            state: 'CA',
            postal_code: '90210',
            phone: '555-123-4567',
            is_active: true
          }
        ];
        
        setLocations(mockLocations);
        
        // Set the current location to the first location or the user's default location
        if (mockLocations.length > 0) {
          const defaultLocationId = user?.default_location_id || mockLocations[0].id;
          const defaultLocation = mockLocations.find(loc => loc.id === defaultLocationId) || mockLocations[0];
          setCurrentLocation(defaultLocation);
        }
      } catch (error) {
        console.error('Error loading locations:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadLocations();
  }, [user]);
  
  const switchLocation = (locationId: string) => {
    const newLocation = locations.find(loc => loc.id === locationId);
    if (newLocation) {
      setCurrentLocation(newLocation);
    }
  };
  
  return {
    locations,
    currentLocation,
    loading,
    switchLocation
  };
};