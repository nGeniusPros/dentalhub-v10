import { Suspense, lazy, useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Spotlight } from './spotlight';
import { cn } from '../../lib/utils';

const Spline = lazy(() => import('@splinetool/react-spline'));

interface SplineSceneProps {
  scene: string;
  className?: string;
  title?: string;
  subtitle?: string;
  primaryColor?: string;
  accentColor?: string;
  interactionPrompt?: string;
  onSceneLoad?: () => void;
  onError?: () => void;
  spotlight?: boolean;
  interactive?: boolean;
}

export function SplineScene({ 
  scene, 
  className, 
  title, 
  subtitle,
  primaryColor = 'bg-navy-default', 
  accentColor = 'text-gold-default',
  interactionPrompt,
  onSceneLoad,
  onError,
  spotlight = true,
  interactive = true
}: SplineSceneProps) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    if (isLoaded && onSceneLoad) {
      onSceneLoad();
    }
  }, [isLoaded, onSceneLoad]);

  const handleLoad = () => {
    setIsLoaded(true);
  };

  const handleError = (err: any) => {
    console.error('Spline scene error:', err);
    setHasError(true);
    if (onError) {
      onError();
    }
  };

  // If we have an error, don't render the component at all
  if (hasError) {
    return null;
  }

  return (
    <div 
      className={cn(
        "relative rounded-xl overflow-hidden border border-gray-200 shadow-lg transition-all duration-300",
        isHovered && interactive ? "shadow-glow scale-[1.01]" : "",
        className
      )}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Gradient Overlay at the top */}
      <div className="absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-navy-default/20 to-transparent z-10"></div>
      
      {/* Spotlight effect */}
      {spotlight && <Spotlight 
        className="opacity-20" 
        fill={`bg-gradient-to-br from-turquoise-default via-blue-default to-purple-default`} 
        size={500}
      />}

      {/* Content header */}
      {(title || subtitle) && (
        <div className="absolute top-0 left-0 right-0 p-4 z-20">
          {title && <h3 className={cn("text-xl font-bold", accentColor)}>{title}</h3>}
          {subtitle && <p className="text-white/80 text-sm">{subtitle}</p>}
        </div>
      )}

      {/* Interaction prompt */}
      {interactionPrompt && interactive && (
        <motion.div 
          className="absolute bottom-4 right-4 bg-gold-default text-navy-default px-3 py-1.5 rounded-full 
                    text-sm font-medium shadow-md z-20 flex items-center gap-2"
          initial={{ opacity: 0, y: 20 }}
          animate={{ 
            opacity: isHovered ? 1 : 0.8, 
            y: isHovered ? 0 : 10,
            scale: isHovered ? 1.05 : 1
          }}
          transition={{ duration: 0.3 }}
        >
          {interactionPrompt}
          <motion.span 
            animate={{ 
              x: isHovered ? [0, 5, 0] : 0 
            }}
            transition={{ 
              repeat: isHovered ? Infinity : 0, 
              duration: 1, 
              ease: "easeInOut" 
            }}
          >
            →
          </motion.span>
        </motion.div>
      )}

      {/* Spline scene with loading state */}
      <Suspense 
        fallback={
          <div className="w-full h-full flex flex-col items-center justify-center bg-navy-lighter/10 p-8">
            <div className="w-10 h-10 border-4 border-gray-light rounded-full border-t-gold-default animate-spin mb-4"></div>
            <p className="text-navy-default text-sm">Loading interactive scene...</p>
          </div>
        }
      >
        <Spline
          scene={scene}
          className={className}
          onLoad={handleLoad}
          onError={handleError}
        />
      </Suspense>
    </div>
  );
}