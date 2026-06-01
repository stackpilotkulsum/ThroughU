import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, Marker, InfoWindow, Circle } from '@react-google-maps/api';
import { donorAPI, hospitalAPI, bloodAPI } from '../utils/api';
import {
  GOOGLE_MAPS_API_KEY,
  MAP_CENTER,
  LIBRARIES,
  DEFAULT_MAP_OPTIONS,
} from '../config/googleMaps';

const CONTAINER_STYLE = { width: '100%', height: '100%' };

// ── SVG marker icons as data URIs ───────────────────────
const createSvgMarker = (color, size = 14) => {
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}">
    <circle cx="${size/2}" cy="${size/2}" r="${size/2 - 2}" fill="${color}" stroke="#fff" stroke-width="2"/>
  </svg>`;
  return {
    url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`,
    scaledSize: { width: size, height: size },
    anchor: { x: size / 2, y: size / 2 },
  };
};

const ICONS = {
  user:       createSvgMarker('#8b5cf6', 18),
  blood:      createSvgMarker('#f87171', 14),
  organ:      createSvgMarker('#14b8a6', 14),
  hospital:   createSvgMarker('#0ea5e9', 18),
  critical:   createSvgMarker('#f87171', 16),
  urgent:     createSvgMarker('#fbbf24', 16),
  normal:     createSvgMarker('#14b8a6', 16),
};

const FILTER_BTN = (active) => ({
  padding: '0.6rem 1.2rem', borderRadius: '100px', fontSize: '0.85rem', fontWeight: '700',
  cursor: 'pointer', transition: 'all 0.3s', fontFamily: "'Playfair Display', serif",
  background: active ? 'linear-gradient(135deg, #06b6d4 0%, #14b8a6 100%)' : 'rgba(225, 29, 72, 0.04)',
  color: active ? '#fff' : 'var(--text-secondary)',
  border: `1px solid ${active ? 'transparent' : 'rgba(225, 29, 72, 0.2)'}`,
  boxShadow: active ? '0 4px 15px rgba(6, 182, 212, 0.25)' : 'none',
});

