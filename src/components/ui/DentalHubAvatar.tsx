import React, { useMemo, useState } from 'react';
import { cn } from '../../lib/utils';

type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';
type AvatarTheme = 'simple' | 'gradient' | 'blue' | 'navy' | 'gold' | 'turquoise' | 'purple' | 'green';
type AvatarStatus = 'online' | 'offline' | 'away' | 'busy' | 'none';

interface DentalHubAvatarProps {
  userId?: string | number;
  name?: string;
  avatarId?: number;
  index?: number;
  src?: string;
  alt?: string;
  size?: AvatarSize;
  theme?: AvatarTheme;
  status?: AvatarStatus;
  fallback?: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

/**
 * DentalHubAvatar Component
 * 
 * A customizable avatar component that uses the custom avatar set from public/avatars/avatar style 2/
 * Can use a specified avatar index, ID or generate one from user ID or name
 */
export const DentalHubAvatar: React.FC<DentalHubAvatarProps> = ({
  userId,
  name,
  avatarId,
  index,
  src,
  alt,
  size = 'md',
  theme = 'gradient',
  status = 'none',
  fallback,
  className,
  onClick
}) => {
  const [imageError, setImageError] = useState(false);
  
  const sizeMap: Record<AvatarSize, string> = {
    xs: 'w-6 h-6',
    sm: 'w-8 h-8',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };
  
  const statusSizeMap: Record<AvatarSize, string> = {
    xs: 'w-1.5 h-1.5',
    sm: 'w-2 h-2',
    md: 'w-2.5 h-2.5',
    lg: 'w-3 h-3',
    xl: 'w-4 h-4'
  };
  
  const statusColorMap: Record<AvatarStatus, string> = {
    online: 'bg-green-default',
    offline: 'bg-gray-darker',
    away: 'bg-gold-default',
    busy: 'bg-red-500',
    none: ''
  };

  const themeStyles: Record<AvatarTheme, string> = {
    gradient: 'bg-gradient-to-br from-navy-default to-blue-default text-white',
    blue: 'bg-blue-default text-white',
    navy: 'bg-navy-default text-white',
    gold: 'bg-gold-default text-navy-default',
    turquoise: 'bg-turquoise-default text-navy-default',
    purple: 'bg-purple-default text-white',
    green: 'bg-green-default text-white',
    simple: ''
  };

  const determinedAvatarId = useMemo(() => {
    // If index is provided, use it directly (1-15 range)
    if (index !== undefined) {
      return ((index % 15) || 15);
    }
    
    if (avatarId !== undefined) return avatarId;
    
    // Use hashCode function to generate a number from name or userId
    const hashCode = (str: string): number => {
      let hash = 0;
      for (let i = 0; i < str.length; i++) {
        const char = str.charCodeAt(i);
        hash = ((hash << 5) - hash) + char;
        hash = hash & hash; // Convert to 32bit integer
      }
      return Math.abs(hash);
    };

    if (name) return (hashCode(name) % 15) + 1;
    if (userId) return (hashCode(userId.toString()) % 15) + 1;
    
    // Default to avatar 1 if no identifier is provided
    return 1;
  }, [index, avatarId, name, userId]);

  // Generate initials from name as a fallback
  const getInitials = (): string => {
    if (!name) return '?';
    
    const nameParts = name.split(' ');
    if (nameParts.length === 1) {
      return nameParts[0].charAt(0).toUpperCase();
    }
    
    return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase();
  };

  return (
    <div className="relative inline-block">
      <div 
        className={cn(
          'rounded-full flex-shrink-0 overflow-hidden', 
          sizeMap[size],
          themeStyles[theme],
          onClick ? 'cursor-pointer hover:opacity-90 transition-opacity' : '',
          className
        )}
        onClick={onClick}
      >
        {src && !imageError ? (
          <img 
            src={src}
            alt={alt || name || 'User avatar'}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              setImageError(true);
              console.warn(`Failed to load avatar image: ${src}`);
            }}
          />
        ) : !imageError && (
          <img 
            src={`/avatars/avatar style 2/avatar-${determinedAvatarId}.png`}
            alt={alt || name || 'User avatar'}
            className="w-full h-full object-cover rounded-full"
            onError={(e) => {
              setImageError(true);
              console.warn(`Failed to load default avatar: /avatars/avatar style 2/avatar-${determinedAvatarId}.png`);
            }}
          />
        )}
        
        {(imageError || fallback) && (
          <div className="absolute inset-0 flex items-center justify-center rounded-full">
            {fallback || <span className="font-medium text-center">{getInitials()}</span>}
          </div>
        )}
      </div>
      
      {status !== 'none' && (
        <div className={cn(
          'absolute bottom-0 right-0 rounded-full border-2 border-white',
          statusSizeMap[size],
          statusColorMap[status]
        )} />
      )}
    </div>
  );
};
