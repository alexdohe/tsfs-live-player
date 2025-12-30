import React, { useEffect, useState } from 'react';

export default function LivePlayer() {
  const [metadata, setMetadata] = useState({ title: 'The Short Film Show', synopsis: 'Loading broadcast...' });
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function init() {
      const shaka = await import('shaka-player/dist/shaka-player.ui.js');
      const video = document.getElementById('video');
      const videoParent = document.getElementById('video-parent');
      const player = new shaka.Player(video);
      const ui = new shaka.ui.Overlay(player, videoParent, video);
      
      try {
        const res = await fetch('/api/live-status');
        const data = await res.json();
        setMetadata(data);
        
        // Load stream (Live or Fallback)
        await player.load(data.streamUrl);

        // Fetch EPG (using %20 for the space in 'public files')
        const epgRes = await fetch('https://the-short-film-channel-assets-public.s3.amazonaws.com/public%20files/main.json');
        const epgData = await epgRes.json();
        setSchedule(epgData.playlist || []);
      } catch (e) { console.error("Player Error", e); }
    }
    init();
  }, []);

  return (
    <div style={{background: '#050505', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', padding: '20px'}}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.7.11/dist/controls.css" />
      <div style={{maxWidth: '1200px', margin: '0 auto'}}>
        
        <div style={{marginBottom: '25px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <a href="https://theshortfilmshow.com" target="_blank" rel="noreferrer">
                <img src="https://the-short-film-channel-assets-public.s3.amazonaws.com/public%20files/the-short-film-CHANNEL.png" alt="TSFS Logo" style={{height: '65px'}} />
            </a>
            <div style={{textAlign: 'right'}}>
                <div style={{color: '#D4AF37', fontWeight: 'bold', fontSize: '1.2rem'}}>LIVE CHANNEL</div>
            </div>
        </div>

        <div style={{display: 'flex', gap: '30px', flexDirection: 'row'}}>
          <div style={{flex: 2.5}}>
            <div id="video-parent" style={{position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212,175,55,0.4)'}}>
              <video id="video" style={{width: '100%', height: '100%'}} autoPlay muted playsInline loop />
            </div>
            <div style={{marginTop: '25px', padding: '30px', background: '#111', borderRadius: '12px', borderTop: '4px solid #D4AF37'}}>
              <h1 style={{fontSize: '2rem', margin: '0 0 15px 0'}}>{metadata.title}</h1>
              <p style={{color: '#bbb', lineHeight: '1.6'}}>{metadata.synopsis}</p>
            </div>
          </div>

          <div style={{flex: 1, background: '#111', padding: '25px', borderRadius: '12px', border: '1px solid #222'}}>
            <h3 style={{color: '#D4AF37', borderBottom: '1px solid #333', paddingBottom: '15px', marginTop: 0}}>Coming Up</h3>
            {schedule.map((item, i) => (
              <div key={i} style={{padding: '10px 0', borderBottom: '1px solid #222'}}>
                <div style={{fontSize: '1rem', fontWeight: 'bold'}}>{item.title}</div>
                <div style={{fontSize: '0.8rem', color: '#666'}}>{item.air_time || 'Next'}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
