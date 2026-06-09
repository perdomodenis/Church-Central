import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { EventsProvider } from './context/EventContext';
import { LanguageProvider } from './context/LanguageContext';
import { NotificationProvider } from './context/NotificationContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <LanguageProvider>
      <AuthProvider>
        <NotificationProvider>
          <EventsProvider>
            <App />
          </EventsProvider>
        </NotificationProvider>
      </AuthProvider>
    </LanguageProvider>
  </React.StrictMode>
);

