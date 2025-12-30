import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ShakaEngine = dynamic(() => import('./ShakaEngine'), { ssr: false });

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const [confirmedUrl, setConfirmedUrl] = useState(null);

  useEffect(() => {
    const checkStream = async () => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 2000);

      try {
        // Ping the stream manifest
        const response = await fetch(streamUrl, { 
          method: 'GET', 
          mode: 'no-cors', 
          signal: controller.signal 
        });
        
        // If we reach here, the server responded (even if no-cors hides status)
        console.log("Stream ping successful, loading Live...");
        setConfirmedUrl(streamUrl);
      } catch (e) {
        console.log("Stream unreachable, switching to Fallback.");
        setConfirmedUrl(fallbackUrl);
      } finally {
        clearTimeout(timeoutId);
      }
    };

    checkStream();
  }, [streamUrl, fallbackUrl]);

  if (!confirmedUrl) {
    return <div style={{ aspectRatio: '16/9', background: '#000', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <span style={{ color: '#444', fontSize: '0.8rem' }}>Connecting to signal...</span>
    </div>;
  }

  return <ShakaEngine streamUrl={confirmedUrl} fallbackUrl={fallbackUrl} />;
};

export default VideoPlayer;
