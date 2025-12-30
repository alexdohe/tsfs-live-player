import React, { useEffect, useState } from 'react';

export default function LivePlayer() {
  const [metadata, setMetadata] = useState({ 
    title: 'The Short Film Show - Live', 
    synopsis: 'Broadcasting the best in independent cinema.' 
  });
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
      
      const liveStream = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
      const fallbackStream = "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4";

      try {
        // Try live stream first
        await player.load(liveStream);
      } catch (e) {
        console.log("Live stream not ready, switching to fallback.");
        await player.load(fallbackStream);
      }

      try {
        // Fetch EPG and fix thumbnails
        const epgRes = await fetch('https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json');
        const epgData = await epgRes.json();
        const updatedPlaylist = (epgData.playlist || []).map(item => ({
          ...item,
          thumbnail: item.thumbnail.replace('assets.theshortfilmshow.com', 'assets.cdn.theshortfilmshow.com')
        }));
        setSchedule(updatedPlaylist);
      } catch (e) { console.error("Schedule sync failed."); }
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
                     alt="TSFS Logo" style={{height: '110px', width: 'auto'}} />
            </a>
            <div style={{color: '#F7AE12', fontWeight: 'bold', fontSize: '1.6rem', letterSpacing: '2px'}}>LIVE BROADCAST</div>
        </div>

        <div style={{display: 'flex', gap: '50px'}}>
          <div style={{flex: 3}}>
            <div id="video-parent" style={{position: 'relative', aspectRatio: '16/9', background: '#000', borderRadius: '20px', overflow: 'hidden', border: '2px solid rgba(247, 174, 18, 0.4)'}}>
              <video id="video" style={{width: '100%', height: '100%'}} autoPlay muted playsInline loop />
            </div>
            <div style={{marginTop: '30px', padding: '40px', background: '#111', borderRadius: '20px', borderTop: '10px solid #F7AE12'}}>
              <h1 style={{fontSize: '2.8rem', margin: '0 0 15px 0'}}>{metadata.title}</h1>
              <p style={{color: '#bbb', fontSize: '1.3rem', lineHeight: '1.6'}}>{metadata.synopsis}</p>
            </div>
          </div>

          <div style={{flex: 1.2, background: '#111', padding: '30px', borderRadius: '20px', border: '1px solid #222', maxHeight: '850px', overflowY: 'auto'}}>
            <h3 style={{color: '#F7AE12', borderBottom: '2px solid #333', paddingBottom: '20px', marginTop: 0, textTransform: 'uppercase'}}>Coming Up</h3>
            {schedule.length > 0 ? schedule.slice(0, 10).map((item, i) => (
              <div key={i} style={{display: 'flex', gap: '15px', padding: '20px 0', borderBottom: '1px solid #222'}}>
                <img src={item.thumbnail} alt="" style={{width: '100px', height: '56px', objectFit: 'cover', borderRadius: '6px', background: '#222'}} 
                     onError={(e) => { e.target.src = 'https://the-short-film-channel-assets-public.s3.amazonaws.com/public%20files/the-short-film-CHANNEL.png'; }} />
                <div>
                  <div style={{fontSize: '1rem', fontWeight: 'bold', color: '#fff'}}>{item.title}</div>
                  <div style={{fontSize: '0.85rem', color: '#F7AE12', marginTop: '6px'}}>
                    {new Date(item.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                  </div>
                </div>
              </div>
            )) : <p style={{color: '#666'}}>Syncing schedule...</p>}
          </div>
        </div>
      </div>
    </div>
  );
}
