import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { fetchJson } from "../lib/api";

type MediaFile = {
  id: number;
  file_path: string;
  caption?: string;
  is_image: boolean;
  sort_order: number;
};

type Subsection = {
  id: number;
  anchor_name: string;
  title: string;
  content_html: string;
  sort_order: number;
  media_files: MediaFile[];
};

type SectionDetail = {
  id: number;
  slug: string;
  title: string;
  short_overview: string;
  short_description: string;
  image_url?: string | null;
  subsections: Subsection[];
};

const SectionPage: React.FC = () => {
  const { slug } = useParams();
  const [section, setSection] = useState<SectionDetail | null>(null);

  useEffect(() => {
    const load = async () => {
      if (!slug) return;
      const data = await fetchJson<SectionDetail>(`/sections/${slug}`);
      setSection(data);
    };
    load();
  }, [slug]);

  if (!section) {
    return (
      <div className="min-h-screen bg-space-dark text-white flex items-center justify-center">
        <p>Загрузка...</p>
      </div>
    );
  }

  const scrollToAnchor = (anchor: string) => {
    const el = document.getElementById(anchor);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const hideRisPrefixSlugs = new Set([
    "repressii",
    "rabota-v-okb",
    "proekty",
    "pervyj-sputnik",
    "polet-gagarina",
    "nasledie",
  ]);

  const normalizeCaption = (caption?: string) => {
    if (!caption) return "";
    if (!hideRisPrefixSlugs.has(section.slug)) return caption;
    const noRis = caption.replace(/^\s*Рис\.\s*/i, "").trim();
    if (section.slug === "repressii") {
      return noRis.replace(/^\d+\s+/, "").trim();
    }
    return noRis;
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-space-dark to-black text-white">
      <header className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
        <Link to="/" className="text-sm text-accent-gold hover:text-white">
          ← На главную
        </Link>
        <Link to="/about" className="text-xs text-accent-silver hover:text-white">
          О проекте
        </Link>
      </header>

      <main className="section-rich max-w-5xl mx-auto px-4 pb-16 grid md:grid-cols-[3fr,1fr] gap-10">
        <section>
          <h1
            className="heading-depth text-2xl mb-3 font-semibold text-accent-gold"
          >
            {section.title}
          </h1>
          {section.slug !== "repressii" && section.short_overview ? (
            <p className="text-sm text-accent-silver/90 mb-8">{section.short_overview}</p>
          ) : null}

          {section.subsections
            .slice()
            .sort((a, b) => a.sort_order - b.sort_order)
            .map((sub) => {
              const mediaSorted = sub.media_files.slice().sort((a, b) => a.sort_order - b.sort_order);
              const imageFiles = mediaSorted.filter((m) => m.is_image);
              const singleImage = imageFiles.length === 1 ? imageFiles[0] : null;
              const fullWidthText = section.slug === "repressii";

              return (
                <article key={sub.id} id={sub.anchor_name} className="mb-10 scroll-mt-24">
                  {sub.title?.trim() ? (
                    <h2 className="heading-depth text-lg font-semibold mb-3 text-accent-gold">{sub.title}</h2>
                  ) : null}

                  {singleImage && !fullWidthText ? (
                    <div className="flex flex-col gap-4 md:flex-row md:items-start md:gap-8">
                      <div
                        className="prose prose-invert max-w-none min-w-0 flex-1 text-sm"
                        dangerouslySetInnerHTML={{ __html: sub.content_html }}
                      />
                      <figure className="mx-auto w-full shrink-0 md:mx-0 md:max-w-[min(420px,42%)] bg-slate-900/70 rounded-lg p-2">
                        <img
                          src={singleImage.file_path}
                          alt={singleImage.caption || ""}
                          className="w-full h-auto rounded"
                        />
                        {singleImage.caption ? (
                          <figcaption className="mt-2 text-xs text-accent-silver/80">{normalizeCaption(singleImage.caption)}</figcaption>
                        ) : null}
                      </figure>
                    </div>
                  ) : (
                    <>
                      <div
                        className="prose prose-invert max-w-none text-sm"
                        dangerouslySetInnerHTML={{ __html: sub.content_html }}
                      />
                      {mediaSorted.length > 0 && (
                        <div className="mt-4 grid gap-4 md:grid-cols-2">
                          {mediaSorted.map((m) =>
                            m.is_image ? (
                              <figure
                                key={m.id}
                                className={section.slug === "repressii" ? "self-start rounded-lg" : "self-start bg-slate-900/70 rounded-lg p-2"}
                              >
                                <img src={m.file_path} alt={m.caption || ""} className="w-full h-auto rounded" />
                                {m.caption && (
                                  <figcaption className="mt-2 text-xs text-accent-silver/80">{normalizeCaption(m.caption)}</figcaption>
                                )}
                              </figure>
                            ) : (
                              <a
                                key={m.id}
                                href={m.file_path}
                                target="_blank"
                                rel="noreferrer"
                                className="text-xs text-accent-gold underline hover:text-white"
                              >
                                {m.caption || "Скачать документ"}
                              </a>
                            )
                          )}
                        </div>
                      )}
                    </>
                  )}
                </article>
              );
            })}
        </section>

        <aside className="md:sticky md:top-20 h-max bg-slate-900/70 border border-accent-silver/40 rounded-xl p-3">
          <h3 className="heading-depth text-xs font-semibold mb-2 text-accent-gold">Навигация по разделу</h3>
          <nav className="space-y-2 text-xs">
            {section.subsections
              .slice()
              .sort((a, b) => a.sort_order - b.sort_order)
              .filter((sub) => sub.title?.trim().length > 0)
              .map((sub) => (
                <button
                  key={sub.id}
                  onClick={() => scrollToAnchor(sub.anchor_name)}
                  className="block w-full text-left text-accent-silver hover:text-accent-gold"
                >
                  {sub.title}
                </button>
              ))}
          </nav>
        </aside>
      </main>
    </div>
  );
};

export default SectionPage;

