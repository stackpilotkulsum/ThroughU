import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GoogleLogin } from '@react-oauth/google';
import toast from 'react-hot-toast';

const PANEL_STYLE = {
  minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
  background: `linear-gradient(165deg, rgba(255, 228, 230,0.65) 0%, rgba(255, 228, 230,0.45) 40%, rgba(255, 228, 230,0.75) 100%), url('/hero_dark.png') center/cover no-repeat fixed`,
  padding: '2rem',
};
const BOX_STYLE = { width: '100%', maxWidth: '500px', position: 'relative', zIndex: 2 };

export function Login() {
  const { login, googleLogin } = useAuth();
  const navigate  = useNavigate();
  const [form, setForm]  = useState({ email:'', password:'' });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try { await login(form.email, form.password); navigate('/dashboard'); }
    catch(err) { toast.error(err.response?.data?.message || 'Login failed'); }
    finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Google Sign-In failed');
    }
  };

  return (
    <div style={PANEL_STYLE}>
      {/* Glow orb */}
      <div style={{ position:'absolute', right: '5%', bottom: '5%', width: '300px', height: '300px', background: 'rgba(34,211,238,0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />
      
        <div style={BOX_STYLE} className="glass-panel login-card" style={{ ...BOX_STYLE, padding: '2.5rem', borderRadius: '24px' }}>
          <h1 style={{ fontSize:'2rem', fontWeight: 900, marginBottom:'0.5rem', color:'#4c0519' }}>Welcome back</h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'2rem' }}>
            Don't have an account? <Link to="/register" style={{ color:'var(--coral)', fontWeight:'700' }}>Register free</Link>
          </p>
          
          <div style={{ display:'flex', justifyContent:'center', marginBottom:'2rem' }}>
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => toast.error('Google Sign-In was unsuccessful')}
                theme="filled_black"
                shape="pill"
                size="large"
                text="continue_with"
                width="400"
              />
          </div>

          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
            <div style={{ flex:1, height:'1px', background:'rgba(225, 29, 72, 0.2)' }}/>
            <span style={{ fontSize:'0.75rem', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:700 }}>Or continue with email</span>
            <div style={{ flex:1, height:'1px', background:'rgba(225, 29, 72, 0.2)' }}/>
          </div>

          <form onSubmit={submit}>
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input className="form-input" type="email" placeholder="you@example.com" value={form.email} onChange={set('email')} required />
            </div>
            <div className="form-group">
              <label className="form-label">Password</label>
              <input className="form-input" type="password" placeholder="Your password" value={form.password} onChange={set('password')} required />
            </div>
            <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ marginTop:'1rem' }}>
              {loading ? '⏳ Signing in...' : '→ Sign In'}
            </button>
          </form>
        </div>
    </div>
  );
}

const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

