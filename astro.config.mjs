import { defineConfig } from 'astro/config';
import tailwind from "@astrojs/tailwind";
import { remarkFrontmatter } from "./src/plugins/remark-frontmatter.mjs";

// https://astro.build/config
export default defineConfig({
  markdown: {
    // Applied to .md and .mdx files
    remarkPlugins: [remarkFrontmatter],
  },
  integrations: [
    tailwind({
      applyBaseStyles: false,
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