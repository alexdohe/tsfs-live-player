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

    const loadContent = async () => {
      try {
        console.log("Shaka attempting to load:", activeUrl);
        await player.load(activeUrl);
      } catch (e) {
        console.error("Shaka Load Error:", e.code);
        if (!isFallback) {
          triggerFallback();
        }
      }
    };

    const triggerFallback = () => {
      console.log("🚨 Hard Switching to Fallback Video...");
      setIsFallback(true);
      setActiveUrl(fallbackUrl);
    };

    loadContent();

    // 5-Second Watchdog: If video hasn't started, force the fallback
    const watchdog = setTimeout(() => {
      if (videoRef.current && videoRef.current.readyState < 3 && !isFallback) {
        triggerFallback();
      }
    }, 5000);

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
