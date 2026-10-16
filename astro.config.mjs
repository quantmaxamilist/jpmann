// @ts-check
import { defineConfig } from 'astro/config';
import sitemap from '@astrojs/sitemap';
import { oldUrls } from './src/data/redirects.mjs';

// The live Wix site serves https://www.jpmann.com with no trailing slashes.
const SITE = 'https://www.jpmann.com';

export default defineConfig({
  site: SITE,
  trailingSlash: 'ignore',
  // Vercel serves about.html at /about via cleanUrls (vercel.json).
  build: { format: 'file' },
  server: { port: 4344 },
  devToolbar: { enabled: false },
  prefetch: { prefetchAll: true, defaultStrategy: 'hover' },
  scopedStyleStrategy: 'class',
  redirects: oldUrls,
  // Pre-bundle deps that are only reached via dynamic import, so the dev server never re-optimises
  // mid-visit (that served a stale bundle and left the first page load broken).
  vite: { optimizeDeps: { include: ['three', 'gsap', 'lenis'] } },
  integrations: [sitemap({ filter: (page) => !page.includes('/404') })],
});