export default function DonorMap() {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: GOOGLE_MAPS_API_KEY,
    libraries: LIBRARIES,
  });

  const mapRef = useRef(null);

  const [donors,    setDonors]    = useState([]);
  const [hospitals, setHospitals] = useState([]);
  const [requests,  setRequests]  = useState([]);
  const [filter,    setFilter]    = useState('all');
  const [userLoc,   setUserLoc]   = useState(null);
  const [loading,   setLoading]   = useState(true);
  const [activeInfo, setActiveInfo] = useState(null); // { type, id, position }

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
        setUserLoc({ lat: pos.coords.latitude, lng: pos.coords.longitude });
      });
    }
  }, []);

  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  const panToUser = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(pos => {
        const loc = { lat: pos.coords.latitude, lng: pos.coords.longitude };
        setUserLoc(loc);
        if (mapRef.current) {
          mapRef.current.panTo(loc);
          mapRef.current.setZoom(12);
        }
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

  if (!isLoaded) {
    return (
      <div className="page-wrapper" style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'calc(100vh - 96px)' }}>
        <div className="spinner"/>
      </div>
    );
  }

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
          padding:'1.5rem', minWidth:'180px', borderRadius: '16px'
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

        <GoogleMap
          mapContainerStyle={CONTAINER_STYLE}
          center={MAP_CENTER}
          zoom={5}
          onLoad={onMapLoad}
          options={DEFAULT_MAP_OPTIONS}
        >
          {/* User location */}
          {userLoc && (
            <>
              <Marker position={userLoc} icon={ICONS.user} onClick={() => setActiveInfo({ type:'user', id:'user', position: userLoc })} />
              <Circle
                center={userLoc}
                radius={5000}
                options={{ fillColor:'#8b5cf6', fillOpacity:0.1, strokeColor:'#8b5cf6', strokeOpacity:0.4, strokeWeight:1 }}
              />
              {activeInfo?.type === 'user' && (
                <InfoWindow position={userLoc} onCloseClick={() => setActiveInfo(null)}>
                  <div style={{ fontFamily:"'Playfair Display', serif", padding:'4px' }}>
                    <div style={{ fontWeight:'800', fontSize:'0.95rem', color:'#4c0519' }}>📍 Your Location</div>
                  </div>
                </InfoWindow>
              )}
            </>
          )}

          {/* Donor markers */}
          {filteredDonors.map(d => (
            <Marker
              key={d._id}
              position={{ lat: d.location.lat, lng: d.location.lng }}
              icon={d.donationType === 'organ' ? ICONS.organ : ICONS.blood}
              onClick={() => setActiveInfo({ type:'donor', id: d._id, data: d, position: { lat: d.location.lat, lng: d.location.lng } })}
            />
          ))}
          {activeInfo?.type === 'donor' && (() => {
            const d = activeInfo.data;
            return (
              <InfoWindow position={activeInfo.position} onCloseClick={() => setActiveInfo(null)}>
                <div style={{ fontFamily:"'Playfair Display', serif", minWidth:'200px', color:'#4c0519' }}>
                  <div style={{ fontWeight:'800', fontSize:'1.05rem', marginBottom:'4px' }}>🩸 {d.user?.name || 'Anonymous Donor'}</div>
                  <div style={{ fontSize:'0.85rem', color:'#64748b', marginBottom:'8px' }}>📍 {d.city}</div>
                  <div style={{ display:'flex', gap:'8px', marginBottom:'12px', flexWrap:'wrap' }}>
                    <span style={{ background:'rgba(248,113,113,0.12)', color:'#f87171', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800' }}>{d.bloodGroup}</span>
                    <span style={{ background:'rgba(20,184,166,0.12)', color:'#14b8a6', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800', textTransform:'capitalize' }}>{d.donationType}</span>
                  </div>
                  {d.user?.phone && <div style={{ fontSize:'0.85rem', fontWeight:'800' }}>📞 Phone: {d.user.phone}</div>}
                </div>
              </InfoWindow>
            );
          })()}

          {/* Hospital markers */}
          {filteredHospitals.map(h => (
            <Marker
              key={h._id}
              position={{ lat: h.location.lat, lng: h.location.lng }}
              icon={ICONS.hospital}
              onClick={() => setActiveInfo({ type:'hospital', id: h._id, data: h, position: { lat: h.location.lat, lng: h.location.lng } })}
            />
          ))}
          {activeInfo?.type === 'hospital' && (() => {
            const h = activeInfo.data;
            return (
              <InfoWindow position={activeInfo.position} onCloseClick={() => setActiveInfo(null)}>
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
              </InfoWindow>
            );
          })()}

          {/* Blood request markers */}
          {filteredRequests.map(r => (
            <Marker
              key={r._id}
              position={{ lat: r.location.lat, lng: r.location.lng }}
              icon={urgencyIcon(r.urgency)}
              onClick={() => setActiveInfo({ type:'request', id: r._id, data: r, position: { lat: r.location.lat, lng: r.location.lng } })}
            />
          ))}
          {activeInfo?.type === 'request' && (() => {
            const r = activeInfo.data;
            const urgencyColor = u => ({ critical:'#f87171', urgent:'#fbbf24', normal:'#14b8a6' }[u] || '#f87171');
            return (
              <InfoWindow position={activeInfo.position} onCloseClick={() => setActiveInfo(null)}>
                <div style={{ fontFamily:"'Playfair Display', serif", minWidth:'200px', color:'#4c0519' }}>
                  <div style={{ fontWeight:'800', fontSize:'1.05rem', marginBottom:'4px', color:'#f87171' }}>🚨 {r.bloodGroup} Needed</div>
                  <div style={{ fontSize:'0.85rem', color:'#64748b', marginBottom:'8px' }}>📍 {r.hospital}, {r.city}</div>
                  <div style={{ display:'flex', gap:'8px', marginBottom:'12px' }}>
                    <span style={{ background:urgencyColor(r.urgency)+'22', color:urgencyColor(r.urgency), padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800', textTransform:'uppercase' }}>{r.urgency}</span>
                    <span style={{ background:'rgba(0,0,0,0.05)', color:'#4c0519', padding:'4px 10px', borderRadius:'100px', fontSize:'0.75rem', fontWeight:'800' }}>{r.units} units</span>
                  </div>
                  {r.requester?.phone && <div style={{ fontSize:'0.85rem', fontWeight:'800' }}>📞 Phone: {r.requester.phone}</div>}
                </div>
              </InfoWindow>
            );
          })()}
        </GoogleMap>
      </div>
    </div>
  );
}
