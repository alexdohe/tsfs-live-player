import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLive, setIsLive] = useState(false);

  const checkStreamHealth = async () => {
    try {
      const response = await fetch(streamUrl, { method: 'HEAD', cache: 'no-cache' });
      if (response.ok) {
        if (!isLive) setIsLive(true);
      } else {
        if (isLive) setIsLive(false);
      }
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
    if (!video) return;

    if (isLive) {
      if (Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();
        
        const hls = new Hls({
          manifestLoadingMaxRetry: Infinity,
          manifestLoadingRetryDelay: 1000,
          liveDurationInfinity: true,
          enableWorker: true
        });
        
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => {
            // If autoplay fails unmuted, we play muted to ensure it starts
            video.muted = true;
            video.play();
          });
        });
      }
    } else {
      // Fallback Mode
      if (hlsRef.current) hlsRef.current.destroy();
      video.src = fallbackUrl;
      video.loop = true;
      video.play().catch(() => {});
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [isLive, streamUrl, fallbackUrl]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        controls
        playsInline
      />
      
      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px', pointerEvents: 'none' }}>
        <div style={{ width: '10px', height: '10px', background: isLive ? '#ff4b4b' : '#555', borderRadius: '50%', boxShadow: isLive ? '0 0 10px #ff4b4b' : 'none' }}></div>
        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: isLive ? '#fff' : '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {isLive ? 'Live Feed' : 'Showcase Mode'}
        </span>
      </div>
    </div>
  );
};

export default VideoPlayer;
