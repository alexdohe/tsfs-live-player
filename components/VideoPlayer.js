import React, { useEffect, useRef, useState } from 'react';

export default function VideoPlayer({ streamUrl, fallbackUrl }) {
  const videoRef = useRef(null);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    const init = async () => {
      const Hls = (await import('hls.js')).default;
      const video = videoRef.current;
      if (!video) return;

      if (Hls.isSupported()) {
        const hls = new Hls({ enableWorker: true, manifestLoadingMaxRetry: 1 });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            hls.destroy();
            video.src = fallbackUrl;
            video.play();
          }
        });
        return () => hls.destroy();
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('error', () => { video.src = fallbackUrl; });
      }
    };
    init();
  }, [streamUrl, fallbackUrl]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#111', borderRadius: '14px', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: '20px', left: '20px', background: '#e50914', color: '#fff', fontSize: '0.75rem', fontWeight: 700, padding: '4px 10px', borderRadius: '999px', zIndex: 10 }}>LIVE</div>
      {isMuted && (
        <button onClick={() => { videoRef.current.muted = false; setIsMuted(false); }} style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(0,0,0,0.7)', color: '#fff', padding: '12px 24px', borderRadius: '999px', cursor: 'pointer', zIndex: 20 }}>Tap to Unmute</button>
      )}
      <video ref={videoRef} autoPlay muted playsInline loop style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
    </div>
  );
}
