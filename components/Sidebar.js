import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [status, setStatus] = useState("Checking S3 Connection...");
  const [data, setData] = useState(null);
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    console.log("FETCH STARTING");
    fetch(`${EPG_URL}?nocache=${Date.now()}`)
      .then(res => {
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        return res.json();
      })
      .then(json => {
        console.log("FETCH SUCCESS", json);
        setData(json);
        setStatus("Data Received");
      })
      .catch(err => {
        console.error("FETCH ERROR", err);
        setStatus(`Error: ${err.message}`);
      });
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#0c0c0c', padding: '20px', borderRadius: '12px', color: '#fff' }}>
      {/* HIGH VISIBILITY DEBUG BAR */}
      <div style={{ background: '#ff00ff', color: '#000', padding: '10px', fontWeight: 'bold', marginBottom: '20px', borderRadius: '4px' }}>
        SYSTEM STATUS: {status}
      </div>

      <div style={{ borderTop: '2px solid #D4AF37', paddingTop: '15px' }}>
        <h2 style={{ fontSize: '1.2rem', color: '#D4AF37' }}>NOW PLAYING</h2>
        <p style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>
          {data?.programs?.[0]?.title || "Loading Title..."}
        </p>
      </div>

      <div style={{ marginTop: '30px' }}>
        <h3 style={{ fontSize: '0.8rem', color: '#777', textTransform: 'uppercase' }}>Schedule List</h3>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {data?.programs?.slice(0, 5).map((p, i) => (
            <li key={i} style={{ padding: '8px 0', borderBottom: '1px solid #222' }}>
              {p.title}
            </li>
          )) || <li>No Programs Found</li>}
        </ul>
      </div>
    </div>
  );
}
