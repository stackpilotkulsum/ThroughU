import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      background: 'rgba(255, 228, 230, 0.95)', color: '#4c0519',
      padding: '5rem 0 2rem', marginTop: 'auto',
      borderTop: '1px solid rgba(225, 29, 72, 0.15)',
      position: 'relative', overflow: 'hidden'
    }}>
      {/* Soft background glow */}
      <div style={{
        position: 'absolute', top: '-100px', left: '50%', transform: 'translateX(-50%)',
        width: '600px', height: '200px', background: 'rgba(6,182,212,0.08)',
        filter: 'blur(100px)', borderRadius: '50%', opacity: '0.4', pointerEvents: 'none'
      }} />

      <div className="container" style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr', gap: '4rem', marginBottom: '4rem' }}>
          <div>
            <div style={{ display:'flex', alignItems:'center', gap:'12px', marginBottom:'1.5rem' }}>
              <span className="brand-symbol" style={{ fontSize:'0.8rem' }} aria-hidden="true" />
              <span className="brand-name" style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.8rem', letterSpacing: 0, fontWeight: '900' }}>
                Through<span className="brand-smile-u">U</span>
              </span>
            </div>
            <p style={{ fontSize:'0.9rem', color:'#881337', lineHeight:'1.8', maxWidth:'320px' }}>
              India's most innovative blood and organ donation platform. Turning loss into hope by connecting donors with recipients in real-time.
            </p>
            <div style={{ display:'flex', gap:'12px', marginTop:'2rem', flexWrap: 'wrap' }}>
              {['Emergency: 108', 'Helpline: 1800-XXX-HOPE'].map(t => (
                <span key={t} style={{
                  display:'inline-flex', alignItems:'center', gap:'8px',
                  background:'rgba(225, 29, 72, 0.08)', color:'#fb7185',
                  padding:'0.5rem 1.2rem', borderRadius:'100px',
                  fontSize:'0.8rem', fontWeight:'700', border: '1px solid rgba(248, 113, 113, 0.2)',
                  letterSpacing: '0.05em'
                }}>🔴 {t}</span>
              ))}
            </div>
          </div>
          {[
            { title: 'Donate', links: [['Blood','/blood'],['Organ Pledge','/organs'],['Become Donor','/become-donor']] },
            { title: 'Find', links: [['Donors','/map'],['Hospitals','/hospitals'],['Blood Requests','/blood']] },
            { title: 'Account', links: [['Register','/register'],['Login','/login'],['Dashboard','/dashboard']] },
          ].map(col => (
            <div key={col.title}>
              <h4 style={{ fontSize:'0.85rem', fontWeight:'800', letterSpacing:'0.08em', textTransform:'uppercase', color:'#22d3ee', marginBottom:'1.5rem' }}>
                {col.title}
              </h4>
              {col.links.map(([label, to]) => (
                <Link key={to} to={to} style={{ display:'block', fontSize:'0.9rem', color:'#881337', marginBottom:'1rem', transition:'all 0.3s', fontWeight: '600' }}
                  onMouseEnter={e => {e.target.style.color='#22d3ee'; e.target.style.transform='translateX(5px)';}}
                  onMouseLeave={e => {e.target.style.color='#881337'; e.target.style.transform='translateX(0)';}}>
                  {label}
                </Link>
              ))}
            </div>
          ))}
        </div>
        <div style={{ borderTop:'1px solid rgba(225, 29, 72, 0.15)', paddingTop:'2.5rem', display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:'1rem' }}>
          <p style={{ fontSize:'0.85rem', color:'#881337' }}>
            © {new Date().getFullYear()} ThroughU. Made with ❤️ in India 🇮🇳
          </p>
          <p style={{ fontSize:'0.85rem', color:'#881337' }}>
            Every 8 seconds someone needs blood. Be the reason they live.
          </p>
        </div>
      </div>
    </footer>
  );
}
