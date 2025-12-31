import React, { useState, useEffect } from 'react';

const Sidebar = () => {
  const [programs, setPrograms] = useState([]);
  const [currentShow, setCurrentShow] = useState(null);
  const [synopsis, setSynopsis] = useState("Loading broadcast details...");
  const [banner, setBanner] = useState(null);

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const res = await fetch('https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json');
        const data = await res.json();
        const now = new Date();
        
        const cleanPrograms = data.programs.filter(pgm => {
          const t = pgm.title ? pgm.title.toLowerCase() : '';
          return t && t !== 'untitled' && !t.includes('ad') && !t.includes('bumper');
        });

        const upcoming = cleanPrograms.filter(pgm => new Date(pgm.end) > now);
        
        if (upcoming.length > 0) {
          setCurrentShow(upcoming[0]);
          fetchDetails(upcoming[0].title);
        } else {
          setCurrentShow({ title: "The Short Film Show" });
          setSynopsis("Supporting filmmakers worldwide.");
          setBanner(null);
        }
        setPrograms(upcoming.slice(0, 5));
      } catch (e) {
        console.error("EPG Error", e);
      }
    };

    const fetchDetails = async (title) => {
      try {
        const res = await fetch(`/api/get-synopsis?title=${encodeURIComponent(title)}`);
        const data = await res.json();
        setSynopsis(data.synopsis);
        setBanner(data.banner);
      } catch (e) {
        setSynopsis("Official broadcast showcase.");
        setBanner(null);
      }
    };

    fetchEPG();
    const interval = setInterval(fetchEPG, 30000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#0a0a0a', padding: '25px', borderRadius: '12px', border: '1px solid #1a1a1a', fontFamily: "'Trust', serif" }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '15px' }}>
        <div style={{ width: '8px', height: '8px', background: '#ff4b4b', borderRadius: '50%', boxShadow: '0 0 8px #ff4b4b' }}></div>
        <h3 style={{ color: '#D4AF37', margin: 0, fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 'bold' }}>Now Playing</h3>
      </div>

      {banner && (
        <img src={banner} alt="Film Artwork" style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', border: '1px solid #333' }} />
      )}
      
      <h2 style={{ fontSize: '1.6rem', margin: '0 0 10px 0', color: '#fff', fontWeight: 'normal' }}>
        {currentShow?.title || "The Short Film Show"}
      </h2>
      <p style={{ color: '#888', lineHeight: '1.6', fontSize: '0.9rem', marginBottom: '20px', fontWeight: '300' }}>{synopsis}</p>
      
      <div style={{ margin: '25px 0', borderTop: '1px solid #222' }}></div>
      <h3 style={{ color: '#444', fontSize: '0.7rem', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '2px' }}>Coming up</h3>
      {programs.slice(1, 5).map((pgm, i) => (
        <div key={i} style={{ marginBottom: '15px', paddingBottom: '12px', borderBottom: '1px solid #111' }}>
          <div style={{ fontWeight: 'normal', fontSize: '0.9rem', color: '#eee' }}>{pgm.title}</div>
          <div style={{ fontSize: '0.75rem', color: '#D4AF37', marginTop: '4px' }}>
            {new Date(pgm.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Sidebar;
