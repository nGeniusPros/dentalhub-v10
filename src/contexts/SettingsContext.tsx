import React, { createContext, useContext, useReducer, ReactNode } from 'react';
import { SettingsState, SettingsAction } from '../pages/admin/settings/types/user';

// Initial state
const initialState: SettingsState = {
  // Original properties
  users: [
    {
      id: 'user-1',
      fullName: 'Sample Provider',
      email: 'provider@example.com',
      role: 'Provider',
      enabled: true,
      dateCreated: new Date(),
      availabilityHours: 40,
      calendarIntegration: {
        type: 'internal',
        connected: true,
      }
    }
  ],
  twilioNumbers: [
    {
      id: 'number-1',
      phoneNumber: '+1 (555) 123-4567',
      friendlyName: 'Main Office',
      isActive: true,
      capabilities: {
        sms: true,
        voice: true,
        mms: true
      }
    }
  ],
  calendarSettings: {
    provider: 'internal',
    enabled: true,
    defaultDuration: 60,
    bufferTime: 15
  },
  notificationSettings: {
    emailNotifications: true,
    smsNotifications: true,
    reminderTime: 24
  },
  general: {
    practiceName: '',
    address: '',
    phone: '',
    email: '',
    timezone: 'America/Los_Angeles',
    dateFormat: 'MM/DD/YYYY',
    currency: 'USD'
  },
  features: {},
  
  // Added to support settings.targetAudience structure
  settings: {
    general: {
      practiceName: '',
      address: '',
      phone: '',
      email: '',
      website: '',
      timezone: 'America/Los_Angeles',
      dateFormat: 'MM/DD/YYYY',
      currency: 'USD'
    },
    branding: {
      colors: {
        primary: '#0047AB',
        secondary: '#6A5ACD',
        accent: '#40E0D0'
      },
      darkMode: false
    },
    notifications: {
      email: true,
      sms: true,
      appointments: true,
      marketing: false,
      reminderTiming: 24
    },
    security: {
      twoFactorAuth: false,
      passwordExpiration: 90,
      loginAttempts: 5,
      sessionTimeout: 30,
      ipWhitelist: [],
      enforcePasswordPolicy: true,
      ipWhitelistEnabled: false,
      auditLogging: true
    },
    integrations: {
      autoSync: true,
      errorNotifications: true,
      enabled: {}
    },
    targetAudience: {
      demographics: {
        ageRanges: [],
        householdTypes: [],
        education: [],
        occupations: [],
        incomeRanges: [],
        locations: []
      },
      interests: []
    },
    features: {}
  }
};

// Create the context
type SettingsContextType = {
  state: SettingsState;
  updateSettings: (action: SettingsAction) => void;
};

const SettingsContext = createContext<SettingsContextType | undefined>(undefined);

// Reducer function
function settingsReducer(state: SettingsState, action: SettingsAction): SettingsState {
  switch (action.type) {
    case 'SET_USERS':
      return {
        ...state,
        users: action.payload
      };

    case 'ADD_USER':
      return {
        ...state,
        users: [...state.users, action.payload]
      };

    case 'UPDATE_USER':
      return {
        ...state,
        users: state.users.map(user => 
          user.id === action.payload.id ? action.payload : user
        )
      };

    case 'DELETE_USER':
      return {
        ...state,
        users: state.users.filter(user => user.id !== action.payload)
      };

    case 'SET_TWILIO_NUMBERS':
      return {
        ...state,
        twilioNumbers: action.payload
      };

    case 'UPDATE_TWILIO_NUMBER': {
      // Check if the number already exists
      const existingNumberIndex = state.twilioNumbers.findIndex(
        num => num.id === action.payload.id
      );

      if (existingNumberIndex >= 0) {
        // Update existing number
        return {
          ...state,
          twilioNumbers: state.twilioNumbers.map(num =>
            num.id === action.payload.id ? action.payload : num
          )
        };
      } else {
        // Add new number
        return {
          ...state,
          twilioNumbers: [...state.twilioNumbers, action.payload]
        };
      }
    }

    case 'UPDATE_CALENDAR_SETTINGS':
      return {
        ...state,
        calendarSettings: {
          ...state.calendarSettings,
          ...action.payload
        }
      };

    case 'UPDATE_NOTIFICATION_SETTINGS':
      return {
        ...state,
        notificationSettings: {
          ...state.notificationSettings,
          ...action.payload
        }
      };
    case 'UPDATE_GENERAL_SETTINGS':
      return {
        ...state,
        general: {
          ...state.general,
          ...action.payload
        }
      };
    
    case 'UPDATE_FEATURES':
      return {
        ...state,
        features: {
          ...state.features,
          ...action.payload
        }
      };
      
    case 'UPDATE_SETTINGS':
      return {
        ...state,
        settings: {
          ...state.settings,
          ...action.payload
        }
      };

    default:
      return state;
  }
}

// Provider component
interface SettingsProviderProps {
  children: ReactNode;
}

export const SettingsProvider: React.FC<SettingsProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(settingsReducer, initialState);

  const updateSettings = (action: SettingsAction) => {
    dispatch(action);
  };

  return (
    <SettingsContext.Provider value={{ state, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
};

// Custom hook to use the context
export const useSettings = () => {
  const context = useContext(SettingsContext);
  if (context === undefined) {
    throw new Error('useSettings must be used within a SettingsProvider');
  }
  return context;
};