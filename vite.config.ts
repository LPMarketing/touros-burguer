import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import fs from 'fs';
import path from 'path';
import {defineConfig, type Plugin} from 'vite';

function getHtmlAttr(tag: string, attrName: string): string | null {
  const match = tag.match(new RegExp(`\\b${attrName}=["']([^"']+)["']`, 'i'));
  return match ? match[1] : null;
}

function isLocalRelativeOrRootAsset(url: string): boolean {
  return url.startsWith('./') || (url.startsWith('/') && !url.startsWith('//'));
}

function stripLeadingPrefix(url: string): string {
  return url.replace(/^\.?\//, '');
}

/**
 * Rewrites built CSS, JS, modulepreload, and favicon tags into a tiny synchronous
 * runtime loader in <head> that resolves paths against "/tourosburguer/" whenever
 * the app is opened under /tourosburguer (with or without trailing slash), and
 * against "/" on the root domain. This avoids 404s on /tourosburguer without
 * trailing slash and avoids <base href> issues with inline SVG url(#...) gradients.
 */
function runtimeSubpathAssetsPlugin(): Plugin {
  return {
    name: 'runtime-subpath-assets',
    apply: 'build',
    transformIndexHtml: {
      order: 'post',
      handler(html: string): string {
        const stylesheets: Array<{href: string; crossorigin: boolean}> = [];
        const modulePreloads: Array<{href: string; crossorigin: boolean}> = [];
        const scripts: Array<{src: string; crossorigin: boolean}> = [];
        let icon: {href: string; type: string} | null = null;

        let transformed = html.replace(/<script\b[^>]*><\/script>\s*/gi, (tag) => {
          const type = getHtmlAttr(tag, 'type');
          const src = getHtmlAttr(tag, 'src');
          if (type === 'module' && src && isLocalRelativeOrRootAsset(src)) {
            scripts.push({
              src: stripLeadingPrefix(src),
              crossorigin: /\bcrossorigin\b/i.test(tag),
            });
            return '';
          }
          return tag;
        });

        transformed = transformed.replace(/<link\b[^>]*\/?>\s*/gi, (tag) => {
          const rel = getHtmlAttr(tag, 'rel')?.toLowerCase();
          const href = getHtmlAttr(tag, 'href');
          if (!href || !isLocalRelativeOrRootAsset(href)) {
            return tag;
          }

          if (rel === 'stylesheet') {
            stylesheets.push({
              href: stripLeadingPrefix(href),
              crossorigin: /\bcrossorigin\b/i.test(tag),
            });
            return '';
          }

          if (rel === 'modulepreload') {
            modulePreloads.push({
              href: stripLeadingPrefix(href),
              crossorigin: /\bcrossorigin\b/i.test(tag),
            });
            return '';
          }

          if (rel === 'icon' || rel === 'shortcut icon') {
            icon = {
              href: stripLeadingPrefix(href),
              type: getHtmlAttr(tag, 'type') ?? 'image/svg+xml',
            };
            return '';
          }

          return tag;
        });

        const manifest = JSON.stringify({
          icon,
          stylesheets,
          modulePreloads,
          scripts,
        });

        const loaderScript = `    <script>
      (function () {
        var pathname = window.location.pathname || '/';
        var match = pathname.match(/^(\\/tourosburguer)(?:\\/|$)/i);
        var base = match ? match[1] + '/' : '/';
        window.__APP_BASE__ = base;
        var assets = ${manifest};
        var head = document.head;
        if (assets.icon) {
          var iconLink = document.createElement('link');
          iconLink.rel = 'icon';
          iconLink.type = assets.icon.type;
          iconLink.href = base + assets.icon.href;
          head.appendChild(iconLink);
        }
        for (var i = 0; i < assets.stylesheets.length; i++) {
          var cssLink = document.createElement('link');
          cssLink.rel = 'stylesheet';
          if (assets.stylesheets[i].crossorigin) cssLink.crossOrigin = '';
          cssLink.href = base + assets.stylesheets[i].href;
          head.appendChild(cssLink);
        }
        for (var j = 0; j < assets.modulePreloads.length; j++) {
          var preloadLink = document.createElement('link');
          preloadLink.rel = 'modulepreload';
          if (assets.modulePreloads[j].crossorigin) preloadLink.crossOrigin = '';
          preloadLink.href = base + assets.modulePreloads[j].href;
          head.appendChild(preloadLink);
        }
        for (var k = 0; k < assets.scripts.length; k++) {
          var scriptEl = document.createElement('script');
          scriptEl.type = 'module';
          if (assets.scripts[k].crossorigin) scriptEl.crossOrigin = '';
          scriptEl.src = base + assets.scripts[k].src;
          head.appendChild(scriptEl);
        }
      })();
    </script>`;

        return transformed.replace('</head>', `${loaderScript}\n  </head>`);
      },
    },
  };
}

export default defineConfig(({command}) => {
  return {
    base: command === 'build' ? './' : '/',
    plugins: [
      react(),
      tailwindcss(),
      runtimeSubpathAssetsPlugin(),
      // Copies src/assets into dist/ so root-relative URLs like
      // "/src/assets/images/..." (e.g. generate_image output) still resolve
      // in production builds. Do not remove.
      {
        name: 'copy-unbundled-src-assets',
        apply: 'build',
        closeBundle(error?: Error): void {
          if (error) {
            return;
          }
          const distDir = path.resolve(__dirname, 'dist');
          const srcAssets = path.resolve(__dirname, 'src/assets');
          const distAssets = path.resolve(distDir, 'src/assets');
          if (fs.existsSync(distDir) && fs.existsSync(srcAssets)) {
            fs.cpSync(srcAssets, distAssets, {recursive: true, force: true});
          }
        },
      },
    ],
    resolve: {
      alias: {
        '@': path.resolve(__dirname, '.'),
      },
    },
    server: {
      // HMR is disabled in AI Studio via DISABLE_HMR env var.
      // Do not modify—file watching is disabled to prevent flickering during agent edits.
      hmr: process.env.DISABLE_HMR !== 'true',
      // Disable file watching when DISABLE_HMR is true to save CPU during agent edits.
      watch: process.env.DISABLE_HMR === 'true' ? null : {},
    },
  };
});
