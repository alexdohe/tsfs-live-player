import Head from 'next/head';
import Link from 'next/link';
import VideoPlayer from '../components/VideoPlayer';
import Sidebar from '../components/Sidebar';

export default function TSFSMain() {
  const STREAM = "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";
  const FALLBACK = "https://the-short-film-channel-assets-public.s3.eu-north-1.amazonaws.com/Fall%20back%20video/Ambience%20-2.mp4";
  const SITE_URL = "https://channel.theshortfilmshow.com";

  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'serif' }}>
      <Head>
        <title>The Short Film Show | Live Broadcast Showcase</title>
        <meta name="description" content="Watch the world's finest independent short films on the official live broadcast channel for The Short Film Show. Supporting global filmmakers." />
        <meta name="keywords" content="short films, cinema, movie, independent film, filmmaker fund, streaming cinema" />
      </Head>
      
      <nav style={{ padding: '20px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: '#000' }}>
        <img src="https://theshortfilmshow.com/Logo.png" alt="The Short Film Show" style={{ height: '45px' }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ width: '10px', height: '10px', background: '#ff4b4b', borderRadius: '50%', boxShadow: '0 0 10px #ff4b4b' }}></div>
          <span style={{ fontSize: '0.8rem', color: '#D4AF37', fontWeight: 600, letterSpacing: '1px' }}>LIVE BROADCAST</span>
        </div>
      </nav>

      <main style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 5% 50px 5%' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '30px' }}>
          <div style={{ flex: 2.5, minWidth: '320px' }}>
            <VideoPlayer streamUrl={STREAM} fallbackUrl={FALLBACK} />
            
            <section style={{ marginTop: '50px', maxWidth: '800px' }}>
              <h1 style={{ color: '#D4AF37', fontSize: '2.4rem', fontWeight: 'normal', marginBottom: '25px' }}>
                For the Independent Spirit.
              </h1>
              
              <div style={{ color: '#eee', lineHeight: '1.9', fontSize: '1.1rem' }}>
                <p>
                  Welcome to the official live channel for <strong>The Short Film Show</strong>. 
                  Every story featured here is part of our global mission to support and distribute 
                  the work of independent filmmakers.
                </p>
                <Link href="/impact" style={{ color: '#D4AF37', textDecoration: 'underline' }}>Learn about our Filmmaker Impact Fund →</Link>
              </div>
            </section>
          </div>
          
          <div style={{ flex: 1, minWidth: '300px' }}>
            <Sidebar />
          </div>
        </div>
      </main>

      <footer style={{ padding: '60px 5%', borderTop: '1px solid #111', textAlign: 'center', color: '#555' }}>
        <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'center', flexWrap: 'wrap', gap: '20px' }}>
          <a href="https://theshortfilmshow.com/submit" style={{ color: '#D4AF37', textDecoration: 'none', border: '1px solid #D4AF37', padding: '10px 20px', borderRadius: '4px' }}>SUBMIT YOUR FILM</a>
          <Link href="/impact" style={{ color: '#999', textDecoration: 'none', border: '1px solid #333', padding: '10px 20px', borderRadius: '4px' }}>IMPACT FUND</Link>
          <a href="https://help.theshortfilmshow.com/privacy-policy" style={{ color: '#999', textDecoration: 'none', border: '1px solid #333', padding: '10px 20px', borderRadius: '4px' }}>PRIVACY</a>
          <a href="https://help.theshortfilmshow.com/terms" style={{ color: '#999', textDecoration: 'none', border: '1px solid #333', padding: '10px 20px', borderRadius: '4px' }}>TERMS</a>
        </div>
        <p style={{ fontSize: '0.8rem' }}>&copy; 2025 The Short Film Show. All Rights Reserved. Supporting Independent Filmmakers Globally.</p>
      </footer>
    </div>
  );
}
