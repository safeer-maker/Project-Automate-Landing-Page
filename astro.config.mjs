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
    optimizeDeps: {
      include: ['astro/assets/services/noop'],
    },
  },
});
