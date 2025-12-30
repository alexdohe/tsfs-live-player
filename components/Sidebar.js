import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [programs, setPrograms] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [details, setDetails] = useState({ synopsis: "", thumbnail: null });
  const [isExpanded, setIsExpanded] = useState(false);
  
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  const isJunk = (t) => {
    if (!t) return false;
    return ["untitled", "advertise", "promo", "bumper", "trailer", "slate"].some(w => t.toLowerCase().includes(w));
  };

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const res = await fetch(`${EPG_URL}?t=${Date.now()}`);
        const data = await res.json();
        const all = data?.programs || [];
        const now = new Date();
        const current = all.find(p => now >= new Date(p.start) && now < new Date(p.end)) || all[0];
        setPrograms(all);
        setNowPlaying(current);
      } catch (err) { console.error("EPG Fetch Error:", err); }
    };
    fetchEPG();
    const interval = setInterval(fetchEPG, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (nowPlaying?.title && !isJunk(nowPlaying.title)) {
      fetch(`/api/get-synopsis?title=${encodeURIComponent(nowPlaying.title)}`)
        .then(res => res.json())
        .then(data => {
            if(data) setDetails(data);
        })
        .catch(() => setDetails({ synopsis: "Short Film Showcase.", thumbnail: null }));
    }
  }, [nowPlaying?.title]);

  const formatTime = (iso) => {
    try {
        return iso ? new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true }) : "--:--";
    } catch (e) { return "--:--"; }
  };

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#0c0c0c', padding: '24px', borderRadius: '12px', color: '#fff' }}>
      {details?.thumbnail && (
        <img src={details.thumbnail} alt="Poster" style={{ width: '100%', borderRadius: '8px', marginBottom: '15px', border: '1px solid #222' }} />
      )}
      
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
        <div style={{ width: '8px', height: '8px', background: '#ff4b4b', borderRadius: '50%' }}></div>
        <span style={{ color: '#D4AF37', fontSize: '0.7rem', fontWeight: 700, textTransform: 'uppercase' }}>Now Playing</span>
      </div>

      <h2 style={{ fontSize: '1.4rem', margin: '0 0 10px 0' }}>
        {isJunk(nowPlaying?.title) ? "Live Stream" : (nowPlaying?.title || "Loading...")}
      </h2>
      
      {details?.synopsis && (
        <>
            <p style={{ fontSize: '0.85rem', color: '#888', lineHeight: '1.4', margin: 0, display: '-webkit-box', WebkitLineClamp: isExpanded ? 'unset' : '3', WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                {details.synopsis}
            </p>
            {details.synopsis.length > 60 && (
                <button onClick={() => setIsExpanded(!isExpanded)} style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.7rem', cursor: 'pointer', fontWeight: 'bold', padding: '5px 0' }}>
                {isExpanded ? 'LESS ↑' : 'MORE ↓'}
                </button>
            )}
        </>
      )}

      <div style={{ borderTop: '1px solid #222', marginTop: '20px', paddingTop: '15px' }}>
        <h3 style={{ fontSize: '0.65rem', color: '#444', textTransform: 'uppercase', marginBottom: '10px' }}>Up Next</h3>
        {programs && programs.length > 0 ? (
          programs.filter(p => new Date(p.start) > new Date() && !isJunk(p?.title)).slice(0, 3).map((p, i) => (
            <div key={i} style={{ padding: '8px 0', borderBottom: '1px solid #111', display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem' }}>
              <span>{p?.title || "Upcoming Film"}</span>
              <span style={{ color: '#D4AF37' }}>{formatTime(p?.start)}</span>
            </div>
          ))
        ) : (
          <div style={{ fontSize: '0.8rem', color: '#444' }}>Updating schedule...</div>
        )}
      </div>
    </div>
  );
}
