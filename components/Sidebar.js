import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [status, setStatus] = useState("Initializing...");
  const [programs, setPrograms] = useState([]);
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    const fetchEPG = async () => {
      setStatus("Fetching...");
      try {
        const res = await fetch(`${EPG_URL}?t=${Date.now()}`);
        if (!res.ok) throw new Error(`S3 Error: ${res.status}`);
        const data = await res.json();
        
        console.log("EPG Data arrived:", data);
        setPrograms(data.programs || []);
        setStatus("Connected");
      } catch (err) {
        console.error("Fetch Error:", err);
        setStatus(`Error: ${err.message}`);
      }
    };

    fetchEPG();
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#0c0c0c', padding: '20px', borderRadius: '12px', color: '#fff' }}>
      {/* THIS IS THE GOLD BAR */}
      <div style={{ background: '#D4AF37', color: '#000', padding: '8px', fontWeight: 'bold', marginBottom: '20px', borderRadius: '4px', textAlign: 'center', fontSize: '12px' }}>
        STATUS: {status.toUpperCase()}
      </div>

      <div style={{ borderTop: '2px solid #D4AF37', paddingTop: '15px' }}>
        <h2 style={{ fontSize: '1rem', color: '#D4AF37' }}>NOW PLAYING</h2>
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold' }}>
          {programs.length > 0 ? programs[0].title : "Syncing..."}
        </p>
      </div>

      <div style={{ marginTop: '20px' }}>
        <h3 style={{ fontSize: '0.8rem', color: '#777' }}>UPCOMING</h3>
        {programs.slice(1, 4).map((p, i) => (
          <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #222', fontSize: '0.9rem' }}>
            {p.title}
          </div>
        ))}
      </div>
    </div>
  );
}
