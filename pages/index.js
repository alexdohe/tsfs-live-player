import React, { useEffect, useState } from 'react';

export default function LivePlayer() {
  const [schedule, setSchedule] = useState([]);

  useEffect(() => {
    const init = async () => {
      const Hls = (await import('hls.js')).default;
      const video = document.getElementById('tv-player');
      const unmuteBtn = document.getElementById('unmute-btn');
      
      const STREAM_URL = 'https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8';
      const PROXY_URL = "https://corsproxy.io/?" + encodeURIComponent(STREAM_URL);
      const FALLBACK = "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4";

      function loadStream(url) {
        if (Hls.isSupported()) {
          const hls = new Hls({ maxBufferLength: 30 });
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => { 
            video.muted = true;
            video.play().catch(() => {}); 
          });
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal && url !== FALLBACK) {
               video.src = FALLBACK;
               video.play();
            }
          });
        } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
          video.src = url;
        }
      }

      loadStream(PROXY_URL);

      unmuteBtn.addEventListener('click', () => {
        video.muted = false;
        unmuteBtn.classList.add('hidden');
      });

      // Fetch EPG and fix thumbnails
      try {
        const epgRes = await fetch('https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/epg/main.json');
        const epgData = await epgRes.json();
        const updated = (epgData.playlist || []).map(item => ({
          ...item,
          thumbnail: item.thumbnail.replace('assets.theshortfilmshow.com', 'assets.cdn.theshortfilmshow.com')
        }));
        setSchedule(updated);
      } catch (e) { console.error("EPG Error", e); }
    };
    init();
  }, []);

  return (
    <div style={{background: 'radial-gradient(circle at top, #151515 0, #050505 55%, #000000 100%)', color: 'white', minHeight: '100vh', fontFamily: 'Helvetica, Arial, sans-serif'}}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style>{`
        .navbar { display: flex; align-items: center; padding: 18px 5%; background: rgba(0,0,0,0.9); border-bottom: 1px solid #222; position: sticky; top: 0; z-index: 100; backdrop-filter: blur(16px); }
        .brand-logo { font-weight: 800; font-size: 1.5rem; text-transform: uppercase; letter-spacing: 1px; }
        .brand-logo span { color: #D4AF37; }
        .channel-layout { display: flex; flex-wrap: wrap; gap: 24px; max-width: 1600px; margin: 0 auto; padding: 24px 5%; }
        .player-column { flex: 2.6; min-width: 320px; }
        .video-container { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 14px; overflow: hidden; box-shadow: 0 32px 80px rgba(0, 0, 0, 0.9); }
        .overlay-badge { position: absolute; top: 20px; left: 20px; background: #e50914; color: #fff; font-size: 0.75rem; font-weight: 700; padding: 4px 10px; border-radius: 999px; z-index: 10; display: flex; align-items: center; gap: 6px; }
        .unmute-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0, 0, 0, 0.72); border: 1px solid rgba(255,255,255,0.3); color: #fff; padding: 14px 26px; border-radius: 999px; cursor: pointer; z-index: 20; font-weight: 600; }
        .info-card { background: rgba(12,12,12,0.96); padding: 22px; border-radius: 12px; border-top: 2px solid #D4AF37; box-shadow: 0 14px 32px rgba(0,0,0,0.8); margin-bottom: 20px; }
        .epg-item { display: flex; gap: 15px; padding: 15px 0; border-bottom: 1px solid #262626; }
        .hidden { display: none !important; }
      `}</style>

      <nav className="navbar">
        <div className="brand-logo">The Short Film <span>Show</span></div>
      </nav>

      <div className="channel-layout">
        <div className="player-column">
          <div className="video-container">
            <div className="overlay-badge"><div style={{width:'8px', height:'8px', background:'#fff', borderRadius:'50%'}}></div> Live</div>
            <button id="unmute-btn" className="unmute-btn"><i className="fas fa-volume-high"></i> Tap to Unmute</button>
            <video id="tv-player" autoPlay muted playsInline loop />
          </div>
        </div>

        <div style={{flex: 1, minWidth: '300px'}}>
          <div className="info-card">
            <span style={{fontSize:'0.75rem', color:'#D4AF37', fontWeight:'700', letterSpacing:'1.5px'}}>NOW PLAYING</span>
            <h1 style={{fontSize:'1.6rem', margin:'10px 0'}}>Live Showcase</h1>
            <p style={{fontSize:'0.9rem', color:'#a1a1a1', lineHeight:'1.6'}}>Award-winning independent cinema, broadcast live 24/7.</p>
          </div>
          
          <div className="info-card">
            <span style={{fontSize:'0.75rem', color:'#D4AF37', fontWeight:'700', letterSpacing:'1.5px'}}>UP NEXT</span>
            {schedule.slice(0,6).map((item, i) => (
              <div key={i} className="epg-item">
                <img src={item.thumbnail} style={{width:'80px', height:'45px', objectFit:'cover', borderRadius:'4px'}} 
                     onError={(e) => { e.target.src = 'https://the-short-film-channel-assets-public.s3.amazonaws.com/public%20files/the-short-film-CHANNEL.png'; }} />
                <div>
                  <div style={{fontSize:'0.9rem', fontWeight:'bold'}}>{item.title}</div>
                  <div style={{fontSize:'0.75rem', color:'#777'}}>{new Date(item.start).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
