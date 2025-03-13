import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../../components/ui/button';
import { useSettings } from '../../../contexts/SettingsContext';
import { User, TwilioNumber } from './types/user';
import CalendarIntegrationSettings from './components/CalendarIntegrationSettings';
import PhoneSettings from './components/PhoneSettings';

const UserManagement: React.FC = () => {
  const { state, updateSettings } = useSettings();
  const [activeTab, setActiveTab] = useState('USERS');
  const [showAddUserModal, setShowAddUserModal] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [availableNumbers, setAvailableNumbers] = useState<TwilioNumber[]>([]);
  
  const [userForm, setUserForm] = useState<Partial<User>>({
    fullName: '',
    email: '',
    role: 'Provider',
    enabled: true,
    phoneNumber: '',
    calendarIntegration: {
      type: 'internal',
      connected: false
    }
  });

  // Get available phone numbers (not assigned to other users)
  useEffect(() => {
    const assignedNumbers = state.users
      .filter(user => user.phoneNumber)
      .map(user => user.phoneNumber);
    
    const availableNums = state.twilioNumbers
      .filter(num => num.isActive && !num.isDeleted && !assignedNumbers.includes(num.phoneNumber));
    
    setAvailableNumbers(availableNums);
  }, [state.users, state.twilioNumbers]);

  const generateUserId = () => {
    return `user-${Date.now()}`;
  };

  const handleAddUser = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newUser: User = {
      id: editingUser ? editingUser.id : generateUserId(),
      dateCreated: editingUser ? editingUser.dateCreated : new Date(),
      fullName: userForm.fullName || '',
      email: userForm.email || '',
      role: (userForm.role as User['role']) || 'Provider',
      enabled: userForm.enabled !== undefined ? userForm.enabled : true,
      phoneNumber: userForm.phoneNumber || undefined,
      calendarIntegration: userForm.calendarIntegration || {
        type: 'internal',
        connected: false
      }
    };

    if (editingUser) {
      updateSettings({
        type: 'UPDATE_USER',
        payload: newUser
      });

      // If a phone number was assigned or changed, update the phone number assignment
      if (newUser.phoneNumber) {
        const phoneNumber = state.twilioNumbers.find(num => num.phoneNumber === newUser.phoneNumber);
        if (phoneNumber) {
          updateSettings({
            type: 'UPDATE_TWILIO_NUMBER',
            payload: {
              ...phoneNumber,
              assignedTo: newUser.id
            }
          });
        }
      }
    } else {
      updateSettings({
        type: 'ADD_USER',
        payload: newUser
      });

      // If a phone number was assigned, update the phone number assignment
      if (newUser.phoneNumber) {
        const phoneNumber = state.twilioNumbers.find(num => num.phoneNumber === newUser.phoneNumber);
        if (phoneNumber) {
          updateSettings({
            type: 'UPDATE_TWILIO_NUMBER',
            payload: {
              ...phoneNumber,
              assignedTo: newUser.id
            }
          });
        }
      }
    }

    // Reset form and close modal
    setUserForm({
      fullName: '',
      email: '',
      role: 'Provider',
      enabled: true,
      phoneNumber: '',
      calendarIntegration: {
        type: 'internal',
        connected: false
      }
    });
    setShowAddUserModal(false);
    setEditingUser(null);
  };

  const handleEditUser = (user: User) => {
    setUserForm({
      fullName: user.fullName,
      email: user.email,
      role: user.role,
      enabled: user.enabled,
      phoneNumber: user.phoneNumber || '',
      calendarIntegration: { ...user.calendarIntegration }
    });
    setEditingUser(user);
    setShowAddUserModal(true);
  };

  const handleDeleteUser = (userId: string) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      updateSettings({
        type: 'DELETE_USER',
        payload: userId
      });
    }
  };

  const handleToggleUserStatus = (user: User) => {
    updateSettings({
      type: 'UPDATE_USER',
      payload: {
        ...user,
        enabled: !user.enabled
      }
    });
  };

  const getRoleIconClass = (role: User['role']) => {
    switch (role) {
      case 'Administrator':
        return 'text-blue-500';
      case 'Provider':
        return 'text-green-500';
      case 'Front Desk':
        return 'text-purple-500';
      default:
        return 'text-gray-500';
    }
  };

  const getRoleIcon = (role: User['role']) => {
    switch (role) {
      case 'Administrator':
        return <Icons.Shield className={`w-4 h-4 mr-2 ${getRoleIconClass(role)}`} />;
      case 'Provider':
        return <Icons.UserCheck className={`w-4 h-4 mr-2 ${getRoleIconClass(role)}`} />;
      case 'Front Desk':
        return <Icons.Headset className={`w-4 h-4 mr-2 ${getRoleIconClass(role)}`} />;
      default:
        return <Icons.User className="w-4 h-4 mr-2 text-gray-500" />;
    }
  };

  return (
    <div className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-semibold">Settings</h1>
        <Button onClick={() => setShowAddUserModal(true)}>
          <Icons.UserPlus className="w-4 h-4 mr-2" />
          Add User
        </Button>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mb-8">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8 px-4">
            <button
              onClick={() => setActiveTab('USERS')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'USERS'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icons.Users className="w-4 h-4 inline mr-2" />
              Users
            </button>
            <button
              onClick={() => setActiveTab('CALENDARS')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'CALENDARS'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icons.Calendar className="w-4 h-4 inline mr-2" />
              Calendar Settings
            </button>
            <button
              onClick={() => setActiveTab('PHONES')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'PHONES'
                  ? 'border-primary text-primary'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <Icons.Phone className="w-4 h-4 inline mr-2" />
              Phone Settings
            </button>
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'USERS' && (
            <div>
              <div className="mb-6">
                <h2 className="text-lg font-semibold mb-2">User Management</h2>
                <p className="text-gray-600">Manage your team members and their permissions</p>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        User
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Role
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Phone Number
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Calendar
                      </th>
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {state.users.map((user) => (
                      <tr key={user.id} className={!user.enabled ? 'bg-gray-50' : ''}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-navy via-purple to-turquoise text-white flex items-center justify-center">
                              {user.fullName.charAt(0)}
                            </div>
                            <div className="ml-4">
                              <div className={`text-sm font-medium ${user.enabled ? 'text-gray-900' : 'text-gray-500'}`}>
                                {user.fullName}
                              </div>
                              <div className="text-sm text-gray-500">{user.email}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {getRoleIcon(user.role)}
                            <span>{user.role}</span>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            user.enabled
                              ? 'bg-green-100 text-green-800'
                              : 'bg-gray-100 text-gray-800'
                          }`}>
                            {user.enabled ? 'Active' : 'Disabled'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.phoneNumber ? (
                            <div className="flex items-center">
                              <Icons.Phone className="w-4 h-4 mr-1 text-blue-500" />
                              <span>{user.phoneNumber}</span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Icons.X className="w-4 h-4 mr-1 text-gray-400" />
                              <span>No Phone Assigned</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.calendarIntegration.connected ? (
                            <div className="flex items-center">
                              <Icons.Check className="w-4 h-4 mr-1 text-green-500" />
                              <span>
                                {user.calendarIntegration.type === 'google'
                                  ? 'Google Calendar'
                                  : user.calendarIntegration.type === 'microsoft'
                                  ? 'Microsoft Outlook'
                                  : 'Internal Calendar'}
                              </span>
                            </div>
                          ) : (
                            <div className="flex items-center">
                              <Icons.X className="w-4 h-4 mr-1 text-gray-400" />
                              <span>Not Connected</span>
                            </div>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleEditUser(user)}
                            >
                              <Icons.Edit className="w-4 h-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleToggleUserStatus(user)}
                            >
                              {user.enabled ? (
                                <Icons.Lock className="w-4 h-4" />
                              ) : (
                                <Icons.Unlock className="w-4 h-4" />
                              )}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleDeleteUser(user.id)}
                            >
                              <Icons.Trash className="w-4 h-4 text-red-500" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'CALENDARS' && <CalendarIntegrationSettings />}
          {activeTab === 'PHONES' && <PhoneSettings />}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddUserModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-lg">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">
                {editingUser ? 'Edit User' : 'Add New User'}
              </h3>
              <button
                onClick={() => {
                  setShowAddUserModal(false);
                  setEditingUser(null);
                  setUserForm({
                    fullName: '',
                    email: '',
                    role: 'Provider',
                    enabled: true,
                    phoneNumber: '',
                    calendarIntegration: {
                      type: 'internal',
                      connected: false
                    }
                  });
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                <Icons.X className="w-5 h-5" />
              </button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Full Name
                </label>
                <input
                  type="text"
                  value={userForm.fullName || ''}
                  onChange={(e) => setUserForm({...userForm, fullName: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="Jane Doe"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  value={userForm.email || ''}
                  onChange={(e) => setUserForm({...userForm, email: e.target.value})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  placeholder="jane.doe@example.com"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Role
                </label>
                <select
                  value={userForm.role || 'Provider'}
                  onChange={(e) => setUserForm({...userForm, role: e.target.value as User['role']})}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
                  required
                >
                  <option value="Administrator">Administrator</option>
                  <option value="Provider">Provider</option>
                  <option value="Front Desk">Front Desk</option>
                </select>
              </div>
              <div className="mb-4">
               <label className="block text-sm font-medium text-gray-700 mb-1">
                 Phone Number
               </label>
               <select
                 value={userForm.phoneNumber || ''}
                 onChange={(e) => setUserForm({...userForm, phoneNumber: e.target.value})}
                 className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-primary focus:border-primary"
               >
                 <option value="">-- Select a phone number --</option>
                 {availableNumbers.map(number => (
                   <option key={number.phoneNumber} value={number.phoneNumber}>
                     {number.phoneNumber} - {number.friendlyName || 'No Label'}
                   </option>
                 ))}
                 {editingUser?.phoneNumber && !availableNumbers.find(n => n.phoneNumber === editingUser.phoneNumber) && (
                   <option value={editingUser.phoneNumber}>
                     {editingUser.phoneNumber} (Currently Assigned)
                   </option>
                 )}
               </select>
               <p className="text-xs text-gray-500 mt-1">
                 This phone number will be used for SMS and call campaigns
               </p>
             </div>

             <div className="mb-4">
               <div className="flex items-center">
                 <input
                   id="userEnabled"
                   type="checkbox"
                   checked={userForm.enabled}
                   onChange={(e) => setUserForm({...userForm, enabled: e.target.checked})}
                   className="rounded border-gray-300 text-primary focus:ring-primary h-4 w-4"
                 />
                 <label htmlFor="userEnabled" className="ml-2 text-sm text-gray-700">
                   User is active
                 </label>
               </div>
             </div>
              
              {editingUser && (
                <div className="mb-4 bg-gray-50 p-3 rounded-md">
                  <h4 className="text-sm font-medium text-gray-700 mb-2">Calendar Integration</h4>
                  <p className="text-xs text-gray-500 mb-2">
                    To manage calendar integration, use the Calendar Settings tab after creating the user.
                  </p>
                  <div className="flex items-center">
                    <div className={`w-3 h-3 rounded-full mr-2 ${editingUser.calendarIntegration.connected ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                    <span className="text-sm">
                      {editingUser.calendarIntegration.connected ? 'Connected' : 'Not Connected'} to {' '}
                      {editingUser.calendarIntegration.type === 'google'
                        ? 'Google Calendar'
                        : editingUser.calendarIntegration.type === 'microsoft'
                        ? 'Microsoft Outlook'
                        : 'Internal Calendar'}
                    </span>
                  </div>
                </div>
              )}
              
              <div className="mt-6 flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    setShowAddUserModal(false);
                    setEditingUser(null);
                    setUserForm({
                      fullName: '',
                      email: '',
                      role: 'Provider',
                      enabled: true,
                      phoneNumber: '',
                      calendarIntegration: {
                        type: 'internal',
                        connected: false
                      }
                    });
                  }}
                >
                  Cancel
                </Button>
                <Button type="submit">
                  {editingUser ? 'Update User' : 'Add User'}
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserManagement;