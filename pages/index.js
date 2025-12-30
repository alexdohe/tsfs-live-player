import React, { useEffect, useState } from 'react';

export default function LivePlayer() {
  const [metadata, setMetadata] = useState({ 
    title: 'The Short Film Show - Live', 
    synopsis: 'Now Broadcasting: Award-winning independent cinema.' 
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
      
      try {
        // FORCING THE LIVE FEED DIRECTLY FOR THE MEETING
        const liveStream = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
        await player.load(liveStream);

        // Still trying to fetch EPG data from your S3
        const epgRes = await fetch('https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json');
        const epgData = await epgRes.json();
        setSchedule(epgData.playlist || []);
      } catch (e) {
        console.error("Stream Load Error", e);
      }
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
                     alt="TSFS Logo" style={{height: '110px'}} />
            </a>
            <div style={{color: '#F7AE12', fontWeight: 'bold', fontSize: '1.6rem'}}>LIVE BROADCAST</div>
        </div>
        <div style={{display: 'flex', gap: '50px'}}>
          <div style={{flex: 3}}>
            <div id="video-parent" style={{position: 'relative', aspectRatio: '16/9', background: '#000', borderRadius: '16px', overflow: 'hidden', border: '2px solid rgba(247, 174, 18, 0.4)'}}>
              <video id="video" style={{width: '100%', height: '100%'}} autoPlay muted playsInline loop />
            </div>
            <div style={{marginTop: '30px', padding: '40px', background: '#111', borderRadius: '16px', borderTop: '8px solid #F7AE12'}}>
              <h1 style={{fontSize: '2.8rem', margin: '0 0 15px 0'}}>{metadata.title}</h1>
              <p style={{color: '#bbb', fontSize: '1.3rem'}}>{metadata.synopsis}</p>
            </div>
          </div>
          <div style={{flex: 1.2, background: '#111', padding: '30px', borderRadius: '16px', border: '1px solid #222'}}>
            <h3 style={{color: '#F7AE12', borderBottom: '2px solid #333', paddingBottom: '20px', marginTop: 0}}>Coming Up</h3>
            {schedule.slice(0, 8).map((item, i) => (
              <div key={i} style={{padding: '15px 0', borderBottom: '1px solid #222'}}>
                <div style={{fontSize: '1rem', fontWeight: 'bold'}}>{item.title}</div>
                <div style={{fontSize: '0.8rem', color: '#F7AE12', marginTop: '5px'}}>
                   {new Date(item.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
