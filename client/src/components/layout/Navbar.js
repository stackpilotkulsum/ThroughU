import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const NAV_LINKS = [
  { to: '/blood',     label: 'Blood' },
  { to: '/organs',    label: 'Organs' },
  { to: '/hospitals', label: 'Hospitals' },
  { to: '/map',       label: 'Impact Map' },
];

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [scrolled, setScrolled] = useState(false);
  const [menu,     setMenu]     = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  useEffect(() => setMenu(false), [location]);

  const styles = {
    nav: {
      position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      padding: scrolled ? '0 2rem' : '1rem 3rem', height: scrolled ? '78px' : '96px',
      background: scrolled ? 'rgba(255, 228, 230, 0.85)' : 'rgba(255, 228, 230, 0.45)',
      backdropFilter: 'blur(24px)',
      borderBottom: '1px solid rgba(225, 29, 72, 0.15)',
      boxShadow: scrolled ? '0 14px 40px rgba(0, 0, 0, 0.5)' : 'none',
      transition: 'all 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
    },
    logo: {
      display: 'flex', alignItems: 'center', gap: '12px',
      fontFamily: "'Playfair Display', serif", fontSize: scrolled ? '1.5rem' : '1.9rem',
      fontWeight: '800',
      color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '0',
      transition: 'all 0.4s ease'
    },
    links: { display: 'flex', alignItems: 'center', gap: '0.5rem', position: 'absolute', left: '50%', transform: 'translateX(-50%)' },
    link: (active) => ({
      padding: '0.5rem 1.1rem', borderRadius: '100px',
      fontSize: '0.9rem', fontWeight: '600',
      color: active ? '#22d3ee' : '#881337',
      background: active ? 'rgba(34, 211, 238, 0.08)' : 'transparent',
      border: active ? '1px solid rgba(34, 211, 238, 0.22)' : '1px solid transparent',
      transition: 'all 0.3s', cursor: 'pointer', letterSpacing: '0', textTransform: 'none'
    }),
    actions: { display: 'flex', alignItems: 'center', gap: '1.2rem' },
    sos: {
      background: 'linear-gradient(135deg, #f87171 0%, #fb7185 100%)', color: '#fff',
      border: 'none', borderRadius: '12px',
      padding: '0.72rem 1.35rem', fontSize: '0.85rem', fontWeight: '800', letterSpacing: '0', textTransform: 'none',
      cursor: 'pointer', fontFamily: "'Playfair Display', serif",
      display: 'flex', alignItems: 'center', gap: '8px',
      animation: 'pulseRing 2s infinite',
      boxShadow: '0 4px 20px rgba(248, 113, 113, 0.4)'
    },
    avatar: {
      width: '42px', height: '42px', borderRadius: '50%',
      background: 'linear-gradient(135deg, #06b6d4, #14b8a6)',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: '#fff', fontWeight: '800', fontSize: '1rem', cursor: 'pointer',
      border: '2px solid rgba(255,255,255,0.2)'
    },
  };

  return (
    <nav style={styles.nav}>
      <style>{`
        .nav-link:hover { color:#22d3ee !important; background:rgba(34, 211, 238, 0.05) !important; }
        .sos-btn:hover  { transform:translateY(-2px); box-shadow: 0 12px 28px rgba(248, 113, 113, 0.4) !important; }
        .hamburger { display:none; }
        @media(max-width:1100px) {
          .nav-links { display:none !important; }
          .hamburger { display:flex !important; }
          .mobile-menu { display:block; position:fixed; top:80px; left:0; right:0; background:rgba(255, 255, 255,0.95); backdrop-filter:blur(24px); border-bottom:1px solid rgba(225, 29, 72, 0.15); padding:1.5rem; z-index:999; box-shadow:0 20px 40px rgba(0,0,0,0.5); }
          .mobile-menu a, .mobile-menu button { display:block; width:100%; text-align:left; padding:1rem 1.2rem; border-radius:12px; color:#4c0519; font-size:1rem; font-weight:700; cursor:pointer; border:none; background:transparent; font-family:'Playfair Display', serif; margin-bottom:8px; text-transform:none; letter-spacing:0; }
          .mobile-menu a:hover, .mobile-menu button:hover { background:rgba(34, 211, 238, 0.08); color:#22d3ee; }
        }
      `}</style>

      {/* Logo */}
      <Link to="/" style={styles.logo}>
        <span className="brand-symbol" aria-hidden="true" />
        <span className="brand-name">
          Through<span className="brand-smile-u">U</span>
        </span>
      </Link>

      {/* Desktop links - Centered */}
      <div className="nav-links" style={styles.links}>
        {NAV_LINKS.map(l => (
          <Link key={l.to} to={l.to} className="nav-link"
            style={styles.link(location.pathname === l.to)}>
            {l.label}
          </Link>
        ))}
      </div>

      {/* Actions */}
      <div style={styles.actions}>
        <button className="sos-btn" style={styles.sos}
          onClick={() => navigate('/request-blood')}>
          🚨 SOS
        </button>
        {user ? (
          <>
            <Link to="/dashboard">
              <div title={user.name} style={styles.avatar}>
                {user.name?.[0]?.toUpperCase()}
              </div>
            </Link>
            <button onClick={logout} style={{
              background:'rgba(225, 29, 72, 0.05)', border:'1px solid rgba(225, 29, 72, 0.25)',
              borderRadius:'12px', padding:'0.6rem 1.2rem',
              fontSize:'0.85rem', fontWeight:'600', cursor:'pointer',
              color:'#881337', fontFamily:"'Playfair Display', serif",
              transition: 'all 0.3s'
            }} onMouseEnter={e => {e.currentTarget.style.color='#22d3ee'; e.currentTarget.style.background='rgba(34, 211, 238, 0.08)'; e.currentTarget.style.borderColor='rgba(34, 211, 238, 0.3)';}}
               onMouseLeave={e => {e.currentTarget.style.color='#881337'; e.currentTarget.style.background='rgba(225, 29, 72, 0.05)'; e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.25)';}}>
               Sign Out
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{ fontSize:'0.9rem', fontWeight:'700', color:'#881337', transition:'color 0.2s' }}
                  onMouseEnter={e => e.currentTarget.style.color='#22d3ee'}
                  onMouseLeave={e => e.currentTarget.style.color='#881337'}>Login</Link>
            <Link to="/register">
              <button style={{
                background:'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)', color:'#fff', border:'none',
                borderRadius:'12px', padding:'0.7rem 1.35rem',
                fontSize:'0.9rem', fontWeight:'700', cursor:'pointer',
                fontFamily:"'Playfair Display', serif",
                transition: 'transform 0.3s, box-shadow 0.3s',
                textTransform: 'none', letterSpacing: '0'
              }} onMouseEnter={e => {e.currentTarget.style.transform='translateY(-3px)'; e.currentTarget.style.boxShadow='0 12px 24px rgba(6,182,212,0.3)'}}
                 onMouseLeave={e => {e.currentTarget.style.transform='none'; e.currentTarget.style.boxShadow='none'}}>
                 Register
              </button>
            </Link>
          </>
        )}
        {/* Hamburger */}
        <button className="hamburger" onClick={() => setMenu(!menu)} style={{
          background:'rgba(225, 29, 72, 0.05)', border:'1px solid rgba(225, 29, 72, 0.25)',
          borderRadius:'8px', padding:'0.5rem 0.8rem', cursor:'pointer',
          fontSize:'1.2rem', color:'#4c0519'
        }}>☰</button>
      </div>

      {/* Mobile menu */}
      {menu && (
        <div className="mobile-menu">
          {NAV_LINKS.map(l => <Link key={l.to} to={l.to} onClick={() => setMenu(false)}>{l.label}</Link>)}
          <hr style={{ border:'none', borderTop:'1px solid rgba(225, 29, 72, 0.15)', margin:'15px 0' }}/>
          {user ? (
            <>
              <Link to="/dashboard" onClick={() => setMenu(false)}>Dashboard</Link>
              <Link to="/profile" onClick={() => setMenu(false)}>Profile</Link>
              <button onClick={() => {logout(); setMenu(false)}}>Sign Out</button>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMenu(false)}>Login</Link>
              <Link to="/register" onClick={() => setMenu(false)}>Register</Link>
            </>
          )}
        </div>
      )}
    </nav>
  );
}