export function Register() {
  const { register, googleLogin } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    name:'', email:'', password:'', phone:'', city:'', state:'',
    age:'', gender:'', bloodGroup:'', role:'user',
  });
  const [loading, setLoading] = useState(false);
  const set = k => e => setForm(p => ({ ...p, [k]: e.target.value }));

  const submit = async e => {
    e.preventDefault();
    setLoading(true);
    try { await register(form); navigate('/dashboard'); }
    catch(err) { toast.error(err.response?.data?.message || 'Registration failed'); }
    finally { setLoading(false); }
  };

  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      await googleLogin(credentialResponse.credential);
      navigate('/dashboard');
    } catch (err) {
      toast.error('Google Sign-In failed');
    }
  };

  const StepDot = ({ n }) => (
    <div style={{ display:'flex', alignItems:'center', gap:'8px' }}>
      <div style={{
        width:'32px', height:'32px', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center',
        fontSize:'0.8rem', fontWeight:'800',
        background: step > n ? 'var(--teal)' : step === n ? '#06b6d4' : 'rgba(225, 29, 72, 0.04)',
        color: '#fff',
        border: step === n ? '2.5px solid rgba(248,113,113,0.4)' : '1px solid rgba(225, 29, 72, 0.2)',
        transition:'all 0.3s',
      }}>{step > n ? '✓' : n}</div>
      <span style={{ fontSize:'0.75rem', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.08em', color: step === n ? '#22d3ee' : 'var(--text-secondary)' }}>
        {['Personal','Medical','Account'][n-1]}
      </span>
    </div>
  );

  return (
    <div style={PANEL_STYLE}>
      <div style={{ position:'absolute', right: '5%', top: '5%', width: '350px', height: '350px', background: 'rgba(20,184,166,0.05)', borderRadius: '50%', filter: 'blur(80px)', pointerEvents: 'none' }} />

        <div style={{ ...BOX_STYLE, padding: '2.5rem', borderRadius: '24px' }} className="glass-panel login-card">
          {/* Step indicator */}
          <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'3rem', flexWrap: 'wrap' }}>
            <StepDot n={1}/><div style={{ flex:1, height:'2px', background: step>1?'var(--teal)':'rgba(225, 29, 72, 0.2)', transition:'background 0.3s', borderRadius:'2px', minWidth: '20px' }}/>
            <StepDot n={2}/><div style={{ flex:1, height:'2px', background: step>2?'var(--teal)':'rgba(225, 29, 72, 0.2)', transition:'background 0.3s', borderRadius:'2px', minWidth: '20px' }}/>
            <StepDot n={3}/>
          </div>

          {step === 1 && (
            <div className="fade-up">
              <h1 style={{ fontSize:'2rem', fontWeight: 950, marginBottom:'0.5rem', color:'#4c0519' }}>Personal Info</h1>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'2rem' }}>Already registered? <Link to="/login" style={{ color:'#22d3ee', fontWeight:'700' }}>Sign in</Link></p>
              
              <div style={{ display:'flex', justifyContent:'center', marginBottom:'2rem' }}>
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={() => toast.error('Google Sign-In was unsuccessful')}
                  theme="filled_black"
                  shape="pill"
                  size="large"
                  text="signup_with"
                  width="400"
                />
              </div>

              <div style={{ display:'flex', alignItems:'center', gap:'1rem', marginBottom:'2rem' }}>
                <div style={{ flex:1, height:'1px', background:'rgba(225, 29, 72, 0.2)' }}/>
                <span style={{ fontSize:'0.75rem', color:'var(--text-secondary)', textTransform:'uppercase', letterSpacing:'0.08em', fontWeight:700 }}>Or register manually</span>
                <div style={{ flex:1, height:'1px', background:'rgba(225, 29, 72, 0.2)' }}/>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" placeholder="Rahul" value={form.name.split(' ')[0] || ''} onChange={e => setForm(p=>({...p,name:e.target.value+' '+(p.name.split(' ')[1]||'')}))} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" placeholder="Sharma" value={form.name.split(' ')[1]||''} onChange={e => setForm(p=>({...p,name:(p.name.split(' ')[0]||'')+' '+e.target.value}))} />
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" placeholder="28" value={form.age} onChange={set('age')} /></div>
                <div className="form-group"><label className="form-label">Gender</label>
                  <select className="form-select" value={form.gender} onChange={set('gender')}>
                    <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Mobile Number</label><input className="form-input" placeholder="+91 98765 43210" value={form.phone} onChange={set('phone')} /></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">City</label><input className="form-input" placeholder="Mumbai" value={form.city} onChange={set('city')} /></div>
                <div className="form-group"><label className="form-label">State</label><input className="form-input" placeholder="Maharashtra" value={form.state} onChange={set('state')} /></div>
              </div>
              <button className="btn btn-primary btn-block btn-lg" onClick={() => setStep(2)} style={{ marginTop: '1rem' }}>Continue →</button>
            </div>
          )}

          {step === 2 && (
            <div className="fade-up">
              <h1 style={{ fontSize:'2rem', fontWeight: 950, marginBottom:'0.5rem', color:'#4c0519' }}>Medical Info</h1>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'2rem' }}>Stored securely and kept private.</p>
              <div className="form-group">
                <label className="form-label">Blood Group</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.8rem', marginTop:'1rem' }}>
                  {BLOOD_GROUPS.map(bg => (
                    <div key={bg} onClick={() => setForm(p=>({...p, bloodGroup:bg}))}
                      style={{
                        background: form.bloodGroup===bg ? 'linear-gradient(135deg, #06b6d4, #14b8a6)' : 'rgba(225, 29, 72, 0.03)',
                        border: `1px solid ${form.bloodGroup===bg ? 'transparent' : 'rgba(225, 29, 72, 0.2)'}`,
                        borderRadius:'12px', padding:'0.85rem 0', textAlign:'center',
                        fontSize:'1rem', fontWeight:'800',
                        color: form.bloodGroup===bg ? '#fff' : 'var(--text-secondary)',
                        cursor:'pointer', transition:'all 0.3s',
                        boxShadow: form.bloodGroup===bg ? '0 4px 15px rgba(6,182,212,0.3)' : 'none'
                      }}>{bg}</div>
                  ))}
                </div>
              </div>
              <div style={{ display:'flex', gap:'1rem', marginTop:'2.5rem' }}>
                <button className="btn btn-ghost" onClick={() => setStep(1)} style={{ flex: 1 }}>← Back</button>
                <button className="btn btn-primary btn-block btn-lg" onClick={() => setStep(3)} style={{ flex: 2 }}>Continue →</button>
              </div>
            </div>
          )}

          {step === 3 && (
            <form onSubmit={submit} className="fade-up">
              <h1 style={{ fontSize:'2rem', fontWeight: 950, marginBottom:'0.5rem', color:'#4c0519' }}>Create Account</h1>
              <p style={{ color:'var(--text-secondary)', fontSize:'0.9rem', marginBottom:'2rem' }}>Almost done — set your credentials.</p>
              <div className="form-group"><label className="form-label">Email Address</label><input className="form-input" type="email" placeholder="rahul@example.com" value={form.email} onChange={set('email')} required /></div>
              <div className="form-group"><label className="form-label">Password</label><input className="form-input" type="password" placeholder="Min. 6 characters" value={form.password} onChange={set('password')} required /></div>
              <div style={{ display:'flex', gap:'1rem', marginTop:'2.5rem' }}>
                <button type="button" className="btn btn-ghost" onClick={() => setStep(2)} style={{ flex: 1 }}>← Back</button>
                <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={loading} style={{ flex: 2 }}>
                  {loading ? '⏳ Creating...' : '🎉 Create Account'}
                </button>
              </div>
            </form>
          )}
        </div>
    </div>
  );
}

export default Login;
