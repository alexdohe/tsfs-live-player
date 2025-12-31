import Head from 'next/head';
import Link from 'next/link';

export default function ImpactFund() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: "'Trust', serif", padding: '5% 10%' }}>
      <Head>
        <title>Filmmaker Impact Fund | The Short Film Show</title>
        <meta name="description" content="The Filmmaker Impact Fund supports creators by turning audience viewing into direct support." />
      </Head>

      <Link href="/" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '0.8rem', letterSpacing: '2px', fontWeight: 'bold' }}>
        ← BACK TO LIVE CHANNEL
      </Link>

      <article style={{ maxWidth: '800px', margin: '60px auto', lineHeight: '2' }}>
        <h1 style={{ color: '#D4AF37', fontSize: '3rem', fontWeight: 'normal', letterSpacing: '-1px', marginBottom: '40px' }}>
          The Filmmaker Impact Fund
        </h1>

        <p style={{ fontSize: '1.3rem', color: '#eee', fontWeight: '300', marginBottom: '30px' }}>
          Short films deserve a bigger stage and filmmakers deserve sustainable support. The Filmmaker Impact Fund turns
          viewing into direct support for the creators whose work you watch on The Short Film Show.
        </p>

        <h2 style={{ color: '#D4AF37', marginTop: '50px', fontWeight: 'normal', fontSize: '1.6rem' }}>How it is funded</h2>
        <p style={{ color: '#ccc', fontSize: '1.1rem' }}>
          The fund is supported by revenue generated across The Short Film Show including advertising and sponsorship on our
          24 7 live stream. Every time an audience member engages with our channel they are contributing to this pool.
        </p>

        <h2 style={{ color: '#D4AF37', marginTop: '50px', fontWeight: 'normal', fontSize: '1.6rem' }}>Supporting filmmakers worldwide</h2>
        <p style={{ color: '#ccc', fontSize: '1.1rem' }}>
          By creating this sustainable ecosystem, we ensure that filmmakers can continue their craft and bring new stories 
          to audiences everywhere. Every view helps build the future of storytelling.
        </p>

        <div style={{ marginTop: '60px' }}>
          <a href="https://help.theshortfilmshow.com" style={{ color: '#D4AF37', textDecoration: 'none', border: '1px solid #D4AF37', padding: '15px 30px', borderRadius: '4px', fontSize: '0.9rem', fontWeight: 'bold', letterSpacing: '1px' }}>
            VISIT THE HELP CENTRE
          </a>
        </div>
      </article>
    </div>
  );
}
