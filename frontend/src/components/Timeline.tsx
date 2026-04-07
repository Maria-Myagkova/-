import React, { useEffect, useState } from "react";
import { burstStarSparklesAlongElement } from "../lib/sparkles";

const SELECT_DELAY_MS = 420;

export type TimelineEvent = {
  id: number;
  year: number;
  title: string;
  short_description: string;
  description?: string | null;
  type?: string | null;
  is_central?: boolean;
};

type Props = {
  events: TimelineEvent[];
  onSelect: (event: TimelineEvent) => void;
};

/**
 * Горизонтальная орбита: эллипс неподвижен; маркеры с годами непрерывно движутся по его траектории.
 */
const Timeline: React.FC<Props> = ({ events, onSelect }) => {
  const w = 720;
  const h = 300;
  const cx = w / 2;
  const cy = h / 2 + 12;
  const rx = 300;
  const ry = 96;

  const [phase, setPhase] = useState(0);
  const list = events.length ? events : [];
  const n = Math.max(list.length, 1);

  useEffect(() => {
    let raf = 0;
    const t0 = performance.now();
    const loop = (now: number) => {
      const elapsed = (now - t0) / 1000;
      setPhase(elapsed * 0.16);
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className="w-full flex justify-center px-2">
      <div className="relative" style={{ width: w, maxWidth: "100%", height: h }}>
        <svg
          className="absolute inset-0 w-full h-full pointer-events-none z-0"
          viewBox={`0 0 ${w} ${h}`}
          aria-hidden
        >
          <ellipse
            cx={cx}
            cy={cy}
            rx={rx}
            ry={ry}
            fill="none"
            stroke="rgba(167, 139, 250, 0.35)"
            strokeWidth="2"
          />
        </svg>

        <div className="absolute inset-0 z-10">
          {list.map((event, index) => {
            const t = (index / n) * 2 * Math.PI - Math.PI / 2 + phase;
            const x = cx + rx * Math.cos(t);
            const y = cy + ry * Math.sin(t);
            const isFront = y >= cy - 4;
            const size = event.is_central && isFront ? 76 : isFront ? 64 : 48;
            const opacity = isFront ? 1 : 0.45;

            return (
              <div
                key={event.id}
                className="absolute"
                style={{
                  left: `${(x / w) * 100}%`,
                  top: `${(y / h) * 100}%`,
                  width: 0,
                  height: 0,
                  zIndex: isFront ? 20 : 10,
                }}
              >
                <button
                  type="button"
                  className="absolute rounded-full border-2 border-white/80 bg-[#2d1b4e] text-white font-semibold shadow-lg hover:scale-105 hover:border-accent-copper transition-transform focus:outline-none focus:ring-2 focus:ring-accent-copper/60"
                  style={{
                    width: size,
                    height: size,
                    left: 0,
                    top: 0,
                    transform: "translate(-50%, -50%)",
                    opacity,
                    fontSize: isFront ? 14 : 12,
                  }}
                  onClick={(e) => {
                    burstStarSparklesAlongElement(e.currentTarget);
                    window.setTimeout(() => onSelect(event), SELECT_DELAY_MS);
                  }}
                  aria-label={`${event.year} — ${event.title}`}
                >
                  {event.year}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Timeline;
