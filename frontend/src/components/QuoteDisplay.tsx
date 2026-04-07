import React, { useEffect, useState } from "react";
import { fetchJson, Quote } from "../lib/api";

const QuoteDisplay: React.FC = () => {
  const [quote, setQuote] = useState<Quote | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetchJson<Quote>("/quote")
      .then((q) => {
        if (!cancelled) setQuote(q);
      })
      .catch((e: unknown) => {
        if (!cancelled) setError(e instanceof Error ? e.message : "Ошибка загрузки цитаты");
      });
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return <p className="mt-4 max-w-2xl text-xs md:text-sm text-accent-silver/60 mx-auto italic">{error}</p>;
  }

  if (!quote) return null;

  return (
    <p className="mt-4 max-w-2xl text-xs md:text-sm text-accent-silver/80 mx-auto italic">
      «{quote.text}»
    </p>
  );
};

export default QuoteDisplay;

