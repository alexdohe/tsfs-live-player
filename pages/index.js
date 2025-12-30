import React, { useEffect } from 'react';

export default function LivePlayer() {
  useEffect(() => {
    const init = async () => {
      // Import HLS.js dynamically for Next.js
      const Hls = (await import('hls.js')).default;
      const video = document.getElementById('tv-player');
      const unmuteBtn = document.getElementById('unmute-btn');
      
      // THE FIX: Using a proxy to bypass CORS blocking
      const RAW_URL = 'https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8';
      const PROXY_URL = "https://corsproxy.io/?" + encodeURIComponent(RAW_URL);
      const FALLBACK = "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4";

      function loadStream(url) {
        if (Hls.isSupported()) {
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          hls.on(Hls.Events.MANIFEST_PARSED, () => { video.play().catch(() => {}); });
          hls.on(Hls.Events.ERROR, (event, data) => {
            if (data.fatal && url !== FALLBACK) {
               console.log("Switching to fallback");
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
    };
    init();
  }, []);

  return (
    <div style={{backgroundColor: '#050505', color: 'white', minHeight: '100vh', fontFamily: 'Helvetica, Arial, sans-serif'}}>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css" />
      <style>{`
        .navbar { display: flex; align-items: center; padding: 18px 5%; background: rgba(0,0,0,0.9); border-bottom: 1px solid #222; }
        .brand-logo { font-weight: 800; font-size: 1.5rem; text-transform: uppercase; }
        .brand-logo span { color: #D4AF37; }
        .channel-layout { display: flex; gap: 24px; max-width: 1600px; margin: 0 auto; padding: 24px 5%; }
        .player-column { flex: 2.6; }
        .video-container { position: relative; width: 100%; aspect-ratio: 16/9; background: #000; border-radius: 14px; overflow: hidden; }
        .overlay-badge { position: absolute; top: 20px; left: 20px; background: #e50914; color: #fff; padding: 4px 10px; border-radius: 999px; z-index: 10; font-size: 0.75rem; }
        .unmute-btn { position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); background: rgba(0,0,0,0.8); color: #fff; padding: 14px 26px; border-radius: 999px; cursor: pointer; z-index: 20; border: 1px solid #D4AF37; }
        .info-card { background: #141414; padding: 22px; border-radius: 12px; border-top: 2px solid #D4AF37; margin-bottom: 20px; }
        .hidden { display: none !important; }
      `}</style>

      <nav className="navbar">
        <div className="brand-logo">The Short Film <span>Show</span></div>
      </nav>

      <div className="channel-layout">
        <div className="player-column">
          <div className="video-container">
            <div className="overlay-badge">LIVE</div>
            <button id="unmute-btn" className="unmute-btn"><i className="fas fa-volume-high"></i> Tap to Unmute</button>
            <video id="tv-player" autoPlay muted playsInline loop />
          </div>
        </div>

        <div style={{flex: 1}}>
          <div className="info-card">
            <span style={{color: '#D4AF37', fontSize: '0.7rem', fontWeight: 'bold'}}>NOW PLAYING</span>
            <h1 style={{fontSize: '1.4rem', marginTop: '10px'}}>Live Channel Stream</h1>
            <p style={{color: '#a1a1a1', fontSize: '0.9rem'}}>Broadcasting the latest award-winning independent short films.</p>
          </div>
        </div>
      </div>
    </div>
  );
}
