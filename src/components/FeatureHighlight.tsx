import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../utils/cn';
import { Button } from './ui/button';

type FeatureHighlightProps = {
  title: string;
  description: string;
  illustration: string;
  direction?: 'right' | 'left';
  className?: string;
  ctaButton?: {
    label: string;
    onClick: () => void;
    variant?: 'gradient-ocean' | 'gradient-gold' | 'gradient-tropical' | 'gradient-royal' | 'gradient-nature' | 'gradient-corporate' | 'primary';
  };
  gradientBackground?: 'none' | 'ocean' | 'gold' | 'tropical' | 'royal' | 'nature' | 'corporate';
};

const FeatureHighlight: React.FC<FeatureHighlightProps> = ({
  title,
  description,
  illustration,
  direction = 'right',
  className = '',
  ctaButton,
  gradientBackground = 'none',
}) => {
  const isImageRight = direction === 'right';
  
  const backgroundClass = gradientBackground !== 'none' 
    ? `bg-gradient-${gradientBackground} text-white`
    : 'bg-white';

  // Adjust text color based on background
  const headingClass = gradientBackground === 'none' 
    ? 'text-navy' 
    : gradientBackground === 'gold' || gradientBackground === 'tropical' || gradientBackground === 'nature' 
      ? 'text-navy' 
      : 'text-white';

  const descriptionClass = gradientBackground === 'none' 
    ? 'text-gray-darker' 
    : gradientBackground === 'gold' || gradientBackground === 'tropical' || gradientBackground === 'nature'
      ? 'text-navy/80' 
      : 'text-white/80';
  
  return (
    <div 
      className={cn(
        `flex flex-col ${isImageRight ? 'md:flex-row' : 'md:flex-row-reverse'} 
        items-center gap-8 p-6 rounded-xl shadow-sm hover:shadow-glow transition-shadow`,
        backgroundClass,
        className
      )}
    >
      {/* Content */}
      <motion.div 
        className="flex-1"
        initial={{ opacity: 0, x: isImageRight ? -20 : 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h3 className={`text-xl md:text-2xl font-bold mb-4 ${headingClass}`}>{title}</h3>
        <p className={`mb-6 ${descriptionClass}`}>{description}</p>
        
        {ctaButton && (
          <Button
            variant={ctaButton.variant || 'primary'}
            onClick={ctaButton.onClick}
            className="shadow-sm hover:shadow-md"
          >
            {ctaButton.label}
          </Button>
        )}
      </motion.div>
      
      {/* Illustration */}
      <motion.div 
        className="flex-1 flex justify-center items-center"
        initial={{ opacity: 0, x: isImageRight ? 20 : -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <img 
          src={illustration} 
          alt={title} 
          className="max-w-full h-auto rounded-lg shadow-md"
        />
      </motion.div>
    </div>
  );
};

export default FeatureHighlight;
