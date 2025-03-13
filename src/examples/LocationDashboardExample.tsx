import React, { useState } from 'react';
import { useLocation } from '../contexts/LocationContext';
import { useAuth } from '../contexts/AuthContext';
import LocationDisplay from '../components/location/LocationDisplay';
import LocationSwitcher from '../components/location/LocationSwitcher';
import LocationAwarePatientSelector from '../components/patients/LocationAwarePatientSelector';

interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  locationId: string;
  email?: string;
  phone?: string;
}

/**
 * Example dashboard showcasing multi-location functionality
 * This component demonstrates how to use the location context and components
 * in a real application scenario.
 */
const LocationDashboardExample: React.FC = () => {
  const { user } = useAuth();
  const { currentLocation, locations, isLoading } = useLocation();
  const [selectedPatient, setSelectedPatient] = useState<Patient | null>(null);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-4 rounded-md bg-white shadow-md">
          <div className="animate-spin h-8 w-8 border-4 border-purple-500 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-2 text-center text-gray-600">Loading location data...</p>
        </div>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="p-6 rounded-md bg-white shadow-md max-w-md">
          <h2 className="text-xl font-bold text-red-500 mb-2">No Location Selected</h2>
          <p className="text-gray-600 mb-4">
            You need to select a location to continue. Please contact your administrator
            if you don't have access to any locations.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <header className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-800">DentalHub Dashboard</h1>
          <div className="flex items-center space-x-4">
            {user && (
              <div className="flex items-center">
                <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center text-purple-700 font-medium">
                  {user.name.charAt(0)}
                </div>
                <span className="ml-2 text-sm font-medium">{user.name}</span>
