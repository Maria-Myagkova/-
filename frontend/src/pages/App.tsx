import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Timeline from "../components/Timeline";
import EventModal from "../components/EventModal";
import { fetchJson, Quote, SectionListItem, TimelineEvent } from "../lib/api";
import RocketNav from "../components/RocketNav";
import { burstStarSparklesAlongElement } from "../lib/sparkles";

const HEADER_NAV_DELAY_MS = 480;

const App: React.FC = () => {
  const navigate = useNavigate();
  const [events, setEvents] = useState<TimelineEvent[]>([]);
  const [sections, setSections] = useState<SectionListItem[]>([]);
  const [selectedEvent, setSelectedEvent] = useState<TimelineEvent | null>(null);
  const [quoteText, setQuoteText] = useState<string | null>(null);

  useEffect(() => {
    const load = async () => {
      const [eventsData, sectionsData, quote] = await Promise.all([
        fetchJson<TimelineEvent[]>("/timeline"),
        fetchJson<SectionListItem[]>("/sections"),
        fetchJson<Quote>("/quote").catch(() => null),
      ]);
      setEvents(eventsData);
      setSections(sectionsData);
      if (quote?.text) setQuoteText(quote.text);
    };
    load();
  }, []);

  const pillClass =
    "inline-flex items-center justify-center rounded-full border-2 border-accent-copper px-5 py-2.5 text-xs md:text-sm font-semibold uppercase tracking-[0.2em] text-white bg-gradient-to-b from-[#2a1448]/90 to-[#12081f] hover:from-[#3b1d5c] hover:to-[#1a0b2e] transition-colors shadow-md";

  return (
    <div className="min-h-screen bg-korolev-bg text-white">
      {/* Слайд 1 */}
      <section className="relative bg-korolev-bg overflow-hidden">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_80%_20%,rgba(91,33,182,0.15),transparent_50%)]" />

        <header className="relative z-20 flex items-center justify-between px-5 pt-6 md:px-10 md:pt-8">
          <a
            href="/about"
            className={pillClass}
            onClick={(e) => {
              if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              burstStarSparklesAlongElement(e.currentTarget);
              window.setTimeout(() => navigate("/about"), HEADER_NAV_DELAY_MS);
            }}
          >
            О проекте
          </a>
          <a
            href="/myths"
            className={pillClass}
            onClick={(e) => {
              if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
              e.preventDefault();
              burstStarSparklesAlongElement(e.currentTarget);
              window.setTimeout(() => navigate("/myths"), HEADER_NAV_DELAY_MS);
            }}
          >
            Мифы
          </a>
        </header>

        <div className="relative z-10 px-5 md:px-10 py-32 md:py-48">
          <div className="max-w-full mx-auto w-full">
            <div className="flex flex-col md:flex-row gap-8 md:gap-0">
              <div className="relative z-20 md:w-1/2 md:ml-16 lg:ml-24 md:mt-12 lg:mt-16">
                <h1 className="heading-depth text-center md:text-left text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                  Сергей Павлович Королёв
                </h1>
                <p className="mt-8 text-center md:text-left text-xl md:text-2xl text-white/90 lowercase drop-shadow-md">
                  основоположник практической космонавтики
                </p>
              </div>
              <div className="relative md:w-1/2 flex justify-end -mt-8 md:-mt-0 md:-ml-8 lg:-ml-12">
                <img
                  src="/media/main/korolev-face-outline.png"
                  alt="Сергей Павлович Королёв"
                  className="w-[110%] md:w-[120%] object-contain opacity-90"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="relative z-10 mt-32 pb-10 md:pb-12">
          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-between items-end gap-2 md:gap-4 h-28 md:h-32 opacity-95">
            <svg
              className="w-[32%] md:w-[30%] max-w-sm shrink text-accent-gold drop-shadow-[4px_4px_10px_rgba(0,0,0,0.45)]"
              viewBox="0 0 220 100"
              fill="currentColor"
              aria-hidden
            >
              <path
                d="M0 100 Q15 72 28 78 T55 62 T82 70 T110 52 T138 68 T165 48 T192 58 T220 45 L220 100 Z"
                opacity="0.88"
              />
            </svg>
            <svg
              className="w-[32%] md:w-[30%] max-w-sm shrink text-accent-gold drop-shadow-[-4px_4px_10px_rgba(0,0,0,0.45)]"
              viewBox="0 0 220 100"
              fill="currentColor"
              aria-hidden
            >
              <path
                d="M220 100 Q205 72 192 78 T165 62 T138 70 T110 52 T82 68 T55 48 T28 58 T0 45 L0 100 Z"
                opacity="0.88"
              />
            </svg>
          </div>
          {quoteText ? (
            <div className="relative z-20 mx-auto max-w-4xl px-4 md:px-8">
              {/* ИЗМЕНЕНО: text-base md:text-lg вместо text-sm md:text-base */}
              <p className="text-center text-base md:text-lg text-white leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] px-2">
                «{quoteText}»
              </p>
            </div>
          ) : (
            <p className="relative z-20 text-center text-white/40 text-sm">Загрузка цитаты…</p>
          )}
        </div>
      </section>

      {/* Слайд 2 */}
      <section className="min-h-screen flex flex-col justify-center bg-korolev-bg px-4 py-16 md:py-24">
        <h2 className="heading-depth text-center text-2xl md:text-3xl font-bold text-accent-gold mb-10 md:mb-14 px-2">
          <span className="relative inline-block px-2 py-2 isolate">
            <svg
              aria-hidden
              className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[4.1em] w-[min(75rem,96vw)] -translate-x-1/2 -translate-y-1/2 opacity-95"
              viewBox="0 0 1200 220"
              fill="none"
            >
              <path
                d="M60 120 C160 40, 280 190, 380 110 C480 30, 620 200, 740 120 C860 40, 980 180, 1140 95"
                stroke="rgba(144,118,196,0.78)"
                strokeWidth="153"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
            <span className="relative z-10">Важные даты космонавтики</span>
          </span>
        </h2>
        <Timeline events={events} onSelect={setSelectedEvent} />
        <EventModal
          isOpen={!!selectedEvent}
          title={selectedEvent ? `${selectedEvent.year} — ${selectedEvent.title}` : ""}
          onClose={() => setSelectedEvent(null)}
        >
          {selectedEvent?.description ?? selectedEvent?.short_description ?? ""}
        </EventModal>
      </section>

      {/* Слайд 3 */}
      <section className="min-h-screen px-4 pb-20 pt-12 md:pt-20 flex flex-col justify-center bg-gradient-to-b from-korolev-bg via-korolev-panel/40 to-black">
        <div className="mb-10 text-center">
          <h2 className="heading-depth text-3xl md:text-4xl font-bold text-accent-gold">
            <span className="relative inline-block px-2 py-2 isolate">
              <svg
                aria-hidden
                className="pointer-events-none absolute left-1/2 top-1/2 z-0 h-[4.1em] w-[min(75rem,96vw)] -translate-x-1/2 -translate-y-1/2 opacity-95"
                viewBox="0 0 1200 220"
                fill="none"
              >
                <path
                  d="M60 120 C160 40, 280 190, 380 110 C480 30, 620 200, 740 120 C860 40, 980 180, 1140 95"
                  stroke="rgba(112,86,162,0.86)"
                  strokeWidth="153"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
              <span className="relative z-10">Разделы</span>
            </span>
          </h2>
        </div>
        <RocketNav sections={sections} />
      </section>
    </div>
  );
};

export default App;