import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { AboutContent, fetchJson } from "../lib/api";

const AboutPage: React.FC = () => {
  const [content, setContent] = useState<AboutContent | null>(null);

  useEffect(() => {
    fetchJson<AboutContent>("/about")
      .then(setContent)
      .catch(() => setContent(null));
  }, []);

  if (!content) {
    return (
      <div className="min-h-screen bg-korolev-bg text-white flex items-center justify-center">
        <p className="text-white/60">Загрузка…</p>
      </div>
    );
  }

  const sourcesLines = content.sources
    .split("\n")
    .map((s) => s.trim())
    .filter(Boolean);

  const relevanceItems = content.relevance
    .split("\n")
    .map((s) => s.trim())
    .filter((s) => s.replace(/^-\s*/, "").length > 0)
    .map((s) => s.replace(/^-\s*/, ""));

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0a001a] text-white">
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-32 -left-24 h-96 w-96 rounded-full bg-purple-900/20 blur-3xl" />
        <div className="absolute top-1/3 right-0 h-[28rem] w-[28rem] rounded-[40%] bg-korolev-wave/60 opacity-40 blur-3xl" />
        <div className="absolute bottom-0 left-1/4 h-64 w-[120%] -translate-x-1/4 rounded-[100%] bg-indigo-950/50 blur-2xl" />
      </div>

      <header className="relative z-10 flex items-start justify-between px-6 pt-8 md:px-12 md:pt-12">
        <Link
          to="/"
          className="text-sm text-white/80 hover:text-white"
        >
          ← На главную
        </Link>
        <span className="rounded-full border-2 border-indigo-500/80 bg-[#221251]/90 px-5 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
          О проекте
        </span>
      </header>

      <main className="relative z-10 mx-auto max-w-4xl px-6 pb-24 pt-8 md:px-10">
        <h1 className="heading-depth text-center text-5xl font-bold text-accent-gold md:text-6xl">Цель</h1>

        <p className="text-justify mx-auto mt-16 max-w-3xl text-base leading-relaxed text-white md:text-lg">
          {content.goal}
        </p>

        {content.mission ? (
          <section className="mt-20">
            <h2 className="heading-depth text-center text-5xl font-bold text-accent-gold md:text-6xl">Миссия</h2>
            <p className="text-justify mx-auto mt-10 max-w-3xl text-base leading-relaxed text-white/90 md:text-lg">
              {content.mission}
            </p>
          </section>
        ) : null}

        {relevanceItems.length > 0 ? (
          <section className="mt-20">
            <h2 className="heading-depth text-center text-5xl font-bold text-accent-gold md:text-6xl">Актуальность</h2>
            <ul className="text-justify mx-auto mt-10 max-w-3xl list-disc space-y-4 pl-6 text-sm text-white/90 md:text-base md:pl-8">
              {relevanceItems.map((line, i) => (
                <li key={i} className="leading-relaxed">
                  {line}
                </li>
              ))}
            </ul>
          </section>
        ) : null}

        <section className="mt-32">
          <h2 className="heading-depth text-center text-5xl font-bold text-accent-gold md:text-6xl">Команда</h2>
          <div className="mx-auto mt-14 grid max-w-3xl grid-cols-1 gap-12 sm:grid-cols-3">
            {content.team_members.map((m) => {
              const hasPhoto = Boolean(m.photo_url && m.photo_url.trim());
              const initials = m.name
                .split(/\s+/)
                .map((p) => p[0])
                .join("")
                .slice(0, 3)
                .toUpperCase();

              if (m.name.includes("Злата")) {
                return (
                  <div key={m.name} className="text-center">
                    <div className="mx-auto h-36 w-36">
                      <div className="h-full w-full overflow-hidden rounded-full border-4 border-accent-gold bg-korolev-panel p-1 shadow-[4px_6px_18px_rgba(0,0,0,0.45)] ring-1 ring-accent-gold/30">
                        <img
                          src="/media/team/zlata.png"
                          alt={m.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-sm font-semibold text-accent-gold">{m.name}</div>
                    <div className="mt-2 whitespace-pre-line text-xs leading-relaxed text-white/80">{m.role}</div>
                  </div>
                );
              }

              if (m.name.includes("Кристина")) {
                return (
                  <div key={m.name} className="text-center">
                    <div className="mx-auto h-36 w-36">
                      <div className="h-full w-full overflow-hidden rounded-full border-4 border-accent-gold bg-korolev-panel p-1 shadow-[4px_6px_18px_rgba(0,0,0,0.45)] ring-1 ring-accent-gold/30">
                        <img
                          src="/media/team/kristina.png"
                          alt={m.name}
                          className="h-full w-full rounded-full object-cover"
                        />
                      </div>
                    </div>
                    <div className="mt-4 text-sm font-semibold text-accent-gold">{m.name}</div>
                    <div className="mt-2 whitespace-pre-line text-xs leading-relaxed text-white/80">{m.role}</div>
                  </div>
                );
              }

              return (
                <div key={m.name} className="text-center">
                  <div className="mx-auto h-36 w-36 overflow-hidden rounded-full border-4 border-accent-gold bg-korolev-panel shadow-lg ring-2 ring-accent-gold/40">
                    {hasPhoto ? (
                      <img src={m.photo_url!} alt={m.name} className="h-full w-full object-cover" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center text-lg font-bold text-white/50">{initials}</div>
                    )}
                  </div>
                  <div className="mt-4 text-sm font-semibold text-accent-gold">{m.name}</div>
                  <div className="mt-2 whitespace-pre-line text-xs leading-relaxed text-white/80">{m.role}</div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="mt-28">
          <h2 className="heading-depth text-center text-5xl font-bold text-accent-gold md:text-6xl">Источники</h2>
          <ul className="text-justify mx-auto mt-10 max-w-3xl space-y-3 text-white/90">
            {sourcesLines.length > 0 ? (
              sourcesLines.map((line, i) =>
                /^https?:\/\//i.test(line) ? (
                  <li key={i} className="text-sm md:text-base leading-relaxed break-all">
                    <a href={line} className="text-accent-gold underline hover:text-white" target="_blank" rel="noreferrer">
                      {line}
                    </a>
                  </li>
                ) : (
                  <li key={i} className="text-sm md:text-base leading-relaxed">
                    {line}
                  </li>
                )
              )
            ) : (
              <li className="text-sm text-white/50">Список источников будет дополнен.</li>
            )}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default AboutPage;
