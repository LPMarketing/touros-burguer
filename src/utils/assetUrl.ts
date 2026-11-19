declare global {
  interface Window {
    __APP_BASE__?: string;
  }
}

const SUBPATH_PREFIX_REGEX = /^(\/tourosburguer)(?:\/|$)/i;

/**
 * Resolves the active mount base path at runtime:
 * - "/tourosburguer/" when opened at /tourosburguer or /tourosburguer/...
 * - "/" when opened at the root domain (e.g. touros-burguer.vercel.app)
 */
export function getAppBasePath(): string {
  if (typeof window === 'undefined') return '/';
  if (typeof window.__APP_BASE__ === 'string' && window.__APP_BASE__.length > 0) {
    return window.__APP_BASE__;
  }
  const pathname = window.location.pathname || '/';
  const match = pathname.match(SUBPATH_PREFIX_REGEX);
  return match ? `${match[1]}/` : '/';
}

/**
 * Resolves a local public asset path relative to the active mount base path
 * while leaving external URLs (https:, data:, blob:, etc.) untouched.
 */
export function resolveAssetUrl(assetPath: string): string {
  if (!assetPath) return '';
  if (/^(?:https?:|data:|blob:|mailto:|tel:|\/\/)/i.test(assetPath)) {
    return assetPath;
  }
  const cleanPath = assetPath.replace(/^\.?\//, '');
  return `${getAppBasePath()}${cleanPath}`;
}
