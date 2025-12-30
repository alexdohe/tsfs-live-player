import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';

export default function TSFSMain() {
  const STREAM = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
  const FALLBACK = "https://the-short-film-channel-assets-public.s3.amazonaws.com/Fall+back+video/Ambience+-2.mp4";
  const SITE_URL = "https://tsfs-live-player.vercel.app"; // Update this to your final domain later

  const shareTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=I'm watching The Short Film Show Live! Check it out here:&url=${SITE_URL}`, '_blank');
  };

  const shareFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}`, '_blank');
  };

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <Head><title>The Short Film Show - Live</title></Head>
      
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
          <VideoPlayer streamUrl={STREAM} fallbackUrl={FALLBACK} />
          
          {/* SOCIAL ACTION BAR */}
          <div style={{ marginTop: '20px', display: 'flex', gap: '15px', alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: '#444', textTransform: 'uppercase' }}>Share Stream:</span>
            
            <button onClick={shareTwitter} style={{ background: '#1DA1F2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
              Twitter / X
            </button>
            
            <button onClick={shareFacebook} style={{ background: '#4267B2', color: '#fff', border: 'none', padding: '8px 16px', borderRadius: '4px', cursor: 'pointer', fontWeight: 'bold', fontSize: '0.8rem' }}>
              Facebook
            </button>
          </div>
        </div>

        <Sidebar />
      </main>
    </div>
  );
}
