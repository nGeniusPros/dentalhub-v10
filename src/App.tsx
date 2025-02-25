import * as React from 'react';
import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { CommunicationProvider } from './contexts/CommunicationContext';
import { AppRoutes } from './routes/index';

const App: React.FC = () => {
  return (
    <AuthProvider>
      <ThemeProvider>
        <NotificationProvider>
          <CommunicationProvider>
            <BrowserRouter>
              <AppRoutes />
            </BrowserRouter>
          </CommunicationProvider>
        </NotificationProvider>
      </ThemeProvider>
    </AuthProvider>
  );
};

export default App;