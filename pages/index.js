import Head from 'next/head';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';

export default function TSFSMain() {
  const STREAM = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
  const FALLBACK = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/Fall%20back%20video/Ambience%20-2.mp4";
  const SITE_URL = "https://channel.theshortfilmshow.com";

  const handleGeneralShare = () => {
    if (navigator.share) {
      navigator.share({
        title: 'The Short Film Show - Live',
        url: SITE_URL
      });
    } else {
      navigator.clipboard.writeText(SITE_URL);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'sans-serif' }}>
      <Head>
        <title>The Short Film Show - Live</title>
      </Head>
      
      <nav style={{ padding: '15px 5%', borderBottom: '1px solid #222', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000' }}>
        <img src="https://theshortfilmshow.com/Logo.png" alt="TSFS" style={{ height: '40px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '8px', height: '8px', background: '#ff4b4b', borderRadius: '50%', boxShadow: '0 0 8px #ff4b4b' }}></div>
          <span style={{ fontSize: '0.7rem', color: '#D4AF37', fontWeight: 700, textTransform: 'uppercase' }}>Live Channel</span>
        </div>
      </nav>

      <main style={{ maxWidth: '1600px', margin: '0 auto', padding: '24px 5%', display: 'flex', flexWrap: 'wrap', gap: '24px' }}>
        <div style={{ flex: 2.6, minWidth: '320px' }}>
          <VideoPlayer streamUrl={STREAM} fallbackUrl={FALLBACK} />
          
          <div style={{ marginTop: '20px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
             <button 
                onClick={() => window.open(`https://twitter.com/intent/tweet?url=${SITE_URL}`, '_blank')} 
                style={{ background: '#000', color: '#fff', border: '1px solid #333', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Share on X
             </button>
             
             <button 
                onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}`, '_blank')} 
                style={{ background: '#1877F2', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>
                Facebook
             </button>

             <button 
                onClick={handleGeneralShare} 
                style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '10px 18px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>
                Share Link
             </button>

             <a href="https://theshortfilmshow.com" style={{ color: '#D4AF37', textDecoration: 'none', marginLeft: 'auto', fontSize: '0.9rem' }}>Visit Main Website →</a>
          </div>
        </div>
        <Sidebar />
      </main>
    </div>
  );
}
