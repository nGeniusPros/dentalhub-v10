import React, { useState, useEffect } from 'react';
import * as Icons from 'lucide-react';
import { Button } from '../../../../components/ui/button';
import { User, TwilioNumber, CalendarIntegration } from '../types/user';

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (user: Omit<User, 'id' | 'dateCreated'>) => void;
  editUser?: User; // If provided, we're editing an existing user
  twilioNumbers: TwilioNumber[];
}

const UserModal: React.FC<UserModalProps> = ({
  isOpen,
  onClose,
  onSave,
  editUser,
  twilioNumbers
}) => {
  const [formData, setFormData] = useState<Partial<User>>({
    fullName: '',
    email: '',
    role: 'Provider',
    enabled: true,
    calendarIntegration: {
      type: 'internal',
      connected: true
    }
  });

  // Reset form when the modal opens/closes or when editUser changes
  useEffect(() => {
    if (isOpen && editUser) {
      setFormData({ ...editUser });
    } else if (isOpen) {
      setFormData({
        fullName: '',
        email: '',
        role: 'Provider',
        enabled: true,
        calendarIntegration: {
          type: 'internal',
          connected: true
        }
      });
    }
  }, [isOpen, editUser]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target as HTMLInputElement;
    
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFormData({ ...formData, [name]: checked });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleCalendarChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const calendarType = e.target.value as CalendarIntegration['type'];
    
    setFormData({
      ...formData,
      calendarIntegration: {
        type: calendarType,
        connected: true,
        email: calendarType !== 'internal' ? formData.email : undefined
      }
    });
  };

  const handlePhoneNumberChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const phoneNumberId = e.target.value;
    if (phoneNumberId) {
      const selectedNumber = twilioNumbers.find(num => num.id === phoneNumberId);
      if (selectedNumber) {
        setFormData({ ...formData, phoneNumber: selectedNumber.phoneNumber });
      }
    } else {
      setFormData({ ...formData, phoneNumber: undefined });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Omit<User, 'id' | 'dateCreated'>);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-lg p-6 w-full max-w-xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold">
            {editUser ? 'Edit User' : 'Add New User'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <Icons.X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name
            </label>
            <input
              type="text"
              name="fullName"
              value={formData.fullName || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email || ''}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Role
            </label>
            <select
              name="role"
              value={formData.role || 'Provider'}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="Administrator">Administrator</option>
              <option value="Provider">Provider</option>
              <option value="Front Desk">Front Desk</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Status
            </label>
            <div className="flex items-center">
              <input
                type="checkbox"
                name="enabled"
                checked={formData.enabled || false}
                onChange={handleInputChange}
                className="rounded border-gray-300 text-primary focus:ring-primary"
              />
              <span className="ml-2 text-sm text-gray-600">Active</span>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number
            </label>
            <select
              onChange={handlePhoneNumberChange}
              defaultValue=""
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="">-- Select from Twilio numbers --</option>
              {twilioNumbers
                .filter(num => num.isActive && (!num.assignedTo || num.assignedTo === editUser?.id))
                .map(num => (
                  <option 
                    key={num.id} 
                    value={num.id}
                    selected={formData.phoneNumber === num.phoneNumber}
                  >
                    {num.displayName}: {num.phoneNumber}
                  </option>
                ))
              }
            </select>
            {formData.phoneNumber && (
              <p className="mt-1 text-sm text-gray-600">
                Selected: {formData.phoneNumber}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Calendar Integration
            </label>
            <select
              onChange={handleCalendarChange}
              value={formData.calendarIntegration?.type || 'internal'}
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            >
              <option value="internal">Internal Calendar</option>
              <option value="google">Google Calendar</option>
              <option value="microsoft">Microsoft Calendar</option>
            </select>
            
            {formData.calendarIntegration?.type !== 'internal' && (
              <div className="mt-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Calendar Email (if different)
                </label>
                <input
                  type="email"
                  name="calendarEmail"
                  value={formData.calendarIntegration?.email || formData.email || ''}
                  onChange={(e) => {
                    setFormData({
                      ...formData,
                      calendarIntegration: {
                        ...formData.calendarIntegration!,
                        email: e.target.value
                      }
                    });
                  }}
                  className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
                />
              </div>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Availability Hours (per week)
            </label>
            <input
              type="number"
              name="availabilityHours"
              value={formData.availabilityHours || 40}
              onChange={handleInputChange}
              min="0"
              max="168"
              className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary"
            />
          </div>

          <div className="flex justify-end space-x-3 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="bg-gradient-to-r from-navy via-purple to-turquoise text-white"
            >
              {editUser ? 'Update User' : 'Add User'}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default UserModal;