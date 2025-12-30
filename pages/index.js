import React, { useEffect } from 'react';

export default function LivePlayer() {
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
        document.getElementById('now-title').innerText = data.title;
        document.getElementById('now-synopsis').innerText = data.synopsis;
        document.getElementById('film-link').href = data.filmPageUrl || '#';
        await player.load(data.streamUrl);
      } catch (e) { console.error(e); }
    }
    init();
  }, []);

  return (
    <div style={{background: '#050505', color: 'white', minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', fontFamily: 'sans-serif'}}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.7.11/dist/controls.css" />
      <div style={{width: '90%', maxWidth: '1000px'}}>
        <div id="video-parent" style={{position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid rgba(212, 175, 55, 0.2)'}}>
          <video id="video" style={{width: '100%', height: '100%'}} autoPlay muted playsInline />
        </div>
        <div style={{marginTop: '20px', padding: '20px', background: '#111', borderRadius: '12px', borderTop: '3px solid #D4AF37'}}>
          <div style={{display: 'flex', alignItems: 'center'}}>
             <span style={{background: '#e50914', color: 'white', padding: '4px 12px', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold', marginRight: '12px'}}>LIVE</span>
             <span id="now-title" style={{fontSize: '1.5rem', fontWeight: 'bold'}}>Loading Broadcast...</span>
          </div>
          <p id="now-synopsis" style={{color: '#aaa', marginTop: '10px'}}>Connecting to the Short Film Show engine...</p>
          <a id="film-link" href="#" target="_blank" style={{display: 'inline-block', marginTop: '15px', color: '#D4AF37', textDecoration: 'none', border: '1px solid #D4AF37', padding: '8px 20px', borderRadius: '5px'}}>View Film Details</a>
        </div>
      </div>
    </div>
  );
}
