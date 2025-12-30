import React, { useEffect, useRef, useState } from 'react';
import 'shaka-player/dist/controls.css';

const ShakaEngine = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const shaka = require('shaka-player/dist/shaka-player.ui.js');
    
    // Check if browser supports Shaka
    if (!shaka.Player.isBrowserSupported()) {
      console.error('Browser not supported!');
      return;
    }

    let player = new shaka.Player(videoRef.current);
    let ui = new shaka.ui.Overlay(player, videoContainerRef.current, videoRef.current);

    ui.configure({
      'controlPanelElements': ['play_pause', 'time_and_duration', 'spacer', 'mute', 'volume', 'fullscreen', 'overflow_menu'],
    });

    const loadVideo = async () => {
      try {
        const url = hasError ? fallbackUrl : streamUrl;
        console.log("Shaka loading:", url);
        
        // Use a more robust load sequence
        await player.load(url);
        console.log("Content loaded successfully!");
      } catch (error) {
        if (!hasError) {
          console.error("Primary stream failed, attempting fallback...", error.code);
          setHasError(true);
        } else {
          console.error("Fallback also failed.", error.code);
        }
      }
    };

    loadVideo();

    return () => {
      if (player) player.destroy();
      if (ui) ui.destroy();
    };
  }, [hasError, streamUrl, fallbackUrl]);

  return (
    <div ref={videoContainerRef} style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
      <video 
        ref={videoRef} 
        style={{ width: '100%', height: '100%', display: 'block' }} 
        autoPlay 
        muted 
        playsinline 
      />
      <style jsx global>{`
        .shaka-release-dot { display: none; }
        .shaka-overflow-menu { background-color: #0c0c0c !important; color: white !important; }
        .shaka-bottom-controls { padding: 0 10px 5px 10px; }
      `}</style>
    </div>
  );
};

export default ShakaEngine;
