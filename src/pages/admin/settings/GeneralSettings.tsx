import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../../../components/ui/button';
import { useSettings } from '../../../contexts/SettingsContext';
import { SecuritySettings } from './components/SecuritySettings';
import { IntegrationsSettings } from './components/IntegrationsSettings';
import { UserPermissions } from './components/UserPermissions';
import { FeatureSettings } from './components/FeatureSettings';
import { TargetAudienceSettings } from './components/TargetAudienceSettings';
import { BrandingSettings } from './components/BrandingSettings';
import { BackOfficePermissions } from './components/BackOfficePermissions';
import { PatientPermissions } from './components/PatientPermissions';
import { NotificationToggle } from './components/NotificationToggle';

const GeneralSettings = () => {
  const { state, updateSettings } = useSettings();
  console.log('Settings:', state);
  console.log('Settings General:', state?.general);

  // Add a defensive check for state
  if (!state || !state.general) {
    return <div className="p-4">Loading settings...</div>;
  }

  const handleGeneralSettingsUpdate = (updates: Partial<typeof state.general>) => {
    updateSettings({
      type: 'UPDATE_GENERAL_SETTINGS',
      payload: updates
    });
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold bg-gradient-to-r from-navy via-purple to-turquoise text-transparent bg-clip-text">
            General Settings
          </h1>
          <p className="text-gray-600">Configure your practice settings and preferences</p>
        </div>
        <Button className="bg-gradient-to-r from-navy via-purple to-turquoise text-white">
          Save Changes
        </Button>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Practice Information</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Practice Name
            </label>
            <input
              type="text"
              value={state.general?.practiceName}
              onChange={(e) => handleGeneralSettingsUpdate({ practiceName: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Address
            </label>
            <input
              type="text"
              value={state.general?.address}
              onChange={(e) => handleGeneralSettingsUpdate({ address: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone
            </label>
            <input
              type="text"
              value={state.general?.phone}
              onChange={(e) => handleGeneralSettingsUpdate({ phone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={state.general?.email}
              onChange={(e) => handleGeneralSettingsUpdate({ email: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>
        </div>
      </motion.div>

      <BrandingSettings />

      <TargetAudienceSettings />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Notifications</h2>
        <div className="space-y-4">
          <NotificationToggle
            type="email"
            title="Email Notifications"
            description="Send email notifications to patients"
          />
          <NotificationToggle
            type="sms"
            title="SMS Notifications"
            description="Send SMS notifications to patients"
          />
          <NotificationToggle
            type="appointments"
            title="Appointment Reminders"
            description="Send appointment reminders"
          />
          <NotificationToggle
            type="marketing"
            title="Marketing Emails"
            description="Send marketing and promotional emails"
          />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white rounded-xl shadow-lg border border-gray-200 p-6"
      >
        <h2 className="text-lg font-semibold mb-4">Regional Settings</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Timezone
            </label>
            <select
              value={state.general?.timezone}
              onChange={(e) => handleGeneralSettingsUpdate({ timezone: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="America/Los_Angeles">Pacific Time (US & Canada)</option>
              <option value="America/Denver">Mountain Time (US & Canada)</option>
              <option value="America/Chicago">Central Time (US & Canada)</option>
              <option value="America/New_York">Eastern Time (US & Canada)</option>
              <option value="America/Phoenix">Arizona</option>
              <option value="America/Anchorage">Alaska</option>
              <option value="Pacific/Honolulu">Hawaii</option>
              <option value="Europe/London">London</option>
              <option value="Europe/Paris">Paris</option>
              <option value="Asia/Tokyo">Tokyo</option>
              <option value="Australia/Sydney">Sydney</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date Format
            </label>
            <select
              value={state.general?.dateFormat}
              onChange={(e) => handleGeneralSettingsUpdate({ dateFormat: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="MM/DD/YYYY">MM/DD/YYYY (US)</option>
              <option value="DD/MM/YYYY">DD/MM/YYYY (European)</option>
              <option value="YYYY-MM-DD">YYYY-MM-DD (ISO)</option>
              <option value="MMM DD, YYYY">MMM DD, YYYY (Written)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Currency
            </label>
            <select
              value={state.general?.currency}
              onChange={(e) => handleGeneralSettingsUpdate({ currency: e.target.value })}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="CAD">CAD ($)</option>
              <option value="AUD">AUD ($)</option>
              <option value="JPY">JPY (¥)</option>
              <option value="CNY">CNY (¥)</option>
              <option value="INR">INR (₹)</option>
              <option value="MXN">MXN ($)</option>
            </select>
          </div>
        </div>
      </motion.div>

      <SecuritySettings />

      <IntegrationsSettings />

      <UserPermissions />
      
      <BackOfficePermissions />
      
      <PatientPermissions />
      <FeatureSettings />

    </div>
  );
};

export default GeneralSettings;
