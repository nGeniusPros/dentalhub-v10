import React from 'react';
import { cn } from '../../lib/utils';

interface LogoProps {
  variant?: 'default' | 'light' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Logo = ({ 
  variant = 'default', 
  size = 'md',
  className
}: LogoProps) => {
  const sizes = {
    sm: 'h-6',
    md: 'h-8',
    lg: 'h-10'
  };

  return (
    <div className={cn('flex items-center gap-2', className)}>
      <img 
        src="/logos/ngenius-logo.svg" 
        alt="nGenius Logo" 
        className={cn(
          sizes[size],
          'object-contain'
        )} 
      />
      <div className="flex flex-col">
        <span className={cn(
          'font-bold bg-clip-text text-transparent',
          size === 'sm' ? 'text-sm' : size === 'md' ? 'text-lg' : 'text-xl',
          variant === 'default' ? 'bg-gradient-to-r from-navy via-navy-light to-blue' : 
          variant === 'light' ? 'bg-white' : 'bg-gradient-to-r from-gold via-gold-light to-gold-lighter'
        )}>
          nGenius
        </span>
        <span className={cn(
          'text-xs',
          variant === 'light' ? 'text-gray-lighter' : 'text-gray-darker'
        )}>
          Dental Hub
        </span>
      </div>
    </div>
  );
};
