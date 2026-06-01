import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Circle, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { donorAPI, hospitalAPI, bloodAPI } from '../utils/api';

const MAP_CENTER = [20.5937, 78.9629]; // India center

// ── SVG marker icons as data URIs ───────────────────────
const createLeafletIcon = (color, size = 14) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="#fff" stroke-width="2"/>
  </svg>`;
  return L.icon({
    iconUrl: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    iconSize: [size, size],
    iconAnchor: [size / 2, size / 2],
    popupAnchor: [0, -size / 2]
  });
};

const ICONS = {
  user:       createLeafletIcon('#8b5cf6', 18),
  blood:      createLeafletIcon('#f87171', 14),
  organ:      createLeafletIcon('#14b8a6', 14),
  hospital:   createLeafletIcon('#0ea5e9', 18),
  critical:   createLeafletIcon('#f87171', 16),
  urgent:     createLeafletIcon('#fbbf24', 16),
  normal:     createLeafletIcon('#14b8a6', 16),
};

const FILTER_BTN = (active) => ({
  padding: '0.6rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700',
  cursor: 'pointer', transition: 'all 0.3s', fontFamily: "'Playfair Display', serif",
  background: active ? 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)' : 'rgba(225, 29, 72, 0.04)',
  color: active ? '#fff' : 'var(--text-secondary)',
  border: `1px solid ${active ? 'transparent' : 'rgba(225, 29, 72, 0.2)'}`,
  boxShadow: active ? '0 4px 15px rgba(6, 182, 212, 0.25)' : 'none',
});

// Helper component to pan map to user location
function LocationMarker({ userLoc }) {
  const map = useMap();
  useEffect(() => {
    if (userLoc) {
      map.flyTo(userLoc, 12, { duration: 1.5 });
    }
  }, [userLoc, map]);
  return null;
}

export default function DonorMap() {
  const [donors,    setDonors]    = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [requests,  setRequests]  = useState([]);
  const [filter,    setFilter]    = useState('all');
  const [userLoc,   setUserLoc]   = useState(null);
  const [loading,   setLoading]   = useState(true);

  const mocksAdded = useRef(false);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      try {
        const [d, h, r] = await Promise.all([
          donorAPI.getMap(),
          hospitalAPI.getMap(),
          bloodAPI.getMap(),
        ]);
        setDonors(d.data.donors || []);
        setHospitals(h.data.hospitals || []);
        setRequests(r.data.requests || []);
      } catch {}
      setLoading(false);
    };
    load();

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserLoc([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  }, []);

  useEffect(() => {
    if (userLoc && !mocksAdded.current) {
      mocksAdded.current = true;
      const offset = () => (Math.random() - 0.5) * 0.12; // Spread across a realistic city radius
      const lat = userLoc[0];
      const lng = userLoc[1];
      
      const mockHospitals = Array.from({length: 6}).map((_,i) => ({
        _id: `mock-h-${i}`, name: `City Care Hospital ${i+1}`, location: { lat: lat + offset(), lng: lng + offset() }, specialties: ['Emergency', 'Blood Bank']
      }));
      const mockDonors = Array.from({length: 45}).map((_,i) => ({
        _id: `mock-d-${i}`, name: `Local Donor ${i+1}`, location: { lat: lat + offset(), lng: lng + offset() },
        donationType: Math.random() > 0.35 ? 'blood' : 'organ', bloodGroup: ['A+','O+','B+','AB-'][Math.floor(Math.random()*4)]
      }));
      const mockRequests = Array.from({length: 15}).map((_,i) => ({
        _id: `mock-r-${i}`, patientName: `Emergency Request ${i+1}`, location: { lat: lat + offset(), lng: lng + offset() },
        urgency: ['critical','urgent','normal'][Math.floor(Math.random()*3)], bloodGroup: ['A-','O-','B+'][Math.floor(Math.random()*3)]
      }));

      setHospitals(p => [...p, ...mockHospitals]);
      setDonors(p => [...p, ...mockDonors]);
      setRequests(p => [...p, ...mockRequests]);
    }
  }, [userLoc]);

  const panToUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        setUserLoc([pos.coords.latitude, pos.coords.longitude]);
      });
    }
  };

  const urgencyIcon = u => ICONS[u] || ICONS.critical;

  const showDonors    = filter === 'all' || filter === 'blood' || filter === 'organ';
  const showHospitals = filter === 'all' || filter === 'hospital';
  const showRequests  = filter === 'all' || filter === 'requests';
  const showBloodOnly = filter === 'blood';
  const showOrganOnly = filter === 'organ';

  const filteredDonors = showDonors
    ? donors
        .filter(d => showBloodOnly ? d.donationType==='blood' : showOrganOnly ? d.donationType==='organ' : true)
        .filter(d => d.location?.lat && d.location?.lng)
    : [];

  const filteredHospitals = showHospitals
    ? hospitals.filter(h => h.location?.lat && h.location?.lng)
    : [];

  const filteredRequests = showRequests
    ? requests.filter(r => r.location?.lat && r.location?.lng)
    : [];

  return (
    <div className="page-wrapper" style={{ display:'flex', flexDirection:'column', height:'calc(100vh - 96px)', overflow:'hidden' }}>
      {/* Top bar */}
      <div style={{
        background:'rgba(255, 228, 230, 0.85)', backdropFilter:'blur(24px)', borderBottom:'1px solid rgba(225, 29, 72, 0.15)',
        padding:'1.5rem 2rem', display:'flex', alignItems:'center', justifyContent:'space-between',
        flexWrap:'wrap', gap:'1.5rem', zIndex:10,
      }}>
        <div>
          <h1 style={{ fontSize:'1.8rem', fontWeight: 900, marginBottom:'4px', color:'#4c0519' }}>Live Impact Map</h1>
          <p style={{ fontSize:'0.85rem', color:'var(--text-secondary)', fontFamily:"'Playfair Display', serif" }}>
            {donors.length} Donors · {hospitals.length} Hospitals · {requests.length} Critical Requests
          </p>
        </div>
        <div style={{ display:'flex', gap:'0.65rem', flexWrap:'wrap' }}>
          {[
            { key:'all',      label:'All' },
            { key:'blood',    label:'🩸 Blood Donors' },
            { key:'organ',    label:'🫀 Organ Donors' },
            { key:'hospital', label:'🏥 Hospitals' },
            { key:'requests', label:'🚨 Blood Requests' },
          ].map(f => (
            <button key={f.key} style={FILTER_BTN(filter===f.key)} onClick={() => setFilter(f.key)}
            onMouseEnter={e => { if(filter!==f.key) e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.3)'; }}
            onMouseLeave={e => { if(filter!==f.key) e.currentTarget.style.borderColor='rgba(225, 29, 72, 0.2)'; }}
            >
              {f.label}
            </button>
          ))}
        </div>
        <button
          onClick={panToUser}
          className="btn btn-secondary btn-sm"
          style={{ padding: '0.65rem 1.4rem', borderRadius: '100px' }}
          >
          📍 My Location
        </button>
      </div>

      <div style={{ flex:1, position:'relative' }}>
        {/* Legend */}
        <div className="glass-panel" style={{
          position:'absolute', top:'1.5rem', left:'1.5rem', zIndex:1000,
          padding:'1.5rem', minWidth:'180px', borderRadius: '16px',
          background: 'rgba(255, 255, 255, 0.85)', backdropFilter: 'blur(10px)'
        }}>
          <div style={{ fontSize:'0.75rem', fontWeight:'800', textTransform:'uppercase', letterSpacing:'0.15em', color:'var(--text-secondary)', marginBottom:'1rem' }}>Legend</div>
          {[
            { color:'#f87171', label:'Blood Donor' },
            { color:'#14b8a6', label:'Organ Donor' },
            { color:'#0ea5e9', label:'Hospital' },
            { color:'#fbbf24', label:'Blood Request' },
            { color:'#8b5cf6', label:'You' },
          ].map(l => (
            <div key={l.label} style={{ display:'flex', alignItems:'center', gap:'10px', marginBottom:'0.6rem', fontSize:'0.85rem', color:'#4c0519', fontWeight:'600', fontFamily:"'Playfair Display', serif" }}>
              <div style={{ width:'14px', height:'14px', borderRadius:'50%', background:l.color, flexShrink:0, boxShadow:`0 0 10px ${l.color}` }}/>
              {l.label}
            </div>
          ))}
        </div>

        {/* Loading overlay */}
        {loading && (
          <div style={{ position:'absolute', inset:0, background:'rgba(255, 228, 230, 0.85)', backdropFilter:'blur(5px)', zIndex:2000, display:'flex', alignItems:'center', justifyContent:'center' }}>
            <div className="spinner"/>
          </div>
        )}

        <MapContainer 
          center={MAP_CENTER} 
          zoom={5} 
          style={{ width: '100%', height: '100%', zIndex: 1 }}
          zoomControl={false}
        >
          <TileLayer
            url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
          />
          <LocationMarker userLoc={userLoc} />

          {/* User location */}
          {userLoc && (
            <>
              <Marker position={userLoc} icon={ICONS.user}>
                <Popup>
                  <div style={{ fontFamily:"'Playfair Display', serif", padding:'4px' }}>
                    <div style={{ fontWeight:'800', fontSize:'0.95rem', color:'#4c0519' }}>📍 Your Location</div>
                  </div>
                </Popup>
              </Marker>
              <Circle
                center={userLoc}
                radius={5000}
                pathOptions={{ fillColor:'#8b5cf6', fillOpacity:0.1, color:'#8b5cf6', opacity:0.4, weight:1 }}
              />
            </>
          )}

          {/* Donor markers */}
          {filteredDonors.map(d => (
            <Marker
              key={d._id}
              position={[d.location.lat, d.location.lng]}
              icon={d.donationType === 'organ' ? ICONS.organ : ICONS.blood}
            >
              <Popup>
                <div style={{ fontFamily:"'Playfair Display', serif", minWidth:'200px', color:'#4c0519' }}>
                  <div style={{ fontWeight:'800', fontSize:'1.05rem', marginBottom:'4px' }}>🩸 {d.user?.name || 'Anonymous Donor'}</div>
                  <div style={{ fontSize:'0.85rem', color:'#64748b', marginBottom:'8px' }}>📍 {d.city}</div>
                  <div style={{ display:'flex', gap:'8px', marginBottom:'12px', flexWrap:'wrap' }}>
                    <span style={{ background:'rgba(248,113,113,0.12)', color:'#f87171', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800' }}>{d.bloodGroup}</span>
                    <span style={{ background:'rgba(20,184,166,0.12)', color:'#14b8a6', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800', textTransform:'capitalize' }}>{d.donationType}</span>
                  </div>
                  {d.user?.phone && <div style={{ fontSize:'0.85rem', fontWeight:'800' }}>📞 Phone: {d.user.phone}</div>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Hospital markers */}
          {filteredHospitals.map(h => (
            <Marker
              key={h._id}
              position={[h.location.lat, h.location.lng]}
              icon={ICONS.hospital}
            >
              <Popup>
                <div style={{ fontFamily:"'Playfair Display', serif", minWidth:'200px', color:'#4c0519' }}>
                  <div style={{ fontWeight:'800', fontSize:'1.05rem', marginBottom:'4px' }}>🏥 {h.name}</div>
                  <div style={{ fontSize:'0.85rem', color:'#64748b', marginBottom:'8px' }}>📍 {h.city} · ⭐ {h.rating}</div>
                  <div style={{ display:'flex', gap:'8px', marginBottom:'12px', flexWrap:'wrap' }}>
                    <span style={{ background:'rgba(14,165,233,0.12)', color:'#0ea5e9', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800', textTransform:'capitalize' }}>{h.type}</span>
                    {h.isOpen24x7 && <span style={{ background:'rgba(20,184,166,0.12)', color:'#14b8a6', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800' }}>24/7</span>}
                    {h.hasBloodBank && <span style={{ background:'rgba(248,113,113,0.12)', color:'#f87171', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800' }}>Blood Bank</span>}
                  </div>
                  {h.phone && <div style={{ fontSize:'0.85rem', fontWeight:'800' }}>📞 Phone: {h.phone}</div>}
                </div>
              </Popup>
            </Marker>
          ))}

          {/* Blood request markers */}
          {filteredRequests.map(r => (
            <Marker
              key={r._id}
              position={[r.location.lat, r.location.lng]}
              icon={urgencyIcon(r.urgency)}
            >
              <Popup>
                <div style={{ fontFamily:"'Playfair Display', serif", minWidth:'200px', color:'#4c0519' }}>
                  <div style={{ fontWeight:'800', fontSize:'1.05rem', marginBottom:'4px', color:'#f87171' }}>🚨 {r.bloodGroup} Needed</div>
                  <div style={{ fontSize:'0.85rem', color:'#64748b', marginBottom:'8px' }}>📍 {r.hospital}, {r.city}</div>
                  <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
                    <span style={{ background:'rgba(248,113,113,0.12)', color:'#f87171', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800', textTransform:'uppercase' }}>{r.urgency}</span>
                    <span style={{ background:'rgba(0,0,0,0.05)', color:'#4c0519', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800' }}>{r.units} units</span>
                  </div>
                  {r.requester?.phone && <div style={{ fontSize:'0.85rem', fontWeight:'800' }}>📞 Phone: {r.requester.phone}</div>}
                </div>
              </Popup>
            </Marker>
          ))}
        </MapContainer>
      </div>
    </div>
  );
}
