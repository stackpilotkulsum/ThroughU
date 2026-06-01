import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { organAPI, hospitalAPI, donorAPI, bloodAPI, userAPI } from '../utils/api';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

// Google Maps Imports
import { GoogleMap, useJsApiLoader, Marker, InfoWindow } from '@react-google-maps/api';
import {
  GOOGLE_MAPS_API_KEY,
  MAP_CENTER,
  LIBRARIES,
  DEFAULT_MAP_OPTIONS,
} from '../config/googleMaps';

const ORGANS = ['Heart','Lungs','Liver','Kidneys','Corneas','Bone','Skin','Pancreas'];
const ORGAN_ICONS = { Heart:'🫀', Lungs:'🫁', Liver:'🟤', Kidneys:'🫘', Corneas:'👁️', Bone:'🦴', Skin:'💪', Pancreas:'🟡' };
const BLOOD_GROUPS = ['A+','A-','B+','B-','O+','O-','AB+','AB-'];

const MAP_CONTAINER_STYLE = { width: '100%', height: '100%' };

// SVG marker icons as data URIs
const createSvgMarker = (color, size = 14) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}"><circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="#fff" stroke-width="2"/></svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: { width: size, height: size },
    anchor: { x: size / 2, y: size / 2 },
  };
};

const hospitalMarkerIcon = createSvgMarker('#3b82f6', 18);
const pinMarkerIcon = createSvgMarker('#fb7185', 20);

// Shared Google Maps loader hook
function useGoogleMaps() {
  return useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });
}

