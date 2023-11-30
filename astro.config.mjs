import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import { generateMeta } from './src/integrations/GenerateMeta';

// https://astro.build/config
export default defineConfig({
  integrations: [
    tailwind({
      applyBaseStyles: false,
    }),
    generateMeta({ openAiApiKey: import.meta.env.VITE_OPENAI_API_KEY })
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