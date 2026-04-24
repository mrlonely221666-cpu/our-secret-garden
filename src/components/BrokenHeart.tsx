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
    // Burst of particles
    const burst = Array.from({ length: 18 }, (_, i) => ({
      id: i,
      tx: (Math.random() - 0.5) * 220,
      ty: -Math.random() * 180 - 40,
    }));
    setParticles(burst);
    setTimeout(() => onHealed(), 1600);
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Réparer le cœur"
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
        viewBox="0 0 200 180"
        className={`w-56 h-56 sm:w-72 sm:h-72 transition-transform duration-500 ${
          healing ? "animate-glow-pulse scale-110" : "animate-heartbeat"
        }`}
        style={{ filter: "drop-shadow(0 0 30px hsl(var(--rose) / 0.6))" }}
      >
        <defs>
          <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="hsl(345 75% 65%)" />
            <stop offset="100%" stopColor="hsl(15 85% 70%)" />
          </linearGradient>
          <filter id="innerGlow">
            <feGaussianBlur stdDeviation="2" />
          </filter>
        </defs>

        {/* Left half */}
        <path
          d="M100 160 C 40 120, 10 80, 10 50 C 10 25, 30 10, 55 10 C 75 10, 90 22, 100 40 L 100 160 Z"
          fill="url(#heartGrad)"
          className="transition-transform duration-[1400ms] ease-out origin-center"
          style={{
            transform: healing ? "translateX(0) rotate(0deg)" : "translateX(-12px) rotate(-6deg)",
          }}
        />
        {/* Right half */}
        <path
          d="M100 160 C 160 120, 190 80, 190 50 C 190 25, 170 10, 145 10 C 125 10, 110 22, 100 40 L 100 160 Z"
          fill="url(#heartGrad)"
          className="transition-transform duration-[1400ms] ease-out origin-center"
          style={{
            transform: healing ? "translateX(0) rotate(0deg)" : "translateX(12px) rotate(6deg)",
          }}
        />
        {/* Crack line */}
        <path
          d="M100 30 L 95 55 L 105 75 L 92 95 L 102 115 L 97 140 L 100 160"
          stroke="hsl(330 40% 8%)"
          strokeWidth="3"
          fill="none"
          strokeLinecap="round"
          className="transition-opacity duration-700"
          style={{ opacity: healing ? 0 : 0.85 }}
        />
        {/* Healing seam glow */}
        <path
          d="M100 30 L 100 160"
          stroke="hsl(var(--starlight))"
          strokeWidth="2"
          fill="none"
          strokeLinecap="round"
          filter="url(#innerGlow)"
          className="transition-opacity duration-700"
          style={{ opacity: healing ? 1 : 0 }}
        />
      </svg>
    </button>
  );
};
