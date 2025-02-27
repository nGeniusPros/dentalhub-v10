import React from 'react';
import * as LucideIcons from 'lucide-react';
import * as DentalIcons from '../../lib/dental-icons';

// Icon strategy component to ensure consistent icon usage across the app
export interface IconProps {
  name: string;
  size?: number | string;
  color?: string;
  className?: string;
  strokeWidth?: number;
}

export const Icon: React.FC<IconProps> = ({ 
  name, 
  size = 24, 
  color, 
  className = '', 
  strokeWidth = 2 
}) => {
  // Handle Lucide icons
  const LucideIcon = (LucideIcons as any)[name];
  
  if (LucideIcon) {
    return (
      <LucideIcon 
        size={size} 
        color={color} 
        className={className} 
        strokeWidth={strokeWidth}
      />
    );
  }
  
  // Handle dental icons
  const DentalIcon = (DentalIcons as any)[name];
  
  if (DentalIcon) {
    return (
      <DentalIcon 
        size={size} 
        color={color} 
        className={className} 
        strokeWidth={strokeWidth}
      />
    );
  }
  
  // Handle SVG icons from public directory
  const svgIcons: Record<string, string> = {
    // Custom SVG icons
    'trending': '/svg/trending.svg',
    'user-custom': '/svg/user.svg',
    'user-info': '/svg/user-info.svg',
    'edit-custom': '/svg/edit.svg',
    'check-circle-custom': '/svg/check-circle.svg',
    'google-docs': '/svg/google-docs.svg',
  };
  
  if (svgIcons[name]) {
    return (
      <img 
        src={svgIcons[name]} 
        alt={`${name} icon`} 
        style={{ 
          width: typeof size === 'number' ? `${size}px` : size,
          height: typeof size === 'number' ? `${size}px` : size
        }} 
        className={className}
      />
    );
  }
  
  // Fallback icon if the specified icon isn't found
  return (
    <LucideIcons.HelpCircle 
      size={size} 
      color={color} 
      className={`${className} text-gray-400`} 
      strokeWidth={strokeWidth}
    />
  );
};

// Icon category objects for better organization and discoverability
export const NavigationIcons = {
  Dashboard: 'LayoutDashboard',
  Brain: 'Brain',
  FileCheck: 'FileCheck',
  Users: 'Users',
  Calendar: 'Calendar',
};

export const ChartIcons = {
  BarChart: 'BarChart',
  Trending: 'trending',
  PieChart: 'PieChart',
  LineChart: 'LineChart',
  TrendingUp: 'TrendingUp',
  TrendingDown: 'TrendingDown',
};

export const UserIcons = {
  User: 'User',
  CustomUser: 'user-custom',
  UserInfo: 'user-info',
  UserPlus: 'UserPlus',
  UserMinus: 'UserMinus',
  Users: 'Users',
};

export const SettingsIcons = {
  Settings: 'Settings',
  Edit: 'edit-custom',
  Sliders: 'Sliders',
  Tool: 'Tool',
  Wrench: 'Wrench',
};

export const NotificationIcons = {
  Bell: 'Bell',
  CheckCircle: 'check-circle-custom',
  AlertCircle: 'AlertCircle',
  AlertTriangle: 'AlertTriangle',
  Info: 'Info',
};

export const DocumentIcons = {
  File: 'File',
  FileText: 'FileText',
  GoogleDocs: 'google-docs',
  FilePlus: 'FilePlus',
  FileCheck: 'FileCheck',
  Clipboard: 'Clipboard',
};

export const ActionIcons = {
  Plus: 'Plus',
  Minus: 'Minus',
  X: 'X',
  Check: 'Check',
  Search: 'Search',
  Filter: 'Filter',
  ArrowUp: 'ArrowUp',
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
};

export const FinanceIcons = {
  DollarSign: 'DollarSign',
  Briefcase: 'Briefcase',
  CreditCard: 'CreditCard',
  Receipt: 'Receipt',
  Wallet: 'Wallet',
};

// Export all icon categories for convenient import
export const Icons = {
  ...NavigationIcons,
  ...ChartIcons,
  ...UserIcons,
  ...SettingsIcons,
  ...NotificationIcons,
  ...DocumentIcons,
  ...ActionIcons,
  ...FinanceIcons,
};

export default Icon;
