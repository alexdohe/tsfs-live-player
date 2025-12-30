import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [programs, setPrograms] = useState([]);
  const [nowPlaying, setNowPlaying] = useState(null);
  const [details, setDetails] = useState({ synopsis: "", filmId: "" });
  const [isExpanded, setIsExpanded] = useState(false);
  
  const EPG_URL = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json";

  const isJunk = (title) => {
    if (!title) return true;
    const lower = title.toLowerCase();
    return ["untitled", "advertise", "promo", "bumper", "trailer", "slate"].some(word => lower.includes(word));
  };

  useEffect(() => {
    const fetchEPG = async () => {
      try {
        const res = await fetch(`${EPG_URL}?t=${Date.now()}`);
        const data = await res.json();
        const allPrograms = data.programs || [];
        const now = new Date();
        const current = allPrograms.find(p => now >= new Date(p.start) && now < new Date(p.end)) || allPrograms[0];
        setPrograms(allPrograms);
        setNowPlaying(current);
      } catch (err) { console.error(err); }
    };
    fetchEPG();
    const interval = setInterval(fetchEPG, 30000); 
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (nowPlaying?.title && !isJunk(nowPlaying.title)) {
      setIsExpanded(false);
      fetch(`/api/get-synopsis?title=${encodeURIComponent(nowPlaying.title)}`)
        .then(res => res.json())
        .then(data => setDetails(data))
        .catch(() => setDetails({ synopsis: "Independent Cinema Showcase.", filmId: "" }));
    } else {
      setDetails({ synopsis: "The Short Film Show - Live Broadcast.", filmId: "" });
    }
  }, [nowPlaying?.title]);

  const formatTime = (isoString) => {
    if(!isoString) return "--:--";
    return new Date(isoString).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
  };

  return (
    <div style={{ flex: 1, minWidth: '300px', background: '#0c0c0c', padding: '24px', borderRadius: '12px', color: '#fff' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
        <div style={{ width: '8px', height: '8px', background: '#ff4b4b', borderRadius: '50%', boxShadow: '0 0 8px #ff4b4b' }}></div>
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Now Playing</span>
      </div>
      
      <h2 style={{ fontSize: '1.5rem', margin: '0 0 8px 0' }}>
        {isJunk(nowPlaying?.title) ? "Short Film Showcase" : nowPlaying.title}
      </h2>
      
      <div style={{ marginBottom: '24px' }}>
        <p style={{ 
          fontSize: '0.85rem', 
          color: '#888', 
          lineHeight: '1.5', 
          margin: 0,
          display: '-webkit-box',
          WebkitLineClamp: isExpanded ? 'unset' : '3',
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {details.synopsis}
        </p>
        {details.synopsis.length > 50 && (
          <button 
            onClick={() => setIsExpanded(!isExpanded)}
            style={{ background: 'none', border: 'none', color: '#D4AF37', fontSize: '0.75rem', padding: '5px 0', cursor: 'pointer', fontWeight: 'bold' }}
          >
            {isExpanded ? 'Show Less ↑' : 'Read More ↓'}
          </button>
        )}
      </div>

      <div style={{ borderTop: '1px solid #222', paddingTop: '20px' }}>
        <h3 style={{ fontSize: '0.7rem', color: '#555', textTransform: 'uppercase', marginBottom: '15px', letterSpacing: '1px' }}>Coming Up Next</h3>
        {programs
          .filter(p => new Date(p.start) > new Date() && !isJunk(p.title))
          .slice(0, 4)
          .map((p, i) => (
            <div key={i} style={{ padding: '12px 0', borderBottom: '1px solid #1a1a1a', display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '0.9rem', color: '#ddd' }}>{p.title}</span>
              <span style={{ color: '#D4AF37', fontSize: '0.75rem' }}>{formatTime(p.start)}</span>
            </div>
        ))}
      </div>
    </div>
  );
}
