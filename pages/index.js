import React, { useEffect, useRef, useState } from 'react';
import Head from 'next/head';

export default function TSFSMainPlayer() {
  const videoRef = useRef(null);
  const [status, setStatus] = useState('connecting');
  const [isMuted, setIsMuted] = useState(true);
  
  const STREAM_URL = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
  const FALLBACK_URL = "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4";

  useEffect(() => {
    const initPlayer = async () => {
      const Hls = (await import('hls.js')).default;
      const video = videoRef.current;
      if (!video) return;

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, manifestLoadingMaxRetry: 1 });
        hls.loadSource(STREAM_URL);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          setStatus('live');
          video.play().catch(() => setStatus('click-to-play'));
        });
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            setStatus('fallback');
            hls.destroy();
            video.src = FALLBACK_URL;
            video.play();
          }
        });
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = STREAM_URL;
        video.addEventListener('error', () => { video.src = FALLBACK_URL; setStatus('fallback'); });
      }
    };
    initPlayer();
  }, []);

  const handleUnmute = () => {
    if (videoRef.current) {
      videoRef.current.muted = false;
      setIsMuted(false);
      videoRef.current.play();
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'Helvetica, Arial, sans-serif' }}>
      <Head><title>The Short Film Show - Live Channel</title></Head>

      <nav style={{ padding: '18px 5%', borderBottom: '1px solid #222', background: 'rgba(0,0,0,0.9)' }}>
        <div style={{ fontWeight: 800, fontSize: '1.5rem', textTransform: 'uppercase' }}>
          THE SHORT FILM <span style={{ color: '#D4AF37' }}>SHOW</span>
        </div>
      </nav>

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 5%', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: 2.6, minWidth: '320px' }}>
          <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#141414', borderRadius: '14px', overflow: 'hidden', boxShadow: '0 32px 80px rgba(0,0,0,0.9)' }}>
            <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#e50914', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', zIndex: 10, display: 'flex', alignItems: 'center', gap: '6px' }}>
              <div style={{ width: '8px', height: '8px', background: '#fff', borderRadius: '50%' }}></div> LIVE
            </div>

            {isMuted && (
              <button onClick={handleUnmute} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.72)', color: '#fff', border: '1px solid rgba(255,255,255,0.3)', padding: '14px 26px', borderRadius: '999px', cursor: 'pointer', zIndex: 20 }}>
                Tap to Unmute
              </button>
            )}

            <video ref={videoRef} autoPlay muted playsInline loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>

          <div style={{ marginTop: '16px', padding: '14px 18px', background: '#0c0c0c', borderRadius: '12px', border: '1px solid #222' }}>
            Watching: <strong>{status === 'live' ? 'Live Stream Channel 1' : 'Broadcast Standby'}</strong>
          </div>
        </div>

        <div style={{ flex: 1, minWidth: '280px' }}>
          <div style={{ background: '#0c0c0c', padding: '22px', borderRadius: '12px', borderTop: '2px solid #D4AF37' }}>
            <span style={{ color: '#D4AF37', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase' }}>Now Playing</span>
            <h1 style={{ fontSize: '1.6rem', margin: '10px 0' }}>Short Film Showcase</h1>
            <p style={{ fontSize: '0.9rem', color: '#a1a1a1', lineHeight: '1.6' }}>
              Curated award-winning shorts from around the world.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
