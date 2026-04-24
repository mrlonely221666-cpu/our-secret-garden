export const Nebula = () => (
  <>
    <div
      className="nebula"
      style={{
        width: "520px",
        height: "520px",
        top: "-120px",
        left: "-100px",
        background: "radial-gradient(circle, hsl(345 75% 60% / 0.5), transparent 70%)",
        animationDelay: "0s",
      }}
      aria-hidden="true"
    />
    <div
      className="nebula"
      style={{
        width: "640px",
        height: "640px",
        top: "30%",
        right: "-180px",
        background: "radial-gradient(circle, hsl(295 60% 40% / 0.45), transparent 70%)",
        animationDelay: "4s",
      }}
      aria-hidden="true"
    />
    <div
      className="nebula"
      style={{
        width: "480px",
        height: "480px",
        bottom: "-150px",
        left: "30%",
        background: "radial-gradient(circle, hsl(15 80% 55% / 0.35), transparent 70%)",
        animationDelay: "8s",
      }}
      aria-hidden="true"
    />
  </>
);
