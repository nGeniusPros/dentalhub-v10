import React from 'react';
import { useLocation } from '../../contexts/LocationContext';

interface LocationDisplayProps {
  className?: string;
  variant?: 'badge' | 'text' | 'full';
  showIcon?: boolean;
}

/**
 * LocationDisplay component shows the current user's assigned location.
 * It can be displayed in different styles based on the variant prop.
 */
export const LocationDisplay: React.FC<LocationDisplayProps> = ({
  className = '',
  variant = 'badge',
  showIcon = true
}) => {
  const { currentLocation, isLoading } = useLocation();

  if (isLoading) {
    return (
      <div className={`inline-flex items-center ${className}`}>
        <div className="w-4 h-4 rounded-full animate-pulse bg-gray-200"></div>
      </div>
    );
  }

  if (!currentLocation) {
    return (
      <div className={`text-gray-400 text-sm ${className}`}>
        {showIcon && (
          <span className="mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
        )}
        No location assigned
      </div>
    );
  }

  // Badge variant (compact with background)
  if (variant === 'badge') {
    return (
      <div className={`inline-flex items-center px-2 py-1 text-sm font-medium rounded-md bg-purple-50 text-purple-700 ${className}`}>
        {showIcon && (
          <span className="mr-1">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
        )}
        {currentLocation.name}
      </div>
    );
  }

  // Text variant (just the name, no background)
  if (variant === 'text') {
    return (
      <div className={`inline-flex items-center text-sm font-medium ${className}`}>
        {showIcon && (
          <span className="mr-1 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
        )}
        {currentLocation.name}
      </div>
    );
  }

  // Full variant (more details)
  return (
    <div className={`flex flex-col ${className}`}>
      <div className="inline-flex items-center mb-1">
        {showIcon && (
          <span className="mr-1 text-purple-600">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="inline-block">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
              <circle cx="12" cy="10" r="3" />
            </svg>
          </span>
        )}
        <span className="font-medium">{currentLocation.name}</span>
      </div>
      <div className="text-sm text-gray-600">
        {currentLocation.address}, {currentLocation.city}, {currentLocation.state} {currentLocation.postalCode}
      </div>
      <div className="text-sm text-gray-600">
        {currentLocation.contactPhone}
      </div>
    </div>
  );
};

export default LocationDisplay;