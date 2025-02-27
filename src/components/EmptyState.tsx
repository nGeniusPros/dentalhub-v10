import React from 'react';
import { motion } from 'framer-motion';
import * as Icons from 'lucide-react';

type EmptyStateProps = {
  title: string;
  description: string;
  illustration?: string;
  icon?: keyof typeof Icons;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
};

const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  illustration,
  icon,
  action,
  className = '',
}) => {
  const IconComponent = icon ? Icons[icon] : undefined;

  return (
    <motion.div 
      className={`flex flex-col items-center justify-center p-8 text-center ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {illustration ? (
        <div className="mb-6">
          <img 
            src={illustration} 
            alt={title} 
            className="max-w-full h-auto max-h-64"
          />
        </div>
      ) : IconComponent ? (
        <div className="mb-6 bg-gray-lighter p-6 rounded-full">
          <IconComponent size={48} className="text-gray-darker" />
        </div>
      ) : null}
      
      <h3 className="text-xl font-bold text-navy mb-2">{title}</h3>
      <p className="text-gray-darker mb-6 max-w-md">{description}</p>
      
      {action && (
        <motion.button
          className="px-4 py-2 bg-navy text-white rounded-lg hover:bg-navy-light transition-colors"
          onClick={action.onClick}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          {action.label}
        </motion.button>
      )}
    </motion.div>
  );
};

export default EmptyState;
