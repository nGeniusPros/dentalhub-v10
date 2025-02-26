import React from 'react';
import { motion } from 'framer-motion';
import { DollarSign, Users, Star, Calendar, HeartPulse, Award, Activity, ArrowRight } from 'lucide-react';
import { cn } from '../../utils/cn';
import { Link } from 'react-router-dom';

// Map of available icons
const iconMap = {
  DollarSign,
  Users,
  Star,
  Calendar,
  HeartPulse,
  Award,
  Activity,
  ArrowRight
};

interface PracticeSnapshotCardProps {
  title: string;
  value: string | number;
  change?: number;
  icon: keyof typeof iconMap;
  variant: 'primary' | 'secondary' | 'accent1' | 'accent2';
  linkTo: string;
  description?: string;
}

const variantStyles = {
  primary: 'bg-gradient-ocean text-white',
  secondary: 'bg-gradient-royal text-white',
  accent1: 'bg-gradient-gold text-white',
  accent2: 'bg-gradient-tropical text-white',
};

const PracticeSnapshotCard = ({
  title,
  value,
  change,
  icon,
  variant,
  linkTo,
  description
}: PracticeSnapshotCardProps) => {
  // Get the specific icon component
  const IconComponent = iconMap[icon];

  return (
    <Link to={linkTo}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}
        className="bg-white/90 backdrop-blur-sm rounded-xl p-6 shadow-lg border border-gray-light hover:shadow-xl transition-all duration-300 cursor-pointer h-full"
      >
        <div className="flex items-center justify-between">
          <div className={cn('p-3 rounded-lg shadow-md', variantStyles[variant])}>
            {/* Render the icon with proper typing */}
            {IconComponent && <IconComponent className="w-6 h-6" />}
          </div>
          {change !== undefined && (
            <motion.span 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              className={cn(
                'text-sm font-medium px-3 py-1 rounded-full',
                change >= 0 
                  ? 'bg-green/10 text-green' 
                  : 'bg-red-100 text-red-600'
              )}
            >
              {change >= 0 ? '+' : ''}{change}%
            </motion.span>
          )}
        </div>
        
        <h3 className="mt-4 text-2xl font-semibold bg-gradient-corporate text-transparent bg-clip-text">
          {value}
        </h3>
        <p className="text-gray-dark text-sm">{title}</p>
        
        {description && (
          <p className="mt-2 text-xs text-gray-500">{description}</p>
        )}
        
        <div className="flex items-center justify-end mt-4 text-sm text-primary font-medium">
          <span>View Details</span>
          <ArrowRight className="ml-1 w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
};

export default PracticeSnapshotCard;