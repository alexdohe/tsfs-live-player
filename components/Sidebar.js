import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [programs, setPrograms] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const response = await fetch(`${EPG_URL}?t=${Date.now()}`);
        const data = await response.json();
        const allPrograms = data.programs || []; // Matches your curl
        setPrograms(allPrograms);

        // Logic: Find the is_live flag, OR the first program that hasn't ended yet
        const now = new Date();
        const live = allPrograms.find(p => p.is_live === true) || 
                     allPrograms.find(p => new Date(p.end) > now) || 
                     allPrograms[0];
        
        setNowPlaying(live);
      } catch (err) {
        console.error("EPG Sync Error:", err);
      }
    };
    fetchEPG();
    const interval = setInterval(fetchEPG, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ background: '#0c0c0c', padding: '22px', borderRadius: '12px', borderTop: '2px solid #D4AF37' }}>
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Now Playing</span>
        <h1 style={{ fontSize: '1.5rem', margin: '10px 0', color: '#fff' }}>
          {nowPlaying?.title || "Short Film Showcase"}
        </h1>
        {nowPlaying?.thumbnail && (
          <img src={nowPlaying.thumbnail.replace('assets.', 'assets.cdn.')} style={{ width: '100%', borderRadius: '6px', marginTop: '10px' }} />
        )}
      </div>
      <div style={{ background: '#0c0c0c', padding: '22px', borderRadius: '12px', borderTop: '1px solid #333' }}>
        <span style={{ color: '#777', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Up Next</span>
        <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0 0 0' }}>
          {programs.filter(p => new Date(p.start) > new Date()).slice(0, 4).map((item, index) => (
            <li key={index} style={{ padding: '12px 0', borderBottom: '1px solid #222' }}>
              <div style={{ color: '#fff', fontSize: '0.95rem' }}>{item.title}</div>
              <div style={{ color: '#D4AF37', fontSize: '0.75rem' }}>{new Date(item.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
