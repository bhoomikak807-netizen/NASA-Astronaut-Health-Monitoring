/// <reference types="vite/client" />
interface ImportMetaEnv {
  readonly VITE_BACKEND_URL?: string;
  readonly VITE_TILE_URL?: string;
  readonly VITE_TILE_ATTRIBUTION?: string;
}
declare module "world-atlas/land-110m.json" {
  const value: unknown;
  export default value;
}
