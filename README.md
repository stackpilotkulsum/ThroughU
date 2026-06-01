# 🩸 ThroughU — Turning Loss Into Hope (MERN Stack)

A full-stack MERN application for blood and organ donation with Google Maps integration.

## 🚀 Tech Stack
- **Frontend**: React 18, React Router v6, Google Maps API, Axios
- **Backend**: Node.js, Express.js, MongoDB, Mongoose, JWT Auth
- **Maps**: @react-google-maps/api

---

## 📁 Project Structure
```
ThroughU/
├── server/          # Express + MongoDB backend
│   ├── models/      # Mongoose schemas
│   ├── routes/      # API routes
│   ├── middleware/  # Auth & error middleware
│   ├── controllers/ # Route controllers
│   └── index.js     # Server entry
└── client/          # React frontend
    └── src/
        ├── components/  # Reusable UI
        ├── pages/       # Page components
        ├── context/     # React Context (Auth)
        ├── hooks/       # Custom hooks
        └── utils/       # API helpers
```

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js >= 16
- MongoDB running locally OR MongoDB Atlas URI
- Google Maps API Key (with Maps JS API + Places API + Geocoding API enabled)

### 2. Backend Setup
```bash
cd server
cp .env.example .env
# Edit .env with your MONGO_URI, JWT_SECRET, GOOGLE_MAPS_KEY
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
cp .env.example .env
# Add your REACT_APP_GOOGLE_MAPS_KEY to .env
npm install
npm start
```

### 4. Seed Sample Data
After the server is running:
```bash
curl -X POST http://localhost:5000/api/seed
```

---

## 🔑 Environment Variables

### server/.env
```
PORT=5000
MONGO_URI=mongodb://localhost:27017/throughu
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

### client/.env
```
REACT_APP_GOOGLE_MAPS_KEY=your_google_maps_api_key
REACT_APP_API_URL=http://localhost:5000/api
```

---

## 📌 Features
- 🔐 JWT Authentication (Register / Login)
- 🩸 Blood Donor Registration & Search
- 🫀 Organ Pledge System
- 🗺️ Google Maps — donor/hospital map with markers & clustering
- 📍 Places Autocomplete for location input
- 🏥 Hospital Finder with distance calculation
- 🚨 Blood Request Board (urgent, normal, critical)
- 📋 User Dashboard with donation history
- 📱 Fully responsive UI

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/auth/register | Register new user |
| POST | /api/auth/login | Login |
| GET | /api/auth/me | Get current user |
| GET | /api/donors | List donors (filters) |
| POST | /api/donors | Register as donor |
| GET | /api/blood | Get blood requests |
| POST | /api/blood | Create blood request |
| GET | /api/organs | Get organ requests |
| POST | /api/organs | Create organ request |
| GET | /api/hospitals | Get hospitals near location |
| POST | /api/seed | Seed sample data |

---

## 🗺️ Google Maps Features
- Interactive map showing donor locations
- Hospital markers with info windows
- Blood request heat zones
- Distance calculation between user & donor/hospital
- Places autocomplete for city/address fields
- Geolocation — auto-detect user location

---

Made with ❤️ in India 🇮🇳
