// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwind from '@astrojs/tailwind';

// https://astro.build/config
export default defineConfig({
  site: 'https://nomadcrew.uk',

  // Static site generation (not SSR)
  output: 'static',

  // Integrations
  integrations: [
    react({
      include: ['**/react/*', '**/*.tsx'],
    }),
    tailwind({
      applyBaseStyles: false, // We import global.css manually
    }),
  ],

  // Dev server configuration
  server: {
    port: 4321,
    host: true,
  },
});
