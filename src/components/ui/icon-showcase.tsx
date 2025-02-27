import React from 'react';
import { Icon, NavigationIcons, ChartIcons, UserIcons, SettingsIcons, NotificationIcons, DocumentIcons } from './icon-strategy';

const IconShowcase: React.FC = () => {
  // Helper function to render icon categories
  const renderIconCategory = (title: string, icons: Record<string, string>) => {
    return (
      <div className="mb-8">
        <h3 className="text-lg font-semibold text-navy-default mb-3">{title}</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
          {Object.entries(icons).map(([key, value]) => (
            <div 
              key={key} 
              className="flex flex-col items-center bg-white p-4 rounded-lg shadow-sm border border-gray-lighter hover:shadow-md transition-shadow"
            >
              <Icon name={value} size={24} className="text-navy-default mb-2" />
              <span className="text-xs text-gray-darker text-center">{key}</span>
              <span className="text-xs text-gray-dark mt-1 font-mono">{value}</span>
            </div>
          ))}
        </div>
      </div>
    );
  };

  return (
    <div className="p-6 bg-gray-smoke">
      <h2 className="text-2xl font-bold text-navy-default mb-6">Icon Usage Strategy</h2>
      <p className="text-gray-darker mb-8">
        Consistent icon usage across the application using Lucide React icons and custom SVG icons
      </p>

      {renderIconCategory('Navigation Icons', NavigationIcons)}
      {renderIconCategory('Chart & Analytics Icons', ChartIcons)}
      {renderIconCategory('User Management Icons', UserIcons)}
      {renderIconCategory('Settings & Configuration Icons', SettingsIcons)}
      {renderIconCategory('Notification Icons', NotificationIcons)}
      {renderIconCategory('Document Handling Icons', DocumentIcons)}
      
      <div className="mt-8 p-4 bg-navy-lighter rounded-lg text-white">
        <h3 className="font-semibold mb-2">How to Use Icons:</h3>
        <pre className="bg-navy-default p-3 rounded text-sm overflow-x-auto">
          {`
// Import the Icon component and optionally icon categories
import { Icon, NavigationIcons } from '../components/ui/icon-strategy';

// Use in your components
<Icon name="LayoutDashboard" size={24} className="text-navy-default" />

// Or use with categories for better organization
<Icon name={NavigationIcons.Dashboard} size={24} className="text-navy-default" />
          `.trim()}
        </pre>
      </div>
    </div>
  );
};

export default IconShowcase;
