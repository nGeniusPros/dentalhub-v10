import React from 'react';
import { motion } from 'framer-motion';
import DentalIcons, { Molar, Tooth } from '../../lib/dental-icons';

export interface ToothData {
  id: number;
  position: string;
  status: 'healthy' | 'treated' | 'needs-treatment' | 'missing';
  treatment?: string;
}

export interface DentalChartProps {
  teeth: ToothData[];
  onToothClick?: (toothId: number) => void;
  className?: string;
}

const getStatusColor = (status: ToothData['status']) => {
  switch (status) {
    case 'healthy':
      return 'text-green';
    case 'treated':
      return 'text-navy';
    case 'needs-treatment':
      return 'text-gold';
    case 'missing':
      return 'text-gray-dark';
    default:
      return 'text-gray';
  }
};

export const DentalChart: React.FC<DentalChartProps> = ({
  teeth,
  onToothClick,
  className = '',
}) => {
  // Group teeth by quadrant
  const upperRight = teeth.filter(tooth => tooth.position.startsWith('UR'));
  const upperLeft = teeth.filter(tooth => tooth.position.startsWith('UL'));
  const lowerRight = teeth.filter(tooth => tooth.position.startsWith('LR'));
  const lowerLeft = teeth.filter(tooth => tooth.position.startsWith('LL'));

  const renderTooth = (tooth: ToothData) => {
    const statusColor = getStatusColor(tooth.status);
    const ToothIcon = tooth.position.includes('M') ? Molar : Tooth;

    return (
      <motion.button
        key={tooth.id}
        className={`p-1 ${statusColor} hover:scale-110 transition-all relative group`}
        whileHover={{ scale: 1.1 }}
        onClick={() => onToothClick && onToothClick(tooth.id)}
      >
        <ToothIcon className="w-8 h-8" />
        <span className="absolute -top-1 -right-1 text-[10px] font-bold bg-white rounded-full w-4 h-4 flex items-center justify-center border border-gray-light">
          {tooth.id}
        </span>
        {tooth.treatment && (
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 bg-white/90 
                        text-[9px] px-1 rounded opacity-0 group-hover:opacity-100 whitespace-nowrap
                        transition-opacity border border-gray-light shadow-sm">
            {tooth.treatment}
          </div>
        )}
      </motion.button>
    );
  };

  return (
    <div className={`dental-chart p-4 bg-white rounded-xl shadow-sm ${className}`}>
      <div className="mb-4 text-center">
        <span className="text-sm font-medium text-gray-dark">Upper</span>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex justify-end space-x-1">
          {upperRight.map(renderTooth)}
        </div>
        <div className="flex justify-start space-x-1">
          {upperLeft.map(renderTooth)}
        </div>
      </div>
      
      <div className="my-6 border-t border-b border-dashed border-gray-light py-3">
        <div className="flex justify-between px-4">
          <span className="text-sm font-medium text-gray-dark">Right</span>
          <span className="text-sm font-medium text-gray-dark">Left</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-2">
        <div className="flex justify-end space-x-1">
          {lowerRight.map(renderTooth)}
        </div>
        <div className="flex justify-start space-x-1">
          {lowerLeft.map(renderTooth)}
        </div>
      </div>
      
      <div className="mt-4 text-center">
        <span className="text-sm font-medium text-gray-dark">Lower</span>
      </div>
      
      <div className="mt-6 flex justify-between px-4 pt-4 border-t border-gray-light">
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-green mr-1"></div>
            <span className="text-xs">Healthy</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-navy mr-1"></div>
            <span className="text-xs">Treated</span>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gold mr-1"></div>
            <span className="text-xs">Needs Treatment</span>
          </div>
          <div className="flex items-center">
            <div className="w-3 h-3 rounded-full bg-gray-dark mr-1"></div>
            <span className="text-xs">Missing</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DentalChart;
