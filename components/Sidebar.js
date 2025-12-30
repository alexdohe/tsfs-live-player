import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [debugMsg, setDebugMsg] = useState("Initializing...");
  const [programs, setPrograms] = useState([]);
  
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    console.log("Sidebar: Starting Fetch for", EPG_URL);
    setDebugMsg("Fetching from S3...");

    fetch(`${EPG_URL}?t=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP Error: ${res.status}`);
        return res.json();
      })
      .then(data => {
        console.log("Sidebar: Data arrived!", data);
        setPrograms(data.programs || []);
        setDebugMsg("Data Loaded Successfully");
      })
      .catch(err => {
        console.error("Sidebar: Fetch failed", err);
        setDebugMsg(`Error: ${err.message}`);
      });
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '280px', color: '#fff', background: '#0c0c0c', padding: '20px', borderRadius: '12px', borderTop: '2px solid #D4AF37' }}>
      <div style={{ marginBottom: '20px', padding: '10px', background: '#1a1a1a', borderRadius: '4px', fontSize: '10px', color: '#D4AF37' }}>
        DEBUG STATUS: {debugMsg}
      </div>

      <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Current Schedule</span>
      <ul style={{ listStyle: 'none', padding: 0, marginTop: '15px' }}>
        {programs.length > 0 ? programs.slice(0, 5).map((p, i) => (
          <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #222' }}>
            {p.title} {p.is_live ? "🔴 LIVE" : ""}
          </li>
        )) : <li style={{ color: '#444' }}>Waiting for data...</li>}
      </ul>
    </div>
  );
}
