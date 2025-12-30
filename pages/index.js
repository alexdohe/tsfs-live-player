import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';

export default function TSFSMain() {
  const STREAM = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
  const FALLBACK = "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4";

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <Head><title>The Short Film Show - Live</title></Head>
      
      {/* HEADER WITH LINKED LOGO */}
      <nav style={{ padding: '18px 5%', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <a href="https://theshortfilmshow.com" target="_blank" rel="noopener noreferrer" style={{ textDecoration: 'none', color: 'inherit' }}>
          <div style={{ fontWeight: 800, fontSize: '1.5rem', letterSpacing: '-1px' }}>
            THE SHORT FILM <span style={{ color: '#D4AF37' }}>SHOW</span>
          </div>
        </a>
        <div style={{ fontSize: '0.8rem', color: '#555', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '1px' }}>Live Playout v1.2</div>
      </nav>

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 5%', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        {/* PLAYER SECTION */}
        <div style={{ flex: 2.6, minWidth: '320px' }}>
          <VideoPlayer streamUrl={STREAM} fallbackUrl={FALLBACK} />
          
          {/* SOCIAL SHARE PLACEHOLDER (Our Next Step) */}
          <div style={{ marginTop: '15px', display: 'flex', gap: '10px' }}>
             <div style={{ height: '40px', width: '120px', background: '#111', borderRadius: '4px', border: '1px dashed #333' }}></div>
          </div>
        </div>

        {/* SIDEBAR SECTION */}
        <Sidebar />
      </main>
    </div>
  );
}
