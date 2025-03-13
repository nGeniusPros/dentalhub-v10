import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useSettings } from '../../../../contexts/SettingsContext';
import { User, CalendarIntegrationType } from '../types/user';

interface CalendarConnectionModalProps {
  user: User;
  onClose: () => void;
  onSave: (userId: string, type: CalendarIntegrationType, email?: string) => void;
}

const CalendarConnectionModal: React.FC<CalendarConnectionModalProps> = ({
  user,
  onClose,
  onSave,
}) => {
  const [calendarType, setCalendarType] = useState<CalendarIntegrationType>(
    user.calendarIntegration.type
  );
  const [email, setEmail] = useState(user.calendarIntegration.email || '');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(user.id, calendarType, email);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Connect Calendar</h3>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <p className="mb-2 text-sm text-gray-600">
              Configure calendar integration for <strong>{user.fullName}</strong>
            </p>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calendar Type
            </label>
            <select
              value={calendarType}
              onChange={(e) => setCalendarType(e.target.value as CalendarIntegrationType)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
            >
              <option value="internal">Internal Calendar</option>
              <option value="google">Google Calendar</option>
              <option value="microsoft">Microsoft Outlook</option>
            </select>
          </div>

          {calendarType !== 'internal' && (
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                placeholder="calendar-email@example.com"
                required
              />
              <p className="mt-1 text-xs text-gray-500">
                This should be the email associated with the {calendarType === 'google' ? 'Google' : 'Microsoft'} account
              </p>
            </div>
          )}

          <div className="mt-6 flex justify-end gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button type="submit">
              Connect Calendar
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

const CalendarIntegrationSettings: React.FC = () => {
  const { state, updateSettings } = useSettings();
  const [connectingUser, setConnectingUser] = useState<User | null>(null);
  const [syncSettings, setSyncSettings] = useState({
    provider: 'internal' as CalendarIntegrationType,
    enabled: true,
    defaultDuration: 60, // in minutes
    bufferTime: 15, // in minutes
  });

  const handleConnectCalendar = (userId: string, type: CalendarIntegrationType, email?: string) => {
    const userToUpdate = state.users.find(user => user.id === userId);
    if (userToUpdate) {
      const updatedUser: User = {
        ...userToUpdate,
        calendarIntegration: {
          ...userToUpdate.calendarIntegration,
          type,
          connected: true,
          email
        },
      };
      updateSettings({
        type: 'UPDATE_USER',
        payload: updatedUser,
      });
    }
  };

  const handleDisconnectCalendar = (userId: string) => {
    if (window.confirm('Are you sure you want to disconnect this calendar?')) {
      const userToUpdate = state.users.find(user => user.id === userId);
      if (userToUpdate) {
        updateSettings({
          type: 'UPDATE_USER',
          payload: {
            ...userToUpdate,
            calendarIntegration: {
              type: 'internal',
              connected: false,
            },
          },
        });
      }
    }
  };

  const handleSyncSettings = () => {
    updateSettings({
      type: 'UPDATE_CALENDAR_SETTINGS',
      payload: syncSettings,
    });
  };

  const getCalendarTypeDisplay = (type: CalendarIntegrationType) => {
    switch (type) {
      case 'google':
        return 'Google Calendar';
      case 'microsoft':
        return 'Microsoft Outlook';
      default:
        return 'Internal Calendar';
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Calendar Integrations</h2>
            <p className="text-gray-600">Manage calendar connections for your users</p>
          </div>
          <Button variant="outline" size="sm" onClick={handleSyncSettings}>
            <Icons.RefreshCw className="w-4 h-4 mr-2" />
            Sync All Calendars
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Calendar Type</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Synced</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {state.users.map((user) => (
                <tr key={user.id} className="hover:bg-gray-50">
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-navy via-purple to-turquoise text-white flex items-center justify-center mr-3">
                        {user.fullName.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{user.fullName}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center">
                      {user.calendarIntegration.type === 'google' && (
                        <Icons.Calendar className="w-4 h-4 mr-2 text-red-500" />
                      )}
                      {user.calendarIntegration.type === 'microsoft' && (
                        <Icons.Calendar className="w-4 h-4 mr-2 text-blue-500" />
                      )}
                      {user.calendarIntegration.type === 'internal' && (
                        <Icons.Calendar className="w-4 h-4 mr-2 text-gray-500" />
                      )}
                      <span>{getCalendarTypeDisplay(user.calendarIntegration.type)}</span>
                    </div>
                    {user.calendarIntegration.email && (
                      <div className="text-xs text-gray-500 mt-1">
                        {user.calendarIntegration.email}
                      </div>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      user.calendarIntegration.connected
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800'
                    }`}>
                      {user.calendarIntegration.connected ? 'Connected' : 'Not Connected'}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-sm text-gray-500">
                    {user.calendarIntegration.connected ? 'Last sync info unavailable' : 'Never synced'}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <div className="flex justify-end space-x-2">
                      {user.calendarIntegration.connected ? (
                        <>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => setConnectingUser(user)}
                          >
                            <Icons.Settings className="w-4 h-4 mr-1" />
                            Configure
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleDisconnectCalendar(user.id)}
                          >
                            <Icons.Unlink className="w-4 h-4 mr-1" />
                            Disconnect
                          </Button>
                        </>
                      ) : (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setConnectingUser(user)}
                        >
                          <Icons.Link className="w-4 h-4 mr-1" />
                          Connect
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 p-6">
        <h3 className="text-lg font-medium mb-4">Sync Settings</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="flex items-center mb-4">
              <input
                id="enabled"
                type="checkbox"
                checked={syncSettings.enabled}
                onChange={(e) => setSyncSettings({...syncSettings, enabled: e.target.checked})}
                className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
              />
              <label htmlFor="enabled" className="ml-2 text-sm text-gray-700">
                Enable automatic calendar synchronization
              </label>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Buffer Time (minutes)
              </label>
              <select
                value={syncSettings.bufferTime}
                onChange={(e) => setSyncSettings({...syncSettings, bufferTime: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="5">5 minutes</option>
                <option value="15">15 minutes</option>
                <option value="30">30 minutes</option>
                <option value="60">60 minutes</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-1">
                Default Appointment Duration (minutes)
              </label>
              <select
                value={syncSettings.defaultDuration}
                onChange={(e) => setSyncSettings({...syncSettings, defaultDuration: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
              >
                <option value="30">30 minutes</option>
                <option value="45">45 minutes</option>
                <option value="60">60 minutes</option>
                <option value="90">90 minutes</option>
                <option value="120">120 minutes</option>
              </select>
            </div>
          </div>
        
        <div className="bg-gray-50 rounded-lg p-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Calendar Integration Help</h4>
          <p className="text-sm text-gray-600 mb-3">
            To connect external calendars, users will need to authorize access to their calendar:
          </p>
          <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
            <li>For Google Calendar, users will need to grant access to their Google account</li>
            <li>For Microsoft Outlook, users will need to authenticate with their Microsoft account</li>
            <li>Users can disconnect their calendar at any time</li>
            <li>The internal calendar does not require any external authentication</li>
          </ul>
          <div className="mt-4">
            <Button 
              variant="outline" 
              size="sm" 
              className="w-full"
              onClick={() => {
                // In a real app, this would open documentation
                console.log('Opening calendar integration documentation');
              }}
            >
              <Icons.FileText className="w-4 h-4 mr-2" />
              View Integration Documentation
            </Button>
          </div>
        </div>
        
        <div className="mt-6 flex justify-end">
          <Button onClick={handleSyncSettings}>
            Save Sync Settings
          </Button>
        </div>
      </div>

      {connectingUser && (
        <CalendarConnectionModal
          user={connectingUser as User}
          onClose={() => setConnectingUser(null)}
          onSave={handleConnectCalendar}
        />
      )}
    </div>
  );
};

export default CalendarIntegrationSettings;
