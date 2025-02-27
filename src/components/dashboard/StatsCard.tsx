import React from 'react';
import { motion } from 'framer-motion';
import { Icon } from '../../components/ui/icon-strategy';
import { cn } from '../../utils/cn';

interface StatsCardProps {
  title: string;
  value: string | number;
  change?: string | number;
  icon: string;
  variant: 'ocean' | 'gold' | 'tropical' | 'royal' | 'nature' | 'corporate';
  isGlowing?: boolean;
}

const variantStyles = {
  ocean: 'bg-gradient-ocean text-white',
  gold: 'bg-gradient-gold text-navy',
  tropical: 'bg-gradient-tropical text-navy',
  royal: 'bg-gradient-royal text-white',
  nature: 'bg-gradient-nature text-navy',
  corporate: 'bg-gradient-corporate text-white',
};

const iconVariantStyles = {
  ocean: 'bg-white/20 text-white',
  gold: 'bg-white/20 text-navy',
  tropical: 'bg-white/20 text-navy',
  royal: 'bg-white/20 text-white',
  nature: 'bg-white/20 text-navy',
  corporate: 'bg-white/20 text-white',
};

const StatsCard = ({ 
  title, 
  value, 
  change, 
  icon, 
  variant, 
  isGlowing = false 
}: StatsCardProps) => {
  const numericChange = typeof change === 'string' ? parseFloat(change) : change;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "rounded-xl p-6 border border-transparent transition-all duration-300",
        variantStyles[variant],
        isGlowing ? "shadow-glow hover:shadow-glow-lg" : "shadow-lg hover:shadow-xl"
      )}
    >
      <div className="flex items-center justify-between">
        <div className={cn('p-3 rounded-lg shadow-md', iconVariantStyles[variant])}>
          <Icon name={icon} className="w-6 h-6" />
        </div>
        {change !== undefined && (
          <motion.span 
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium",
              numericChange && numericChange > 0 
                ? "bg-green/10 text-green" 
                : "bg-purple/10 text-purple"
            )}
          >
            {numericChange && numericChange > 0 ? '+' : ''}{change}%
          </motion.span>
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-medium">{title}</h3>
        <p className="text-2xl font-bold mt-1">{value}</p>
      </div>
    </motion.div>
  );
};

export default StatsCard;