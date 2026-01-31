// astro.config.mjs
import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import tailwindcss from '@tailwindcss/vite';
import { visualizer } from 'rollup-plugin-visualizer';

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
    plugins: [
      tailwindcss(),
      visualizer({
        filename: './stats.html',
        open: false,
        gzipSize: true,
        brotliSize: true,
      }),
    ],
  },

  // Dev server configuration
  server: {
    port: 4321,
    host: true,
  },
});
