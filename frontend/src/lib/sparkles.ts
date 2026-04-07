const GLYPHS = ["✦", "✧", "⋆", "★", "✶"];

function appendBurstContainer(): HTMLDivElement {
  const container = document.createElement("div");
  container.setAttribute("aria-hidden", "true");
  container.style.cssText =
    "position:fixed;inset:0;pointer-events:none;z-index:10000;overflow:visible";
  document.body.appendChild(container);
  return container;
}

function spawnStar(
  container: HTMLElement,
  leftPx: number,
  topPx: number,
  tx: number,
  ty: number,
  glyphIndex: number
): void {
  const el = document.createElement("span");
  el.textContent = GLYPHS[glyphIndex % GLYPHS.length];
  el.style.cssText = [
    "position:absolute",
    `left:${leftPx}px`,
    `top:${topPx}px`,
    "transform:translate(-50%,-50%)",
    "color:#f5b042",
    "font-size:14px",
    "line-height:1",
    "text-shadow:0 0 8px rgba(245,176,66,0.9)",
    "animation:star-burst 0.55s ease-out forwards",
    `--star-tx:${tx}px`,
    `--star-ty:${ty}px`,
  ].join(";");
  container.appendChild(el);
}

/** Вспышка «звёздочек» из одной точки (клик). */
export function burstStarSparkles(clientX: number, clientY: number): void {
  const container = appendBurstContainer();
  const n = 10;
  for (let i = 0; i < n; i++) {
    const angle = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.4;
    const dist = 28 + Math.random() * 36;
    spawnStar(container, clientX, clientY, Math.cos(angle) * dist, Math.sin(angle) * dist, i);
  }
  window.setTimeout(() => container.remove(), 600);
}

/**
 * Звёзды по периметру элемента (эллипс по bounding box — подходит для pill-кнопок).
 * Частицы разлетаются наружу от границы.
 */
export function burstStarSparklesAlongElement(element: HTMLElement): void {
  const r = element.getBoundingClientRect();
  const container = appendBurstContainer();
  const n = 12;
  const cx = r.left + r.width / 2;
  const cy = r.top + r.height / 2;
  const rx = Math.max(r.width / 2 - 2, 2);
  const ry = Math.max(r.height / 2 - 2, 2);

  for (let i = 0; i < n; i++) {
    const t = (Math.PI * 2 * i) / n + (Math.random() - 0.5) * 0.3;
    const px = cx + rx * Math.cos(t);
    const py = cy + ry * Math.sin(t);
    const dist = 26 + Math.random() * 34;
    const spread = (Math.random() - 0.5) * 0.45;
    const tx = Math.cos(t + spread) * dist;
    const ty = Math.sin(t + spread) * dist;
    spawnStar(container, px, py, tx, ty, i);
  }
  window.setTimeout(() => container.remove(), 600);
}
