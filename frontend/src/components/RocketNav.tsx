import React from "react";
import { useNavigate } from "react-router-dom";
import { burstStarSparklesAlongElement } from "../lib/sparkles";

export type SectionLink = {
  id?: number;
  slug: string;
  title: string;
  short_description?: string | null;
  image_url?: string | null;
  sort_order?: number;
};

type Props = {
  sections: SectionLink[];
};

const NAV_DELAY_MS = 480;

const RocketNav: React.FC<Props> = ({ sections }) => {
  const navigate = useNavigate();
  const ordered = sections.slice().sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-col md:flex-row gap-2 md:gap-2 items-center md:items-start">
      {/* Ракета */}
      <div className="flex justify-center md:justify-end md:w-[300px] shrink-0 md:mr-2">
        <div className="w-40 md:w-52 h-[min(92vh,720px)] relative opacity-95 drop-shadow-[-12px_8px_24px_rgba(0,0,0,0.55)]">
          <svg
            aria-hidden
            className="absolute inset-0 h-full w-full object-contain object-bottom"
            viewBox="0 0 320 1080"
            xmlns="http://www.w3.org/2000/svg"
          >
            <defs>
              <linearGradient id="hull" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#110a1d" />
                <stop offset="0.25" stopColor="#1b1030" />
                <stop offset="0.6" stopColor="#251445" />
                <stop offset="1" stopColor="#2b184f" />
              </linearGradient>
              <linearGradient id="inner" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0" stopColor="#0b0612" />
                <stop offset="0.5" stopColor="#130b22" />
                <stop offset="1" stopColor="#1a0f2d" />
              </linearGradient>
            </defs>
            <path
              d="M160 28c50 76 82 176 82 272v330c0 126-36 230-82 312-46-82-82-186-82-312V300c0-96 32-196 82-272z"
              fill="url(#hull)"
              stroke="#301a4a"
              strokeWidth="2"
            />
            <path
              d="M160 120c28 50 46 112 46 182v320c0 94-18 176-46 246-28-70-46-152-46-246V302c0-70 18-132 46-182z"
              fill="url(#inner)"
              opacity="0.95"
            />
            <path d="M104 800c-28 22-50 50-58 92 40 18 70 16 92-2 4-34-6-64-34-90z" fill="url(#hull)" />
            <path d="M216 800c28 22 50 50 58 92-40 18-70 16-92-2-4-34 6-64 34-90z" fill="url(#hull)" />
            <path
              d="M128 884c8-22 22-34 32-34s24 12 32 34v42c0 18-14 32-32 32s-32-14-32-32v-42z"
              fill="url(#hull)"
            />
          </svg>
        </div>
      </div>

      {/* Кнопки - левые и правые сдвинуты навстречу ДРУГ ДРУГУ В 10 РАЗ БЛИЖЕ */}
      <div className="flex-1 flex flex-col justify-center gap-2 md:gap-2 py-6 md:py-8">
        {ordered.map((s, idx) => (
          <div 
            key={s.slug} 
            className={idx % 2 === 0 ? "self-start translate-x-32 md:translate-x-48" : "self-end -translate-x-32 md:-translate-x-48"}
          >
            <a
              href={`/sections/${s.slug}`}
              onClick={(e) => {
                if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                e.preventDefault();
                burstStarSparklesAlongElement(e.currentTarget);
                window.setTimeout(() => navigate(`/sections/${s.slug}`), NAV_DELAY_MS);
              }}
              className="inline-block min-w-[220px] md:min-w-[260px] lg:min-w-[280px] rounded-full border-[3px] border-accent-copper bg-white px-6 py-3 text-center text-accent-copper uppercase tracking-wide text-sm md:text-base font-bold shadow-sm hover:bg-amber-50 transition-colors cursor-pointer"
            >
              {s.title}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RocketNav;