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

        <div className="relative z-10 px-5 md:px-10 py-20 md:py-32">
          <div className="max-w-full mx-auto w-full">
            <div className="flex flex-col md:flex-row gap-6 md:gap-0">
              <div className="relative z-20 md:w-1/2 md:ml-16 lg:ml-24 md:mt-12 lg:mt-16">
                <h1 className="heading-depth text-center md:text-left text-5xl md:text-6xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                  Сергей Павлович Королёв
                </h1>
                <p className="mt-6 text-center md:text-left text-xl md:text-2xl text-white/90 lowercase drop-shadow-md">
                  основоположник практической космонавтики
                </p>
              </div>
              <div className="relative md:w-1/2 flex justify-end -mt-6 md:-mt-0 md:-ml-8 lg:-ml-12">
                <img
                  src="/media/main/korolev-face-outline.png"
                  alt="Сергей Павлович Королёв"
                  className="w-[110%] md:w-[120%] object-contain opacity-90"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Цитата */}
        <div className="relative z-10 mt-16 pb-16 md:pb-20">
          {quoteText ? (
            <div className="relative mx-auto max-w-4xl px-4 md:px-8">
              {/* Декоративные полумесяцы */}
              <div className="pointer-events-none absolute inset-0 -z-10 overflow-visible">
                <div className="absolute left-0 top-1/2 -translate-x-16 -translate-y-1/2">
                  <svg
                    aria-hidden
                    width="200"
                    height="140"
                    viewBox="0 0 200 140"
                    className="md:w-[260px] md:h-[180px]"
                  >
                    <defs>
                      <linearGradient id="crescentLeft" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                        <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
                        <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M160 20 C120 35, 80 65, 80 100 C80 135, 120 165, 160 180"
                      stroke="url(#crescentLeft)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
                <div className="absolute right-0 top-1/2 translate-x-16 -translate-y-1/2">
                  <svg
                    aria-hidden
                    width="200"
                    height="140"
                    viewBox="0 0 200 140"
                    className="md:w-[260px] md:h-[180px]"
                  >
                    <defs>
                      <linearGradient id="crescentRight" x1="0" y1="0" x2="1" y2="0">
                        <stop offset="0%" stopColor="#F59E0B" stopOpacity="0" />
                        <stop offset="30%" stopColor="#F59E0B" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#F59E0B" stopOpacity="1" />
                        <stop offset="70%" stopColor="#F59E0B" stopOpacity="0.8" />
                        <stop offset="100%" stopColor="#F59E0B" stopOpacity="0" />
                      </linearGradient>
                    </defs>
                    <path
                      d="M40 20 C80 35, 120 65, 120 100 C120 135, 80 165, 40 180"
                      stroke="url(#crescentRight)"
                      strokeWidth="10"
                      strokeLinecap="round"
                      fill="none"
                    />
                  </svg>
                </div>
              </div>
              <p className="text-center text-base md:text-lg text-white leading-relaxed drop-shadow-[0_2px_12px_rgba(0,0,0,0.85)] px-8 py-4 md:px-16 md:py-6">
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

      {/* Слайд 3 - Максимально широкое расстояние между кнопками */}
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
        
        {/* Максимальное расширение - кнопки будут по краям экрана */}
        <div className="w-full px-2 md:px-4">
          <div className="flex justify-between items-center w-full">
            <div className="flex-1 flex justify-start">
              {/* Левые кнопки будут здесь через RocketNav */}
            </div>
            <div className="flex-1 flex justify-end">
              {/* Правые кнопки будут здесь через RocketNav */}
            </div>
          </div>
          {/* Сам RocketNav с кастомными классами для максимального расстояния */}
          <div className="-mx-4 md:-mx-8 lg:-mx-16">
            <RocketNav sections={sections} />
          </div>
        </div>
      </section>
    </div>
  );
};

export default App;