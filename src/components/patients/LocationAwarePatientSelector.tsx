import React, { useState, useEffect } from 'react';
import { useLocation } from '../../contexts/LocationContext';

// Define the Patient type
interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  locationId: string;
  email?: string;
  phone?: string;
}

interface LocationAwarePatientSelectorProps {
  onSelect: (patient: Patient) => void;
  className?: string;
}

/**
 * A location-aware patient selector that only shows patients 
 * from the current user's active location
 */
export const LocationAwarePatientSelector: React.FC<LocationAwarePatientSelectorProps> = ({
  onSelect,
  className = ''
}) => {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const { currentLocation, isLoading: locationLoading } = useLocation();
  
  // Fetch patients based on the current location
  useEffect(() => {
    const fetchPatients = async () => {
      if (locationLoading || !currentLocation) {
        return;
      }
      
      setLoading(true);
      try {
        // In a real app, this would be an API call to your backend
        // For example:
        // const response = await fetch(`/api/patients?locationId=${currentLocation.id}`);
        // const data = await response.json();
        
        // For demo purposes, we'll use mock data stored in localStorage
        const mockPatientData = localStorage.getItem('mock_patients');
        let patientData: Patient[] = [];
        
        if (mockPatientData) {
          patientData = JSON.parse(mockPatientData);
        } else {
          // Create mock patients for demonstration
          patientData = [
            {
              id: 'patient-1',
              firstName: 'John',
              lastName: 'Doe',
              dateOfBirth: '1980-05-15',
              locationId: 'dev-location-id',
              email: 'john.doe@example.com',
              phone: '555-123-4567'
            },
            {
              id: 'patient-2',
              firstName: 'Jane',
              lastName: 'Smith',
              dateOfBirth: '1992-08-22',
              locationId: 'dev-location-id',
              email: 'jane.smith@example.com',
              phone: '555-987-6543'
            },
            {
              id: 'patient-3',
              firstName: 'Robert',
              lastName: 'Johnson',
              dateOfBirth: '1975-11-03',
              locationId: 'loc-2',
              email: 'robert.johnson@example.com',
              phone: '555-456-7890'
            }
          ];
          localStorage.setItem('mock_patients', JSON.stringify(patientData));
        }
        
        // Filter patients by current location
        const locationPatients = patientData.filter(
          patient => patient.locationId === currentLocation.id
        );
        
        setPatients(locationPatients);
      } catch (error) {
        console.error('Error fetching patients:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchPatients();
  }, [currentLocation, locationLoading]);
  
  // Filter patients based on search term
  const filteredPatients = patients.filter(patient => {
    const fullName = `${patient.firstName} ${patient.lastName}`.toLowerCase();
    return fullName.includes(searchTerm.toLowerCase());
  });
  
  if (locationLoading) {
    return <div className="animate-pulse">Loading location data...</div>;
  }
  
  if (!currentLocation) {
    return <div className="text-red-500">No location selected</div>;
  }
  
  return (
    <div className={`w-full ${className}`}>
      <div className="mb-4">
        <div className="flex items-center mb-2">
          <div className="w-4 h-4 bg-purple-100 rounded-full mr-2"></div>
          <span className="font-medium text-purple-700">
            {currentLocation.name} Patients
          </span>
        </div>
        <p className="text-sm text-gray-500">
          Showing {patients.length} patients at this location
        </p>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search patients..."
          className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      
      {loading ? (
        <div className="animate-pulse">Loading patients...</div>
      ) : (
        <div className="space-y-2">
          {filteredPatients.length === 0 ? (
            <div className="text-gray-500 p-4 text-center border border-gray-200 rounded-md">
              No patients found at this location
            </div>
          ) : (
            filteredPatients.map(patient => (
              <div
                key={patient.id}
                className="p-3 border border-gray-200 rounded-md hover:bg-purple-50 cursor-pointer"
                onClick={() => onSelect(patient)}
              >
                <div className="font-medium">{patient.firstName} {patient.lastName}</div>
                <div className="text-sm text-gray-500">
                  DOB: {new Date(patient.dateOfBirth).toLocaleDateString()}
                </div>
                {patient.phone && (
                  <div className="text-sm text-gray-500">{patient.phone}</div>
                )}
              </div>
            ))
          )}
        </div>
      )}
      
      <div className="mt-4 p-3 border border-gray-200 rounded-md bg-gray-50">
        <p className="text-sm text-gray-700">
          <strong>Note:</strong> Patients are segmented by location. Switch locations to see different patient lists.
        </p>
      </div>
    </div>
  );
};

export default LocationAwarePatientSelector;