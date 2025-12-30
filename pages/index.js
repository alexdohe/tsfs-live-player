import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';

export default function TSFSMain() {
  const STREAM = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
  const FALLBACK = "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4";

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff' }}>
      <Head><title>The Short Film Show - Live</title></Head>
      <nav style={{ padding: '18px 5%', borderBottom: '1px solid #222' }}>
        <div style={{ fontWeight: 800, fontSize: '1.5rem' }}>THE SHORT FILM <span style={{ color: '#D4AF37' }}>SHOW</span></div>
      </nav>
      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 5%', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: 2.6, minWidth: '320px' }}>
          <VideoPlayer streamUrl={STREAM} fallbackUrl={FALLBACK} />
        </div>
        <Sidebar />
      </main>
    </div>
  );
}
