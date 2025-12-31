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

  const linkStyle = { color: '#999', textDecoration: 'none', border: '1px solid #333', padding: '12px 25px', borderRadius: '4px', fontSize: '0.9rem' };
  const goldStyle = { ...linkStyle, color: '#D4AF37', border: '1px solid #D4AF37', fontWeight: 'bold' };

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'serif' }}>
      <Head>
        <title>The Short Film Show | Watch Short Films Live 24 7</title>
        <meta name="description" content="Stream the official 24 7 channel from The Short Film Show. Watch short films from filmmakers worldwide and support the Filmmaker Impact Fund." />
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
            
            <div style={{ marginTop: '25px', display: 'flex', flexWrap: 'wrap', gap: '12px', alignItems: 'center' }}>
               <button onClick={() => window.open(`https://twitter.com/intent/tweet?url=${SITE_URL}`, '_blank')} style={{ background: '#000', color: '#fff', border: '1px solid #333', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Share on X</button>
               <button onClick={() => window.open(`https://www.facebook.com/sharer/sharer.php?u=${SITE_URL}`, '_blank')} style={{ background: '#1877F2', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem' }}>Facebook</button>
               <button onClick={handleGeneralShare} style={{ background: '#D4AF37', color: '#000', border: 'none', padding: '12px 20px', borderRadius: '6px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 'bold' }}>Share Link</button>
            </div>

            <section style={{ marginTop: '50px', padding: '40px', background: '#0a0a0a', borderRadius: '12px', border: '1px solid #1a1a1a' }}>
              <h1 style={{ color: '#D4AF37', fontSize: '2.4rem', fontWeight: 'normal', marginBottom: '25px' }}>Short films always on</h1>
              <div style={{ color: '#ccc', lineHeight: '2', fontSize: '1.1rem' }}>
                <p>Welcome to the official 24 7 live channel from <strong>The Short Film Show</strong>. This stream is a dedicated showcase for short films from filmmakers around the world.</p>
                <p style={{ marginTop: '20px' }}>Every view supports the <strong>Filmmaker Impact Fund</strong>. We are building a sustainable ecosystem where filmmakers can keep creating. By watching, you are helping fund the future of short films.</p>
                
                <h2 style={{ color: '#D4AF37', fontSize: '1.5rem', marginTop: '40px', fontWeight: 'normal' }}>How the live channel works</h2>
                <p>Our broadcast is a continuous schedule of curated films. You can join the stream at any time to discover fresh voices and unforgettable stories. The schedule updates regularly to ensure there is always something new to watch.</p>

                <div style={{ marginTop: '30px' }}>
                  <Link href="/impact" style={{ color: '#D4AF37', textDecoration: 'none', fontWeight: 'bold', borderBottom: '1px solid #D4AF37' }}>Learn about the Impact Fund →</Link>
                </div>
              </div>

              <div style={{ marginTop: '50px', paddingTop: '30px', borderTop: '1px solid #222', textAlign: 'center' }}>
                <div style={{ color: '#444', fontSize: '0.65rem', letterSpacing: '2px', marginBottom: '15px', textTransform: 'uppercase' }}>Advertisement</div>
                <div style={{ minHeight: '100px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#222' }}>[ AdSense Leaderboard Placement ]</div>
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
          <a href="https://theshortfilmshow.com/submit" style={goldStyle}>SUBMIT YOUR FILM</a>
          <Link href="/impact" style={linkStyle}>IMPACT FUND</Link>
          <a href="https://help.theshortfilmshow.com/about/" style={linkStyle} target="_blank">ABOUT</a>
          <a href="https://help.theshortfilmshow.com/contact-us/" style={linkStyle} target="_blank">CONTACT</a>
          <a href="https://help.theshortfilmshow.com/privacy-policy/" style={linkStyle} target="_blank">PRIVACY</a>
          <a href="https://help.theshortfilmshow.com/website-terms-of-use/" style={linkStyle} target="_blank">TERMS</a>
          <a href="https://help.theshortfilmshow.com/cookie-policy/" style={linkStyle} target="_blank">COOKIES</a>
        </div>
        <p style={{ fontSize: '0.85rem', letterSpacing: '0.5px' }}>&copy; 2025 The Short Film Show. All Rights Reserved. Supporting filmmakers worldwide.</p>
      </footer>
    </div>
  );
}
