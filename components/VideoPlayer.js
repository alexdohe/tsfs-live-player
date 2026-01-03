import React, { useEffect, useRef, useState } from 'react';
import Hls from 'hls.js';

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const hlsRef = useRef(null);
  const [isLive, setIsLive] = useState(false);
  const [isMuted, setIsMuted] = useState(true);

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
    const heartbeat = setInterval(checkStreamHealth, 10000); // 10s check
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
          liveSyncDurationCount: 3, // Stay close to the "edge" of the live feed
          manifestLoadingMaxRetry: Infinity,
          manifestLoadingRetryDelay: 1000,
        });
        
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hlsRef.current = hls;
        
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(() => console.log("Waiting for user interaction to unmute"));
        });

        // Error handling to force a reload if the stream stalls
        hls.on(Hls.Events.ERROR, (event, data) => {
          if (data.fatal) {
            hls.startLoad(); // Recover the stream
          }
        });
      }
    } else {
      video.src = fallbackUrl;
      video.loop = true;
      video.play().catch(() => {});
    }

    return () => {
      if (hlsRef.current) hlsRef.current.destroy();
    };
  }, [isLive, streamUrl, fallbackUrl]);

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !videoRef.current.muted;
      setIsMuted(videoRef.current.muted);
      videoRef.current.volume = 1.0;
    }
  };

  return (
    <div style={{ position: 'relative', width: '100%', aspectRatio: '16/9', background: '#000', borderRadius: '12px', overflow: 'hidden', border: '1px solid #1a1a1a' }}>
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', display: 'block' }}
        controls
        playsInline
        muted={isMuted}
      />
      
      {isMuted && (
        <button 
          onClick={toggleMute}
          style={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', background: 'rgba(212, 175, 55, 0.9)', color: '#000', border: 'none', padding: '15px 30px', borderRadius: '50px', fontWeight: 'bold', cursor: 'pointer', zIndex: 10, boxShadow: '0 0 20px rgba(0,0,0,0.5)', fontFamily: 'inherit' }}
        >
          🔊 TAP TO UNMUTE
        </button>
      )}

      <div style={{ position: 'absolute', top: '20px', left: '20px', display: 'flex', alignItems: 'center', gap: '8px' }}>
        <div style={{ width: '10px', height: '10px', background: isLive ? '#ff4b4b' : '#555', borderRadius: '50%', boxShadow: isLive ? '0 0 10px #ff4b4b' : 'none' }}></div>
        <span style={{ fontSize: '0.7rem', fontWeight: 'bold', color: isLive ? '#fff' : '#888', textTransform: 'uppercase', letterSpacing: '1px' }}>
          {isLive ? 'Live Feed' : 'Showcase Mode'}
        </span>
      </div>
    </div>
  );
};

export default VideoPlayer;
