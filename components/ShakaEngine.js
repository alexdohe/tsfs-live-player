import React, { useEffect, useRef } from 'react';
import 'shaka-player/dist/controls.css';

const ShakaEngine = ({ streamUrl }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shaka = require('shaka-player/dist/shaka-player.ui.js');
    
    let player = new shaka.Player(videoRef.current);
    let ui = new shaka.ui.Overlay(player, videoContainerRef.current, videoRef.current);

    ui.configure({
      'controlPanelElements': ['play_pause', 'spacer', 'mute', 'volume', 'fullscreen']
    });

    const load = async () => {
      try {
        await player.load(streamUrl);
      } catch (e) {
        console.error("Shaka error:", e.code);
      }
    };

    load();

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
