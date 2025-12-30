import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [data, setData] = useState(null);
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  useEffect(() => {
    fetch(`${EPG_URL}?t=${Date.now()}`)
      .then(res => res.json())
      .then(json => setData(json))
      .catch(err => console.log("EPG Error:", err));
  }, []);

  return (
    <div style={{ flex: 1, background: '#0c0c0c', padding: '20px', borderRadius: '12px', color: '#fff', borderTop: '2px solid #D4AF37' }}>
      <h2 style={{ color: '#D4AF37', fontSize: '1.2rem' }}>NOW PLAYING</h2>
      <p style={{ fontSize: '1.4rem' }}>{data?.programs?.[0]?.title || "Syncing Schedule..."}</p>
      <hr style={{ borderColor: '#222' }} />
      <ul style={{ listStyle: 'none', padding: 0 }}>
        {data?.programs?.slice(1, 5).map((p, i) => (
          <li key={i} style={{ padding: '5px 0', fontSize: '0.9rem', color: '#aaa' }}>{p.title}</li>
        ))}
      </ul>
    </div>
  );
}
