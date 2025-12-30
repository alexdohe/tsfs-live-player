import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [programs, setPrograms] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [loading, setLoading] = useState(true);

  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const response = await fetch(EPG_URL);
        const data = await response.json();
        
        const allPrograms = data.programs || [];
        setPrograms(allPrograms);

        // Find the one currently live
        const live = allPrograms.find(p => p.is_live === true) || allPrograms[0];
        setNowPlaying(live);
        
        setLoading(false);
      } catch (err) {
        console.error("EPG Fetch Error (Likely S3 CORS):", err);
        setLoading(false);
      }
    };

    fetchEPG();
    const interval = setInterval(fetchEPG, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      {/* NOW PLAYING CARD */}
      <div style={{ background: '#0c0c0c', padding: '22px', borderRadius: '12px', borderTop: '2px solid #D4AF37', boxShadow: '0 14px 32px rgba(0,0,0,0.8)' }}>
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Now Playing</span>
        <h1 style={{ fontSize: '1.4rem', margin: '10px 0', color: '#fff' }}>
          {nowPlaying?.title || "Short Film Showcase"}
        </h1>
        {nowPlaying?.thumbnail && (
          <img src={nowPlaying.thumbnail} alt="thumb" style={{ width: '100%', borderRadius: '4px', margin: '10px 0' }} />
        )}
      </div>

      {/* UP NEXT LIST */}
      <div style={{ background: '#0c0c0c', padding: '22px', borderRadius: '12px', borderTop: '1px solid #333' }}>
        <span style={{ color: '#777', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Up Next</span>
        <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0 0 0' }}>
          {programs.filter(p => !p.is_live).slice(0, 5).map((item, index) => (
            <li key={index} style={{ padding: '12px 0', borderBottom: '1px solid #222', display: 'flex', flexDirection: 'column' }}>
              <span style={{ color: '#fff', fontSize: '0.95rem', fontWeight: 600 }}>{item.title}</span>
              <span style={{ color: '#D4AF37', fontSize: '0.7rem', fontFamily: 'monospace', marginTop: '4px' }}>
                {new Date(item.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
