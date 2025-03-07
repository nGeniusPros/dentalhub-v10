import React from 'react';
import { Card } from 'flowbite-react';

interface ClaimStatusSummaryProps {
  title: string;
  count: number;
  color?: string;
  onClick?: () => void;
  active?: boolean;
}

const ClaimStatusSummary: React.FC<ClaimStatusSummaryProps> = ({
  title,
  count,
  color = 'blue',
  onClick,
  active = false
}) => {
  const getColorClasses = () => {
    switch (color) {
      case 'green':
        return {
          bg: active ? 'bg-green-100' : 'bg-white hover:bg-green-50',
          text: 'text-green-600',
          border: active ? 'border-green-500' : 'border-gray-200'
        };
      case 'red':
        return {
          bg: active ? 'bg-red-100' : 'bg-white hover:bg-red-50',
          text: 'text-red-600',
          border: active ? 'border-red-500' : 'border-gray-200'
        };
      case 'yellow':
        return {
          bg: active ? 'bg-yellow-100' : 'bg-white hover:bg-yellow-50',
          text: 'text-yellow-600',
          border: active ? 'border-yellow-500' : 'border-gray-200'
        };
      case 'blue':
      default:
        return {
          bg: active ? 'bg-blue-100' : 'bg-white hover:bg-blue-50',
          text: 'text-blue-600',
          border: active ? 'border-blue-500' : 'border-gray-200'
        };
    }
  };

  const colors = getColorClasses();

  return (
    <Card
      className={`${colors.bg} cursor-pointer transition-colors duration-200 border ${colors.border}`}
      onClick={onClick}
    >
      <div className="flex flex-col items-center">
        <h5 className="text-gray-700 font-medium text-sm">{title}</h5>
        <p className={`text-3xl font-bold ${colors.text} mt-2`}>{count}</p>
      </div>
    </Card>
  );
};

export default ClaimStatusSummary;