import React, { useEffect, useRef } from 'react';
import 'shaka-player/dist/controls.css';

const ShakaEngine = ({ streamUrl, onSuccess, onFailure }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shaka = require('shaka-player/dist/shaka-player.ui.js');
    
    let player = new shaka.Player(videoRef.current);
    let ui = new shaka.ui.Overlay(player, videoContainerRef.current, videoRef.current);

    const init = async () => {
      try {
        await player.load(streamUrl);
        onSuccess(); // Tell the wrapper we are live!
      } catch (e) {
        console.error("Shaka error:", e.code);
        onFailure(); // Tell the wrapper to swap to fallback
      }
    };

    init();

    return () => {
      if (player) player.destroy();
      if (ui) ui.destroy();
    };
  }, [streamUrl]);

  return (
    <div ref={videoContainerRef} style={{ width: '100%', position: 'relative', background: '#000', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
      <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay muted playsInline />
    </div>
  );
};

export default ShakaEngine;
