import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLive, setIsLive] = useState(false);

  // Heartbeat to check if the feed is active
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
    if (!video) return;

    if (isLive) {
      if (Hls.isSupported()) {
        if (hlsRef.current) hlsRef.current.destroy();
        const hls = new Hls({ 
          manifestLoadingMaxRetry: Infinity, 
          liveSyncDurationCount: 3,
          enableWorker: true 
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.muted = false; // Try unmuted
          video.play().catch(() => {
            video.muted = true; // Fallback to muted if browser blocks
            video.play();
          });
        });
      }
    } else {
      // S3 Backup Loop
      if (hlsRef.current) hlsRef.current.destroy();
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
    <div style={{ width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        controls
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
