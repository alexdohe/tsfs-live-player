import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';

export default function TSFSMain() {
  const STREAM = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
  const FALLBACK = "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4";
  const SITE_URL = "https://tsfs-live-player.vercel.app";

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=I'm watching The Short Film Show Live!&url=${SITE_URL}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <Head>
        <title>The Short Film Show - Live Channel</title>
        <meta property="og:title" content="The Short Film Show - Live" />
        <meta property="og:image" content="https://theshortfilmshow.com/Logo.png" />
        <meta name="twitter:card" content="summary_large_image" />
      </Head>
      
      <nav style={{ padding: '15px 5%', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000' }}>
        <a href="https://theshortfilmshow.com" target="_blank" rel="noopener noreferrer">
          <img src="https://theshortfilmshow.com/Logo.png" alt="TSFS" style={{ height: '40px', width: 'auto' }} />
        </a>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', background: '#ff4b4b', borderRadius: '50%', boxShadow: '0 0 8px #ff4b4b' }}></div>
          <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>Live Channel</span>
        </div>
      </nav>

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 5%', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: 2.6, minWidth: '320px' }}>
          {/* PLAYER WITH CONTROLS ENABLED FOR SUBTITLES/FULLSCREEN */}
          <VideoPlayer streamUrl={STREAM} fallbackUrl={FALLBACK} />
          
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '15px', alignItems: 'center' }}>
            <button onClick={shareTwitter} style={{ background: '#1DA1F2', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Share on X</button>
            <button onClick={shareFacebook} style={{ background: '#4267B2', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>Facebook</button>
            <a href="https://theshortfilmshow.com" target="_blank" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '0.9rem', fontWeight: 600, marginLeft: 'auto', borderBottom: '1px solid #D4AF37' }}>
              Visit Main Website →
            </a>
          </div>
        </div>
        <Sidebar />
      </main>
    </div>
  );
}
// Stable Build Force
