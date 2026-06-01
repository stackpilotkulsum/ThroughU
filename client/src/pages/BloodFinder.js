import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { bloodAPI, donorAPI } from '../utils/api';
import toast from 'react-hot-toast';

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];
const URGENCY_OPTS = ['critical','urgent','normal'];

export default function BloodFinder() {
  const loc = useLocation();
  const [requests, setRequests] = useState([]);
  const [donors,   setDonors]   = useState([]);
  const [stats,    setStats]    = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [view,     setView]     = useState('requests'); // requests | donors
  const [filters,  setFilters]  = useState({
    bloodGroup: loc.state?.bloodGroup || '',
    city: '', urgency: '',
  });

  useEffect(() => {
    load();
    bloodAPI.stats().then(r => setStats(r.data.stats || [])).catch(() => {});
  }, [filters]);

  const load = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.bloodGroup) params.bloodGroup = filters.bloodGroup;
      if (filters.city)       params.city       = filters.city;
      if (filters.urgency)    params.urgency    = filters.urgency;
      const [rRes, dRes] = await Promise.all([
        bloodAPI.getAll(params),
        donorAPI.getAll({ ...params, donationType:'blood' }),
      ]);
      setRequests(rRes.data.requests || []);
      setDonors(dRes.data.donors || []);
    } catch { toast.error('Failed to load data'); }
    setLoading(false);
  };

  const fulfill = async id => {
    try {
      await bloodAPI.fulfill(id);
      toast.success('✅ Marked as fulfilled!');
      load();
    } catch { toast.error('Failed'); }
  };

  const urgBg    = u => ({ critical:'rgba(248,113,113,0.15)', urgent:'rgba(251,191,36,0.15)', normal:'rgba(20,184,166,0.15)' }[u]);
  const urgColor = u => ({ critical:'#f87171', urgent:'#fbbf24', normal:'#14b8a6' }[u]);

  const setF = k => v => setFilters(p => ({ ...p, [k]: p[k]===v ? '' : v }));

  return (
    <div className="page-wrapper" style={{ overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="hero-orb hero-orb-1" style={{ opacity: 0.7 }} />
      <div className="hero-orb hero-orb-2" style={{ opacity: 0.5 }} />

      {/* Hero strip */}
      <div style={{ padding:'5rem 0 3rem', position:'relative', zIndex: 2 }}>
        <div className="container">
          <div className="section-tag">Blood Finder</div>
          <h1 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight: 900, marginBottom:'1rem', lineHeight:1.1 }}>
            Find Blood. <span className="text-coral-gradient">Save Lives.</span>
          </h1>
          <p style={{ color:'var(--text-secondary)', maxWidth:'520px', fontSize: '1.05rem', lineHeight:1.75, marginBottom:'2.5rem' }}>
            Browse active blood requests and verified volunteer donors. Real-time matching where every heartbeat counts.
          </p>
          <div style={{ display:'flex', gap:'1.2rem', flexWrap: 'wrap' }}>
            <Link to="/request-blood"><button className="btn btn-primary">🚨 Post Emergency Request</button></Link>
            <Link to="/become-donor"><button className="btn btn-ghost">🩸 Register as Donor</button></Link>
          </div>

          {/* Blood type availability */}
          <div style={{ display:'flex', gap:'0.65rem', marginTop:'3rem', flexWrap:'wrap' }}>
            {BLOOD_GROUPS.map(bg => {
              const s = stats.find(x => x.group===bg);
              const active = filters.bloodGroup === bg;
              return (
                <button key={bg} onClick={() => setF('bloodGroup')(bg)} style={{
                  background: active ? 'linear-gradient(135deg, #f87171 0%, #fb7185 100%)' : 'rgba(225, 29, 72, 0.04)',
                  border: `1px solid ${active ? 'transparent' : 'rgba(225, 29, 72, 0.2)'}`,
                  borderRadius:'12px', padding:'0.75rem 1.1rem', cursor:'pointer',
                  color: active ? '#fff' : 'rgba(159, 18, 57, 0.85)',
                  fontFamily:"'Playfair Display', serif", fontWeight:'800', fontSize:'0.9rem',
                  transition:'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)', minWidth:'68px',
                  boxShadow: active ? '0 8px 20px rgba(248, 113, 113, 0.3)' : 'none',
                }}
                onMouseEnter={e => { if(!active) { e.currentTarget.style.borderColor='rgba(34, 211, 238, 0.3)'; e.currentTarget.style.background='rgba(225, 29, 72, 0.08)'; } }}
                onMouseLeave={e => { if(!active) { e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.2)'; e.currentTarget.style.background='rgba(225, 29, 72, 0.04)'; } }}
                >
                  <div style={{ fontSize: '1.05rem' }}>{bg}</div>
                  {s && <div style={{ fontSize:'0.65rem', fontWeight:'600', opacity:0.8, marginTop:'4px' }}>{s.open} req</div>}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem', position: 'relative', zIndex: 2 }}>
        {/* Filters + view toggle */}
        <div style={{ display:'flex', gap:'1.2rem', marginBottom:'2.5rem', flexWrap:'wrap', alignItems:'center' }}>
          <div style={{ position: 'relative', width: '100%', maxWidth: '280px' }}>
            <input className="form-input" placeholder="🔍 Search city..." 
              style={{ paddingLeft: '1.2rem' }}
              value={filters.city} onChange={e => setFilters(p=>({...p,city:e.target.value}))} />
          </div>
          <div style={{ display:'flex', gap:'0.5rem', flexWrap: 'wrap' }}>
            {URGENCY_OPTS.map(u => {
              const active = filters.urgency === u;
              return (
                <button key={u} onClick={() => setF('urgency')(u)} style={{
                  padding:'0.6rem 1.2rem', borderRadius:'100px', 
                  border:`1px solid ${active ? urgColor(u) : 'rgba(225, 29, 72, 0.2)'}`,
                  background: active ? urgBg(u) : 'rgba(225, 29, 72, 0.03)',
                  color: active ? urgColor(u) : 'var(--text-secondary)',
                  fontSize:'0.82rem', fontWeight:'700', cursor:'pointer', textTransform:'capitalize',
                  fontFamily:"'Playfair Display', serif", transition:'all 0.3s',
                }}
                onMouseEnter={e => { if(!active) e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.35)'; }}
                onMouseLeave={e => { if(!active) e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.2)'; }}
                >{u==='critical'?'🔴':u==='urgent'?'🟡':'🟢'} {u}</button>
              );
            })}
          </div>
          <div style={{ marginLeft:'auto', display:'flex', gap:'4px', background:'rgba(225, 29, 72, 0.04)', borderRadius:'12px', padding:'4px', border: '1px solid rgba(225, 29, 72, 0.15)' }}>
            {[['requests','🚨 Requests'],['donors','🩸 Donors']].map(([k,l]) => (
              <button key={k} onClick={() => setView(k)} style={{
                padding:'0.65rem 1.3rem', borderRadius:'8px', border:'none', cursor:'pointer',
                background: view===k ? 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)' : 'transparent',
                color: view===k ? '#fff' : 'var(--text-secondary)',
                fontWeight:'700', fontSize:'0.85rem', 
                boxShadow: view===k ? '0 4px 15px rgba(6, 182, 212, 0.25)' : 'none',
                transition:'all 0.3s', fontFamily:"'Playfair Display', serif",
              }}>{l}</button>
            ))}
          </div>
        </div>

        {loading ? <div className="spinner"/> : (
          <>
            {/* Blood requests */}
            {view === 'requests' && (
              <>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.5rem' }}>
                  <p style={{ fontSize:'0.9rem', color:'var(--text-secondary)', fontWeight:'600' }}>
                    Found <span style={{ color: '#22d3ee' }}>{requests.length}</span> active blood requests
                  </p>
                </div>
                {requests.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '20px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩸</div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Requests Found</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Try adjusting your filters or location search.</p>
                  </div>
                ) : (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.5rem' }} className="grid-2">
                    {requests.map(r => (
                      <div key={r._id} className="glass-panel" style={{ padding:'2rem', display: 'flex', flexDirection: 'column' }}>
                        <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.2rem', alignItems: 'center' }}>
                          <div style={{
                            width:'56px', height:'56px', borderRadius:'14px',
                            background: 'linear-gradient(135deg, #f87171 0%, #fb7185 100%)',
                            color: '#fff', fontSize: '1.25rem', fontWeight: '900',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            boxShadow: '0 8px 20px rgba(248, 113, 113, 0.2)'
                          }}>{r.bloodGroup}</div>
                          <span style={{ 
                            background:urgBg(r.urgency), color:urgColor(r.urgency), 
                            padding:'6px 14px', borderRadius:'100px', 
                            fontSize:'0.7rem', fontWeight:'900', 
                            textTransform:'uppercase', border: `1px solid rgba(${r.urgency === 'critical' ? '248,113,113' : r.urgency === 'urgent' ? '251,191,36' : '20,184,166'}, 0.2)`
                          }}>{r.urgency}</span>
                        </div>
                        <h3 style={{ fontWeight:'800', fontSize:'1.2rem', color: 'var(--text-primary)', marginBottom:'6px' }}>{r.hospital}</h3>
                        <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'6px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                          <span>📍</span> {r.city}{r.state ? `, ${r.state}` : ''}
                        </div>
                        <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'1.2rem' }}>
                          🩸 <strong>{r.units} Unit{r.units>1?'s':''}</strong> needed {r.patientName && `· Patient: ${r.patientName}`}
                        </div>
                        {r.reason && (
                          <div style={{ 
                            fontSize:'0.85rem', color:'var(--text-secondary)', fontStyle:'italic', 
                            marginBottom:'1.5rem', borderLeft:'3px solid #f87171', 
                            paddingLeft:'12px', background: 'rgba(248, 113, 113, 0.04)', padding: '10px 12px',
                            borderRadius: '0 8px 8px 0'
                          }}>{r.reason}</div>
                        )}
                        <div style={{ display:'flex', gap:'1rem', marginTop:'auto' }}>
                          <a href={`tel:${r.contactPhone}`} style={{ flex: 1 }}>
                            <button className="btn btn-primary btn-sm btn-block">📞 Contact</button>
                          </a>
                          <button className="btn btn-secondary btn-sm" style={{ flex: 1 }} onClick={() => fulfill(r._id)}>✅ Fulfilled</button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}

            {/* Donors list */}
            {view === 'donors' && (
              <>
                <p style={{ fontSize:'0.9rem', color:'var(--text-secondary)', fontWeight:'600', marginBottom:'1.5rem' }}>
                  Found <span style={{ color: '#22d3ee' }}>{donors.length}</span> active donor{donors.length>1?'s':''}
                </p>
                {donors.length === 0 ? (
                  <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center', borderRadius: '20px' }}>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🩸</div>
                    <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Donors Found</h3>
                    <p style={{ color: 'var(--text-secondary)' }}>Try changing the city or blood type filters.</p>
                  </div>
                ) : (
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }} className="grid-3">
                    {donors.map(d => (
                      <div key={d._id} className="glass-panel" style={{ padding:'2rem', textAlign:'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        <div style={{ 
                          width:'64px', height:'64px', borderRadius:'50%', 
                          background:'linear-gradient(135deg,#06b6d4,#14b8a6)', 
                          display:'flex', alignItems:'center', justifyContent:'center', 
                          margin:'0 auto 1.2rem', color:'#fff', fontSize:'1.6rem', fontWeight:'900',
                          boxShadow: '0 8px 25px rgba(6, 182, 212, 0.25)',
                          border: '2px solid rgba(225, 29, 72, 0.12)'
                        }}>
                          {d.user?.name?.[0]||'D'}
                        </div>
                        <h4 style={{ fontWeight:'800', fontSize:'1.1rem', color: 'var(--text-primary)', marginBottom:'4px' }}>{d.user?.name||'Anonymous Donor'}</h4>
                        <div style={{ fontSize:'0.85rem', color:'var(--text-secondary)', marginBottom:'1.2rem' }}>📍 {d.city}</div>
                        <div style={{ display:'flex', gap:'0.5rem', justifyContent:'center', marginBottom:'1.5rem' }}>
                          <span style={{ 
                            background:'rgba(248, 113, 113, 0.12)', color:'#f87171', 
                            padding:'4px 12px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800',
                            border: '1px solid rgba(248, 113, 113, 0.2)'
                          }}>{d.bloodGroup}</span>
                          <span style={{ 
                            background:'rgba(34, 211, 238, 0.12)', color:'#22d3ee', 
                            padding:'4px 12px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800',
                            border: '1px solid rgba(34, 211, 238, 0.2)'
                          }}>{d.donationType}</span>
                        </div>
                        {d.user?.phone && (
                          <a href={`tel:${d.user.phone}`} style={{ width: '100%', marginTop: 'auto' }}>
                            <button className="btn btn-primary btn-sm btn-block">📞 Contact Donor</button>
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
