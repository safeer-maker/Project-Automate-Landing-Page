import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
  output: 'static',
  build: {
    // Inline the (small, Latin-only-fonts) CSS so the first paint doesn't wait on a separate
    // stylesheet request competing with the tracking scripts and the GHL form.
    inlineStylesheets: 'always',
  },
  vite: {
    build: {
      // Astro builds for esnext, so the CSS minifier would write breakpoints as `@media
      // (width<=809px)` and drop -webkit-backdrop-filter. iPhones before iOS 16.4 ignore that range
      // syntax (every phone layout rule) and only blur with the prefix, so target iOS 15.
      cssTarget: ['ios15', 'safari15', 'chrome100', 'edge100', 'firefox100'],
    },
    optimizeDeps: {
      include: ['astro/assets/services/noop'],
    },
  },
});
