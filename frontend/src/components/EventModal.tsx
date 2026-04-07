import React, { useEffect } from "react";

type Props = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onClose: () => void;
};

const EventModal: React.FC<Props> = ({ isOpen, title, subtitle, children, onClose }) => {
  useEffect(() => {
    if (!isOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        aria-label="Закрыть"
        onClick={onClose}
      />
      <div className="relative w-full max-w-2xl rounded-2xl border border-accent-silver/40 bg-slate-950/90 shadow-2xl">
        <div className="p-5 md:p-6">
          <div className="flex items-start justify-between gap-4">
            <div>
              <h3 className="heading-depth text-lg md:text-xl font-semibold text-accent-gold">{title}</h3>
              {subtitle && <p className="mt-1 text-xs md:text-sm text-accent-silver/80">{subtitle}</p>}
            </div>
            <button
              onClick={onClose}
              className="shrink-0 px-3 py-1 rounded-full text-xs border border-accent-silver/40 text-accent-silver hover:border-accent-gold hover:text-white"
            >
              Закрыть
            </button>
          </div>

          <div className="mt-4 max-h-[min(70vh,28rem)] overflow-y-auto pr-1 text-sm text-accent-silver/90 leading-relaxed whitespace-pre-line">
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventModal;

