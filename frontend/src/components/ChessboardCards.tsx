import React from "react";
import { Link } from "react-router-dom";
import { SectionListItem } from "../lib/api";

type Props = {
  sections: SectionListItem[];
};

const ChessboardCards: React.FC<Props> = ({ sections }) => {
  return (
    <div className="space-y-6">
      {sections
        .slice()
        .sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0))
        .map((s, idx) => {
          const reversed = idx % 2 === 1;
          return (
            <Link
              key={s.slug}
              to={`/sections/${s.slug}`}
              className="block group"
              aria-label={`Открыть раздел: ${s.title}`}
            >
              <div
                className={`grid gap-4 md:gap-8 items-stretch rounded-2xl border border-accent-silver/30 bg-slate-900/40 overflow-hidden md:grid-cols-2 ${
                  reversed ? "md:[&>*:first-child]:order-2" : ""
                }`}
              >
                <div className="p-5 md:p-7 flex flex-col justify-center">
                  <h3 className="text-lg md:text-xl font-semibold group-hover:text-accent-gold transition-colors">
                    {s.title}
                  </h3>
                  <p className="mt-2 text-sm text-accent-silver/85 leading-relaxed">
                    {s.short_description ?? ""}
                  </p>
                  <div className="mt-4 text-xs text-accent-gold">Открыть раздел →</div>
                </div>

                <div className="relative min-h-44 md:min-h-56">
                  {s.image_url ? (
                    <img
                      src={s.image_url}
                      alt={s.title}
                      className="absolute inset-0 w-full h-full object-cover opacity-90 group-hover:opacity-100 transition-opacity"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gradient-to-br from-slate-700/40 to-slate-950/40" />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-black/55" />
                </div>
              </div>
            </Link>
          );
        })}
    </div>
  );
};

export default ChessboardCards;

