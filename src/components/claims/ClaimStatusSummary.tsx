import React from 'react';
import { Card } from 'flowbite-react';
import { IconType } from 'react-icons';
import { HiDocumentText } from 'react-icons/hi';

export interface ClaimStatusSummaryProps {
  title: string;
  count: number;
  color?: string;
  onClick: () => void;
  active: boolean;
  icon?: IconType;
}

/**
 * Component for displaying claim status summary cards on the dashboard
 */
export const ClaimStatusSummary: React.FC<ClaimStatusSummaryProps> = ({
  title,
  count,
  color = 'info',
  onClick,
  active,
  icon: Icon = HiDocumentText
}) => {
  // Convert color name to Tailwind CSS classes
  const getColorClasses = (colorName: string) => {
    const colorMap: Record<string, { bg: string, text: string, border: string }> = {
      gray: { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200' },
      info: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      blue: { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200' },
      green: { bg: 'bg-green-50', text: 'text-green-700', border: 'border-green-200' },
      red: { bg: 'bg-red-50', text: 'text-red-700', border: 'border-red-200' },
      yellow: { bg: 'bg-yellow-50', text: 'text-yellow-700', border: 'border-yellow-200' }
    };
    
    return colorMap[colorName] || colorMap.info;
  };
  
  const { bg, text, border } = getColorClasses(color);
  
  return (
    <Card
      className={`cursor-pointer transition-colors duration-200 ${
        active ? `${bg} ${border} border-2` : 'hover:bg-gray-50'
      }`}
      onClick={onClick}
    >
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <span className="text-sm font-medium text-gray-500">{title}</span>
          <span className={`text-2xl font-bold ${active ? text : 'text-gray-800'}`}>
            {count}
          </span>
        </div>
        <div className={`rounded-full p-2 ${bg}`}>
          <Icon className={`h-5 w-5 ${text}`} />
        </div>
      </div>
    </Card>
  );
};