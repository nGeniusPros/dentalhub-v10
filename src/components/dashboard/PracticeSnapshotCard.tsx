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
  variant: 'ocean' | 'gold' | 'tropical' | 'royal' | 'nature' | 'corporate';
  linkTo: string;
  description?: string;
  isGlowing?: boolean;
}

const variantStyles = {
  ocean: 'bg-gradient-ocean text-white',
  gold: 'bg-gradient-gold text-white',
  tropical: 'bg-gradient-tropical text-white',
  royal: 'bg-gradient-royal text-white',
  nature: 'bg-gradient-nature text-white',
  corporate: 'bg-gradient-corporate text-white',
};

const PracticeSnapshotCard = ({
  title,
  value,
  change,
  icon,
  variant,
  linkTo,
  description,
  isGlowing = false
}: PracticeSnapshotCardProps) => {
  // Get the specific icon component
  const IconComponent = iconMap[icon];

  return (
    <Link to={linkTo}>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -5 }}
        className={cn(
          "bg-white/90 backdrop-blur-sm rounded-xl p-6 border border-gray-light transition-all duration-300 cursor-pointer h-full",
          isGlowing ? "shadow-glow hover:shadow-glow-lg" : "shadow-lg hover:shadow-xl"
        )}
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
        
        <h3 className={cn(
          "mt-4 text-2xl font-semibold text-transparent bg-clip-text",
          variant === 'ocean' ? 'bg-gradient-ocean' :
          variant === 'gold' ? 'bg-gradient-gold' :
          variant === 'tropical' ? 'bg-gradient-tropical' :
          variant === 'royal' ? 'bg-gradient-royal' :
          variant === 'nature' ? 'bg-gradient-nature' :
          variant === 'corporate' ? 'bg-gradient-corporate' : ''
        )}>
          {value}
        </h3>
        <p className="text-gray-dark text-sm">{title}</p>
        
        {description && (
          <p className="mt-2 text-xs text-gray-500">{description}</p>
        )}
        
        <div className={cn(
          "flex items-center justify-end mt-4 text-sm font-medium",
          `text-${variant === 'gold' ? 'navy' : variant}`
        )}>
          <span>View Details</span>
          <ArrowRight className="ml-1 w-4 h-4" />
        </div>
      </motion.div>
    </Link>
  );
};

export default PracticeSnapshotCard;