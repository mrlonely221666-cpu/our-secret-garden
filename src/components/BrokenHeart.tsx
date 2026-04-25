import { useState } from "react";

interface BrokenHeartProps {
  onHealed: () => void;
}

export const BrokenHeart = ({ onHealed }: BrokenHeartProps) => {
  const [healing, setHealing] = useState(false);
  const [particles, setParticles] = useState<Array<{ id: number; tx: number; ty: number }>>([]);

  const handleClick = () => {
    if (healing) return;
    setHealing(true);
    const burst = Array.from({ length: 22 }, (_, i) => ({
      id: i,
      tx: (Math.random() - 0.5) * 240,
      ty: -Math.random() * 200 - 30,
    }));
    setParticles(burst);
    setTimeout(() => onHealed(), 1800);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Réunir les deux âmes"
      className="relative group focus:outline-none"
    >
      {/* Particles */}
      {particles.map((p) => (
        <span
          key={p.id}
          className="particle"
          style={{
            left: "50%",
            top: "50%",
            ["--tx" as string]: `${p.tx}px`,
            ["--ty" as string]: `${p.ty}px`,
            animation: `particle-rise ${0.8 + Math.random() * 0.6}s ease-out forwards`,
          }}
        />
      ))}

      <svg
        viewBox="0 0 240 220"
        className={`w-64 h-60 sm:w-80 sm:h-72 transition-transform duration-500 ${
          healing ? "scale-105" : "animate-heartbeat"
        }`}
        style={{ filter: "drop-shadow(0 0 30px hsl(var(--rose) / 0.55))" }}
      >
        <defs>
          <linearGradient id="bodyGradL" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(345 75% 70%)" />
            <stop offset="100%" stopColor="hsl(330 60% 45%)" />
          </linearGradient>
          <linearGradient id="bodyGradR" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(28 80% 72%)" />
            <stop offset="100%" stopColor="hsl(15 75% 50%)" />
          </linearGradient>
          <radialGradient id="heartGlow" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="hsl(345 90% 70%)" />
            <stop offset="100%" stopColor="hsl(15 85% 60%)" />
          </radialGradient>
          <filter id="softGlow">
            <feGaussianBlur stdDeviation="2.5" />
          </filter>
        </defs>

        {/* Heart that appears above when they hug */}
        <g
          className="transition-all duration-700 ease-out origin-center"
          style={{
            opacity: healing ? 1 : 0,
            transform: healing ? "translateY(0) scale(1)" : "translateY(20px) scale(0.4)",
            transformOrigin: "120px 35px",
          }}
        >
          <path
            d="M120 55 C 110 42, 92 38, 92 25 C 92 16, 100 10, 108 10 C 114 10, 118 14, 120 20 C 122 14, 126 10, 132 10 C 140 10, 148 16, 148 25 C 148 38, 130 42, 120 55 Z"
            fill="url(#heartGlow)"
            filter="url(#softGlow)"
          />
        </g>

        {/* Left person */}
        <g
          className="transition-transform duration-[1400ms] ease-out"
          style={{
            transform: healing ? "translateX(28px)" : "translateX(-18px)",
          }}
        >
          {/* Head */}
          <circle cx="80" cy="95" r="18" fill="url(#bodyGradL)" />
          {/* Body / arm reaching */}
          <path
            d="M62 118 Q 60 145, 70 175 L 102 175 Q 108 150, 102 130 Q 118 122, 122 110 Q 118 100, 108 102 Q 92 110, 80 115 Q 70 116, 62 118 Z"
            fill="url(#bodyGradL)"
            className="transition-all duration-[1400ms] ease-out"
            style={{
              opacity: 0.95,
            }}
          />
        </g>

        {/* Right person */}
        <g
          className="transition-transform duration-[1400ms] ease-out"
          style={{
            transform: healing ? "translateX(-28px)" : "translateX(18px)",
          }}
        >
          {/* Head */}
          <circle cx="160" cy="95" r="18" fill="url(#bodyGradR)" />
          {/* Body / arm reaching */}
          <path
            d="M178 118 Q 180 145, 170 175 L 138 175 Q 132 150, 138 130 Q 122 122, 118 110 Q 122 100, 132 102 Q 148 110, 160 115 Q 170 116, 178 118 Z"
            fill="url(#bodyGradR)"
            style={{
              opacity: 0.95,
            }}
          />
        </g>

        {/* Sparkle seam between them when hugging */}
        <line
          x1="120"
          y1="80"
          x2="120"
          y2="170"
          stroke="hsl(var(--starlight))"
          strokeWidth="1.5"
          strokeLinecap="round"
          filter="url(#softGlow)"
          className="transition-opacity duration-700"
          style={{ opacity: healing ? 0.7 : 0 }}
        />
      </svg>
    </button>
  );
};
