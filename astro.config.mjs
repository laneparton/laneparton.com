import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import sitemap from '@astrojs/sitemap';
import partytown from '@astrojs/partytown';
import { generateMeta } from './src/integrations/GenerateMeta';
import icon from "astro-icon";
import alpine from "@astrojs/alpinejs";

// https://astro.build/config
export default defineConfig({
  site: 'https://laneparton.com',
  integrations: [
    alpine(),
    icon(),
    tailwind({
      applyBaseStyles: false
    }),
    sitemap(),
    partytown(),
    generateMeta({
      openAiApiKey: import.meta.env.VITE_OPENAI_API_KEY
    }),
  ],
  vite: {
    ssr: {
      external: ['@resvg/resvg-js']
    },
    optimizeDeps: {
      exclude: ["@resvg/resvg-js"]
    }
  }
});