import React, { useState } from 'react';
import { useLocation } from '../../contexts/LocationContext';

interface LocationSwitcherProps {
  variant?: 'dropdown' | 'button';
  className?: string;
}

/**
 * LocationSwitcher component allows users to switch between multiple locations
 * they have access to. It can be displayed as a dropdown or a button that opens a modal.
 */
export const LocationSwitcher: React.FC<LocationSwitcherProps> = ({
  variant = 'dropdown',
  className = ''
}) => {
  const { currentLocation, locations, setCurrentLocation, isLoading } = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  // If only one location or still loading, don't show the switcher
  if (isLoading || locations.length <= 1) {
    return null;
  }

  // Button variant - opens a modal with location options
  if (variant === 'button') {
    return (
      <div className={`relative ${className}`}>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="inline-flex items-center px-3 py-2 text-sm font-medium rounded-md bg-white border border-gray-300 hover:bg-gray-50"
        >
          <svg 
            xmlns="http://www.w3.org/2000/svg" 
            width="16" 
            height="16" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round" 
            className="mr-2"
          >
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
            <circle cx="12" cy="10" r="3" />
          </svg>
          Change Location
        </button>

        {isOpen && (
          <div className="absolute left-0 mt-2 w-64 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
            <div className="py-1" role="menu" aria-orientation="vertical">
              {locations.map(location => (
                <button
                  key={location.id}
                  onClick={() => {
                    setCurrentLocation(location.id);
                    setIsOpen(false);
                  }}
                  className={`block w-full text-left px-4 py-2 text-sm ${
                    currentLocation?.id === location.id 
                      ? 'bg-purple-50 text-purple-700 font-medium' 
                      : 'text-gray-700 hover:bg-gray-50'
                  }`}
                  role="menuitem"
                >
                  <div className="font-medium">{location.name}</div>
                  <div className="text-xs text-gray-500">
                    {location.address}, {location.city}
                  </div>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  // Default dropdown variant
  return (
    <div className={className}>
      <select
        value={currentLocation?.id || ''}
        onChange={(e) => setCurrentLocation(e.target.value)}
        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-purple-500 focus:border-purple-500 sm:text-sm rounded-md"
      >
        {locations.map(location => (
          <option key={location.id} value={location.id}>
            {location.name}
          </option>
        ))}
      </select>
    </div>
  );
};

export default LocationSwitcher;