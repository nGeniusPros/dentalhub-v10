import React, { useState } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { useSettings } from '../../../../contexts/SettingsContext';
import { TwilioNumber } from '../types/user';

const PhoneSettings: React.FC = () => {
  const { state, updateSettings } = useSettings();
  const [twilioApiKey] = useState("********************************");
  const [isAddNumberModalOpen, setIsAddNumberModalOpen] = useState(false);
  const [newPhoneForm, setNewPhoneForm] = useState({
    phoneNumber: '',
    friendlyName: '',
    isActive: true,
    capabilities: {
      sms: true,
      voice: true,
      mms: true
    }
  });

  const handleAddNumber = () => {
    const newNumber: TwilioNumber = {
      id: `number-${Date.now()}`,
      phoneNumber: newPhoneForm.phoneNumber,
      friendlyName: newPhoneForm.friendlyName || undefined,
      isActive: newPhoneForm.isActive,
      capabilities: {
        sms: newPhoneForm.capabilities.sms,
        voice: newPhoneForm.capabilities.voice,
        mms: newPhoneForm.capabilities.mms
      }
    };

    updateSettings({
      type: 'UPDATE_TWILIO_NUMBER',
      payload: newNumber
    });

    // Reset form and close modal
    setNewPhoneForm({
      phoneNumber: '',
      friendlyName: '',
      isActive: true,
      capabilities: {
        sms: true,
        voice: true,
        mms: true
      }
    });
    setIsAddNumberModalOpen(false);
  };

  const handleToggleNumberStatus = (numberId: string) => {
    const numberToUpdate = state.twilioNumbers.find(num => num.id === numberId);
    if (numberToUpdate) {
      updateSettings({
        type: 'UPDATE_TWILIO_NUMBER',
        payload: { ...numberToUpdate, isActive: !numberToUpdate.isActive }
      });
    }
  };

  const handleAssignNumber = (numberId: string, userId?: string) => {
    const numberToUpdate = state.twilioNumbers.find(num => num.id === numberId);
    if (numberToUpdate) {
      updateSettings({
        type: 'UPDATE_TWILIO_NUMBER',
        payload: { ...numberToUpdate, assignedTo: userId }
      });
    }
  };

  const handleDeleteNumber = (numberId: string) => {
    if (window.confirm('Are you sure you want to delete this phone number?')) {
      const numberToDelete = state.twilioNumbers.find(num => num.id === numberId);
      if (numberToDelete) {
        // We'll remove the number by updating it with isActive: false
        // In a real app, you might want to completely remove it from the array
        updateSettings({
          type: 'UPDATE_TWILIO_NUMBER',
          payload: { ...numberToDelete, isActive: false, isDeleted: true }
        });
      }
    }
  };

  return (
    <div className="space-y-8">
      <div>
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-lg font-semibold">Twilio Integration</h2>
            <p className="text-gray-600">Manage your Twilio account and phone numbers</p>
          </div>
          <div className="flex space-x-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('Syncing numbers with Twilio');
                // In a real implementation, this would call an API endpoint
              }}
            >
              <Icons.RefreshCw className="w-4 h-4 mr-2" />
              Sync Numbers
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => {
                console.log('Opening advanced settings');
                // In a real implementation, this would open a modal or navigate to settings page
              }}
            >
              <Icons.Settings className="w-4 h-4 mr-2" />
              Advanced Settings
            </Button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-md font-medium mb-3">Twilio API Configuration</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twilio Account SID
              </label>
              <div className="flex">
                <input
                  type="password"
                  readOnly
                  value="********************************"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button 
                  className="ml-2 text-gray-600 hover:text-primary"
                  onClick={() => {
                    navigator.clipboard.writeText("********************************");
                  }}
                >
                  <Icons.Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Twilio Auth Token
              </label>
              <div className="flex">
                <input
                  type="password"
                  readOnly
                  value={twilioApiKey}
                  className="flex-grow px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                />
                <button 
                  type="button"
                  className="ml-2 text-gray-600 hover:text-primary"
                  onClick={() => {
                    navigator.clipboard.writeText(twilioApiKey);
                  }}
                >
                  <Icons.Copy className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h3 className="text-md font-medium">Phone Numbers</h3>
          <Button size="sm" onClick={() => setIsAddNumberModalOpen(true)}>
            <Icons.Plus className="w-4 h-4 mr-2" />
            Add Phone Number
          </Button>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200">
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Phone Number</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Capabilities</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Assigned To</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {state.twilioNumbers
                .filter(num => !num.isDeleted)
                .map((number) => {
                  const assignedUser = number.assignedTo 
                    ? state.users.find(u => u.id === number.assignedTo)
                    : undefined;
                    
                  return (
                    <tr key={number.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium">{number.phoneNumber}</div>
                        {number.friendlyName && (
                          <div className="text-sm text-gray-500">{number.friendlyName}</div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex space-x-2">
                          {number.capabilities.sms && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              SMS
                            </span>
                          )}
                          {number.capabilities.voice && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              Voice
                            </span>
                          )}
                          {number.capabilities.mms && (
                            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                              MMS
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-4 py-3">
                        <select
                          value={number.assignedTo || ''}
                          onChange={(e) => handleAssignNumber(number.id, e.target.value || undefined)}
                          className="block w-full pl-3 pr-10 py-1 text-base border-gray-300 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm rounded-md"
                        >
                          <option value="">Not Assigned</option>
                          {state.users
                            .filter(user => user.enabled)
                            .map(user => (
                              <option key={user.id} value={user.id}>
                                {user.fullName}
                              </option>
                            ))
                          }
                        </select>
                        {assignedUser && (
                          <div className="text-xs text-gray-500 mt-1">
                            {assignedUser.email}
                          </div>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center">
                          <button 
                            type="button"
                            className={`relative inline-flex items-center h-6 rounded-full w-11 ${
                              number.isActive ? 'bg-primary' : 'bg-gray-300'
                            }`}
                            onClick={() => handleToggleNumberStatus(number.id)}
                          >
                            <span 
                              className={`absolute h-4 w-4 mx-1 rounded-full bg-white transition-transform ${
                                number.isActive ? 'transform translate-x-5' : 'transform translate-x-0'
                              }`} 
                            />
                          </button>
                          <span className="ml-2 text-sm text-gray-600">
                            {number.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button 
                          className="text-gray-600 hover:text-red-600"
                          onClick={() => handleDeleteNumber(number.id)}
                        >
                          <Icons.Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Phone Number Modal */}
      {isAddNumberModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Add Phone Number</h3>
              <button
                onClick={() => setIsAddNumberModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleAddNumber();
            }}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  type="text"
                  value={newPhoneForm.phoneNumber}
                  onChange={(e) => setNewPhoneForm({...newPhoneForm, phoneNumber: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="+1 (555) 123-4567"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Friendly Name (Optional)
                </label>
                <input
                  type="text"
                  value={newPhoneForm.friendlyName}
                  onChange={(e) => setNewPhoneForm({...newPhoneForm, friendlyName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Main Office Line"
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Capabilities
                </label>
                <div className="space-y-2">
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cap-sms"
                      checked={newPhoneForm.capabilities.sms}
                      onChange={(e) => setNewPhoneForm({
                        ...newPhoneForm, 
                        capabilities: {
                          ...newPhoneForm.capabilities,
                          sms: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor="cap-sms" className="ml-2 text-sm text-gray-700">
                      SMS
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cap-voice"
                      checked={newPhoneForm.capabilities.voice}
                      onChange={(e) => setNewPhoneForm({
                        ...newPhoneForm, 
                        capabilities: {
                          ...newPhoneForm.capabilities,
                          voice: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor="cap-voice" className="ml-2 text-sm text-gray-700">
                      Voice
                    </label>
                  </div>
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="cap-mms"
                      checked={newPhoneForm.capabilities.mms}
                      onChange={(e) => setNewPhoneForm({
                        ...newPhoneForm, 
                        capabilities: {
                          ...newPhoneForm.capabilities,
                          mms: e.target.checked
                        }
                      })}
                      className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                    />
                    <label htmlFor="cap-mms" className="ml-2 text-sm text-gray-700">
                      MMS
                    </label>
                  </div>
                </div>
              </div>
              <div className="mb-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="isActive"
                    checked={newPhoneForm.isActive}
                    onChange={(e) => setNewPhoneForm({...newPhoneForm, isActive: e.target.checked})}
                    className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                  />
                  <label htmlFor="isActive" className="ml-2 text-sm text-gray-700">
                    Number is active
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-3 mt-6">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsAddNumberModalOpen(false)}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  Add Number
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PhoneSettings;