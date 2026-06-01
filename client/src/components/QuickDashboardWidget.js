import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { bloodAPI } from '../utils/api';

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

export function QuickDashboardWidget() {
  const navigate = useNavigate();
  const [stats, setStats] = useState(null);

  useEffect(() => {
    bloodAPI.stats().then(res => setStats(res.data)).catch(()=>{});
  }, []);

  const getLevel = n => n > 20 ? {label:'Available', color:'#10b981'} : n > 5 ? {label:'Low Stock', color:'#f59e0b'} : {label:'Critical', color:'#ef4444'};

  return (
    <div style={{
      background: 'rgba(255, 255, 255,0.6)',
      backdropFilter: 'blur(24px)',
      border: '1px solid rgba(255, 255, 255, 0.8)',
      borderRadius: '30px', padding: '2rem',
      boxShadow: '0 30px 60px rgba(0,0,0,0.08)',
      position: 'relative', overflow:'hidden',
    }}>
      <div style={{ position:'absolute', top:'-50%', left:'-50%', width:'200%', height:'200%', background:'radial-gradient(circle, rgba(225, 29, 72, 0.05) 0%, transparent 60%)', animation:'spin 30s linear infinite', pointerEvents:'none' }}/>

      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
        <div style={{ fontSize:'0.78rem', fontWeight:'800', letterSpacing:'0.12em', textTransform:'uppercase', color:'#22d3ee' }}>Live Blood Status</div>
        <div className="pulse-ring" style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#f87171' }} />
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.6rem', marginBottom:'2rem' }}>
        {BLOOD_GROUPS.map(bg => {
          const stat = stats?.stats?.find(s => s.group === bg);
          const lvl  = getLevel(stat?.open || 0);
          return (
            <div key={bg} onClick={() => navigate('/blood', { state: { bloodGroup: bg } })}
              style={{
                background:'rgba(225, 29, 72, 0.04)', border:'1px solid rgba(225, 29, 72, 0.18)',
                borderRadius:'14px', padding:'0.75rem 0.2rem', textAlign:'center', cursor:'pointer',
                transition:'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(6,182,212,0.1)'; e.currentTarget.style.borderColor='rgba(34,211,238,0.3)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 24px rgba(244, 63, 94, 0.15)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(225, 29, 72, 0.04)'; e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.18)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
              <div style={{ fontSize:'1.1rem', fontWeight:'900', color:'#4c0519' }}>{bg}</div>
              <div style={{ fontSize:'0.55rem', color:lvl.color, marginTop:'4px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.05em' }}>{lvl.label}</div>
            </div>
          );
        })}
      </div>

      {/* Organ pledges */}
      <div style={{ fontSize:'0.78rem', fontWeight:'800', letterSpacing:'0.12em', textTransform:'uppercase', color:'#22d3ee', marginBottom:'1.2rem' }}>
        Pledge Your Organs
      </div>
      <div style={{ display:'flex', flexWrap:'wrap', gap:'0.5rem', marginBottom:'2rem' }}>
        {[['🫀','Heart'],['🫁','Lungs'],['🟤','Liver'],['🫘','Kidneys'],['👁️','Corneas']].map(([icon,name]) => (
          <span key={name} onClick={() => navigate('/organs')}
            style={{
              display:'inline-flex', alignItems:'center', gap:'6px',
              background:'rgba(225, 29, 72, 0.04)', border:'1px solid rgba(225, 29, 72, 0.18)',
              borderRadius:'999px', padding:'0.5rem 0.9rem',
              fontSize:'0.75rem', fontWeight:'700', color:'#881337', cursor:'pointer',
              transition:'all 0.3s',
            }}
            onMouseEnter={e => { e.currentTarget.style.background='rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor='rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow='0 0 15px rgba(139,92,246,0.2)'; e.currentTarget.style.transform='translateY(-2px)'; }}
            onMouseLeave={e => { e.currentTarget.style.background='rgba(225, 29, 72, 0.04)'; e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.18)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
            <span style={{ fontSize:'1rem' }}>{icon}</span> {name}
          </span>
        ))}
      </div>

      <button className="btn btn-block" style={{
        background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
        color: '#fff', padding:'1.1rem', fontSize:'0.9rem', fontWeight:'800',
        letterSpacing:'0.06em', textTransform:'uppercase', borderRadius: '12px',
        boxShadow: '0 0 30px rgba(6,182,212,0.25)',
        border: '1px solid rgba(34,211,238,0.2)',
      }} onClick={() => navigate('/register')}>
        Begin Your Journey
      </button>
    </div>
  );
}
