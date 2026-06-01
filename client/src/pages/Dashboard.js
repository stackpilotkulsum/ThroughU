import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { donorAPI, bloodAPI, organAPI } from '../utils/api';
import toast from 'react-hot-toast';

export default function Dashboard() {
  const { user } = useAuth();
  const [donor,   setDonor]   = useState(null);
  const [myBlood, setMyBlood] = useState([]);
  const [myOrgans,setMyOrgans]= useState([]);
  const [stats,   setStats]   = useState(null);
  const [loading, setLoading] = useState(true);
  const [tab,     setTab]     = useState('overview');

  useEffect(() => {
    const load = async () => {
      try {
        const [bs] = await Promise.all([bloodAPI.stats()]);
        setStats(bs.data);
        if (user?.isDonor) {
          const d = await donorAPI.getMe();
          setDonor(d.data.donor);
        }
        const br = await bloodAPI.getAll({ status: 'open' });
        setMyBlood(br.data.requests?.slice(0, 5) || []);
        const or = await organAPI.getAll({});
        setMyOrgans(or.data.requests?.slice(0, 4) || []);
      } catch {}
      setLoading(false);
    };
    load();
  }, [user]);

  const urgencyColor = u => ({ critical:'#f87171', urgent:'#fbbf24', normal:'#14b8a6' }[u] || 'var(--text-secondary)');
  const urgencyBg    = u => ({ critical:'rgba(248,113,113,0.15)', urgent:'rgba(251,191,36,0.15)', normal:'rgba(20,184,166,0.15)' }[u]);

  if (loading) return <div className="page-wrapper"><div className="spinner" /></div>;

  return (
    <div className="page-wrapper" style={{ overflow: 'hidden' }}>
      {/* Background Orbs */}
      <div className="hero-orb hero-orb-1" style={{ opacity: 0.6 }} />
      <div className="hero-orb hero-orb-2" style={{ opacity: 0.4 }} />

      <div className="container" style={{ padding:'2.5rem 1.5rem', position: 'relative', zIndex: 2 }}>

        {/* Welcome bar */}
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'2.5rem', flexWrap:'wrap', gap:'1.2rem' }}>
          <div>
            <h1 style={{ fontSize:'2.2rem', fontWeight: 900, marginBottom:'6px' }}>
              Welcome back, <span className="text-coral-gradient">{user?.name?.split(' ')[0]}</span> 👋
            </h1>
            <p style={{ color:'var(--text-secondary)', fontSize:'0.95rem' }}>📍 {user?.city} · Blood Group: <strong style={{ color: '#22d3ee' }}>{user?.bloodGroup || 'Not Set'}</strong></p>
          </div>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap' }}>
            <Link to="/request-blood"><button className="btn btn-primary">🚨 Request Blood</button></Link>
            {!user?.isDonor && <Link to="/become-donor"><button className="btn btn-teal">🩸 Become Donor</button></Link>}
          </div>
        </div>

        {/* Stat cards */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'1.5rem', marginBottom:'2.5rem' }} className="grid-2">
          {[
            { icon:'🩸', label:'Blood Group', value: user?.bloodGroup || '—', sub:'Your registered type', color:'#f87171' },
            { icon:'❤️', label:'Donor Status', value: user?.isDonor ? 'Active' : 'Not Yet', sub: user?.isDonor ? 'Verified donor' : 'Help save lives', color: user?.isDonor ? '#14b8a6' : '#fbbf24' },
            { icon:'🚨', label:'Open Requests', value: stats?.total || 0, sub:'Blood requests active', color:'#f87171' },
            { icon:'⚠️', label:'Critical Cases', value: stats?.critical || 0, sub:'Immediate response', color:'#f87171' },
          ].map(s => (
            <div key={s.label} className="glass-panel" style={{ padding:'1.5rem', display: 'flex', flexDirection: 'column' }}>
              <div style={{ fontSize:'1.8rem', marginBottom:'0.6rem' }}>{s.icon}</div>
              <div style={{ fontSize:'2.2rem', fontWeight:'900', color:s.color, letterSpacing:'-1px', marginBottom:'4px', textShadow: `0 0 20px rgba(6,182,212,0.1)` }}>{s.value}</div>
              <div style={{ fontSize:'0.75rem', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.08em', color:'var(--text-secondary)', marginBottom: '4px' }}>{s.label}</div>
              <div style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginTop:'auto' }}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div style={{ display:'flex', gap:'4px', background:'rgba(225, 29, 72, 0.04)', borderRadius:'12px', padding:'4px', marginBottom:'2.2rem', width:'fit-content', border: '1px solid rgba(225, 29, 72, 0.15)' }}>
          {['overview','blood','organs','profile'].map(t => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding:'0.6rem 1.4rem', borderRadius:'9px', border:'none', cursor:'pointer',
              fontSize:'0.85rem', fontWeight:'700', fontFamily:"'Playfair Display', serif",
              background: tab===t ? 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)' : 'transparent',
              color: tab===t ? '#fff' : 'var(--text-secondary)',
              boxShadow: tab===t ? '0 4px 15px rgba(6, 182, 212, 0.2)' : 'none',
              transition:'all 0.3s', textTransform:'capitalize',
            }}>{t}</button>
          ))}
        </div>

        {/* Overview tab */}
        {tab === 'overview' && (
          <div style={{ display:'grid', gridTemplateColumns:'1fr 360px', gap:'1.8rem' }} className="grid-2">
            <div>
              {/* Donor card */}
              {donor ? (
                <div style={{ background:'linear-gradient(135deg, rgba(225, 29, 72, 0.08), rgba(20,184,166,0.05))', border:'1px solid rgba(248,113,113,0.18)', borderRadius:'20px', padding:'2rem', marginBottom:'2rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'1.2rem', marginBottom:'1.5rem', flexWrap: 'wrap' }}>
                    <div style={{ 
                      width:'58px', height:'58px', borderRadius:'50%', 
                      background:'linear-gradient(135deg, #06b6d4, #14b8a6)', 
                      display:'flex', alignItems:'center', justifyContent:'center', 
                      color:'#fff', fontSize:'1.5rem', fontWeight:'900',
                      boxShadow: '0 8px 25px rgba(6,182,212,0.25)',
                      border: '2px solid rgba(225, 29, 72, 0.12)'
                    }}>
                      {user?.name?.[0]?.toUpperCase()}
                    </div>
                    <div>
                      <div style={{ fontWeight:'900', fontSize:'1.2rem', color: '#4c0519' }}>{user?.name}</div>
                      <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)' }}>Donor ID: T-U-{user?._id?.slice(-6).toUpperCase()}</div>
                    </div>
                    <span style={{ marginLeft:'auto', background:'rgba(20,184,166,0.12)', color:'#14b8a6', border: '1px solid rgba(20,184,166,0.2)', padding:'4px 14px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'900' }}>✓ ACTIVE</span>
                  </div>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1rem' }}>
                    {[
                      { label:'Blood Group', value: donor.bloodGroup, color:'#f87171' },
                      { label:'Type', value: donor.donationType, color:'#14b8a6' },
                      { label:'City', value: donor.city, color:'#22d3ee' },
                    ].map(v => (
                      <div key={v.label} style={{ background:'rgba(255, 255, 255,0.6)', border: '1px solid rgba(225, 29, 72, 0.15)', borderRadius:'14px', padding:'1rem', textAlign:'center' }}>
                        <div style={{ fontSize:'1.2rem', fontWeight:'900', color:v.color }}>{v.value}</div>
                        <div style={{ fontSize:'0.7rem', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.06em', marginTop:'4px' }}>{v.label}</div>
                      </div>
                    ))}
                  </div>
                  <div style={{ marginTop:'1.5rem', display:'flex', gap:'1rem', flexWrap: 'wrap' }}>
                    <Link to="/profile"><button className="btn btn-secondary btn-sm">Edit Profile</button></Link>
                    <Link to="/map"><button className="btn btn-primary btn-sm">View on Map</button></Link>
                  </div>
                </div>
              ) : (
                <div style={{ background:'rgba(225, 29, 72, 0.03)', border:'2px dashed rgba(248,113,113,0.3)', borderRadius:'20px', padding:'3rem 2rem', textAlign:'center', marginBottom:'2rem' }}>
                  <div style={{ fontSize:'3rem', marginBottom:'1rem' }}>🩸</div>
                  <h3 style={{ fontSize:'1.5rem', fontWeight: 900, marginBottom:'0.6rem' }}>Become a Donor</h3>
                  <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'2rem', maxWidth: '400px', marginLine: 'auto' }}>Register as a blood or organ donor and make a direct difference.</p>
                  <Link to="/become-donor"><button className="btn btn-primary">Register as Donor →</button></Link>
                </div>
              )}

              {/* Recent blood requests */}
              <div className="glass-panel" style={{ padding:'2rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1.5rem' }}>
                  <h3 style={{ fontWeight:'800', fontSize:'1.1rem', display: 'flex', alignItems: 'center', gap: '8px' }}>🚨 Recent Blood Requests</h3>
                  <Link to="/blood" style={{ fontSize:'0.82rem', color:'#22d3ee', fontWeight:'700' }}>View All →</Link>
                </div>
                {myBlood.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '2rem' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🩸</div>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>No open requests</p>
                  </div>
                ) : myBlood.map(r => (
                  <div key={r._id} style={{ display:'flex', alignItems:'center', gap:'1.2rem', padding:'1rem', background:'rgba(225, 29, 72, 0.03)', border: '1px solid rgba(148,163,184,0.05)', borderRadius:'14px', marginBottom:'0.8rem' }}>
                    <div style={{
                      width: '45px', height: '45px', borderRadius: '10px',
                      background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.2)',
                      color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '900', fontSize: '1rem'
                    }}>{r.bloodGroup}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:'800', fontSize:'0.95rem', color: '#4c0519' }}>{r.hospital}</div>
                      <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginTop: '2px' }}>📍 {r.city} · {r.units} Unit{r.units>1?'s':''}</div>
                    </div>
                    <span style={{ background:urgencyBg(r.urgency), color:urgencyColor(r.urgency), padding:'4px 12px', borderRadius:'100px', fontSize:'0.65rem', fontWeight:'900', textTransform:'uppercase' }}>{r.urgency}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right sidebar */}
            <div style={{ display:'flex', flexDirection:'column', gap:'1.8rem' }}>
              {/* Quick actions */}
              <div className="glass-panel" style={{ padding:'1.8rem' }}>
                <h3 style={{ fontWeight:'800', fontSize:'1.1rem', marginBottom:'1.2rem' }}>⚡ Quick Actions</h3>
                {[
                  { icon:'🩸', label:'Find Blood Donor', to:'/blood' },
                  { icon:'🏥', label:'Nearest Hospital', to:'/hospitals' },
                  { icon:'🗺️', label:'Live Donor Map', to:'/map' },
                  { icon:'🫀', label:'Organ Pledge', to:'/organs' },
                  { icon:'🚨', label:'Emergency Request', to:'/request-blood' },
                ].map(a => (
                  <Link key={a.to} to={a.to} style={{ display:'flex', alignItems:'center', gap:'12px', padding:'0.85rem 1rem', borderRadius:'12px', marginBottom:'6px', transition:'all 0.3s', textDecoration:'none', color:'var(--text-primary)', border: '1px solid transparent' }}
                    className="quick-action-link"
                    onMouseEnter={e => { e.currentTarget.style.background='rgba(225, 29, 72, 0.04)'; e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.15)'; }}
                    onMouseLeave={e => { e.currentTarget.style.background='transparent'; e.currentTarget.style.borderColor='transparent'; }}>
                    <span style={{ fontSize:'1.2rem' }}>{a.icon}</span>
                    <span style={{ fontWeight:'700', fontSize:'0.9rem' }}>{a.label}</span>
                    <span style={{ marginLeft:'auto', color:'var(--text-secondary)' }}>→</span>
                  </Link>
                ))}
              </div>

              {/* Blood availability */}
              <div style={{ background:'rgba(255, 255, 255,0.8)', border: '1px solid rgba(225, 29, 72, 0.15)', borderRadius:'20px', padding:'1.8rem' }}>
                <h3 style={{ fontWeight:'800', fontSize:'0.85rem', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.08em', marginBottom:'1.2rem' }}>Blood Availability</h3>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.65rem' }}>
                  {(stats?.stats || []).map(s => (
                    <div key={s.group} style={{ textAlign:'center', background:'rgba(225, 29, 72, 0.03)', border: '1px solid rgba(148,163,184,0.05)', borderRadius:'10px', padding:'0.75rem 0.4rem' }}>
                      <div style={{ fontSize:'0.95rem', fontWeight:'900', color:'#f87171' }}>{s.group}</div>
                      <div style={{ fontSize:'0.65rem', color: s.open>2?'#f87171':s.open>0?'#fbbf24':'#14b8a6', marginTop:'4px', fontWeight:'800', textTransform: 'uppercase' }}>
                        {s.open>2?'Needed':s.open>0?'Low':'OK'}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Blood tab */}
        {tab === 'blood' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.8rem', alignItems: 'center' }}>
              <h2 style={{ fontSize:'1.6rem', fontWeight: 900 }}>My Blood Requests</h2>
              <Link to="/request-blood"><button className="btn btn-primary">+ New Request</button></Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.5rem' }} className="grid-2">
              {myBlood.map(r => (
                <div key={r._id} className="glass-panel" style={{ padding:'2rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-start', marginBottom:'1.2rem' }}>
                    <div style={{
                      width: '48px', height: '48px', borderRadius: '10px',
                      background: 'rgba(248,113,113,0.12)', border: '1px solid rgba(248,113,113,0.2)',
                      color: '#f87171', display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: '900', fontSize: '1rem'
                    }}>{r.bloodGroup}</div>
                    <span style={{ background:urgencyBg(r.urgency), color:urgencyColor(r.urgency), padding:'5px 12px', borderRadius:'100px', fontSize:'0.7rem', fontWeight:'900', textTransform:'uppercase' }}>{r.urgency}</span>
                  </div>
                  <h3 style={{ fontWeight:'850', fontSize: '1.25rem', marginBottom:'6px' }}>{r.hospital}</h3>
                  <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'8px' }}>📍 {r.city} · {r.units} Unit{r.units>1?'s':''}</div>
                  <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)' }}>📞 Contact: <strong>{r.contactPhone}</strong></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Organs tab */}
        {tab === 'organs' && (
          <div>
            <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.8rem', alignItems: 'center' }}>
              <h2 style={{ fontSize:'1.6rem', fontWeight: 900 }}>Organ Pledges & Requests</h2>
              <Link to="/organs"><button className="btn btn-teal">+ New Request</button></Link>
            </div>
            <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.5rem' }} className="grid-2">
              {myOrgans.map(r => (
                <div key={r._id} className="glass-panel" style={{ padding:'2rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem', alignItems: 'center' }}>
                    <span style={{ fontSize:'2rem' }}>
                      {{'Heart':'🫀','Lungs':'🫁','Liver':'🟤','Kidneys':'🫘','Corneas':'👁️','Bone':'🦴','Skin':'💪','Pancreas':'🟡'}[r.organ]||'🏥'}
                    </span>
                    <span style={{ background:urgencyBg(r.urgency), color:urgencyColor(r.urgency), padding:'5px 12px', borderRadius:'100px', fontSize:'0.7rem', fontWeight:'900', textTransform:'uppercase' }}>{r.urgency}</span>
                  </div>
                  <h3 style={{ fontWeight:'850', fontSize: '1.25rem', marginBottom:'6px' }}>{r.organ} needed</h3>
                  <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'6px' }}>👤 Patient Name: <strong>{r.patientName}</strong></div>
                  <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)' }}>🏥 Hospital: <strong>{r.hospital}, {r.city}</strong></div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Profile tab */}
        {tab === 'profile' && (
          <div style={{ maxWidth:'650px', margin: '0 auto' }}>
            <h2 style={{ fontSize:'1.6rem', fontWeight: 900, marginBottom:'1.5rem', textAlign: 'center' }}>My Profile Details</h2>
            <div className="glass-panel" style={{ padding:'2.5rem' }}>
              {[
                { label:'Full Name',    value: user?.name },
                { label:'Email Address', value: user?.email },
                { label:'Contact Number',value: user?.phone },
                { label:'City / Region',value: user?.city },
                { label:'Blood Group',  value: user?.bloodGroup },
                { label:'Age (Years)',  value: user?.age },
                { label:'Gender',       value: user?.gender },
                { label:'Donor Status', value: user?.isDonor ? '✅ Active Registered Donor' : '❌ Not registered as donor' },
              ].map(f => (
                <div key={f.label} style={{ display:'flex', justifyContent:'space-between', padding:'1rem 0', borderBottom:'1px solid rgba(225, 29, 72, 0.15)' }}>
                  <span style={{ fontSize:'0.8rem', fontWeight:'800', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.08em' }}>{f.label}</span>
                  <span style={{ fontSize:'0.95rem', fontWeight:'700', color: '#4c0519' }}>{f.value || '—'}</span>
                </div>
              ))}
              <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                <Link to="/profile"><button className="btn btn-primary" style={{ minWidth: '200px' }}>Edit Profile Details →</button></Link>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
