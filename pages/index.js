import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';

export default function TSFSMain() {
  const STREAM = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
  const FALLBACK = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/Fall+back+video/Ambience+-2.mp4";

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <Head><title>The Short Film Show - Live</title></Head>
      
      {/* HEADER WITH IMAGE LOGO */}
      <nav style={{ padding: '15px 5%', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000' }}>
        <a href="https://theshortfilmshow.com" target="_blank" rel="noopener noreferrer" style={{ display: 'flex', alignItems: 'center' }}>
          <img 
            src="https://theshortfilmshow.com/Logo.png" 
            alt="The Short Film Show" 
            style={{ height: '45px', width: 'auto' }} 
          />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '8px', height: '8px', background: '#ff4b4b', borderRadius: '50%', boxShadow: '0 0 8px #ff4b4b' }}></div>
          <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>Live Channel</span>
        </div>
      </nav>

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 5%', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {/* PLAYER SECTION */}
        <div style={{ flex: 2.6, minWidth: '320px' }}>
          <VideoPlayer streamUrl={STREAM} fallbackUrl={FALLBACK} />
          
          {/* Action Bar (Next Step) */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '12px', alignItems: 'center' }}>
             {/* We will put social buttons here */}
          </div>
        </div>

        {/* SIDEBAR SECTION */}
        <Sidebar />
      </main>
    </div>
  );
}
