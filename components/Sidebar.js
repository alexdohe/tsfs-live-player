import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [programs, setPrograms] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const res = await fetch(`${EPG_URL}?t=${Date.now()}`);
        const data = await res.json();
        const allPrograms = data.programs || [];
        setPrograms(allPrograms);

        const now = new Date();
        const current = allPrograms.find(p => {
          const start = new Date(p.start);
          const end = new Date(p.end);
          return now >= start && now < end;
        }) || allPrograms.find(p => new Date(p.start) > now) || allPrograms[0];

        setNowPlaying(current);
      } catch (err) {
        console.error("EPG Sync Error:", err);
      }
    };

    fetchEPG();
    const interval = setInterval(fetchEPG, 30000); 
    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString) => {
    if(!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#0c0c0c', padding: '24px', borderRadius: '12px', color: '#fff', boxShadow: '0 20px 40px rgba(0,0,0,0.4)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ width: '8px', height: '8px', background: '#ff4b4b', borderRadius: '50%', boxShadow: '0 0 8px #ff4b4b' }}></div>
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Now Playing</span>
      </div>
      
      <h2 style={{ fontSize: '1.6rem', margin: '0 0 8px 0', lineHeight: '1.2' }}>{nowPlaying?.title || "Short Film Showcase"}</h2>
      <div style={{ fontSize: '0.9rem', color: '#777', marginBottom: '24px' }}>
        {nowPlaying ? `${formatTime(nowPlaying.start)} - ${formatTime(nowPlaying.end)}` : 'Loading Schedule...'}
      </div>

      <div style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Coming Up Next</h3>
        {programs.filter(p => new Date(p.start) > new Date()).slice(0, 4).map((p, i) => (
          <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.95rem', color: '#ddd' }}>{p.title}</span>
            <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 'bold' }}>{formatTime(p.start)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
