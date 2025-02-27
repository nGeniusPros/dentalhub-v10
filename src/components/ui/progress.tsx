import * as React from "react";
import { cn } from "../../lib/utils";

interface ProgressProps {
  value: number;
  max?: number;
  className?: string;
  barClassName?: string;
  showValue?: boolean;
  size?: 'sm' | 'md' | 'lg';
  variant?: 'default' | 'gradient-ocean' | 'gradient-gold' | 'gradient-tropical' | 'gradient-royal' | 'gradient-nature' | 'gradient-corporate';
  animate?: boolean;
}

const sizeClassMap = {
  sm: "h-1",
  md: "h-2",
  lg: "h-3",
};

const variantClassMap = {
  default: "bg-navy",
  "gradient-ocean": "bg-gradient-ocean",
  "gradient-gold": "bg-gradient-gold",
  "gradient-tropical": "bg-gradient-tropical",
  "gradient-royal": "bg-gradient-royal",
  "gradient-nature": "bg-gradient-nature",
  "gradient-corporate": "bg-gradient-corporate",
};

export const Progress = React.forwardRef<HTMLDivElement, ProgressProps>(
  ({ 
    value, 
    max = 100, 
    className, 
    barClassName, 
    showValue = false, 
    size = "md", 
    variant = "default",
    animate = true,
    ...props 
  }, ref) => {
    const percentage = Math.min(100, Math.max(0, (value / max) * 100));
    
    return (
      <div className="relative">
        <div
          className={cn(
            "w-full bg-gray-lighter overflow-hidden rounded-full", 
            sizeClassMap[size],
            className
          )}
          ref={ref}
          {...props}
        >
          <div
            className={cn(
              "h-full rounded-full transition-all", 
              animate ? "transition-[width] duration-500 ease-in-out" : "",
              variantClassMap[variant],
              barClassName
            )}
            style={{ width: `${percentage}%` }}
          />
        </div>
        {showValue && (
          <div className="mt-1 text-xs text-right font-medium text-gray-darker">
            {Math.round(percentage)}%
          </div>
        )}
      </div>
    );
  }
);

Progress.displayName = "Progress";

export default Progress;
