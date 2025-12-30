import { useEffect, useRef } from "react";

export default function LiveTest() {
  const videoRef = useRef(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.src =
      "https://channel.stage.theshortfilmshow.com/channel/main/playlist.m3u8";

    video.muted = true;
    video.autoplay = true;
    video.playsInline = true;

    video.play().catch(() => {});
  }, []);

  return (
    <div style={{ background: "black", height: "100vh" }}>
      <video
        ref={videoRef}
        controls
        style={{
          width: "90%",
          maxWidth: "1200px",
          margin: "40px auto",
          display: "block",
        }}
      />
    </div>
  );
}
