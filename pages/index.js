import React, { useEffect } from 'react';

export default function LivePlayer() {
  useEffect(() => {
    async function init() {
      const shaka = await import('shaka-player/dist/shaka-player.ui.js');
      const video = document.getElementById('video');
      const videoParent = document.getElementById('video-parent');
      const player = new shaka.Player(video);
      
      // Basic UI for the demo
      const ui = new shaka.ui.Overlay(player, videoParent, video);
      
      const liveStream = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
      const fallback = "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4";

      try {
        // Force the player to try the live stream
        await player.load(liveStream);
        console.log("Live stream loaded successfully");
      } catch (error) {
        console.error("CORS or Stream error, switching to fallback:", error);
        // If the live stream is blocked, load the S3 fallback immediately
        await player.load(fallback);
      }
    }
    init();
  }, []);

  return (
    <div style={{background: '#000', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center'}}>
      <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/shaka-player@4.7.11/dist/controls.css" />
      
      <div id="video-parent" style={{width: '90%', maxWidth: '1200px', aspectRatio: '16/9', background: '#111', borderRadius: '12px', overflow: 'hidden'}}>
        <video id="video" style={{width: '100%', height: '100%'}} autoPlay muted playsInline loop={true} />
      </div>

      <div style={{marginTop: '20px', textAlign: 'center', color: '#F7AE12', fontFamily: 'sans-serif'}}>
        <img src="https://the-short-film-channel-assets-public.s3.amazonaws.com/public%20files/the-short-film-CHANNEL.png" 
             style={{height: '80px', marginBottom: '10px'}} alt="Logo" />
        <h1 style={{fontSize: '1.5rem'}}>LIVE BROADCAST</h1>
      </div>
    </div>
  );
}
