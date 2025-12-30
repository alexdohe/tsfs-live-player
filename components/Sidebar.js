import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [status, setStatus] = useState("Initializing...");
  const [programs, setPrograms] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const res = await fetch(`${EPG_URL}?t=${Date.now()}`);
        if (!res.ok) throw new Error(`S3 Error: ${res.status}`);
        const data = await response.json();
        const allPrograms = data.programs || [];
        setPrograms(allPrograms);

        // Find the program based on actual current time
        const now = new Date();
        const current = allPrograms.find(p => {
          const start = new Date(p.start);
          const end = new Date(p.end);
          return now >= start && now < end;
        }) || allPrograms[0]; // Fallback to first if no match

        setNowPlaying(current);
        setStatus("Connected");
      } catch (err) {
        setStatus(`Error: ${err.message}`);
      }
    };

    fetchEPG();
    const interval = setInterval(fetchEPG, 30000); 
    return () => clearInterval(interval);
  }, []);

  const formatTime = (isoString) => {
    return new Date(isoString).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: true 
    });
  };

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#0c0c0c', padding: '20px', borderRadius: '12px', color: '#fff' }}>
      <div style={{ background: '#D4AF37', color: '#000', padding: '8px', fontWeight: 'bold', marginBottom: '20px', borderRadius: '4px', textAlign: 'center', fontSize: '12px' }}>
        STATUS: {status.toUpperCase()}
      </div>

      <div style={{ borderTop: '2px solid #D4AF37', paddingTop: '15px' }}>
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Now Playing</span>
        <h2 style={{ fontSize: '1.4rem', margin: '10px 0' }}>{nowPlaying?.title || "Syncing..."}</h2>
        <div style={{ fontSize: '0.8rem', color: '#777' }}>
          {nowPlaying ? `${formatTime(nowPlaying.start)} - ${formatTime(nowPlaying.end)}` : '--:--'}
        </div>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase' }}>Up Next</h3>
        {programs
          .filter(p => new Date(p.start) > new Date())
          .slice(0, 4)
          .map((p, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.9rem' }}>{p.title}</span>
              <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontFamily: 'monospace' }}>{formatTime(p.start)}</span>
            </div>
        ))}
      </div>
    </div>
  );
}
