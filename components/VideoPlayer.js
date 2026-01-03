import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLive, setIsLive] = useState(false);

  const checkStreamHealth = async () => {
    try {
      // Use a timestamp to bypass browser cache
      const cacheBuster = streamUrl.includes('?') ? `&t=${Date.now()}` : `?t=${Date.now()}`;
      const response = await fetch(streamUrl + cacheBuster, { method: 'HEAD', cache: 'no-store' });
      
      if (response.ok && !isLive) setIsLive(true);
      if (!response.ok && isLive) setIsLive(false);
    } catch (e) {
      if (isLive) setIsLive(false);
    }
  };

  useEffect(() => {
    const heartbeat = setInterval(checkStreamHealth, 8000); // Check every 8 seconds
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
          // Force player to stay at the very edge of the live stream
          liveSyncDurationCount: 2, 
          manifestLoadingMaxRetry: Infinity,
          manifestLoadingRetryDelay: 500,
          enableWorker: true,
          // Prevent manifest caching
          xhrSetup: (xhr) => {
            xhr.open('GET', xhr.responseURL.includes('?') ? xhr.responseURL + `&t=${Date.now()}` : xhr.responseURL + `?t=${Date.now()}`, true);
          }
        });
        
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          // Attempt unmuted play (Browser may still require one initial click on the page)
          video.muted = false;
          video.play().catch(() => {
            console.log("Autoplay requires a user click to start unmuted.");
            video.muted = true; // Fallback to muted autoplay if blocked
            video.play();
          });
        });
      }
    } else {
      video.src = fallbackUrl;
      video.loop = true;
      video.muted = false;
      video.play().catch(() => {
        video.muted = true;
        video.play();
      });
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
        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: isLive ? '#fff' : '#888', textTransform: 'uppercase', letterSpacing: '1px', textShadow: '0 2px 4px rgba(0,0,0,0.5)' }}>
          {isLive ? 'Live Feed' : 'Showcase Mode'}
        </span>
      </div>
    </div>
  );
};

export default VideoPlayer;
