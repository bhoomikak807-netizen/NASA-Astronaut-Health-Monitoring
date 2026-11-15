import { lazy } from 'react';

/**
 * Route-level code splitting: the home page ships in the main bundle; every other page is its own
 * chunk, fetched on first visit or earlier via prefetchRoute (nav hover / idle time).
 */
const loaders = {
  '/about': () => import('./pages/About'),
  '/technology': () => import('./pages/Technology'),
  '/technology/quantumnav': () => import('./pages/QuantumNav'),
  '/technology/astrohealth': () => import('./pages/ModulePage'),
  '/technology/firehealth': () => import('./pages/ModulePage'),
  '/technology/radiation': () => import('./pages/ModulePage'),
  '/health-monitor': () => import('./pages/HealthMonitor'),
  '/legal': () => import('./pages/Legal'),
  '/platform': () => import('./pages/Platform'),
  '/mission-control': () => import('./pages/MissionControl'),
  '/research': () => import('./pages/Research'),
  '/contact': () => import('./pages/Contact'),
} as const;

/** Standalone module apps behind some routes; warmed into the HTTP cache on prefetch. */
const MODULE_FILES: Record<string, string> = {
  '/technology/quantumnav': '/quantumnav/index.html',
  '/technology/astrohealth': '/astrohealth-ai/index.html',
  '/technology/firehealth': '/aegis-fds/index.html',
  '/technology/radiation': '/radiation-monitor/index.html',
  '/health-monitor': '/astrohealth-ai/index.html',
};

const warmed = new Set<string>();
export function prefetchRoute(path: string) {
  const clean = path.split(/[?#]/)[0];
  if (warmed.has(clean)) return;
  warmed.add(clean);
  const load = loaders[clean as keyof typeof loaders];
  if (load) void load().catch(() => warmed.delete(clean));
  const file = MODULE_FILES[clean];
  if (file) {
    const link = document.createElement('link');
    link.rel = 'prefetch';
    link.href = file;
    document.head.appendChild(link);
  }
}

/** After the first paint settles, quietly fetch the most visited pages. */
export function prefetchCommonRoutes() {
  const run = () => ['/technology', '/mission-control', '/platform', '/about'].forEach(prefetchRoute);
  const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
  if (w.requestIdleCallback) w.requestIdleCallback(run, { timeout: 4000 });
  else window.setTimeout(run, 2500);
}

export const About = lazy(() => loaders['/about']().then((m) => ({ default: m.About })));
export const Technology = lazy(() => loaders['/technology']().then((m) => ({ default: m.Technology })));
export const QuantumNav = lazy(() => loaders['/technology/quantumnav']().then((m) => ({ default: m.QuantumNav })));
export const AstroHealthPage = lazy(() => loaders['/technology/astrohealth']().then((m) => ({ default: m.AstroHealthPage })));
export const FireHealthPage = lazy(() => loaders['/technology/firehealth']().then((m) => ({ default: m.FireHealthPage })));
export const RadiationPage = lazy(() => loaders['/technology/radiation']().then((m) => ({ default: m.RadiationPage })));
export const HealthMonitor = lazy(() => loaders['/health-monitor']().then((m) => ({ default: m.HealthMonitor })));
export const Legal = lazy(() => loaders['/legal']().then((m) => ({ default: m.Legal })));
export const Platform = lazy(() => loaders['/platform']().then((m) => ({ default: m.Platform })));
export const MissionControl = lazy(() => loaders['/mission-control']().then((m) => ({ default: m.MissionControl })));
export const Research = lazy(() => loaders['/research']().then((m) => ({ default: m.Research })));
export const Contact = lazy(() => loaders['/contact']().then((m) => ({ default: m.Contact })));
