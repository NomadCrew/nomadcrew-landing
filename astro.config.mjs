// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';

// https://astro.build/config
export default defineConfig({
  site: 'https://nomadcrew.uk',

  // Static site generation (not SSR)
  output: 'static',

  // React integration for islands
  integrations: [
    react({
      include: ['**/react/*', '**/*.tsx'],
    }),
  ],

  // Vite configuration - Tailwind plugin added in Plan 04
  vite: {
    plugins: [],
  },

  // Dev server configuration
  server: {
    port: 4321,
    host: true,
  },
});
