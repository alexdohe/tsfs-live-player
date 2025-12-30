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
        
        const now = new Date();
        const current = allPrograms.find(p => now >= new Date(p.start) && now < new Date(p.end)) || allPrograms[0];
        
        setPrograms(allPrograms);
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

  // Enhanced filter to remove technical/internal metadata
  const isCrapMetadata = (title) => {
    if (!title) return true;
    const lower = title.toLowerCase();
    const junkWords = ["untitled", "advertise", "promo", "bumper", "trailer", "slate"];
    return junkWords.some(word => lower.includes(word));
  };

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#0c0c0c', padding: '24px', borderRadius: '12px', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ width: '8px', height: '8px', background: '#ff4b4b', borderRadius: '50%', boxShadow: '0 0 8px #ff4b4b' }}></div>
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Now Playing</span>
      </div>
      
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>
        {isCrapMetadata(nowPlaying?.title) ? "The Short Film Show" : nowPlaying.title}
      </h2>
      <div style={{ fontSize: '0.85rem', color: '#777', marginBottom: '24px' }}>
        {formatTime(nowPlaying?.start)} - {formatTime(nowPlaying?.end)}
      </div>

      <div style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', letterSpacing: '2px', marginBottom: '15px' }}>Coming Up Next</h3>
        {programs
          .filter(p => new Date(p.start) > new Date() && !isCrapMetadata(p.title))
          .slice(0, 4)
          .map((p, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem' }}>{p.title}</span>
              <span style={{ color: '#D4AF37', fontSize: '0.75rem' }}>{formatTime(p.start)}</span>
            </div>
        ))}
      </div>
    </div>
  );
}
