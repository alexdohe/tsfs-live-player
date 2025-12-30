import React, { useEffect, useRef, useState } from 'react';
import 'shaka-player/dist/controls.css';
import shaka from 'shaka-player/dist/shaka-player.ui.js';

const ShakaEngine = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const localPlayer = new shaka.Player(videoRef.current);
    const ui = new shaka.ui.Overlay(localPlayer, videoContainerRef.current, videoRef.current);
    
    ui.configure({
      'controlPanelElements': ['play_pause', 'time_and_duration', 'spacer', 'mute', 'volume', 'fullscreen', 'overflow_menu'],
    });

    const loadContent = async () => {
      try {
        await localPlayer.load(hasError ? fallbackUrl : streamUrl);
      } catch (e) {
        if (!hasError) {
          console.error("Shaka Load Error - Switching to Fallback", e);
          setHasError(true);
        }
      }
    };

    loadContent();

    return () => {
      localPlayer.destroy();
      ui.destroy();
    };
  }, [hasError, streamUrl, fallbackUrl]);

  return (
    <div ref={videoContainerRef} style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}>
      <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay muted playsInline />
    </div>
  );
};

export default ShakaEngine;
