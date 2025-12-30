import React, { useEffect, useState } from 'react';

export default function LivePlayer() {
  const [metadata, setMetadata] = useState({ title: 'The Short Film Show', synopsis: 'Connecting to database...' });
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    async function init() {
      const shaka = await import('shaka-player/dist/shaka-player.ui.js');
      const video = document.getElementById('video');
      const videoParent = document.getElementById('video-parent');
      const player = new shaka.Player(video);
      
      const uiConfig = {
        'controlPanelElements': ['play_pause', 'time_and_duration', 'spacer', 'caption', 'mute', 'volume', 'fullscreen', 'airplay'],
      };
      const ui = new shaka.ui.Overlay(player, videoParent, video);
      ui.configure(uiConfig);
      
      try {
        const res = await fetch('/api/live-status');
        const data = await res.json();
        setMetadata(data);
        await player.load(data.streamUrl);

        // This fetch requires the S3 CORS fix to be saved first
        const epgRes = await fetch('https://the-short-film-channel-assets-public.s3.amazonaws.com/public%20files/main.json');
        const epgData = await epgRes.json();
        setSchedule(epgData.playlist || []);
      } catch (e) { console.error("Data Fetch Error", e); }
    }
    init();
  }, []);

  return (
    <div style={{background: '#050505', color: 'white', minHeight: '100vh', fontFamily: 'sans-serif', padding: '40px'}}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.7.11/dist/controls.css" />
      <div style={{maxWidth: '1400px', margin: '0 auto'}}>
        <div style={{marginBottom: '40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
            <a href="https://theshortfilmshow.com" target="_blank" rel="noreferrer">
                <img src="https://the-short-film-channel-assets-public.s3.amazonaws.com/public%20files/the-short-film-CHANNEL.png" 
                     alt="TSFS Logo" 
                     style={{height: '120px', width: 'auto'}} />
            </a>
            <div style={{color: '#F7AE12', fontWeight: 'bold', fontSize: '1.6rem'}}>LIVE BROADCAST</div>
        </div>
        <div style={{display: 'flex', gap: '50px', flexDirection: 'row'}}>
          <div style={{flex: 3}}>
            <div id="video-parent" style={{position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(247, 174, 18, 0.4)'}}>
              <video id="video" style={{width: '100%', height: '100%'}} autoPlay muted playsInline loop />
            </div>
            <div style={{marginTop: '30px', padding: '40px', background: '#111', borderRadius: '16px', borderTop: '8px solid #F7AE12'}}>
              <h1 style={{fontSize: '2.8rem', margin: '0 0 15px 0'}}>{metadata.title}</h1>
              <p style={{color: '#bbb', fontSize: '1.3rem'}}>{metadata.synopsis}</p>
            </div>
          </div>
          <div style={{flex: 1.2, background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #222'}}>
            <h3 style={{color: '#F7AE12', borderBottom: '2px solid #333', paddingBottom: '20px', marginTop: 0}}>Coming Up</h3>
            {schedule.length > 0 ? schedule.map((item, i) => (
              <div key={i} style={{padding: '20px 0', borderBottom: '1px solid #222'}}>
                <div style={{fontSize: '1.2rem', fontWeight: 'bold'}}>{item.title}</div>
                <div style={{fontSize: '0.9rem', color: '#F7AE12', marginTop: '5px'}}>{item.air_time || 'Next'}</div>
              </div>
            )) : <p style={{color: '#444'}}>Connecting to schedule...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
