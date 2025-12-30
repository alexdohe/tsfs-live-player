import React, { useEffect, useRef, useState } from 'react';
import 'shaka-player/dist/controls.css';

const ShakaEngine = ({ streamUrl, fallbackUrl }) => {
  const videoRef = useRef(null);
  const videoContainerRef = useRef(null);
  const [useFallback, setUseFallback] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const shaka = require('shaka-player/dist/shaka-player.ui.js');
    
    let player = new shaka.Player(videoRef.current);
    let ui = new shaka.ui.Overlay(player, videoContainerRef.current, videoRef.current);

    ui.configure({
      'controlPanelElements': ['play_pause', 'spacer', 'mute', 'volume', 'fullscreen']
    });

    const startPlayer = async () => {
      try {
        const url = useFallback ? fallbackUrl : streamUrl;
        console.log("🎬 Shaka Loading:", useFallback ? "FALLBACK" : "STREAM");
        
        // Critical: Tell Shaka exactly how to handle an MP4 file
        if (useFallback) {
          player.configure('manifest.retryParameters.maxAttempts', 0);
        }

        await player.load(url);
      } catch (e) {
        console.error("❌ Shaka Error Code:", e.code);
        // If the stream (or fallback) fails, toggle to the other one
        if (!useFallback) {
          console.log("⚠️ Stream failed. Hard-switching to Fallback...");
          setUseFallback(true);
        }
      }
    };

    startPlayer();

    return () => {
      if (player) player.destroy();
      if (ui) ui.destroy();
    };
  }, [useFallback, streamUrl, fallbackUrl]);

  return (
    <div ref={videoContainerRef} style={{ width: '100%', position: 'relative', background: '#000', aspectRatio: '16/9', borderRadius: '12px', overflow: 'hidden' }}>
      <video ref={videoRef} style={{ width: '100%', height: '100%' }} autoPlay muted playsInline />
    </div>
  );
};

export default ShakaEngine;
