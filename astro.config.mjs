// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';

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

  // Vite configuration with Tailwind v4
  vite: {
    plugins: [tailwindcss()],
  },

  // Dev server configuration
  server: {
    port: 4321,
    host: true,
  },
});
