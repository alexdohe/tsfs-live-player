import React from 'react';
import dynamic from 'next/dynamic';

// This is the magic line that prevents the "document is not defined" error
const ShakaEngine = dynamic(() => import('./ShakaEngine'), { 
  ssr: false,
  loading: () => <div style={{ paddingTop: '56.25%', background: '#000', borderRadius: '12px' }} />
});

const VideoPlayer = ({ streamUrl, fallbackUrl }) => {
  return <ShakaEngine streamUrl={streamUrl} fallbackUrl={fallbackUrl} />;
};

export default VideoPlayer;
