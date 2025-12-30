import React, { useEffect, useState } from 'react';

export default function LivePlayer() {
  const [metadata, setMetadata] = useState({ title: 'The Short Film Show', synopsis: 'Connecting...' });
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function init() {
      const shaka = await import('shaka-player/dist/shaka-player.ui.js');
      const video = document.getElementById('video');
      const videoParent = document.getElementById('video-parent');
      const player = new shaka.Player(video);
      
      // UI Configuration for AirPlay and Fullscreen
      const uiConfig = {
        controlPanelElements: ['play_pause', 'time_and_duration', 'spacer', 'caption', 'mute', 'volume', 'fullscreen', 'airplay'],
      };
      const ui = new shaka.ui.Overlay(player, videoParent, video);
      ui.configure(uiConfig);
      
      try {
        const res = await fetch('/api/live-status');
        const data = await res.json();
        setMetadata(data);
        await player.load(data.streamUrl);

        const epgRes = await fetch('https://the-short-film-channel-assets-public.s3.amazonaws.com/public%20files/main.json');
        const epgData = await epgRes.json();
        setSchedule(epgData.playlist || []);
      } catch (e) { console.error("Player Error", e); }
    }
    init();
  }, []);

  return (
    <div style={{background: '#050505', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px'}}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.7.11/dist/controls.css" />
      <div style={{maxWidth: '1300px', margin: '0 auto'}}>
        
        {/* HEADER WITH LARGE LINKED LOGO */}
        <div style={{marginBottom: '30px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end'}}>
            <a href="https://theshortfilmshow.com" target="_blank" rel="noreferrer">
                <img 
                  src="https://the-short-film-channel-assets-public.s3.amazonaws.com/public%20files/the-short-film-CHANNEL.png" 
                  alt="TSFS Logo" 
                  style={{height: '100px', width: 'auto'}} 
                />
            </a>
            <div style={{textAlign: 'right'}}>
                <div style={{color: '#F7AE12', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '2px'}}>LIVE CHANNEL</div>
            </div>
        </div>

        <div style={{display: 'flex', gap: '40px', flexDirection: 'row'}}>
          {/* PLAYER AREA */}
          <div style={{flex: 2.5}}>
            <div id="video-parent" style={{position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden', border: '1px solid rgba(247, 174, 18, 0.3)'}}>
              <video id="video" style={{width: '100%', height: '100%'}} autoPlay muted playsInline loop />
            </div>
            <div style={{marginTop: '30px', padding: '30px', background: '#111', borderRadius: '16px', borderTop: '5px solid #F7AE12'}}>
              <h1 style={{fontSize: '2.2rem', margin: '0 0 15px 0', color: '#fff'}}>{metadata.title}</h1>
              <p style={{color: '#bbb', fontSize: '1.1rem', lineHeight: '1.6'}}>{metadata.synopsis}</p>
            </div>
          </div>

          {/* EPG SIDEBAR */}
          <div style={{flex: 1, background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #222', maxHeight: '750px', overflowY: 'auto'}}>
            <h3 style={{color: '#F7AE12', borderBottom: '1px solid #333', paddingBottom: '20px', marginTop: 0, textTransform: 'uppercase'}}>Coming Up</h3>
            {schedule.length > 0 ? schedule.map((item, i) => (
              <div key={i} style={{padding: '20px 0', borderBottom: '1px solid #222'}}>
                <div style={{fontSize: '1.1rem', fontWeight: 'bold'}}>{item.title}</div>
                <div style={{fontSize: '0.9rem', color: '#F7AE12', marginTop: '8px'}}>{item.air_time || 'Next'}</div>
              </div>
            )) : <p style={{color: '#666'}}>Syncing schedule...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
