import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { bloodAPI } from '../utils/api';

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

export default function Home() {
  const [stats, setStats] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    bloodAPI.stats().then(r => setStats(r.data)).catch(() => {});
  }, []);

  const getLevel = (open) => {
    if (open === 0)  return { label: 'Available', color: '#22d3ee' };
    if (open <= 2)   return { label: 'Low',       color: '#fbbf24' };
    return             { label: 'Needed',   color: '#f87171' };
  };

  return (
    <div style={{ background: '#fff1f2' }}>
      {/* ── HERO ── */}
      <div style={{
        minHeight: '100vh',
        background: `linear-gradient(165deg, rgba(255, 228, 230,0.75) 0%, rgba(255, 228, 230,0.55) 40%, rgba(255, 228, 230,0.8) 100%), url('/hero_dark.png') center/cover no-repeat`,
        display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden',
      }}>
        {/* Animated gradient orbs */}
        <div className="hero-orb hero-orb-1" />
        <div className="hero-orb hero-orb-2" />
        <div className="hero-orb hero-orb-3" />

        {/* Scanline effect */}
        <div style={{
          position:'absolute', inset:0, pointerEvents:'none',
          background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(6,182,212,0.015) 2px, rgba(6,182,212,0.015) 4px)',
          zIndex: 1,
        }}/>

        {/* Bottom fade */}
        <div style={{
          position:'absolute', bottom:0, left:0, right:0, height:'30vh', pointerEvents:'none',
          background: 'linear-gradient(to top, #fff1f2 0%, transparent 100%)', zIndex:2,
        }}/>

        <div className="container" style={{ position:'relative', zIndex:3, padding:'12rem 1.5rem 8rem' }}>
          <div style={{ display:'grid', gridTemplateColumns:'1.15fr 0.85fr', gap:'5rem', alignItems:'center' }}>

            {/* LEFT — Brand & Copy */}
            <div className="fade-up">
              <div style={{
                display:'inline-flex', alignItems:'center', gap:'12px',
                color:'#22d3ee', fontSize:'0.78rem', fontWeight:'700',
                letterSpacing:'0.18em', textTransform:'uppercase', marginBottom:'2rem',
              }}>
                <span style={{ width:'45px', height:'1.5px', background:'linear-gradient(90deg, #22d3ee, transparent)' }}/>
                Turning Loss Into Hope
              </div>

              {/* BRAND — ThroughU massively displayed */}
              <div className="brand-lockup brand-hero" aria-label="ThroughU" style={{ marginBottom: '1.5rem' }}>
                <span className="brand-symbol" aria-hidden="true" />
                <span className="brand-name">
                  Through<span className="brand-smile-u">U</span>
                </span>
              </div>

              <h1 style={{
                fontSize:'clamp(3rem, 5.5vw, 5.5rem)',
                color:'#4c0519', lineHeight:1.08, marginBottom:'2rem', letterSpacing:'-0.02em',
                fontFamily: "'Playfair Display', serif", fontWeight: 800,
              }}>
                A profound gift.<br/>
                <span style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 50%, #f87171 100%)',
                  WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text', fontStyle:'italic',
                }}>Infinite</span> impact.
              </h1>

              <p style={{ color:'rgba(148,163,184,0.9)', fontSize:'1.12rem', lineHeight:1.85, maxWidth:'520px', marginBottom:'3rem', fontWeight:'400' }}>
                India's most advanced platform connecting willing donors with patients in real time. Your legacy can rewrite someone's future today.
              </p>

              <div style={{ display:'flex', gap:'1.5rem', flexWrap:'wrap' }}>
                <Link to="/register">
                  <button className="btn btn-primary btn-lg" style={{
                    background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                    boxShadow: '0 0 40px rgba(6,182,212,0.3), 0 12px 30px rgba(6,182,212,0.2)',
                    border: '1px solid rgba(34,211,238,0.2)',
                  }}>
                    Register as Donor
                  </button>
                </Link>
                <Link to="/map">
                  <button className="btn btn-lg" style={{
                    background: 'rgba(225, 29, 72, 0.05)',
                    color: '#9f1239', border: '1px solid rgba(225, 29, 72, 0.3)',
                    backdropFilter: 'blur(10px)',
                  }}
                  onMouseEnter={e => { e.currentTarget.style.background='rgba(6,182,212,0.1)'; e.currentTarget.style.borderColor='rgba(34,211,238,0.4)'; }}
                  onMouseLeave={e => { e.currentTarget.style.background='rgba(225, 29, 72, 0.05)'; e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.3)'; }}
                  >
                    View Live Impact <span style={{fontSize:'1.3rem', marginLeft:'4px'}}>→</span>
                  </button>
                </Link>
              </div>

              {/* Stats */}
              <div style={{ display:'flex', gap:'4rem', marginTop:'5rem', flexWrap:'wrap', paddingTop:'2.5rem', borderTop:'1px solid rgba(34,211,238,0.12)' }}>
                {[['4.2M+','Donors Registered'],['18K+','Lives Touched'],['<6 min','Avg. Match Time']].map(([n,l]) => (
                  <div key={l}>
                    <div style={{
                      fontSize:'2.5rem', fontWeight:'900', letterSpacing:'-0.02em',
                      fontFamily: "'Playfair Display', serif",
                      background: 'linear-gradient(135deg, #9f1239, #22d3ee)',
                      WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                    }}>{n}</div>
                    <div style={{ fontSize:'0.72rem', color:'rgba(148,163,184,0.7)', textTransform:'uppercase', letterSpacing:'0.12em', marginTop:'8px', fontWeight:'700' }}>{l}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* RIGHT — Glass Action Panel */}
            <div className="fade-up" style={{ animationDelay:'0.3s' }}>
              <div style={{
                background: 'rgba(255, 255, 255,0.6)',
                backdropFilter: 'blur(24px)',
                border: '1px solid rgba(34,211,238,0.12)',
                borderRadius: '24px',
                padding: '3rem',
                boxShadow: '0 25px 60px rgba(0,0,0,0.4), inset 0 1px 0 rgba(34,211,238,0.08)',
              }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'2rem' }}>
                  <div style={{ fontSize:'0.78rem', fontWeight:'800', letterSpacing:'0.12em', textTransform:'uppercase', color:'#22d3ee' }}>
                    Live Blood Status
                  </div>
                  <div className="pulse-ring" style={{ width:'10px', height:'10px', borderRadius:'50%', background:'#f87171' }} />
                </div>

                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.8rem', marginBottom:'2.5rem' }}>
                  {BLOOD_GROUPS.map(bg => {
                    const stat = stats?.stats?.find(s => s.group === bg);
                    const lvl  = getLevel(stat?.open || 0);
                    return (
                      <div key={bg} onClick={() => navigate('/blood', { state: { bloodGroup: bg } })}
                        style={{
                          background:'rgba(225, 29, 72, 0.04)', border:'1px solid rgba(225, 29, 72, 0.18)',
                          borderRadius:'14px', padding:'1rem 0.5rem', textAlign:'center', cursor:'pointer',
                          transition:'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.background='rgba(6,182,212,0.1)'; e.currentTarget.style.borderColor='rgba(34,211,238,0.3)'; e.currentTarget.style.transform='translateY(-4px)'; e.currentTarget.style.boxShadow='0 12px 24px rgba(244, 63, 94, 0.15)'; }}
                        onMouseLeave={e => { e.currentTarget.style.background='rgba(225, 29, 72, 0.04)'; e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.18)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}>
                        <div style={{ fontSize:'1.3rem', fontWeight:'900', color:'#4c0519' }}>{bg}</div>
                        <div style={{ fontSize:'0.65rem', color:lvl.color, marginTop:'6px', fontWeight:'700', textTransform:'uppercase', letterSpacing:'0.1em' }}>{lvl.label}</div>
                      </div>
                    );
                  })}
                </div>

                {/* Organ pledges */}
                <div style={{ fontSize:'0.78rem', fontWeight:'800', letterSpacing:'0.12em', textTransform:'uppercase', color:'#22d3ee', marginBottom:'1.2rem' }}>
                  Pledge Your Organs
                </div>
                <div style={{ display:'flex', flexWrap:'wrap', gap:'0.7rem', marginBottom:'2.5rem' }}>
                  {[['🫀','Heart'],['🫁','Lungs'],['🟤','Liver'],['🫘','Kidneys'],['👁️','Corneas']].map(([icon,name]) => (
                    <span key={name} onClick={() => navigate('/organs')}
                      style={{
                        display:'inline-flex', alignItems:'center', gap:'8px',
                        background:'rgba(225, 29, 72, 0.04)', border:'1px solid rgba(225, 29, 72, 0.18)',
                        borderRadius:'999px', padding:'0.6rem 1.1rem',
                        fontSize:'0.82rem', fontWeight:'700', color:'#881337', cursor:'pointer',
                        transition:'all 0.3s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.background='rgba(139,92,246,0.15)'; e.currentTarget.style.borderColor='rgba(139,92,246,0.4)'; e.currentTarget.style.boxShadow='0 0 15px rgba(139,92,246,0.2)'; e.currentTarget.style.transform='translateY(-2px)'; }}
                      onMouseLeave={e => { e.currentTarget.style.background='rgba(225, 29, 72, 0.04)'; e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.18)'; e.currentTarget.style.boxShadow='none'; e.currentTarget.style.transform='translateY(0)'; }}>
                      <span style={{ fontSize:'1.1rem' }}>{icon}</span> {name}
                    </span>
                  ))}
                </div>

                <button className="btn btn-block" style={{
                  background: 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)',
                  color: '#fff', padding:'1.3rem', fontSize:'0.95rem', fontWeight:'800',
                  letterSpacing:'0.06em', textTransform:'uppercase', borderRadius: '14px',
                  boxShadow: '0 0 30px rgba(6,182,212,0.25)',
                  border: '1px solid rgba(34,211,238,0.2)',
                }} onClick={() => navigate('/register')}>
                  Begin Your Journey
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── FEATURES ── */}
      <section style={{ padding:'10rem 0', position:'relative', background:'#fff1f2', overflow:'hidden' }}>
        {/* Background effects */}
        <div style={{ position:'absolute', top:'10%', left:'-10%', width:'500px', height:'500px', background:'radial-gradient(circle, rgba(6,182,212,0.08) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', bottom:'10%', right:'-5%', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(139,92,246,0.06) 0%, transparent 70%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:0, left:'50%', transform:'translateX(-50%)', width:'80%', height:'1px', background:'radial-gradient(circle, rgba(34,211,238,0.15) 0%, transparent 70%)' }}/>

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <div style={{ textAlign:'center', marginBottom:'5rem' }}>
            <div className="section-tag" style={{ justifyContent:'center', color:'#22d3ee' }}>The ThroughU Difference</div>
            <h2 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', color:'#4c0519', fontFamily:"'Playfair Display', serif" }}>
              Advanced technology for<br/>
              <span style={{
                background:'linear-gradient(135deg, #06b6d4, #14b8a6)',
                WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
                fontStyle:'italic',
              }}>profound humanity.</span>
            </h2>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'2rem' }}>
            {[
              { icon:'🗺️', title:'Live Impact Map', desc:'See donors, hospitals, and critical requests dynamically updated on an interactive, real-time map.', link:'/map', glow:'rgba(244, 63, 94, 0.15)' },
              { icon:'⚡', title:'Algorithmic Matching', desc:'Our proprietary AI connects urgent blood requirements with eligible donors in under 6 minutes.', link:'/blood', glow:'rgba(250,204,21,0.12)' },
              { icon:'🕊️', title:'Legacy Pledging', desc:'Register your organ donation pledge securely. One selfless decision can save up to 8 lives.', link:'/organs', glow:'rgba(251, 113, 133, 0.12)' },
              { icon:'🏥', title:'Verified Network', desc:'Integrated with 480+ premier partner hospitals providing live stock information and verified emergency channels.', link:'/hospitals', glow:'rgba(20,184,166,0.12)' },
              { icon:'🚨', title:'Instant SOS Protocol', desc:'Trigger a verified emergency broadcast that immediately alerts the nearest matched donors and coordinators.', link:'/request-blood', glow:'rgba(248,113,113,0.12)' },
              { icon:'🔐', title:'Secure Dashboard', desc:'Manage your legacy securely. Track your real-world impact, update pledges, and control your availability.', link:'/dashboard', glow:'rgba(59,130,246,0.12)' },
            ].map((f, i) => (
              <Link key={f.title} to={f.link} style={{ textDecoration:'none' }}>
                <div style={{
                  background: 'rgba(255, 255, 255,0.5)',
                  backdropFilter: 'blur(16px)',
                  border: '1px solid rgba(225, 29, 72, 0.15)',
                  borderRadius: '20px',
                  padding: '2.5rem',
                  height: '100%',
                  cursor: 'pointer',
                  display: 'flex', flexDirection: 'column',
                  transition: 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                  position: 'relative', overflow: 'hidden',
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(34,211,238,0.3)'; e.currentTarget.style.transform='translateY(-6px)'; e.currentTarget.style.boxShadow=`0 25px 50px rgba(0,0,0,0.3), 0 0 30px ${f.glow}`; }}
                onMouseLeave={e => { e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.15)'; e.currentTarget.style.transform='translateY(0)'; e.currentTarget.style.boxShadow='none'; }}
                >
                  {/* Glow orb */}
                  <div style={{ position:'absolute', top:'-30px', right:'-30px', width:'120px', height:'120px', background:`radial-gradient(circle, ${f.glow} 0%, transparent 70%)`, pointerEvents:'none' }}/>
                  <div style={{ width:'56px', height:'56px', borderRadius:'14px', background:'rgba(225, 29, 72, 0.05)', border:'1px solid rgba(225, 29, 72, 0.18)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.8rem', marginBottom:'1.8rem', position:'relative', zIndex:1 }}>{f.icon}</div>
                  <h3 style={{ fontFamily:"'Playfair Display', serif", fontSize:'1.2rem', fontWeight:'800', marginBottom:'0.8rem', color:'#4c0519', position:'relative', zIndex:1 }}>{f.title}</h3>
                  <p style={{ fontSize:'0.92rem', color:'rgba(148,163,184,0.8)', lineHeight:'1.75', flex:1, position:'relative', zIndex:1 }}>{f.desc}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section style={{
        background: '#fff1f2',
        padding:'10rem 0', textAlign:'center', position:'relative', overflow:'hidden',
      }}>
        {/* Dramatic glow */}
        <div style={{ position:'absolute', top:'50%', left:'50%', transform:'translate(-50%,-50%)', width:'800px', height:'800px', background:'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 60%)', pointerEvents:'none' }}/>
        <div style={{ position:'absolute', top:'40%', left:'30%', width:'400px', height:'400px', background:'radial-gradient(circle, rgba(248,113,113,0.06) 0%, transparent 70%)', pointerEvents:'none' }}/>

        <div className="container" style={{ position:'relative', zIndex:1 }}>
          <h2 style={{ fontFamily:"'Playfair Display', serif", fontSize:'clamp(3rem,6vw,5rem)', color:'#4c0519', letterSpacing:'-0.02em', marginBottom:'2rem', fontWeight:800 }}>
            Your legacy begins here.<br/>
            <span style={{
              background:'linear-gradient(135deg, #06b6d4 0%, #f87171 100%)',
              WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent', backgroundClip:'text',
              fontStyle:'italic',
            }}>Turn loss into hope.</span>
          </h2>
          <p style={{ color:'rgba(148,163,184,0.8)', fontSize:'1.15rem', maxWidth:'700px', margin:'0 auto 3.5rem', lineHeight:'1.85', fontWeight:'400' }}>
            Every 8 seconds, a life hangs in the balance. Every 10 minutes, a new name is etched onto the transplant waiting list. Your decision today is someone's miracle tomorrow.
          </p>
          <div style={{ display:'flex', gap:'1.5rem', justifyContent:'center', flexWrap:'wrap' }}>
            <Link to="/register">
              <button className="btn btn-lg" style={{
                background:'linear-gradient(135deg, #06b6d4, #14b8a6)', color:'#fff',
                padding:'1.2rem 3.5rem', fontSize:'1.05rem',
                boxShadow:'0 0 40px rgba(6,182,212,0.25)', border:'1px solid rgba(34,211,238,0.2)',
              }}>Register Now</button>
            </Link>
            <Link to="/map">
              <button className="btn btn-lg" style={{
                background:'rgba(225, 29, 72, 0.05)', color:'#9f1239',
                padding:'1.2rem 3.5rem', fontSize:'1.05rem',
                border:'1px solid rgba(225, 29, 72, 0.3)',
              }}
              onMouseEnter={e => { e.currentTarget.style.background='rgba(6,182,212,0.1)'; e.currentTarget.style.borderColor='rgba(34,211,238,0.3)'; }}
              onMouseLeave={e => { e.currentTarget.style.background='rgba(225, 29, 72, 0.05)'; e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.3)'; }}
              >Explore Impact Map</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
