import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';

const ShakaEngine = dynamic(() => import('./ShakaEngine'), { ssr: false });

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const [showFallback, setShowFallback] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Watchdog: If we don't have a stable stream in 4 seconds, force fallback
    const timer = setTimeout(() => {
      if (loading) {
        console.log("Stream taking too long or blocked. Switching to Native HTML5.");
        setShowFallback(true);
        setLoading(false);
      }
    }, 4000);

    return () => clearTimeout(timer);
  }, [loading]);

  if (showFallback) {
    return (
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
  }

  return (
    <div style={{ position: 'relative' }}>
      <ShakaEngine 
        streamUrl={streamUrl} 
        onSuccess={() => setLoading(false)} 
        onFailure={() => setShowFallback(true)} 
      />
      {loading && (
        <div style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' }}>
          <span style={{ color: '#D4AF37', fontSize: '0.8rem' }}>ESTABLISHING SIGNAL...</span>
        </div>
      )}
    </div>
  );
};

export default VideoPlayer;
