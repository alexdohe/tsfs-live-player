import React, { useEffect, useRef, useState } from 'react';
import 'shaka-player/dist/controls.css';

const ShakaEngine = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [activeUrl, setActiveUrl] = useState(streamUrl);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shaka = require('shaka-player/dist/shaka-player.ui.js');
    
    let player = new shaka.Player(videoRef.current);
    let ui = new shaka.ui.Overlay(player, videoContainerRef.current, videoRef.current);

    ui.configure({
      'controlPanelElements': ['play_pause', 'spacer', 'mute', 'volume', 'fullscreen']
    });

    const init = async () => {
      try {
        console.log("Shaka attempting to load:", activeUrl);
        await player.load(activeUrl);
      } catch (e) {
        console.error("Shaka Load Error:", e.code);
        // If primary stream fails, switch to fallback immediately
        if (activeUrl !== fallbackUrl) {
          console.log("Switching to Fallback Video...");
          setActiveUrl(fallbackUrl);
        }
      }
    };

    init();

    // Safety Timeout: If nothing happens in 4 seconds, force fallback
    const timer = setTimeout(() => {
      if (videoRef.current && videoRef.current.readyState === 0 && activeUrl !== fallbackUrl) {
        setActiveUrl(fallbackUrl);
      }
    }, 4000);

    return () => {
      clearTimeout(timer);
      if (player) player.destroy();
      if (ui) ui.destroy();
    };
  }, [activeUrl, fallbackUrl, streamUrl]);

  return (
    <div ref={videoContainerRef} style={{ width: '100%', position: 'relative', background: '#000', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
      <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay muted playsInline />
    </div>
  );
};

export default ShakaEngine;
