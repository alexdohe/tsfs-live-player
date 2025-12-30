import React, { useEffect, useRef, useState } from 'react';
import 'shaka-player/dist/controls.css';

const ShakaEngine = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [activeUrl, setActiveUrl] = useState(streamUrl);
  const [isFallback, setIsFallback] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shaka = require('shaka-player/dist/shaka-player.ui.js');
    
    let player = new shaka.Player(videoRef.current);
    let ui = new shaka.ui.Overlay(player, videoContainerRef.current, videoRef.current);

    ui.configure({
      'controlPanelElements': ['play_pause', 'spacer', 'mute', 'volume', 'fullscreen']
    });

    const triggerFallback = () => {
      if (!isFallback) {
        console.log("🚨 Stream hung. Force-switching to S3 Fallback.");
        setIsFallback(true);
        setActiveUrl(fallbackUrl);
      }
    };

    const loadContent = async () => {
      try {
        // Set a short timeout for the manifest request itself
        player.configure('manifest.retryParameters.timeout', 5000);
        player.configure('manifest.retryParameters.maxAttempts', 1);
        
        await player.load(activeUrl);
      } catch (e) {
        console.error("Shaka Error:", e.code);
        triggerFallback();
      }
    };

    loadContent();

    // The "Watchdog": If the video isn't actually playing in 6 seconds, kill it.
    const watchdog = setTimeout(() => {
      if (videoRef.current && videoRef.current.paused && !isFallback) {
        triggerFallback();
      }
    }, 6000);

    return () => {
      clearTimeout(watchdog);
      if (player) player.destroy();
      if (ui) ui.destroy();
    };
  }, [activeUrl, fallbackUrl, isFallback]);

  return (
    <div ref={videoContainerRef} style={{ width: '100%', position: 'relative', background: '#000', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
      <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay muted playsInline />
    </div>
  );
};

export default ShakaEngine;
