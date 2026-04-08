import React, { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { fetchJson, Myth } from "../lib/api";

const categories: { key: "politics" | "tech" | "personality"; label: string }[] = [
  { key: "personality", label: "личность" },
  { key: "politics", label: "политика" },
  { key: "tech", label: "техника" },
];

function shuffleInPlace<T>(arr: T[]): T[] {
  for (let i = arr.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const MythsPage: React.FC = () => {
  const [myths, setMyths] = useState<Myth[]>([]);
  const [category, setCategory] = useState<"politics" | "tech" | "personality" | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answer, setAnswer] = useState<boolean | null>(null);

  useEffect(() => {
    const load = async () => {
      const data = await fetchJson<Myth[]>(`/myths${category ? `?category=${category}` : ""}`);
      setMyths(shuffleInPlace(data.slice()));
      setCurrentIndex(0);
      setAnswer(null);
    };
    load();
  }, [category]);

  const filtered = myths;
  const currentMyth = filtered[currentIndex];

  const stats = useMemo(() => {
    if (!currentMyth) return null;
    const total = currentMyth.votes_for_true + currentMyth.votes_for_false || 1;
    return {
      truthPercent: Math.round((currentMyth.votes_for_true / total) * 100),
      mythPercent: Math.round((currentMyth.votes_for_false / total) * 100),
    };
  }, [currentMyth]);

  const handleVote = async (voteAsTruth: boolean) => {
    if (!currentMyth) return;
    setAnswer(voteAsTruth);
    await fetchJson<Myth>(`/myths/${currentMyth.id}/vote`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ vote: voteAsTruth }),
    }).catch(() => {});
  };

  return (
    <div className="min-h-screen bg-korolev-bg text-white">
      <header className="flex items-center justify-between px-6 py-8 md:px-12">
        <Link to="/" className="text-sm text-white/80 hover:text-white">
          ← На главную
        </Link>
      </header>

      <main className="mx-auto max-w-3xl px-6 pb-24 md:px-10">
        <h1 className="myths-title-depth select-none text-7xl font-black uppercase leading-none text-purple-200/70 md:text-9xl">
          Мифы
        </h1>

        <div className="mt-6 space-y-4 text-sm leading-relaxed text-white/90 md:text-base">
          <p>
            Ниже — два списка утверждений: «Правда» и «Миф». Проверьте себя: что соответствует биографии и
            фактам, а что — распространённым заблуждениям.
          </p>
          <p>Фильтр по темам опционален; можно пройти все утверждения подряд.</p>
        </div>

        <div className="mt-10 rounded-3xl border-2 border-purple-800/80 bg-[#12081f]/60 p-6 md:p-8">
          <p className="text-center text-sm font-medium text-white/90">О каких мифах вы хотите узнать?</p>
          <div className="mt-6 flex flex-col gap-4">
            <button
              type="button"
              onClick={() => setCategory(null)}
              className={`flex items-center gap-3 text-left text-sm uppercase tracking-wide ${
                category === null ? "text-accent-gold" : "text-white/70"
              }`}
            >
              <span
                className={`inline-flex h-5 w-5 shrink-0 rounded border-2 ${
                  category === null ? "border-accent-gold bg-accent-gold/20" : "border-white/40"
                }`}
              />
              все
            </button>
            {categories.map((c) => (
              <button
                key={c.key}
                type="button"
                onClick={() => setCategory(c.key)}
                className={`flex items-center gap-3 text-left text-sm uppercase tracking-wide ${
                  category === c.key ? "text-accent-gold" : "text-white/70"
                }`}
              >
                <span
                  className={`inline-flex h-5 w-5 shrink-0 rounded border-2 ${
                    category === c.key ? "border-accent-gold bg-accent-gold/20" : "border-white/40"
                  }`}
                />
                {c.label}
              </button>
            ))}
          </div>
        </div>

        {currentMyth && (
          <div className="mt-12 space-y-6">
            <div className="flex gap-3">
              <span className="mt-1.5 inline-block h-3 w-3 shrink-0 rounded-full bg-accent-gold" />
              <p className="text-sm leading-relaxed text-white md:text-base">{currentMyth.title}</p>
            </div>
            {currentMyth.description?.trim() &&
            !currentMyth.description.includes("Утверждение из списка") ? (
              <p className="text-xs text-white/60 md:text-sm">{currentMyth.description}</p>
            ) : null}

            <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:flex-wrap sm:gap-4">
              <button
                type="button"
                onClick={() => handleVote(true)}
                className="w-full touch-manipulation rounded-full border-2 border-accent-gold px-8 py-3 text-xs font-bold uppercase tracking-widest text-accent-gold hover:bg-accent-gold/10 sm:w-auto sm:py-2"
              >
                Правда
              </button>
              <button
                type="button"
                onClick={() => handleVote(false)}
                className="w-full touch-manipulation rounded-full border-2 border-accent-gold px-8 py-3 text-xs font-bold uppercase tracking-widest text-accent-gold hover:bg-accent-gold/10 sm:w-auto sm:py-2"
              >
                Миф
              </button>
            </div>

            {answer !== null && stats && (
              <div className="rounded-2xl border border-white/10 bg-black/30 p-4 text-xs text-white/85 space-y-2">
                <p className="font-semibold text-accent-peach">
                  {currentMyth.is_true ? "Это правда." : "Это миф."}
                </p>
                <p className="whitespace-pre-line leading-relaxed">{currentMyth.truth}</p>
                <p className="pt-2 text-white/60">
                  Статистика: правда — {stats.truthPercent}% • миф — {stats.mythPercent}%
                </p>
              </div>
            )}

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => {
                  setCurrentIndex((i) => (filtered.length ? (i + 1) % filtered.length : 0));
                  setAnswer(null);
                }}
                className="text-sm text-accent-gold hover:text-white"
              >
                Следующий →
              </button>
            </div>
          </div>
        )}

        {!currentMyth && (
          <p className="mt-10 text-center text-sm text-white/50">В этой категории пока нет мифов.</p>
        )}
      </main>
    </div>
  );
};

export default MythsPage;
