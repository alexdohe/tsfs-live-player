import React, { useEffect, useRef, useState } from 'react';
import 'shaka-player/dist/controls.css';

const ShakaEngine = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    // We import Shaka inside useEffect to ensure it only runs in the browser
    const shaka = require('shaka-player/dist/shaka-player.ui.js');

    const initPlayer = async () => {
      const video = videoRef.current;
      const videoContainer = videoContainerRef.current;
      
      const player = new shaka.Player(video);
      const ui = new shaka.ui.Overlay(player, videoContainer, video);

      // Configure professional UI controls
      ui.configure({
        'controlPanelElements': ['play_pause', 'time_and_duration', 'spacer', 'mute', 'volume', 'fullscreen', 'overflow_menu'],
      });

      // Try to load the stream, then the fallback
      try {
        const urlToLoad = hasError ? fallbackUrl : streamUrl;
        console.log("Shaka attempting to load:", urlToLoad);
        await player.load(urlToLoad);
      } catch (error) {
        console.error("Shaka Load Error:", error.code);
        if (!hasError) {
          setHasError(true); // This triggers a re-run with the fallbackUrl
        }
      }

      return { player, ui };
    };

    let result;
    initPlayer().then(res => { result = res; });

    return () => {
      if (result) {
        result.player.destroy();
        result.ui.destroy();
      }
    };
  }, [hasError, streamUrl, fallbackUrl]);

  return (
    <div ref={videoContainerRef} style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
      <video 
        ref={videoRef} 
        style={{ width: '100%', height: '100%', display: 'block' }} 
        autoPlay 
        muted 
        playsInline 
      />
      <style jsx global>{`
        .shaka-release-dot { display: none; }
        .shaka-controls-container { background: linear-gradient(transparent, rgba(0,0,0,0.7)); }
      `}</style>
    </div>
  );
};

export default ShakaEngine;
