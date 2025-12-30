import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ShakaEngine = dynamic(() => import('./ShakaEngine'), { ssr: false });

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const [isLive, setIsLive] = useState(null);

  useEffect(() => {
    const checkSignal = async () => {
      try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2500);

        // A simple fetch to see if the server is even breathing
        const response = await fetch(streamUrl, { mode: 'no-cors', signal: controller.signal });
        console.log("Signal detected, engaging Shaka.");
        setIsLive(true);
        clearTimeout(timeout);
      } catch (e) {
        console.log("No signal found, engaging Native Fallback.");
        setIsLive(false);
      }
    };
    checkSignal();
  }, [streamUrl]);

  if (isLive === null) {
    return <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: '12px' }} />;
  }

  // If Live, use the Pro Engine. If Dead, use a standard robust Video tag.
  return isLive ? (
    <ShakaEngine streamUrl={streamUrl} />
  ) : (
    <div style={{ width: '100%', position: 'relative', background: '#000', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
      <video 
        src={fallbackUrl} 
        controls 
        autoPlay 
        muted 
        playsInline 
        loop 
        style={{ width: '100%', height: '100%' }} 
      />
    </div>
  );
};

export default VideoPlayer;
