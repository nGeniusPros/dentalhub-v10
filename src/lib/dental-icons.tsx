import React from 'react';

// Interface for our icon components
export interface DentalIconProps {
  className?: string;
  size?: number | string;
  color?: string;
  strokeWidth?: number;
}

// Base component for all dental icons
const createDentalIcon = (path: string) => {
  const Icon = ({ 
    className = '', 
    size = 24, 
    color = 'currentColor', 
    strokeWidth = 2 
  }: DentalIconProps) => {
    return (
      <img 
        src={path} 
        width={size} 
        height={size} 
        className={className} 
        style={{ 
          color: color, 
          strokeWidth: strokeWidth 
        }} 
        alt="Dental icon"
      />
    );
  };
  return Icon;
};

// Define all dental icons
export const Tooth = createDentalIcon('/icons/dental/tooth.svg');
export const DentistChair = createDentalIcon('/icons/dental/dentist-chair.svg');
export const Toothbrush = createDentalIcon('/icons/dental/toothbrush.svg');
export const Molar = createDentalIcon('/icons/dental/molar.svg');
export const DentalDrill = createDentalIcon('/icons/dental/dental-drill.svg');
export const DentalChart = createDentalIcon('/icons/dental/dental-chart.svg');
export const DentalCalendar = createDentalIcon('/icons/dental/dental-calendar.svg');
export const DentalClock = createDentalIcon('/icons/dental/dental-clock.svg');

// Export all icons as a collection
const DentalIcons = {
  Tooth,
  DentistChair,
  Toothbrush,
  Molar,
  DentalDrill,
  DentalChart,
  DentalCalendar,
  DentalClock,
};

export default DentalIcons;
