import React, { useState, useEffect } from 'react';

const Sidebar = () => {
  const [programs, setPrograms] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);
  const [synopsis, setSynopsis] = useState("Loading broadcast details...");

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const res = await fetch('https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json');
        const data = await res.json();
        
        const now = new Date();
        
        // 1. Filter out shows that ended in the past
        const futureAndCurrent = data.programs.filter(pgm => new Date(pgm.end) > now);
        setPrograms(futureAndCurrent.slice(0, 5));

        // 2. Find the exact show playing RIGHT NOW
        const active = data.programs.find(pgm => 
          new Date(pgm.start) <= now && new Date(pgm.end) >= now
        );

        if (active) {
          setCurrentShow(active);
          fetchSynopsis(active.title);
        } else {
          setSynopsis("Short Film Showcase: Independent Cinema.");
        }
      } catch (e) {
        console.error("EPG Fetch Error", e);
      }
    };

    const fetchSynopsis = async (title) => {
      try {
        const res = await fetch(`/api/get-synopsis?title=${encodeURIComponent(title)}`);
        const data = await res.json();
        setSynopsis(data.synopsis);
      } catch (e) {
        setSynopsis("Independent Cinema Showcase.");
      }
    };

    fetchEPG();
    const interval = setInterval(fetchEPG, 30000); // Refresh every 30s
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
      <h3 style={{ color: '#D4AF37', marginTop: 0, fontSize: '0.9rem', textTransform: 'uppercase' }}>Now Playing</h3>
      <h2 style={{ fontSize: '1.5rem', margin: '10px 0' }}>{currentShow?.title || "TSFS Broadcast"}</h2>
      <p style={{ color: '#aaa', lineHeight: '1.6', fontSize: '0.9rem' }}>{synopsis}</p>
      
      <hr style={{ border: '0', borderTop: '1px solid #222', margin: '20px 0' }} />
      
      <h3 style={{ color: '#666', fontSize: '0.8rem', textTransform: 'uppercase' }}>Coming Up Next</h3>
      {programs.slice(1).map((pgm, i) => (
        <div key={i} style={{ marginBottom: '15px', paddingBottom: '10px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{pgm.title}</div>
          <div style={{ fontSize: '0.75rem', color: '#555' }}>
            {new Date(pgm.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
