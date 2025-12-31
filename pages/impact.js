import Head from 'next/head';
import Link from 'next/link';

export default function ImpactFund() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'serif' }}>
      <Head>
        <title>Filmmaker Impact Fund | The Short Film Show</title>
        <meta name="description" content="Discover how The Short Film Show supports independent creators through the Filmmaker Impact Fund." />
      </Head>
      
      <nav style={{ padding: '20px 5%', backgroundColor: '#000', borderBottom: '1px solid #111' }}>
        <Link href="/">
          <img src="https://theshortfilmshow.com/Logo.png" alt="The Short Film Show" style={{ height: '40px', cursor: 'pointer' }} />
        </Link>
      </nav>

      <main style={{ padding: '5% 10%' }}>
        <Link href="/" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span>←</span> BACK TO LIVE CHANNEL
        </Link>
        
        <article style={{ maxWidth: '800px', margin: '60px auto', lineHeight: '2' }}>
          <h1 style={{ color: '#D4AF37', fontSize: '3rem', fontWeight: 'normal', marginBottom: '30px' }}>
            The Filmmaker Impact Fund
          </h1>
          
          <p style={{ fontSize: '1.25rem', color: '#eee', marginBottom: '30px', fontWeight: '300' }}>
            Our mission is built on a simple premise: Independent cinema is the heartbeat of storytelling. 
            The Filmmaker Impact Fund was created to ensure those stories reach a global audience while 
            providing direct, tangible support to the creators themselves.
          </p>
          
          <h2 style={{ color: '#D4AF37', marginTop: '50px', fontSize: '1.8rem', fontWeight: 'normal' }}>
            Sustainable Monetization
          </h2>
          <p style={{ color: '#ccc', fontSize: '1.1rem' }}>
            By integrating professional advertising and sponsorships into our 24/7 broadcast stream, 
            we generate a dedicated revenue pool. Unlike traditional models, a significant portion of 
            this pool is allocated directly to the filmmakers featured on our platform. 
            This revenue helps fund future production costs, festival entry fees, and the 
            continued development of independent projects.
          </p>

          <h2 style={{ color: '#D4AF37', marginTop: '50px', fontSize: '1.8rem', fontWeight: 'normal' }}>
            A Global Showcase
          </h2>
          <p style={{ color: '#ccc', fontSize: '1.1rem' }}>
            The Short Film Show is more than a broadcaster; we are a partner in the filmmaking journey. 
            Every view on our live channel is a contribution to a fairer, more supportive ecosystem 
            for independent artists worldwide.
          </p>

          <div style={{ marginTop: '80px', padding: '40px', border: '1px solid #1a1a1a', textAlign: 'center', borderRadius: '8px' }}>
            <h3 style={{ color: '#fff', marginBottom: '20px' }}>Ready to showcase your work?</h3>
            <a href="https://theshortfilmshow.com/submit" style={{ color: '#000', background: '#D4AF37', padding: '15px 30px', borderRadius: '4px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block' }}>
              SUBMIT TO THE SHORT FILM SHOW
            </a>
          </div>
        </article>
      </main>

      <footer style={{ padding: '40px 5%', textAlign: 'center', color: '#444', fontSize: '0.8rem', borderTop: '1px solid #111' }}>
        &copy; 2025 The Short Film Show. All Rights Reserved.
      </footer>
    </div>
  );
}
