import React, { useEffect, useRef, useState } from 'react';
import { ExternalLink, Loader2, Maximize2 } from 'lucide-react';
import { alarm } from '../../services/alarm';

interface EmbeddedModuleProps {
  /** Same-origin path of the bundled module (served from /public). */
  src: string;
  title: string;
  /**
   * 'auto' grows the frame to the module's content height so the page scrolls as one document.
   * A CSS height (e.g. 'calc(100vh - 160px)') gives the module its own scroll area, for full apps.
   */
  height?: 'auto' | string;
  minHeight?: number;
  className?: string;
  showToolbar?: boolean;
  label?: string;
  /** Receives the frame's window once it has loaded, so the host page can drive the module. */
  onReady?: (win: Window) => void;
  /** Load immediately instead of waiting until the frame scrolls near the viewport. */
  eager?: boolean;
}

/**
 * Hosts a standalone ASTRA module (QuantumNav, Health Monitor) inside the main site.
 * The modules detect the frame and switch to a transparent background, so the global
 * space backdrop shows through and the pages read as one site.
 */
export const EmbeddedModule: React.FC<EmbeddedModuleProps> = ({
  src,
  title,
  height = 'auto',
  minHeight = 600,
  className = '',
  showToolbar = true,
  label,
  onReady,
  eager = false,
}) => {
  const frameRef = useRef<HTMLIFrameElement>(null);
  const boxRef = useRef<HTMLDivElement>(null);
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(eager);

  // Modules below the fold are only fetched and started when the visitor scrolls toward them,
  // so they never compete with the page's first paint.
  useEffect(() => {
    if (inView) return;
    const el = boxRef.current;
    if (!el || typeof IntersectionObserver === 'undefined') {
      setInView(true);
      return;
    }
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setInView(true);
          io.disconnect();
        }
      },
      { rootMargin: '600px 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [inView]);
  const [autoHeight, setAutoHeight] = useState(minHeight);

  useEffect(() => {
    if (height !== 'auto' || !loaded) return;
    const frame = frameRef.current;
    const doc = frame?.contentDocument;
    if (!doc) return;
    const measure = () => {
      const h = Math.max(doc.body?.scrollHeight ?? 0, doc.documentElement.scrollHeight);
      if (h > 0) setAutoHeight(Math.max(minHeight, h));
    };
    measure();
    const ro = new ResizeObserver(measure);
    if (doc.body) ro.observe(doc.body);
    const t = window.setInterval(measure, 1500);
    return () => {
      ro.disconnect();
      window.clearInterval(t);
    };
  }, [height, loaded, minHeight]);

  const handleLoad = () => {
    setLoaded(true);
    const win = frameRef.current?.contentWindow;
    // Clicks inside the module count as the user gesture that allows alarm audio.
    try {
      win?.addEventListener('pointerdown', () => alarm.unlock(), { passive: true });
    } catch {
      /* cross-origin frame */
    }
    if (win && onReady) onReady(win);
  };

  return (
    <div className={`relative ${className}`}>
      {showToolbar && (
        <div className="flex items-center justify-between gap-3 mb-2 px-1">
          <span className="text-[10px] font-mono tracking-widest text-[#7DD3FC] uppercase flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#10B981] animate-pulse" />
            {label ?? title}
          </span>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => frameRef.current?.requestFullscreen?.()}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono text-[#94A3B8] border border-white/10 hover:text-white hover:border-[#58C7FF]/50 transition-colors"
            >
              <Maximize2 className="w-3 h-3" /> Fullscreen
            </button>
            <a
              href={src}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md text-[10px] font-mono text-[#58C7FF] border border-[#58C7FF]/30 hover:bg-[#58C7FF]/10 transition-colors"
            >
              <ExternalLink className="w-3 h-3" /> Open in new tab
            </a>
          </div>
        </div>
      )}
      <div ref={boxRef} className="relative rounded-2xl overflow-hidden glass-frame" style={inView ? undefined : { height: height === 'auto' ? minHeight : height, minHeight }}>
        {!loaded && (
          <div className="absolute inset-0 flex items-center justify-center gap-2 text-xs font-mono text-[#94A3B8]">
            <Loader2 className="w-4 h-4 animate-spin text-[#58C7FF]" /> Loading {title}…
          </div>
        )}
        {inView && (
        <iframe
          ref={frameRef}
          src={src}
          title={title}
          onLoad={handleLoad}
          allow="geolocation; fullscreen; microphone"
          allowFullScreen
          className="block w-full bg-transparent"
          style={{
            height: height === 'auto' ? autoHeight : height,
            minHeight,
            colorScheme: 'dark',
            opacity: loaded ? 1 : 0,
            transition: 'opacity .4s ease',
          }}
        />
        )}
      </div>
    </div>
  );
};

export default EmbeddedModule;
