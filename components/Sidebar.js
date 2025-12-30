import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [schedule, setSchedule] = useState([]);
  const [loading, setLoading] = useState(true);

  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const response = await fetch(EPG_URL);
        if (!response.ok) throw new Error('S3 Access Denied (Check CORS)');
        const data = await response.json();
        
        // Based on your docs, we expect an array of films or a schedule object
        setSchedule(Array.isArray(data) ? data : data.schedule || []);
        setLoading(false);
      } catch (err) {
        console.error("EPG Fetch Error:", err);
        setLoading(false);
      }
    };

    fetchEPG();
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ background: '#0c0c0c', padding: '22px', borderRadius: '12px', borderTop: '2px solid #D4AF37', boxShadow: '0 14px 32px rgba(0,0,0,0.8)' }}>
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>Now Playing</span>
        <h1 style={{ fontSize: '1.6rem', margin: '10px 0' }}>
          {schedule[0]?.title || "Short Film Showcase"}
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#a1a1a1', lineHeight: '1.6' }}>
          {schedule[0]?.description || "Curated award-winning shorts from around the world."}
        </p>
      </div>

      <div style={{ background: '#0c0c0c', padding: '22px', borderRadius: '12px', borderTop: '1px solid #333' }}>
        <span style={{ color: '#777', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Up Next</span>
        <ul style={{ listStyle: 'none', padding: 0, margin: '15px 0 0 0' }}>
          {schedule.slice(1, 4).map((item, index) => (
            <li key={index} style={{ padding: '10px 0', borderBottom: '1px solid #222', display: 'flex', gap: '12px' }}>
              <span style={{ color: '#D4AF37', fontFamily: 'monospace' }}>{item.time || "00:00"}</span>
              <span style={{ color: '#fff', fontSize: '0.9rem' }}>{item.title}</span>
            </li>
          ))}
          {loading && <div style={{ color: '#444' }}>Loading Schedule...</div>}
        </ul>
      </div>
    </div>
  );
}
