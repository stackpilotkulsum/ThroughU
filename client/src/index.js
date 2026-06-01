import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { GoogleOAuthProvider } from '@react-oauth/google';
import { Toaster } from 'react-hot-toast';
import './index.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={process.env.REACT_APP_GOOGLE_CLIENT_ID || ''}>
      <AuthProvider>
        <App />
        <Toaster
          position="top-right"
          toastOptions={{
            style: {
              fontFamily: "'Outfit', sans-serif",
              fontSize: '0.9rem',
              fontWeight: '600',
              borderRadius: '12px',
              background: '#050505',
              color: '#fff',
              border: '1px solid rgba(225, 29, 72, 0.12)',
            },
            success: { iconTheme: { primary: '#00cec9', secondary: '#fff' } },
            error:   { iconTheme: { primary: '#ff6b6b', secondary: '#fff' } },
          }}
        />
      </AuthProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
