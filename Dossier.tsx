import { useEffect, useRef } from "react";
import raw from "./dossier.html?raw";

/**
 * The original QuantumNav Research page, preserved unchanged in content and rendered inside a
 * shadow root so its styles cannot collide with the dashboard. Dark tokens are forced to match.
 */
const DARK = `:host{all:initial;display:block;--paper:#0A0E14;--panel:#111823;--ink:#E3E8EE;--muted:#97A3B2;--line:#243041;--rb:#EE5E64;--pulsar:#5BBFDF;--warn-bg:#2A2110;--warn-ink:#F0D08F;--warn-line:#5E4A1F;--plate:#060A10;--plate-line:#223042;color-scheme:dark}
.dossier-body{background:var(--paper);color:var(--ink);font-family:var(--body);font-size:17px;line-height:1.62;border-radius:6px;overflow:hidden}
.top{display:none}`;

export default function Dossier() {
  const host = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = host.current;
    if (!el || el.shadowRoot) return;
    const style = raw.match(/<style>([\s\S]*?)<\/style>/)?.[1] ?? "";
    const fonts = raw.match(/<link rel="stylesheet"[^>]*>/)?.[0] ?? "";
    const start = raw.indexOf("</style>") + "</style>".length;
    const end = raw.indexOf("<script>");
    const body = raw.slice(start, end > 0 ? end : undefined);
    const css = style
      .replace(/:root/g, ":host")
      .replace(/\bbody::before\{[^}]*\}/g, "")
      .replace(/\bbody\{/g, ".dossier-body{");
    const root = el.attachShadow({ mode: "open" });
    root.innerHTML = `${fonts}<style>${css}\n${DARK}</style><div class="dossier-body">${body}</div>`;
    // regenerate the seeded starfields the original page drew with its own script
    const NS = "http://www.w3.org/2000/svg";
    const rng = (s: number) => () => { s = (s * 16807) % 2147483647; return (s - 1) / 2147483646; };
    root.querySelectorAll<SVGGElement>("g[data-stars]").forEach((g) => {
      const d = g.dataset, r = rng(Number(d.seed) || 1);
      const n = Number(d.stars), x0 = Number(d.x || 0), y0 = Number(d.y || 0), w = Number(d.w), h = Number(d.h);
      for (let i = 0; i < n; i++) {
        const c = document.createElementNS(NS, "circle");
        c.setAttribute("cx", (x0 + r() * w).toFixed(1));
        c.setAttribute("cy", (y0 + r() * h).toFixed(1));
        const big = r();
        c.setAttribute("r", (big > 0.94 ? 1.6 : big > 0.75 ? 1 : 0.6).toFixed(1));
        c.setAttribute("class", "star");
        c.setAttribute("opacity", (0.25 + r() * 0.6).toFixed(2));
        g.appendChild(c);
      }
    });
    // in-page anchors scroll within the dossier
    root.querySelectorAll<HTMLAnchorElement>('a[href^="#"]').forEach((a) => {
      a.addEventListener("click", (ev) => {
        const t = root.getElementById(a.getAttribute("href")!.slice(1));
        if (t) { ev.preventDefault(); t.scrollIntoView({ behavior: "smooth", block: "start" }); }
      });
    });
  }, []);
  return <div ref={host} />;
}
