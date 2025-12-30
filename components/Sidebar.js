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
        
        // Filter out past shows
        const upcoming = data.programs.filter(pgm => new Date(pgm.end) > now);
        
        // Find the "True" current or next real film (skipping Untitled/Promo blocks)
        const currentOrNextFilm = upcoming.find(pgm => 
          pgm.title && 
          pgm.title.toLowerCase() !== 'untitled' && 
          !pgm.title.toLowerCase().includes('5 minute ad')
        );

        if (currentOrNextFilm) {
          setCurrentShow(currentOrNextFilm);
          fetchSynopsis(currentOrNextFilm.title);
        }

        setPrograms(upcoming.filter(p => p.title && p.title.toLowerCase() !== 'untitled').slice(0, 5));
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
    const interval = setInterval(fetchEPG, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#111', padding: '20px', borderRadius: '12px', border: '1px solid #222' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
        <div style={{ width: '8px', height: '8px', background: '#ff4b4b', borderRadius: '50%' }}></div>
        <h3 style={{ color: '#D4AF37', margin: 0, fontSize: '0.8rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Featured Next</h3>
      </div>
      
      <h2 style={{ fontSize: '1.4rem', margin: '0 0 10px 0', color: '#fff' }}>{currentShow?.title || "TSFS Showcase"}</h2>
      <p style={{ color: '#aaa', lineHeight: '1.5', fontSize: '0.85rem', minHeight: '60px' }}>{synopsis}</p>
      
      <div style={{ margin: '20px 0', borderTop: '1px solid #222' }}></div>
      
      <h3 style={{ color: '#555', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '15px' }}>Coming Up</h3>
      {programs.slice(1, 5).map((pgm, i) => (
        <div key={i} style={{ marginBottom: '12px', paddingBottom: '8px', borderBottom: '1px solid #1a1a1a' }}>
          <div style={{ fontWeight: '600', fontSize: '0.85rem', color: '#eee' }}>{pgm.title}</div>
          <div style={{ fontSize: '0.7rem', color: '#D4AF37', marginTop: '2px' }}>
            {new Date(pgm.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
