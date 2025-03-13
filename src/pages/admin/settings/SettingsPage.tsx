import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { SettingsProvider } from '../../../contexts/SettingsContext';
import UserManagement from './UserManagement';

// Tab type definition
type SettingsTab = {
  id: string;
  label: string;
  icon: React.ReactNode;
  component: React.ReactNode;
};

const SettingsPage: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('users');

  // Define the tabs for the settings page
  const tabs: SettingsTab[] = [
    {
      id: 'users',
      label: 'User Management',
      icon: <Icons.Users className="w-5 h-5" />,
      component: <UserManagement />,
    },
    {
      id: 'phone',
      label: 'Phone Settings',
      icon: <Icons.Phone className="w-5 h-5" />,
      component: <div className="p-6 text-center text-gray-500">Phone settings will be implemented in future updates</div>,
    },
    {
      id: 'calendar',
      label: 'Calendar Integration',
      icon: <Icons.Calendar className="w-5 h-5" />,
      component: <div className="p-6 text-center text-gray-500">Calendar integration settings will be implemented in future updates</div>,
    },
    {
      id: 'notifications',
      label: 'Notifications',
      icon: <Icons.Bell className="w-5 h-5" />,
      component: <div className="p-6 text-center text-gray-500">Notification settings will be implemented in future updates</div>,
    },
    {
      id: 'security',
      label: 'Security',
      icon: <Icons.Shield className="w-5 h-5" />,
      component: <div className="p-6 text-center text-gray-500">Security settings will be implemented in future updates</div>,
    },
  ];

  // Find the active tab
  const currentTab = tabs.find(tab => tab.id === activeTab) || tabs[0];

  return (
    <SettingsProvider>
      <div className="container mx-auto p-6">
        <div className="flex items-center mb-8">
          <Icons.Settings className="w-6 h-6 text-primary mr-2" />
          <h1 className="text-2xl font-semibold">Settings</h1>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          {/* Sidebar */}
          <div className="w-full md:w-64 shrink-0 mb-6 md:mb-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <ul>
                {tabs.map((tab) => (
                  <li key={tab.id}>
                    <button
                      className={`w-full px-4 py-3 flex items-center gap-3 transition ${
                        tab.id === activeTab
                          ? 'bg-gradient-to-r from-navy via-purple to-turquoise text-white'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                      onClick={() => setActiveTab(tab.id)}
                    >
                      {tab.icon}
                      <span>{tab.label}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1">
            {currentTab.component}
          </div>
        </div>
      </div>
    </SettingsProvider>
  );
};

export default SettingsPage;
      </div>
    </SettingsProvider>
  );
};

export default SettingsPage;