// ────────────────────────────────────────────
//  ORGAN PLEDGE PAGE
// ────────────────────────────────────────────
export function OrganPledge() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [loading,  setLoading]  = useState(true);
  const [form,     setForm]     = useState({ organ:'', bloodGroup:'', hospital:'', city:'', patientName:'', patientAge:'', urgency:'urgent', contactPhone:'', medicalNotes:'' });
  const [showForm, setShowForm] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    organAPI.getAll({}).then(r => { setRequests(r.data.requests||[]); setLoading(false); }).catch(()=>setLoading(false));
  }, []);

  const submit = async e => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    setSubmitting(true);
    try {
      await organAPI.create(form);
      toast.success('🫀 Organ request submitted!');
      setShowForm(false);
      const r = await organAPI.getAll({});
      setRequests(r.data.requests||[]);
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); }
    setSubmitting(false);
  };

  const urgBg    = u => ({critical:'rgba(248,113,113,0.15)',urgent:'rgba(251,191,36,0.15)',normal:'rgba(20,184,166,0.15)'}[u]);
  const urgColor = u => ({critical:'#f87171',urgent:'#fbbf24',normal:'#14b8a6'}[u]);

  return (
    <div className="page-wrapper" style={{ overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="hero-orb hero-orb-1" style={{ opacity: 0.6 }} />
      <div className="hero-orb hero-orb-2" style={{ opacity: 0.4 }} />

      <div style={{ padding:'5rem 0 3rem', position:'relative', zIndex: 2 }}>
        <div className="container">
          <div className="section-tag">Organ Donation</div>
          <h1 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight: 900, marginBottom:'1rem', lineHeight:1.1 }}>
            After you, <span className="text-brand-gradient">life</span> continues in them.
          </h1>
          <p style={{ color:'var(--text-secondary)', maxWidth:'520px', fontSize: '1.05rem', lineHeight:1.75, marginBottom:'2.5rem' }}>
            One organ donor can save up to 8 lives. Pledge your organs today — it costs nothing and means everything.
          </p>
          <div style={{ display:'flex', gap:'1.2rem', flexWrap: 'wrap' }}>
            <Link to="/become-donor"><button className="btn btn-teal">🫀 Pledge My Organs</button></Link>
            <button className="btn btn-ghost" onClick={() => setShowForm(!showForm)}>+ Post Request</button>
          </div>
          {/* Organ chips */}
          <div style={{ display:'flex', gap:'0.65rem', marginTop:'3rem', flexWrap:'wrap' }}>
            {ORGANS.map(o => (
              <span key={o} style={{ display:'inline-flex', alignItems:'center', gap:'8px', background:'rgba(20,184,166,0.08)', border:'1px solid rgba(20,184,166,0.18)', borderRadius:'100px', padding:'0.5rem 1.1rem', fontSize:'0.82rem', fontWeight:'600', color:'#14b8a6' }}>
                {ORGAN_ICONS[o]} {o}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem', position: 'relative', zIndex: 2 }}>
        {/* Post request form */}
        {showForm && (
          <div className="glass-panel" style={{ padding:'2.5rem', marginBottom:'2.5rem' }}>
            <h3 style={{ fontSize:'1.5rem', fontWeight: 900, marginBottom:'2rem', color: '#4c0519' }}>Post Organ Request</h3>
            <form onSubmit={submit}>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Organ Needed *</label>
                  <select className="form-select" value={form.organ} onChange={e=>setForm(p=>({...p,organ:e.target.value}))} required>
                    <option value="">Select organ</option>
                    {ORGANS.map(o=><option key={o}>{o}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Blood Group</label>
                  <select className="form-select" value={form.bloodGroup} onChange={e=>setForm(p=>({...p,bloodGroup:e.target.value}))}>
                    <option value="">Select</option>
                    {BLOOD_GROUPS.map(b=><option key={b}>{b}</option>)}
                  </select>
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Patient Name *</label><input className="form-input" value={form.patientName} onChange={e=>setForm(p=>({...p,patientName:e.target.value}))} required/></div>
                <div className="form-group"><label className="form-label">Patient Age</label><input className="form-input" type="number" value={form.patientAge} onChange={e=>setForm(p=>({...p,patientAge:e.target.value}))}/></div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Hospital *</label><input className="form-input" value={form.hospital} onChange={e=>setForm(p=>({...p,hospital:e.target.value}))} required/></div>
                <div className="form-group"><label className="form-label">City *</label><input className="form-input" value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} required/></div>
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Urgency</label>
                  <select className="form-select" value={form.urgency} onChange={e=>setForm(p=>({...p,urgency:e.target.value}))}>
                    <option value="critical">🔴 Critical</option>
                    <option value="urgent">🟡 Urgent</option>
                    <option value="normal">🟢 Normal</option>
                  </select>
                </div>
                <div className="form-group"><label className="form-label">Contact Phone *</label><input className="form-input" value={form.contactPhone} onChange={e=>setForm(p=>({...p,contactPhone:e.target.value}))} required/></div>
              </div>
              <div className="form-group"><label className="form-label">Medical Notes</label><textarea className="form-input" rows={3} value={form.medicalNotes} onChange={e=>setForm(p=>({...p,medicalNotes:e.target.value}))} style={{resize:'vertical'}}/></div>
              <div style={{ display:'flex', gap:'1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn btn-teal" disabled={submitting}>{submitting?'Submitting...':'Submit Request'}</button>
                <button type="button" className="btn btn-secondary" onClick={()=>setShowForm(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        <h2 style={{ fontSize:'1.6rem', fontWeight: 900, marginBottom:'1.8rem', color: '#4c0519' }}>Active Organ Requests</h2>
        {loading ? <div className="spinner"/> : requests.length===0 ? (
          <div className="glass-panel" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🫀</div>
            <h3 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>No Requests Currently</h3>
            <p style={{ color: 'var(--text-secondary)' }}>All organ donation requests have been fulfilled.</p>
          </div>
        ) : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:'1.5rem' }} className="grid-3">
            {requests.map(r => (
              <div key={r._id} className="glass-panel" style={{ padding:'2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.2rem', alignItems: 'center' }}>
                  <span style={{ fontSize:'2.2rem' }}>{ORGAN_ICONS[r.organ]||'🏥'}</span>
                  <span style={{ 
                    background:urgBg(r.urgency), color:urgColor(r.urgency), 
                    padding:'5px 12px', borderRadius:'100px', fontSize:'0.7rem', 
                    fontWeight:'900', textTransform:'uppercase', border: `1px solid rgba(${r.urgency === 'critical' ? '248,113,113' : r.urgency === 'urgent' ? '251,191,36' : '20,184,166'}, 0.2)`
                  }}>{r.urgency}</span>
                </div>
                <h3 style={{ fontWeight:'850', fontSize:'1.2rem', color: '#4c0519', marginBottom:'6px' }}>{r.organ} Needed</h3>
                <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'6px' }}>👤 Patient: <strong>{r.patientName}</strong>{r.patientAge?` (${r.patientAge} yrs)`:''}</div>
                <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'6px' }}>🏥 Hospital: <strong>{r.hospital}</strong></div>
                <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)', marginBottom:'1.2rem' }}>📍 Location: <strong>{r.city}</strong></div>
                {r.bloodGroup && (
                  <div style={{ marginBottom: '1.5rem' }}>
                    <span style={{ 
                      background:'rgba(248,113,113,0.12)', color:'#f87171', 
                      padding:'4px 12px', borderRadius:'100px', fontSize:'0.75rem', 
                      fontWeight:'800', border: '1px solid rgba(248,113,113,0.2)' 
                    }}>Blood: {r.bloodGroup}</span>
                  </div>
                )}
                <a href={`tel:${r.contactPhone}`} style={{ marginTop: 'auto', width: '100%' }}>
                  <button className="btn btn-teal btn-sm btn-block">📞 Contact Hospital</button>
                </a>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
//  HOSPITALS MAP VIEW (extracted for Google Maps)
// ────────────────────────────────────────────
function HospitalsMapView({ combinedMapHosp }) {
  const [activeInfo, setActiveInfo] = useState(null);

  return (
    <div style={{ height:'500px', borderRadius:'24px', overflow:'hidden', marginBottom:'3rem', border:'1px solid rgba(225, 29, 72, 0.15)', boxShadow: 'var(--glass-shadow)' }}>
      <GoogleMap
        mapContainerStyle={MAP_CONTAINER_STYLE}
        center={MAP_CENTER}
        zoom={5}
        options={DEFAULT_MAP_OPTIONS}
      >
        {combinedMapHosp.filter(h => h.location?.lat && h.location?.lng).map(h => (
          <Marker
            key={h._id}
            position={{ lat: h.location.lat, lng: h.location.lng }}
            icon={hospitalMarkerIcon}
            onClick={() => setActiveInfo(h)}
          />
        ))}
        {activeInfo && (
          <InfoWindow
            position={{ lat: activeInfo.location.lat, lng: activeInfo.location.lng }}
            onCloseClick={() => setActiveInfo(null)}
          >
            <div style={{ fontFamily:"'Playfair Display', serif", padding:'6px', minWidth:'200px', color:'#4c0519' }}>
              <div style={{ fontWeight:'800', fontSize: '1rem', marginBottom:'4px' }}>🏥 {activeInfo.name}</div>
              <div style={{ fontSize:'0.8rem', color:'#64748b', marginBottom:'8px' }}>📍 {activeInfo.city} · ⭐ {activeInfo.rating}</div>
              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                {activeInfo.isOpen24x7 && <span style={{ background:'rgba(20,184,166,0.12)', color:'#14b8a6', padding:'2px 8px', borderRadius:'6px', fontSize:'0.7rem', fontWeight:'700' }}>24/7</span>}
                {activeInfo.hasBloodBank && <span style={{ background:'rgba(248,113,113,0.12)', color:'#f87171', padding:'2px 8px', borderRadius:'6px', fontSize:'0.7rem', fontWeight:'700' }}>Blood Bank</span>}
              </div>
              {activeInfo.phone && <div style={{ fontSize:'0.8rem', marginTop:'8px', fontWeight:'700' }}>📞 Phone: {activeInfo.phone}</div>}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </div>
  );
}

// ────────────────────────────────────────────
//  HOSPITALS PAGE with Google Map
// ────────────────────────────────────────────
export function Hospitals() {
  const [hospitals, setHospitals] = useState([]);
  const [mapHosp,   setMapHosp]   = useState([]);
  const [loading,   setLoading]   = useState(true);
  const [search,    setSearch]    = useState('');
  const [filter,    setFilter]    = useState({ type:'', hasBloodBank:false });
  const [mapView,   setMapView]   = useState(false);
  const [externalHospitals, setExternalHospitals] = useState([]);
  const [isFetchingExternal, setIsFetchingExternal] = useState(false);

  useEffect(() => {
    hospitalAPI.getAll({ city: search, ...filter.type?{type:filter.type}:{}, ...filter.hasBloodBank?{hasBloodBank:true}:{} })
      .then(r => setHospitals(r.data.hospitals||[])).catch(()=>{}).finally(()=>setLoading(false));
    hospitalAPI.getMap().then(r => setMapHosp(r.data.hospitals||[])).catch(()=>{});
  }, [search, filter]);

  useEffect(() => {
    if (!search || search.length < 3) {
      setExternalHospitals([]);
      setIsFetchingExternal(false);
      return;
    }
    const timer = setTimeout(() => {
      setIsFetchingExternal(true);
      const query = `[out:json][timeout:25];area[name~"${search}",i]->.searchArea;(node["amenity"="hospital"](area.searchArea);way["amenity"="hospital"](area.searchArea);relation["amenity"="hospital"](area.searchArea););out center;`;
      fetch('https://overpass-api.de/api/interpreter', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        },
        body: 'data=' + encodeURIComponent(query)
      })
      .then(res => res.json())
      .then(data => {
        if (data && data.elements) {
          const fetched = data.elements
            .filter(el => el.tags && el.tags.name)
            .map(el => ({
              _id: 'osm_' + el.id,
              name: el.tags.name,
              city: search,
              location: { lat: el.lat || el.center?.lat, lng: el.lon || el.center?.lon },
              type: 'external',
              rating: 'N/A',
              isExternal: true
            }))
            .filter(el => el.location.lat && el.location.lng);
          setExternalHospitals(fetched);
        } else { setExternalHospitals([]); }
      })
      .catch(() => setExternalHospitals([]))
      .finally(() => setIsFetchingExternal(false));
    }, 1500);
    return () => clearTimeout(timer);
  }, [search]);

  const INDIAN_CITIES = [
    "Mumbai", "Delhi", "Bangalore", "Hyderabad", "Ahmedabad", "Chennai", "Kolkata", "Surat", "Pune", "Jaipur",
    "Lucknow", "Kanpur", "Nagpur", "Indore", "Thane", "Bhopal", "Visakhapatnam", "Pimpri-Chinchwad", "Patna",
    "Vadodara", "Ghaziabad", "Ludhiana", "Agra", "Nashik", "Faridabad", "Meerut", "Rajkot", "Kalyan-Dombivli",
    "Vasai-Virar", "Varanasi", "Srinagar", "Aurangabad", "Dhanbad", "Amritsar", "Navi Mumbai", "Allahabad",
    "Howrah", "Ranchi", "Gwalior", "Jabalpur", "Coimbatore", "Vijayawada", "Jodhpur", "Madurai", "Raipur",
    "Kota", "Guwahati", "Chandigarh", "Solapur", "Hubli-Dharwad", "Bareilly", "Moradabad", "Mysore", "Gurugram",
    "Aligarh", "Jalandhar", "Tiruchirappalli", "Bhubaneswar", "Salem", "Mira-Bhayandar", "Warangal", "Thiruvananthapuram",
    "Bhiwandi", "Saharanpur", "Guntur", "Amravati", "Bikaner", "Noida", "Jamshedpur", "Bhilai", "Cuttack",
    "Firozabad", "Kochi", "Nellore", "Bhavnagar", "Dehradun", "Durgapur", "Asansol", "Rourkela", "Nanded",
    "Kolhapur", "Ajmer", "Akola", "Gulbarga", "Jamnagar", "Ujjain", "Loni", "Siliguri", "Jhansi", "Ulhasnagar",
    "Jammu", "Sangli-Miraj & Kupwad", "Mangalore", "Erode", "Belgaum", "Kurnool", "Ambattur", "Rajahmundry",
    "Tirunelveli", "Malegaon", "Gaya", "Udaipur", "Kakinada", "Davangere", "Kozhikode", "Maheshtala", "Rajpur Sonarpur",
    "Bokaro", "South Dumdum", "Bellary", "Patiala", "Gopalpur", "Agartala", "Bhagalpur", "Muzaffarnagar", "Bhatpara",
    "Panihati", "Latur", "Dhule", "Tirupati", "Rohtak", "Korba", "Bhilwara", "Berhampur", "Muzaffarpur", "Ahmednagar",
    "Mathura", "Kollam", "Avadi", "Kadapa", "Kamarhati", "Sambalpur", "Bilaspur", "Shahjahanpur", "Satara", "Bijapur",
    "Rampur", "Shivamogga", "Chandrapur", "Junagadh", "Thrissur", "Alwar", "Bardhaman", "Kulti", "Nizamabad", "Parbhani",
    "Tumkur", "Khammam", "Ozhukarai", "Bihar Sharif", "Panipat", "Darbhanga", "Bally", "Aizawl", "Dewas", "Ichalkaranji",
    "Karnal", "Bathinda", "Jalna", "Eluru", "Kirari Suleman Nagar", "Barasat", "Purnia", "Satna", "Mau", "Sonipat",
    "Farrukhabad", "Sagar", "Rourkela", "Durg", "Imphal", "Ratlam", "Hapur", "Arrah", "Karimnagar", "Anantapur",
    "Etawah", "Ambernath", "North Dumdum", "Bharatpur", "Begusarai", "New Delhi", "Gandhidham", "Baranagar", "Tiruvottiyur",
    "Puducherry", "Sikar", "Thoothukudi", "Rewa", "Mirzapur", "Raichur", "Pali", "Ramagundam", "Haridwar", "Vijayanagaram",
    "Katihar", "Nagercoil", "Sri Ganganagar", "Karawal Nagar", "Mango", "Thanjavur", "Bulandshahr", "Uluberia", "Murwara",
    "Sambhal", "Singrauli", "Nadiad", "Secunderabad", "Naihati", "Yamunanagar", "Bidhannagar", "Pallavaram", "Bidar",
    "Munger", "Panchkula", "Burhanpur", "Raurkela Industrial Township", "Kharagpur", "Dindigul", "Gandhinagar", "Hospet",
    "Nangloi Jat", "English Bazar", "Ongole", "Deoghar", "Chapra", "Haldia", "Khandwa", "Nandyal", "Chittoor", "Morena",
    "Amroha", "Anand", "Bhind", "Bhalswa Jahangir Pur", "Madhyamgram", "Bhiwani", "Navi Mumbai Panvel Raigad", "Baharampur",
    "Ambala", "Morvi", "Fatehpur", "Rae Bareli", "Khora", "Bhusawal", "Orai", "Bahraich", "Vellore", "Mahesana",
    "Raiganj", "Sirsa", "Danapur", "Serampore", "Sultan Pur Majra", "Guna", "Jaunpur", "Panvel", "Shivpuri", "Surendranagar Dudhrej",
    "Unnao", "Hugli and Chinsurah", "Alappuzha", "Kottayam", "Shimla", "Prayagraj"
  ];
  
  const uniqueCities = Array.from(new Set([...INDIAN_CITIES, ...mapHosp.map(h => h.city)])).filter(Boolean).sort();

  const filteredMapHosp = mapHosp.filter(h => {
    if (search && !h.city?.toLowerCase().includes(search.toLowerCase())) return false;
    if (filter.type && h.type !== filter.type) return false;
    if (filter.hasBloodBank && !h.hasBloodBank) return false;
    return true;
  });

  const filteredExternalHospitals = externalHospitals.filter(h => {
    if (filter.type) return false;
    if (filter.hasBloodBank) return false;
    return true;
  });

  const combinedMapHosp = [...filteredMapHosp, ...filteredExternalHospitals];
  const combinedListHosp = [...hospitals, ...filteredExternalHospitals];

  return (
    <div className="page-wrapper" style={{ overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="hero-orb hero-orb-1" style={{ opacity: 0.6 }} />
      <div className="hero-orb hero-orb-2" style={{ opacity: 0.4 }} />

      <div style={{ padding:'5rem 0 3rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <div className="section-tag">Hospital Network</div>
          <h1 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight: 900, marginBottom:'1rem', lineHeight:1.1 }}>
            Find the right <span className="text-gradient">hospital near you.</span>
          </h1>
          <div style={{ display:'flex', gap:'1rem', flexWrap:'wrap', marginTop:'2rem', alignItems: 'center' }}>
            <input className="form-input" placeholder="🔍 Search city..." style={{ maxWidth:'280px' }}
              value={search} onChange={e => setSearch(e.target.value)} list="cities-list" />
            <datalist id="cities-list">
              {uniqueCities.map(c => <option key={c} value={c} />)}
            </datalist>
            <select className="form-select" style={{ maxWidth:'180px' }}
              value={filter.type} onChange={e => setFilter(p=>({...p,type:e.target.value}))}>
              <option value="">All Types</option>
              <option value="government">Government</option>
              <option value="private">Private</option>
              <option value="clinic">Clinic</option>
            </select>
            <label style={{ display:'flex', alignItems:'center', gap:'10px', color:'var(--text-secondary)', fontSize:'0.9rem', cursor:'pointer', userSelect: 'none' }}>
              <input type="checkbox" checked={filter.hasBloodBank} onChange={e=>setFilter(p=>({...p,hasBloodBank:e.target.checked}))} style={{ width: '16px', height: '16px', accentColor:'#22d3ee', cursor: 'pointer' }}/>
              Blood Bank only
            </label>
            <button onClick={()=>setMapView(v=>!v)} style={{ 
              background:mapView?'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)':'rgba(225, 29, 72, 0.05)', 
              border: mapView?'none':'1px solid rgba(225, 29, 72, 0.25)', 
              borderRadius:'12px', padding:'0.75rem 1.4rem', color:'#fff', 
              fontSize:'0.85rem', fontWeight:'700', cursor:'pointer', transition: 'all 0.3s' 
            }}
            onMouseEnter={e => { if(!mapView) e.currentTarget.style.background='rgba(255,255,255,0.08)'; }}
            onMouseLeave={e => { if(!mapView) e.currentTarget.style.background='rgba(225, 29, 72, 0.05)'; }}
            >
              {mapView?'📋 List View':'🗺️ Map View'}
            </button>
          </div>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem', position: 'relative', zIndex: 2 }}>
        {mapView ? (
          <HospitalsMapView combinedMapHosp={combinedMapHosp} />
        ) : null}

        {loading ? <div className="spinner"/> : (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:'1.5rem' }} className="grid-2">
            {isFetchingExternal && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '1rem', color: 'var(--text-secondary)', fontSize: '1rem', fontStyle: 'italic' }}>
                Fetching live hospitals from OpenStreetMap...
              </div>
            )}
            {combinedListHosp.length === 0 && !isFetchingExternal && (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)', fontSize: '1.2rem', fontWeight: 'bold' }}>
                No hospitals found matching your criteria.
              </div>
            )}
            {combinedListHosp.map(h => (
              <div key={h._id} className="glass-panel" style={{ padding:'2rem', display: 'flex', flexDirection: 'column' }}>
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1.2rem', alignItems: 'flex-start' }}>
                  <div>
                    <h3 style={{ fontWeight:'850', fontSize:'1.2rem', color: '#4c0519', marginBottom:'4px' }}>🏥 {h.name}</h3>
                    <div style={{ fontSize:'0.9rem', color:'var(--text-secondary)' }}>📍 {h.city}{h.state?`, ${h.state}`:''}</div>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <div style={{ fontWeight:'900', color:'#fbbf24', fontSize: '1.1rem' }}>⭐ {h.rating}</div>
                    <div style={{ fontSize:'0.75rem', color: h.isExternal ? '#f43f5e' : 'var(--text-secondary)', textTransform:'uppercase', letterSpacing: '0.08em', marginTop: '2px', fontWeight: h.isExternal ? 'bold' : 'normal' }}>
                      {h.isExternal ? 'OPENSTREETMAP' : h.type}
                    </div>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap', marginBottom:'1.5rem', marginTop: 'auto' }}>
                  {h.isOpen24x7   && <span style={{ background:'rgba(20,184,166,0.12)',  color:'#14b8a6', border: '1px solid rgba(20,184,166,0.2)', padding:'4px 10px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:'800' }}>24/7 OPEN</span>}
                  {h.hasBloodBank && <span style={{ background:'rgba(244,63,94,0.12)', color:'#f43f5e', border: '1px solid rgba(244,63,94,0.2)', padding:'4px 10px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:'800' }}>BLOOD BANK</span>}
                  {h.hasOT        && <span style={{ background:'rgba(139,92,246,0.12)', color:'#8b5cf6', border: '1px solid rgba(139,92,246,0.2)', padding:'4px 10px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:'800' }}>SURGERY OT</span>}
                  {h.isExternal   && <span style={{ background:'rgba(59,130,246,0.12)', color:'#3b82f6', border: '1px solid rgba(59,130,246,0.2)', padding:'4px 10px', borderRadius:'6px', fontSize:'0.72rem', fontWeight:'800' }}>LIVE DATA</span>}
                </div>
                {h.specialties && h.specialties.length > 0 && (
                  <div style={{ fontSize:'0.8rem', color:'var(--text-secondary)', marginBottom:'1.5rem', lineHeight:1.6 }}>
                    <strong style={{color:'var(--text-primary)'}}>Specialties:</strong> {h.specialties.join(', ')}
                  </div>
                )}
                {h.phone && (
                  <a href={`tel:${h.phone}`} style={{ width: '100%' }}>
                    <button className="btn btn-secondary btn-sm btn-block">📞 {h.phone}</button>
                  </a>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
//  BECOME DONOR PAGE
// ────────────────────────────────────────────
export function BecomeDonor() {
  const { user, updateUser } = useAuth();
  const navigate = useNavigate();
  const [tab,  setTab]  = useState('blood'); // blood | organ | both
  const [form, setForm] = useState({
    donationType: 'blood',
    bloodGroup: user?.bloodGroup || '',
    organsPledged: [],
    city: user?.city || '',
    state: user?.state || '',
    address: '',
    medicalNotes: '',
    location: user?.location || null,
  });
  const [submitting, setSubmitting] = useState(false);
  const hasUserLoc = !!(user?.location?.lat && user?.location?.lng);
  const [mapCenter,  setMapCenter]  = useState(hasUserLoc ? { lat: user.location.lat, lng: user.location.lng } : MAP_CENTER);
  const [pinPos,     setPinPos]     = useState(hasUserLoc ? [user.location.lat, user.location.lng] : null);

  useEffect(() => {
    if (user?.location?.lat && user?.location?.lng) {
      const pos = [user.location.lat, user.location.lng];
      setMapCenter({ lat: user.location.lat, lng: user.location.lng });
      setPinPos(pos);
    }
  }, [user]);

  const toggleOrgan = o => setForm(p => ({
    ...p,
    organsPledged: p.organsPledged.includes(o)
      ? p.organsPledged.filter(x=>x!==o)
      : [...p.organsPledged, o]
  }));

  const submit = async e => {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, donationType: tab };
    try {
      await donorAPI.register(payload);
      updateUser({ isDonor: true, isOrganPledged: tab !== 'blood' });
      toast.success('🎉 Registered as donor!');
      navigate('/dashboard');
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); }
    setSubmitting(false);
  };

  return (
    <div className="page-wrapper" style={{ overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="hero-orb hero-orb-1" style={{ opacity: 0.6 }} />
      <div className="hero-orb hero-orb-2" style={{ opacity: 0.4 }} />

      <div style={{ padding:'5rem 0 3rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <h1 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight: 900, marginBottom:'1rem', lineHeight:1.1 }}>
            Become a <span className="text-coral-gradient">Donor</span>
          </h1>
          <p style={{ color:'var(--text-secondary)', maxWidth:'520px', fontSize: '1.05rem', lineHeight:1.75 }}>
            Register as a blood and/or organ donor. Pin your location on the map so recipients can find you quickly in emergencies.
          </p>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem' }} className="grid-2">
          {/* Form */}
          <div className="glass-panel" style={{ padding: '2.5rem' }}>
            {/* Type tabs */}
            <div style={{ display:'flex', background:'rgba(225, 29, 72, 0.04)', border: '1px solid rgba(225, 29, 72, 0.15)', borderRadius:'12px', padding:'4px', marginBottom:'2rem', width:'fit-content' }}>
              {[['blood','🩸 Blood'],['organ','🫀 Organ'],['both','❤️ Both']].map(([k,l]) => (
                <button key={k} onClick={()=>{setTab(k);setForm(p=>({...p,donationType:k}));}} style={{
                  padding:'0.6rem 1.3rem', borderRadius:'9px', border:'none', cursor:'pointer',
                  background: tab===k?'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)':'transparent', 
                  color: tab===k?'#fff':'var(--text-secondary)',
                  fontWeight:'700', fontSize:'0.85rem', fontFamily:"'Playfair Display', serif",
                  boxShadow: tab===k?'0 4px 12px rgba(6,182,212,0.2)':'none', transition:'all 0.3s',
                }}>{l}</button>
              ))}
            </div>

            <form onSubmit={submit}>
              {(tab==='blood'||tab==='both') && (
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" style={{ marginBottom: '1rem' }}>Select Blood Group *</label>
                  <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.65rem' }}>
                    {BLOOD_GROUPS.map(bg => {
                      const active = form.bloodGroup === bg;
                      return (
                        <div key={bg} onClick={()=>setForm(p=>({...p,bloodGroup:bg}))} style={{
                          background: active ? 'linear-gradient(135deg, #f87171 0%, #fb7185 100%)' : 'rgba(225, 29, 72, 0.03)',
                          border: `1px solid ${active ? 'transparent' : 'rgba(225, 29, 72, 0.2)'}`,
                          borderRadius:'10px', padding:'0.75rem 0', textAlign:'center',
                          fontSize:'0.95rem', fontWeight:'800',
                          color: active ? '#fff' : 'var(--text-secondary)',
                          cursor:'pointer', transition:'all 0.3s',
                          boxShadow: active ? '0 6px 15px rgba(248, 113, 113, 0.25)' : 'none',
                        }}>{bg}</div>
                      );
                    })}
                  </div>
                </div>
              )}

              {(tab==='organ'||tab==='both') && (
                <div className="form-group" style={{ marginBottom: '2rem' }}>
                  <label className="form-label" style={{ marginBottom: '1rem' }}>Organs to Pledge</label>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:'0.65rem' }}>
                    {ORGANS.map(o => {
                      const active = form.organsPledged.includes(o);
                      return (
                        <div key={o} onClick={()=>toggleOrgan(o)} style={{
                          display:'flex', alignItems:'center', gap:'8px',
                          background: active ? 'rgba(20,184,166,0.15)' : 'rgba(225, 29, 72, 0.03)',
                          border: `1px solid ${active ? '#14b8a6' : 'rgba(225, 29, 72, 0.2)'}`,
                          borderRadius:'10px', padding:'0.6rem 1.1rem', cursor:'pointer', transition:'all 0.3s',
                          color: active ? '#22d3ee' : 'var(--text-secondary)',
                          fontWeight:'700', fontSize:'0.82rem',
                          boxShadow: active ? '0 4px 12px rgba(20, 184, 166, 0.15)' : 'none'
                        }}>{ORGAN_ICONS[o]} {o}</div>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="form-row">
                <div className="form-group"><label className="form-label">City *</label><input className="form-input" value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))} required/></div>
                <div className="form-group"><label className="form-label">State</label><input className="form-input" value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))}/></div>
              </div>
              <div className="form-group"><label className="form-label">Medical Notes (optional)</label><textarea className="form-input" rows={3} value={form.medicalNotes} onChange={e=>setForm(p=>({...p,medicalNotes:e.target.value}))} style={{resize:'vertical'}} placeholder="Any relevant medical history..."/></div>
              <p style={{ fontSize:'0.82rem', color:'var(--text-secondary)', marginBottom:'1.5rem' }}>📍 Click on the map to pin your location so recipients can find you faster.</p>
              {pinPos && <p style={{ fontSize:'0.85rem', color:'#14b8a6', fontWeight:'700', marginBottom:'1.2rem' }}>✅ Location pinned: {pinPos[0].toFixed(4)}, {pinPos[1].toFixed(4)}</p>}
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting}>
                {submitting ? '⏳ Registering...' : '🎉 Register as Donor'}
              </button>
            </form>
          </div>

          {/* Map to pin location */}
          <div>
            <h3 style={{ fontWeight:'800', marginBottom:'1.2rem', fontSize:'1.05rem', color: '#4c0519' }}>📍 Pin Your Location</h3>
            <div style={{ borderRadius:'24px', overflow:'hidden', border:'1px solid rgba(225, 29, 72, 0.15)', height:'500px', boxShadow: 'var(--glass-shadow)' }}>
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={mapCenter}
                zoom={5}
                options={DEFAULT_MAP_OPTIONS}
                onClick={(e) => {
                  const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                  setPinPos([pos.lat, pos.lng]);
                  setForm(p => ({...p, location: pos}));
                }}
              >
                {pinPos && <Marker position={{ lat: pinPos[0], lng: pinPos[1] }} icon={pinMarkerIcon} />}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
//  BLOOD REQUEST PAGE
// ────────────────────────────────────────────
export function BloodRequest() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ bloodGroup:'', units:1, hospital:'', city:'', state:'', urgency:'urgent', patientName:'', reason:'', contactPhone:'', location:null });
  const [pinPos, setPinPos] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const set = k => e => setForm(p => ({...p, [k]: e.target.value}));

  const submit = async e => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await bloodAPI.create(form);
      toast.success('🚨 Blood request posted! Donors nearby will be alerted.');
      navigate('/blood');
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); }
    setSubmitting(false);
  };

  return (
    <div className="page-wrapper" style={{ overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="hero-orb hero-orb-1" style={{ opacity: 0.6 }} />
      <div className="hero-orb hero-orb-2" style={{ opacity: 0.4 }} />

      <div style={{ padding:'5rem 0 3rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <h1 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight: 900, marginBottom:'1rem', lineHeight:1.1 }}>
            🚨 Emergency <span className="text-coral-gradient">Blood Request</span>
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'1.05rem' }}>Post an urgent blood request. Nearby volunteer donors will be alerted immediately.</p>
        </div>
      </div>

      <div className="container" style={{ padding:'2rem 1.5rem', position: 'relative', zIndex: 2 }}>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'2.5rem' }} className="grid-2">
          <form onSubmit={submit}>
            <div className="glass-panel" style={{ padding:'2.5rem' }}>
              <div className="form-group" style={{ marginBottom: '2rem' }}>
                <label className="form-label" style={{ marginBottom: '1rem' }}>Blood Group Needed *</label>
                <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:'0.65rem' }}>
                  {BLOOD_GROUPS.map(bg => {
                    const active = form.bloodGroup === bg;
                    return (
                      <div key={bg} onClick={()=>setForm(p=>({...p,bloodGroup:bg}))} style={{
                        background: active ? 'linear-gradient(135deg, #f87171 0%, #fb7185 100%)' : 'rgba(225, 29, 72, 0.03)',
                        border:`1px solid ${active ? 'transparent' : 'rgba(225, 29, 72, 0.2)'}`,
                        borderRadius:'10px', padding:'0.75rem 0', textAlign:'center',
                        fontSize:'0.95rem', fontWeight:'800',
                        color: active ? '#fff' : 'var(--text-secondary)',
                        cursor:'pointer', transition:'all 0.3s',
                        boxShadow: active ? '0 6px 15px rgba(248, 113, 113, 0.25)' : 'none',
                      }}>{bg}</div>
                    );
                  })}
                </div>
              </div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Units Required *</label><input className="form-input" type="number" min="1" value={form.units} onChange={set('units')} required/></div>
                <div className="form-group">
                  <label className="form-label">Urgency *</label>
                  <select className="form-select" value={form.urgency} onChange={set('urgency')}>
                    <option value="critical">🔴 Critical — Life threatening</option>
                    <option value="urgent">🟡 Urgent — Within 24hrs</option>
                    <option value="normal">🟢 Normal — Scheduled</option>
                  </select>
                </div>
              </div>
              <div className="form-group"><label className="form-label">Patient Name</label><input className="form-input" value={form.patientName} onChange={set('patientName')} placeholder="Full name"/></div>
              <div className="form-row">
                <div className="form-group"><label className="form-label">Hospital *</label><input className="form-input" value={form.hospital} onChange={set('hospital')} required/></div>
                <div className="form-group"><label className="form-label">City *</label><input className="form-input" value={form.city} onChange={set('city')} required/></div>
              </div>
              <div className="form-group"><label className="form-label">Contact Phone *</label><input className="form-input" type="tel" value={form.contactPhone} onChange={set('contactPhone')} required/></div>
              <div className="form-group"><label className="form-label">Reason / Notes</label><textarea className="form-input" rows={3} value={form.reason} onChange={set('reason')} style={{resize:'vertical'}} placeholder="Brief reason for blood requirement..."/></div>
              {pinPos && <p style={{ fontSize:'0.85rem', color:'#14b8a6', fontWeight:'700', marginBottom:'1.2rem' }}>✅ Location pinned on map</p>}
              <button type="submit" className="btn btn-primary btn-block btn-lg" disabled={submitting} style={{ background:'linear-gradient(135deg, #f87171 0%, #fb7185 100%)', boxShadow: '0 8px 25px rgba(248, 113, 113, 0.3)', border: 'none' }}>
                {submitting ? '⏳ Posting...' : '🚨 Post Blood Request'}
              </button>
            </div>
          </form>

          <div>
            <h3 style={{ fontWeight:'800', marginBottom:'1.2rem', fontSize:'1.05rem', color: '#4c0519' }}>📍 Pin Hospital Location (optional)</h3>
            <div style={{ borderRadius:'24px', overflow:'hidden', border:'1px solid rgba(225, 29, 72, 0.15)', height:'500px', boxShadow: 'var(--glass-shadow)' }}>
              <GoogleMap
                mapContainerStyle={MAP_CONTAINER_STYLE}
                center={MAP_CENTER}
                zoom={5}
                options={DEFAULT_MAP_OPTIONS}
                onClick={(e) => {
                  const pos = { lat: e.latLng.lat(), lng: e.latLng.lng() };
                  setPinPos([pos.lat, pos.lng]);
                  setForm(p => ({...p, location: pos}));
                }}
              >
                {pinPos && <Marker position={{ lat: pinPos[0], lng: pinPos[1] }} icon={pinMarkerIcon} />}
              </GoogleMap>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ────────────────────────────────────────────
//  PROFILE PAGE
// ────────────────────────────────────────────
export function Profile() {
  const { user, updateUser } = useAuth();
  const [form, setForm] = useState({ name:user?.name||'', phone:user?.phone||'', city:user?.city||'', state:user?.state||'', age:user?.age||'', gender:user?.gender||'', bloodGroup:user?.bloodGroup||'' });
  const [saving, setSaving] = useState(false);

  const submit = async e => {
    e.preventDefault();
    setSaving(true);
    try {
      const { data } = await userAPI.update(form);
      updateUser(data.user);
      toast.success('✅ Profile updated!');
    } catch(err) { toast.error(err.response?.data?.message||'Failed'); }
    setSaving(false);
  };

  return (
    <div className="page-wrapper" style={{ overflow: 'hidden' }}>
      {/* Background orbs */}
      <div className="hero-orb hero-orb-1" style={{ opacity: 0.6 }} />
      <div className="hero-orb hero-orb-2" style={{ opacity: 0.4 }} />

      <div style={{ padding:'5rem 0 3rem', position: 'relative', zIndex: 2 }}>
        <div className="container">
          <h1 style={{ fontSize:'clamp(2.5rem,5vw,4rem)', fontWeight: 900, marginBottom:'1rem', lineHeight:1.1 }}>
            My <span className="text-coral-gradient">Profile</span>
          </h1>
          <p style={{ color:'var(--text-secondary)', fontSize:'1.05rem' }}>Manage your personal, contact, and medical information</p>
        </div>
      </div>
      <div className="container" style={{ padding:'2rem 1.5rem', maxWidth:'750px', position: 'relative', zIndex: 2 }}>
        <div className="glass-panel" style={{ padding:'2.5rem' }}>
          {/* Avatar info block */}
          <div style={{ display:'flex', alignItems:'center', gap:'1.8rem', marginBottom:'3rem', flexWrap: 'wrap' }}>
            <div style={{ 
              width:'78px', height:'78px', borderRadius:'50%', 
              background:'linear-gradient(135deg, #06b6d4, #14b8a6)', 
              display:'flex', alignItems:'center', justifyContent:'center', 
              color:'#fff', fontSize:'2rem', fontWeight:'900',
              boxShadow: '0 8px 25px rgba(6,182,212,0.25)',
              border: '2px solid rgba(225, 29, 72, 0.12)'
            }}>
              {user?.name?.[0]?.toUpperCase()}
            </div>
            <div>
              <div style={{ fontWeight:'900', fontSize:'1.3rem', color: '#4c0519' }}>{user?.name}</div>
              <div style={{ color:'var(--text-secondary)', fontSize:'0.88rem', marginTop: '2px' }}>{user?.email}</div>
              <div style={{ display:'flex', gap:'8px', marginTop:'8px', flexWrap: 'wrap' }}>
                {user?.isDonor && <span style={{ background:'rgba(20,184,166,0.12)', color:'#14b8a6', border: '1px solid rgba(20,184,166,0.2)', padding:'4px 12px', borderRadius:'100px', fontSize:'0.72rem', fontWeight:'800' }}>✓ DONOR</span>}
                {user?.isOrganPledged && <span style={{ background:'rgba(248,113,113,0.12)', color:'#f87171', border: '1px solid rgba(248,113,113,0.2)', padding:'4px 12px', borderRadius:'100px', fontSize:'0.72rem', fontWeight:'800' }}>🫀 ORGAN PLEDGED</span>}
              </div>
            </div>
          </div>

          <form onSubmit={submit}>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Full Name</label><input className="form-input" value={form.name} onChange={e=>setForm(p=>({...p,name:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">Phone</label><input className="form-input" value={form.phone} onChange={e=>setForm(p=>({...p,phone:e.target.value}))}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">City</label><input className="form-input" value={form.city} onChange={e=>setForm(p=>({...p,city:e.target.value}))}/></div>
              <div className="form-group"><label className="form-label">State</label><input className="form-input" value={form.state} onChange={e=>setForm(p=>({...p,state:e.target.value}))}/></div>
            </div>
            <div className="form-row">
              <div className="form-group"><label className="form-label">Age</label><input className="form-input" type="number" value={form.age} onChange={e=>setForm(p=>({...p,age:e.target.value}))}/></div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select className="form-select" value={form.gender} onChange={e=>setForm(p=>({...p,gender:e.target.value}))}>
                  <option value="">Select</option><option>Male</option><option>Female</option><option>Other</option>
                </select>
              </div>
            </div>
            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" style={{ marginBottom: '1rem' }}>Blood Group</label>
              <div style={{ display:'grid', gridTemplateColumns:'repeat(8,1fr)', gap:'0.4rem' }}>
                {BLOOD_GROUPS.map(bg => {
                  const active = form.bloodGroup === bg;
                  return (
                    <div key={bg} onClick={()=>setForm(p=>({...p,bloodGroup:bg}))} style={{
                      background: active ? 'linear-gradient(135deg, #f87171 0%, #fb7185 100%)' : 'rgba(225, 29, 72, 0.03)',
                      border:`1px solid ${active ? 'transparent' : 'rgba(225, 29, 72, 0.2)'}`,
                      borderRadius:'8px', padding:'0.6rem 0', textAlign:'center',
                      fontSize:'0.85rem', fontWeight:'800',
                      color: active ? '#fff' : 'var(--text-secondary)',
                      cursor:'pointer', transition:'all 0.3s',
                      boxShadow: active ? '0 4px 10px rgba(248, 113, 113, 0.2)' : 'none',
                    }}>{bg}</div>
                  );
                })}
              </div>
            </div>
            <div style={{ display:'flex', gap:'1.2rem', marginTop:'2rem' }}>
              <button type="submit" className="btn btn-primary" disabled={saving}>{saving?'Saving...':'Save Changes'}</button>
              <Link to="/dashboard"><button type="button" className="btn btn-secondary">Cancel</button></Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
