import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [needsInteraction, setNeedsInteraction] = useState(true);

  const checkStreamHealth = async () => {
    try {
      const response = await fetch(streamUrl, { method: 'HEAD', cache: 'no-cache' });
      if (response.ok && !isLive) setIsLive(true);
      if (!response.ok && isLive) setIsLive(false);
    } catch (e) {
      if (isLive) setIsLive(false);
    }
  };

  useEffect(() => {
    const heartbeat = setInterval(checkStreamHealth, 10000);
    checkStreamHealth();
    return () => clearInterval(heartbeat);
  }, [isLive]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || needsInteraction) return;

    if (isLive) {
      if (Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();
        const hls = new Hls({ manifestLoadingMaxRetry: Infinity, liveSyncDurationCount: 3 });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.muted = false;
          video.volume = 1.0;
          video.play();
        });
      }
    } else {
      video.src = fallbackUrl;
      video.loop = true;
      video.muted = false;
      video.volume = 1.0;
      video.play();
    }
  }, [isLive, needsInteraction, streamUrl, fallbackUrl]);

  const handleStart = () => {
    setNeedsInteraction(false);
  };

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        controls
        playsInline
      />
      
      {needsInteraction && (
        <div 
          onClick={handleStart}
          style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.9)', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', cursor: 'pointer', zIndex: 20 }}
        >
          <img src="https://theshortfilmshow.com/Logo.png" alt="Logo" style={{ height: '60px', marginBottom: '20px' }} />
          <button style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '15px 40px', borderRadius: '4px', fontWeight: 'bold', letterSpacing: '2px', cursor: 'pointer' }}>
            ENTER CINEMA
          </button>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
