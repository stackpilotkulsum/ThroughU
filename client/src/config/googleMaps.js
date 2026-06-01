// ─────────────────────────────────────────────────────────
//  Google Maps Configuration
//  Set your API key in client/.env as:
//  REACT_APP_GOOGLE_MAPS_KEY=your_key_here
//  Enable "Maps JavaScript API", "Places API", and
//  "Geocoding API" in Google Cloud Console.
// ─────────────────────────────────────────────────────────

export const GOOGLE_MAPS_API_KEY =
  process.env.REACT_APP_GOOGLE_MAPS_KEY || '';

if (!GOOGLE_MAPS_API_KEY) {
  console.warn(
    '⚠️ REACT_APP_GOOGLE_MAPS_KEY is not set in client/.env — maps will not load.'
  );
}

export const MAP_CENTER = { lat: 20.5937, lng: 78.9629 }; // India center

export const LIBRARIES = ['marker', 'places'];

// Light-themed map style matching the app's rose/blush aesthetic
export const MAP_STYLES = [
  { elementType: 'geometry', stylers: [{ color: '#fff5f5' }] },
  { elementType: 'labels.text.stroke', stylers: [{ color: '#ffffff' }] },
  { elementType: 'labels.text.fill', stylers: [{ color: '#6b2130' }] },
  {
    featureType: 'administrative',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e8b4bc' }],
  },
  {
    featureType: 'administrative.land_parcel',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#9e6a73' }],
  },
  {
    featureType: 'landscape.natural',
    elementType: 'geometry',
    stylers: [{ color: '#fff0f3' }],
  },
  {
    featureType: 'poi',
    elementType: 'geometry',
    stylers: [{ color: '#ffe4e6' }],
  },
  {
    featureType: 'poi',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#8b3a4a' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'geometry.fill',
    stylers: [{ color: '#d4f5e5' }],
  },
  {
    featureType: 'poi.park',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#3a7d5e' }],
  },
  {
    featureType: 'road',
    elementType: 'geometry',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'geometry',
    stylers: [{ color: '#fce4ec' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry',
    stylers: [{ color: '#f8bbd0' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#e8a0b0' }],
  },
  {
    featureType: 'transit.line',
    elementType: 'geometry',
    stylers: [{ color: '#f3d4da' }],
  },
  {
    featureType: 'water',
    elementType: 'geometry',
    stylers: [{ color: '#cce5f6' }],
  },
  {
    featureType: 'water',
    elementType: 'labels.text.fill',
    stylers: [{ color: '#5b8fb0' }],
  },
];

// Default map options
export const DEFAULT_MAP_OPTIONS = {
  styles: MAP_STYLES,
  disableDefaultUI: false,
  zoomControl: true,
  mapTypeControl: false,
  streetViewControl: false,
  fullscreenControl: false,
};
