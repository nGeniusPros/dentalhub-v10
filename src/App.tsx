import * as React from 'react';
import { BrowserRouter, createBrowserRouter, RouterProvider } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CommunicationProvider } from './contexts/CommunicationContext';
import { AppRoutes } from './routes/index';

// Create router with future flags to address warnings
const router = createBrowserRouter(
  [{ path: "*", element: <AppRoutes /> }],
  {
    future: {
      v7_startTransition: true,
      v7_relativeSplatPath: true
    }
  }
);

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <CommunicationProvider>
            <RouterProvider router={router} />
          </CommunicationProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;