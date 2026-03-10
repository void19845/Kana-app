interface TimerRingProps {
  remaining: number;
  fraction:  number;  // 0→1
  colorVar:  string;  // variable CSS couleur
  size?:     number;
}

const RADIUS = 20;
const CIRC   = 2 * Math.PI * RADIUS;

export function TimerRing({ remaining, fraction, colorVar, size = 48 }: TimerRingProps) {
  const offset = CIRC * (1 - fraction);

  return (
    <div className="timer-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size} viewBox="0 0 48 48"
           style={{ transform: 'rotate(-90deg)' }}>
        {/* Piste de fond */}
        <circle
          cx="24" cy="24" r={RADIUS}
          fill="none" strokeWidth="3"
          stroke="var(--border)"
          strokeDasharray={CIRC}
          strokeDashoffset={0}
        />
        {/* Arc animé */}
        <circle
          cx="24" cy="24" r={RADIUS}
          fill="none" strokeWidth="3"
          strokeLinecap="round"
          stroke={colorVar}
          strokeDasharray={CIRC}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 0.9s linear, stroke 0.4s' }}
        />
      </svg>
      <span className="timer-num">{remaining}</span>
    </div>
  );
}
