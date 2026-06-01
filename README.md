<div align="center">
  <img src="./client/public/hero_dark.png" alt="ThroughU Homepage" width="100%" />

  # 🩸 ThroughU — Turning Loss Into Hope

  **India's most advanced platform connecting willing donors with patients in real-time. Your legacy can rewrite someone's future today.**

  [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
  [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)](https://nodejs.org/)
  [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
</div>

<br />

## ✨ Features

- 🔐 **Secure Authentication** — JWT-based login & Google OAuth integration.
- 🩸 **Real-time Blood Requests** — Live boards for urgent and critical blood needs.
- 🫀 **Organ Pledge System** — Empowering users to leave a legacy.
- 🗺️ **Interactive Donor Map** — Integrated with TomTom API for real-time donor and hospital clustering.
- 📍 **Smart Location** — Auto-detect user location and calculate proximity to hospitals.
- 📱 **Fully Responsive** — Glassmorphism UI built for any device.

---

## 🚀 Tech Stack

### Frontend
* **Core:** React 18, React Router v6
* **Maps & Geo:** TomTom Maps SDK, Leaflet, React-Leaflet
* **Styling & UI:** Vanilla CSS (Glassmorphism), Framer Motion
* **Auth:** Google Identity Services (`@react-oauth/google`)
* **State & Data:** Axios, React Hot Toast

### Backend
* **Core:** Node.js, Express.js
* **Auth & Security:** JWT (JSON Web Tokens), Bcrypt.js, CORS

---

## ⚙️ Setup Instructions

### 1. Prerequisites
- Node.js >= 16
- Git

### 2. Backend Setup
```bash
cd server
npm install
npm run dev
```

### 3. Frontend Setup
```bash
cd client
cp .env.example .env
# Edit .env and add your TomTom API Key & Google Client ID
npm install
npm start
```

### 4. Seed Sample Data
Once the server is running, populate the database with mock donors and requests:
```bash
curl -X POST http://localhost:5000/api/seed
```

---

## 🔑 Environment Variables

**`client/.env`**
```env
REACT_APP_GOOGLE_CLIENT_ID=your_google_oauth_client_id
REACT_APP_TOMTOM_API_KEY=your_tomtom_api_key
REACT_APP_API_URL=http://localhost:5000/api
```

**`server/.env`** (Optional)
```env
PORT=5000
JWT_SECRET=your_super_secret_key
JWT_EXPIRE=7d
```

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/auth/register` | Register new user |
| `POST` | `/api/auth/login` | Login |
| `POST` | `/api/auth/google` | Google OAuth Login |
| `GET` | `/api/auth/me` | Get current user |
| `GET` | `/api/donors` | List donors (filters) |
| `POST` | `/api/donors` | Register as donor |
| `GET` | `/api/blood` | Get blood requests |
| `POST` | `/api/blood` | Create blood request |
| `GET` | `/api/organs` | Get organ requests |
| `POST` | `/api/organs` | Create organ request |
| `GET` | `/api/hospitals` | Get hospitals near location |
| `POST` | `/api/seed` | Seed sample data |

---

<div align="center">
  <p>Made with ❤️ in India 🇮🇳</p>
</div>
