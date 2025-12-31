import Head from 'next/head';
import Link from 'next/link';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';

export default function TSFSMain() {
  const STREAM = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
  const FALLBACK = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/Fall%20back%20video/Ambience%20-2.mp4";
  const SITE_URL = "https://channel.theshortfilmshow.com";

  const handleGeneralShare = () => {
    if (navigator.share) {
      navigator.share({ title: 'The Short Film Show - Live', url: SITE_URL });
    } else {
      navigator.clipboard.writeText(SITE_URL);
      alert("Link copied to clipboard!");
    }
  };

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'serif' }}>
      <Head>
        <title>The Short Film Show | Live Broadcast Showcase</title>
        <meta name="description" content="Watch the official live broadcast of The Short Film Show. Supporting filmmakers through the Filmmakers Impact Fund." />
        <meta name="keywords" content="short films, independent cinema, movie showcase, filmmaker fund" />
      </Head>
      
      <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000', borderBottom: '1px solid #111' }}>
        <img src="https://theshortfilmshow.com/Logo.png" alt="The Short Film Show" style={{ height: '45px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', background: '#ff4b4b', borderRadius: '50%', boxShadow: '0 0 10px #ff4b4b' }}></div>
          <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600, letterSpacing: '1px' }}>LIVE BROADCAST</span>
        </div>
      </nav>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '30px 5% 50px 5%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '40px' }}>
          <div style={{ flex: 2.5, minWidth: '320px' }}>
            <VideoPlayer streamUrl={STREAM} fallbackUrl={FALLBACK} />
            
            {/* SOCIAL SHARING ROW */}
            <div style={{ marginTop: '25px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
               <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${SITE_URL}`, '_blank')} style={{ background: '#000', color: '#fff', border: '1px solid #333', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Share on X</button>
               <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}`, '_blank')} style={{ background: '#1877F2', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Facebook</button>
               <button onClick={handleGeneralShare} style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Share Link</button>
            </div>

            {/* EDITORIAL CONTENT AREA */}
            <section style={{ marginTop: '50px', padding: '40px', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
              <h1 style={{ color: '#D4AF37', fontSize: '2.4rem', fontWeight: 'normal', marginBottom: '25px' }}>
                For the Independent Spirit.
              </h1>
              
              <div style={{ color: '#ccc', lineHeight: '2', fontSize: '1.1rem' }}>
                <p>
                  Welcome to the official live channel for <strong>The Short Film Show</strong>. 
                  This broadcast is a dedicated showcase for independent creators, providing a 24/7 window 
                  into the world’s most compelling short-form stories.
                </p>
                <p style={{ marginTop: '20px' }}>
                  Every view on this channel directly supports the <strong>Filmmakers Impact Fund</strong>. 
                  We believe in a sustainable ecosystem where filmmakers are empowered to continue their craft. 
                  By watching, you are helping fund the future of independent storytelling.
                </p>
                <div style={{ marginTop: '30px' }}>
                  <Link href="/impact" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid #D4AF37' }}>
                    Discover the Impact Fund →
                  </Link>
                </div>
              </div>

              {/* DEDICATED ADSENSE SLOT */}
              <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #222', textAlign: 'center' }}>
                <div style={{ color: '#444', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '15px', textTransform: 'uppercase' }}>Advertisement</div>
                <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  {/* AdSense Unit will go here */}
                  <div style={{ color: '#222' }}>[ AdSense Leaderboard ]</div>
                </div>
              </div>
            </section>
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Sidebar />
          </div>
        </div>
      </main>

      <footer style={{ padding: '80px 5%', borderTop: '1px solid #111', textAlign: 'center', color: '#555' }}>
        <div style={{ marginBottom: '30px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <a href="https://theshortfilmshow.com/submit" style={{ color: '#D4AF37', textDecoration: 'none', border: '1px solid #D4AF37', padding: '12px 25px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold' }}>SUBMIT YOUR FILM</a>
          <Link href="/impact" style={{ color: '#999', textDecoration: 'none', border: '1px solid #333', padding: '12px 25px', borderRadius: '4px', fontSize: '0.9rem' }}>IMPACT FUND</Link>
          <a href="https://help.theshortfilmshow.com/en/collections/10313589-privacy-terms" style={{ color: '#999', textDecoration: 'none', border: '1px solid #333', padding: '12px 25px', borderRadius: '4px', fontSize: '0.9rem' }}>LEGAL</a>
        </div>
        <p style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>&copy; 2025 The Short Film Show. All Rights Reserved. Supporting Independent Filmmakers Globally.</p>
      </footer>
    </div>
  );
}
