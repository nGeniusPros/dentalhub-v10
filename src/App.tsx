import * as React from 'react';
import { useEffect } from 'react';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { LocationProvider } from './contexts/LocationContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CommunicationProvider } from './contexts/CommunicationContext';
import { ClaimsProvider } from './contexts/ClaimsContext';
import { SettingsProvider } from './contexts/SettingsContext';
import { AppRoutes } from './routes/index';
import { initErrorTracking } from './utils/errorTracking';

// Create router with future flags to address warnings
const router = createBrowserRouter(
  [{ path: "*", element: <AppRoutes /> }],
  {
    future: {
      v7_relativeSplatPath: true
    }
  }
);

const App: React.FC = () => {
  // Initialize error tracking on app startup
  useEffect(() => {
    // In production, initialize global error tracking
    if (import.meta.env.PROD) {
      initErrorTracking();
      console.log('Production error tracking initialized');
    }
  }, []);

  return (
    <AuthProvider>
      <LocationProvider>
        <ThemeProvider>
          <NotificationProvider>
            <CommunicationProvider>
              <ClaimsProvider>
                <SettingsProvider>
                  <RouterProvider router={router} />
                </SettingsProvider>
              </ClaimsProvider>
            </CommunicationProvider>
          </NotificationProvider>
        </ThemeProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default App;