import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

import Navbar      from './components/layout/Navbar';
import Footer      from './components/layout/Footer';
import Home        from './pages/Home';
import Dashboard   from './pages/Dashboard';
import BloodFinder from './pages/BloodFinder';
import DonorMap    from './pages/DonorMap';

import { Login, Register }  from './pages/Login';
import { OrganPledge }      from './pages/OrganPledge';
import { Hospitals }        from './pages/OrganPledge';
import { Profile }          from './pages/OrganPledge';
import { BecomeDonor }      from './pages/OrganPledge';
import { BloodRequest }     from './pages/OrganPledge';

const Protected = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) return <div className="spinner" style={{ marginTop: '40vh' }} />;
  return user ? children : <Navigate to="/login" replace />;
};

export default function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <div className="medical-side-emblem" aria-hidden="true">
        <svg viewBox="0 0 140 260" role="img">
          <path className="emblem-staff" d="M70 24v212" />
          <path className="emblem-snake" d="M70 44c-34 18-34 46 0 61s34 43 0 58-34 43 0 59" />
          <path className="emblem-snake" d="M70 44c34 18 34 46 0 61s-34 43 0 58 34 43 0 59" />
          <circle className="emblem-head" cx="70" cy="38" r="14" />
          <path className="emblem-cross" d="M70 12v52M44 38h52" />
        </svg>
      </div>
      <Routes>
        <Route path="/"              element={<Home />} />
        <Route path="/login"         element={<Login />} />
        <Route path="/register"      element={<Register />} />
        <Route path="/blood"         element={<BloodFinder />} />
        <Route path="/organs"        element={<OrganPledge />} />
        <Route path="/hospitals"     element={<Hospitals />} />
        <Route path="/map"           element={<DonorMap />} />
        <Route path="/dashboard"     element={<Protected><Dashboard /></Protected>} />
        <Route path="/profile"       element={<Protected><Profile /></Protected>} />
        <Route path="/become-donor"  element={<Protected><BecomeDonor /></Protected>} />
        <Route path="/request-blood" element={<Protected><BloodRequest /></Protected>} />
        <Route path="*"              element={<Navigate to="/" replace />} />
      </Routes>
      <Footer />
    </BrowserRouter>
  );
}
