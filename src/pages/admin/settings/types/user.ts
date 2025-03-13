import type { Settings } from '../../../../types/settings';

export interface User {
  id: string;
  dateCreated: Date;
  fullName: string;
  email: string;
  role: 'Administrator' | 'Provider' | 'Front Desk';
  enabled: boolean;
  availabilityHours?: number;
  calendarIntegration: {
    type: CalendarIntegrationType;
    connected: boolean;
    accessToken?: string;
    refreshToken?: string;
    expiresAt?: Date;
    email?: string;
  };
  phoneNumber?: string;
}

export type CalendarIntegrationType = 'internal' | 'google' | 'microsoft';

export interface TwilioNumber {
  id: string;
  phoneNumber: string;
  friendlyName?: string;
  isActive: boolean;
  isDeleted?: boolean;
  assignedTo?: string;
  capabilities: {
    sms: boolean;
    voice: boolean;
    mms: boolean;
  };
}

export interface SettingsState {
  users: User[];
  twilioNumbers: TwilioNumber[];
  calendarSettings: {
    provider: CalendarIntegrationType;
    defaultDuration: number;
    bufferTime: number;
    enabled: boolean;
  };
  notificationSettings: {
    emailNotifications: boolean;
    smsNotifications: boolean;
    reminderTime: number;
  };
  general: {
    practiceName: string;
    address: string;
    phone: string;
    email: string;
    timezone: string;
    dateFormat: string;
    currency: string;
  };
  features: {
    [featureId: string]: boolean | undefined;
  };
  // Add the settings property from the Settings type
  settings: Settings;
}

export type SettingsAction =
  | { type: 'SET_USERS'; payload: User[] }
  | { type: 'ADD_USER'; payload: User }
  | { type: 'UPDATE_USER'; payload: User }
  | { type: 'DELETE_USER'; payload: string }
  | { type: 'SET_TWILIO_NUMBERS'; payload: TwilioNumber[] }
  | { type: 'UPDATE_TWILIO_NUMBER'; payload: TwilioNumber }
  | { type: 'UPDATE_CALENDAR_SETTINGS'; payload: Partial<SettingsState['calendarSettings']> }
  | { type: 'UPDATE_NOTIFICATION_SETTINGS'; payload: Partial<SettingsState['notificationSettings']> }
  | { type: 'UPDATE_GENERAL_SETTINGS'; payload: Partial<SettingsState['general']> }
  | { type: 'UPDATE_FEATURES'; payload: Partial<SettingsState['features']> }
  | { type: 'UPDATE_SETTINGS'; payload: Partial<Settings> };