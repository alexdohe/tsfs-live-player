import Head from 'next/head';

export default function ImpactFund() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'serif', padding: '5% 10%' }}>
      <Head>
        <title>Filmmaker Impact Fund | The Short Film Show</title>
      </Head>
      <a href="/" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Live Channel</a>
      <article style={{ maxWidth: '800px', margin: '40px auto', lineHeight: '2' }}>
        <h1 style={{ color: '#D4AF37', fontSize: '2.5rem', fontWeight: 'normal' }}>The Filmmaker Impact Fund</h1>
        <p style={{ fontSize: '1.2rem', color: '#ccc' }}>Our mission is built on a simple premise: Independent cinema is the heartbeat of storytelling. The Filmmaker Impact Fund was created to ensure those stories reach a global audience while directly supporting the creators.</p>
        <h2 style={{ color: '#D4AF37', marginTop: '40px', fontWeight: 'normal' }}>Direct Support</h2>
        <p>By hosting ads and sponsorships on our 24/7 stream, we generate a revenue pool that is allocated directly to the filmmakers featured on our platform, helping fund their future projects.</p>
      </article>
    </div>
  );
}
