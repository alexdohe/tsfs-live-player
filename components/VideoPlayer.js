import React, { useEffect, useRef, useState } from 'react';
import 'shaka-player/dist/controls.css';
const shaka = require('shaka-player/dist/shaka-player.ui.js');

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [player, setPlayer] = useState(null);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    let localPlayer = new shaka.Player(videoRef.current);
    const ui = new shaka.ui.Overlay(localPlayer, videoContainerRef.current, videoRef.current);
    
    // Configure Shaka for Fullscreen and typical player settings
    const config = {
      'controlPanelElements': ['play_pause', 'time_and_duration', 'spacer', 'mute', 'volume', 'fullscreen', 'overflow_menu'],
    };
    ui.configure(config);

    const loadContent = async () => {
      try {
        await localPlayer.load(hasError ? fallbackUrl : streamUrl);
      } catch (e) {
        if (!hasError) {
          console.error("Stream failed, switching to Shaka Fallback", e);
          setHasError(true);
        }
      }
    };

    loadContent();
    setPlayer(localPlayer);

    return () => {
      if (localPlayer) {
        localPlayer.destroy();
        ui.destroy();
      }
    };
  }, [hasError, streamUrl, fallbackUrl]);

  return (
    <div 
      ref={videoContainerRef} 
      style={{ position: 'relative', width: '100%', borderRadius: '12px', overflow: 'hidden', backgroundColor: '#000' }}
    >
      <video
        ref={videoRef}
        style={{ width: '100%', height: '100%', borderRadius: '12px' }}
        autoPlay
        muted
        playsInline
      />
    </div>
  );
};

export default VideoPlayer;
