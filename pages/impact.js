import Head from 'next/head';
import Link from 'next/link';

export default function ImpactFund() {
  return (
    <div style={{ backgroundColor: '#050505', minHeight: '100vh', color: '#fff', fontFamily: 'serif', padding: '5% 10%' }}>
      <Head>
        <title>Filmmaker Impact Fund | The Short Film Show</title>
        <meta name="description" content="The Filmmaker Impact Fund supports short filmmakers by turning viewing into direct support. Learn how we fund the future of storytelling." />
      </Head>

      <Link href="/" style={{ color: '#D4AF37', textDecoration: 'none', fontSize: '0.9rem' }}>← Back to Live Channel</Link>

      <article style={{ maxWidth: '800px', margin: '40px auto', lineHeight: '2' }}>
        <h1 style={{ color: '#D4AF37', fontSize: '2.5rem', fontWeight: 'normal' }}>The Filmmaker Impact Fund</h1>

        <p style={{ fontSize: '1.2rem', color: '#ccc' }}>
          Short films deserve a bigger stage and filmmakers deserve sustainable support. The Filmmaker Impact Fund turns
          viewing into direct support for the creators whose work you watch on The Short Film Show.
        </p>

        <h2 style={{ color: '#D4AF37', marginTop: '40px', fontWeight: 'normal' }}>What the fund is</h2>
        <p>
          The Filmmaker Impact Fund is our commitment to building a healthier filmmaking ecosystem. Instead of relying on
          one off prizes or publicity alone, the fund is designed to create an ongoing pool that supports filmmakers over time. 
          By creating this framework, we ensure that talented storytellers have the resources they need to keep producing high quality work.
        </p>

        <h2 style={{ color: '#D4AF37', marginTop: '40px', fontWeight: 'normal' }}>How it is funded</h2>
        <p>
          The fund is supported by revenue generated across The Short Film Show, including advertising and sponsorship on our
          24 7 live stream. Every time an audience member engages with our channel, they are contributing to this pool. 
          As our broadcast reach grows, the fund grows alongside it, allowing us to support even more creators.
        </p>

        <h2 style={{ color: '#D4AF37', marginTop: '40px', fontWeight: 'normal' }}>How filmmakers benefit</h2>
        <p>
          Filmmakers featured on our platform can receive payments supported by the fund. The aim is simple: help creators
          keep making new work, improve sustainability, and reward films that audiences connect with. This direct financial 
          support can be used for production costs, equipment, or developing future scripts.
        </p>

        <h2 style={{ color: '#D4AF37', marginTop: '40px', fontWeight: 'normal' }}>Transparency and Future</h2>
        <p>
          We are building the fund to be clear and accountable. As the platform develops, we will publish updates that explain
          how the fund is calculated and how payouts are handled. Our goal is to create a model that the entire film community can trust.
        </p>

        <div style={{ marginTop: '50px', padding: '30px', borderTop: '1px solid #222' }}>
          <h3 style={{ color: '#D4AF37', fontSize: '1.2rem', fontWeight: 'normal' }}>Frequently Asked Questions</h3>
          <ul style={{ color: '#999', paddingLeft: '20px', marginTop: '20px' }}>
            <li style={{ marginBottom: '10px' }}><strong>How can I support?</strong> Simply by watching the live channel and sharing the stream.</li>
            <li style={{ marginBottom: '10px' }}><strong>Who is eligible?</strong> Any filmmaker whose work is officially selected for broadcast on our channel.</li>
            <li style={{ marginBottom: '10px' }}><strong>Where can I learn more?</strong> You can find full details in our help centre.</li>
          </ul>
        </div>

        <p style={{ marginTop: '40px' }}>
          <a href="https://help.theshortfilmshow.com" style={{ color: '#D4AF37', textDecoration: 'none', border: '1px solid #D4AF37', padding: '10px 20px', borderRadius: '4px' }}>
            Visit the Help Centre
          </a>
        </p>
      </article>
    </div>
  );
}
