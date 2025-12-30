import React, { useEffect, useState } from 'react';

export default function Sidebar() {
  const [nowPlaying, setNowPlaying] = useState({
    title: "Loading Showcase...",
    synopsis: "Fetching the latest film metadata...",
  });

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('/api/live-status');
        const data = await response.json();
        
        // Update with real data if available, otherwise use your branded default
        setNowPlaying({
          title: data.film?.title || "Short Film Showcase",
          synopsis: data.film?.description || "Curated award-winning shorts from around the world, hand-picked by The Short Film Show team."
        });
      } catch (err) {
        console.error("Failed to fetch live status:", err);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 60000); // Refresh every minute
    return () => clearInterval(interval);
  }, []);

  return (
    <div style={{ flex: 1, minWidth: '280px', display: 'flex', flexDirection: 'column', gap: '18px' }}>
      <div style={{ background: '#0c0c0c', padding: '22px', borderRadius: '12px', borderTop: '2px solid #D4AF37', boxShadow: '0 14px 32px rgba(0,0,0,0.8)' }}>
        <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1.5px' }}>
          Now Playing
        </span>
        <h1 style={{ fontSize: '1.6rem', margin: '10px 0', lineHeight: '1.25' }}>
          {nowPlaying.title}
        </h1>
        <p style={{ fontSize: '0.9rem', color: '#a1a1a1', lineHeight: '1.6' }}>
          {nowPlaying.synopsis}
        </p>
      </div>
      
      {/* Static "Coming Up" placeholder based on your HTML reference */}
      <div style={{ background: '#0c0c0c', padding: '22px', borderRadius: '12px', borderTop: '2px solid #333' }}>
        <span style={{ color: '#777', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Up Next</span>
        <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#555' }}>
          Schedule Syncing...
        </div>
      </div>
    </div>
  );
}
