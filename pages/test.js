import React, { useEffect, useRef } from 'react';
import Hls from 'hls.js';

export default function TestPlayer() {
  const videoRef = useRef(null);
  const streamUrl = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";

  useEffect(() => {
    let hls;
    if (videoRef.current) {
      const video = videoRef.current;

      if (Hls.isSupported()) {
        hls = new Hls({
          enableWorker: true,
          lowLatencyMode: true,
          backBufferLength: 90
        });
        hls.loadSource(streamUrl);
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED, () => {
          video.play().catch(e => console.log("Autoplay blocked, user must click play", e));
        });
      } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
        video.src = streamUrl;
      }
    }
    return () => {
      if (hls) hls.destroy();
    };
  }, []);

  return (
    <div style={{ background: '#000', height: '100vh', display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>
      <h1 style={{ marginBottom: '20px', fontFamily: 'sans-serif' }}>TSFS Live Test</h1>
      <video 
        ref={videoRef} 
        controls 
        autoPlay 
        muted 
        playsInline
        style={{ width: '90%', maxWidth: '1000px', boxShadow: '0 0 50px rgba(0,0,0,0.5)' }} 
      />
      <p style={{ marginTop: '20px', opacity: 0.6 }}>Direct Stream: {streamUrl}</p>
    </div>
  );
}
