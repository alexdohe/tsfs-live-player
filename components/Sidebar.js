import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [status, setStatus] = useState("Standby");
  const [programs, setPrograms] = useState([]);
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    // Wait 1 second to ensure the browser is ready
    const timer = setTimeout(() => {
      setStatus("Fetching Schedule...");
      
      fetch(`${EPG_URL}?t=${Date.now()}`)
        .then(res => {
          if (!res.ok) throw new Error(`S3 Error: ${res.status}`);
          return res.json();
        })
        .then(data => {
          setPrograms(data.programs || []);
          setStatus("Schedule Synced");
        })
        .catch(err => {
          console.error("Fetch Error:", err);
          setStatus(`Sync Failed: ${err.message}`);
        });
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#0c0c0c', padding: '20px', borderRadius: '12px', color: '#fff' }}>
      <div style={{ background: '#D4AF37', color: '#000', padding: '8px', fontWeight: 'bold', marginBottom: '20px', borderRadius: '4px', fontSize: '12px', textAlign: 'center' }}>
        SYSTEM: {status.toUpperCase()}
      </div>

      <div style={{ borderTop: '2px solid #D4AF37', paddingTop: '15px' }}>
        <h2 style={{ fontSize: '1rem', color: '#D4AF37', textTransform: 'uppercase' }}>Now Playing</h2>
        <p style={{ fontSize: '1.4rem', fontWeight: 'bold', margin: '10px 0' }}>
          {programs.find(p => p.is_live)?.title || programs[0]?.title || "Awaiting Data..."}
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '0.75rem', color: '#777', textTransform: 'uppercase', marginBottom: '15px' }}>Coming Up Next</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {programs.length > 0 ? programs.slice(1, 5).map((p, i) => (
            <li key={i} style={{ padding: '10px 0', borderBottom: '1px solid #222', fontSize: '0.9rem' }}>
              {p.title}
            </li>
          )) : <li style={{ color: '#444' }}>No upcoming films found</li>}
        </ul>
      </div>
    </div>
  );
}
