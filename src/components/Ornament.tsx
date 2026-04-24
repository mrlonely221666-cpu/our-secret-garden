interface OrnamentProps {
  className?: string;
}

/** Decorative gold flourish — used as section divider */
export const Ornament = ({ className = "" }: OrnamentProps) => (
  <div className={`divider-ornament ${className}`} aria-hidden="true">
    <svg width="56" height="20" viewBox="0 0 56 20" fill="none">
      <path
        d="M2 10 Q 14 2, 28 10 Q 42 18, 54 10"
        stroke="url(#ornamentGrad)"
        strokeWidth="1.2"
        strokeLinecap="round"
        fill="none"
      />
      <circle cx="28" cy="10" r="2.5" fill="hsl(var(--gold-bright))" />
      <circle cx="28" cy="10" r="5" fill="none" stroke="hsl(var(--gold) / 0.5)" strokeWidth="0.8" />
      <defs>
        <linearGradient id="ornamentGrad" x1="0" x2="56" y1="0" y2="0">
          <stop offset="0%" stopColor="hsl(var(--gold) / 0)" />
          <stop offset="50%" stopColor="hsl(var(--gold-bright))" />
          <stop offset="100%" stopColor="hsl(var(--gold) / 0)" />
        </linearGradient>
      </defs>
    </svg>
  </div>
);
