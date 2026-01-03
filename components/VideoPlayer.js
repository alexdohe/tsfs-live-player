import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [hasError, setHasError] = useState(false);

  const checkStreamHealth = async () => {
    try {
      const response = await fetch(streamUrl, { method: 'HEAD' });
      if (response.ok) {
        if (!isLive) setIsLive(true);
        setHasError(false);
      } else {
        setIsLive(false);
      }
    } catch (e) {
      setIsLive(false);
    }
  };

  useEffect(() => {
    // 15-second heartbeat to check if live feed is back
    const heartbeat = setInterval(checkStreamHealth, 15000);
    checkStreamHealth();

    const video = videoRef.current;
    if (!video) return;

    // Set Volume to 100% by default
    video.volume = 1.0;

    let hls;
    if (isLive) {
      if (Hls.isSupported()) {
        hls = new Hls({
          manifestLoadingRetryDelay: 3000,
          manifestLoadingMaxRetry: Infinity // Keep retrying forever
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => video.play().catch(e => console.log("Autoplay blocked")));
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
        video.addEventListener('loadedmetadata', () => video.play());
      }
    } else {
      // Fallback mode: stays in same video element to prevent Fullscreen exit
      video.src = fallbackUrl;
      video.loop = true;
      video.play().catch(e => console.log("Autoplay blocked"));
    }

    return () => {
      clearInterval(heartbeat);
      if (hls) hls.destroy();
    };
  }, [isLive, streamUrl, fallbackUrl]);

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        controls
        playsInline
        muted // Necessary for reliable autoplay
      />
      {!isLive && (
        <div style={{ position: 'absolute', top: '10px', right: '10px', background: 'rgba(0,0,0,0.6)', padding: '5px 10px', borderRadius: '4px', fontSize: '0.7rem', color: '#D4AF37' }}>
          OFF-AIR: SHOWCASE MODE
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
