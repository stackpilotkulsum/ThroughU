import React from 'react';
import { render } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import { OrganPledge } from './OrganPledge';
import { AuthProvider } from '../context/AuthContext';

// Mock Google Maps because it doesn't run well in JSDOM/Node environment
jest.mock('@react-google-maps/api', () => ({
  GoogleMap: ({ children }) => <div data-testid="map-container">{children}</div>,
  Marker: () => <div />,
  InfoWindow: ({ children }) => <div>{children}</div>,
  Circle: () => <div />,
  useJsApiLoader: () => ({ isLoaded: true }),
}));

test('renders OrganPledge page without crashing', () => {
  render(
    <BrowserRouter>
      <OrganPledge />
    </BrowserRouter>
  );
  console.log('OrganPledge page rendered successfully in test!');
});
