// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    app: {
        pageTransition: { name: 'page', mode: 'out-in' }
    },
    extends: ['nuxt-seo-kit'],
    modules: [
        '@nuxt/image',
        '@nuxt/content',
        '@nuxtjs/eslint-module',
        '@nuxtjs/tailwindcss',
        'nuxt-og-image'
    ],
    content: {
        highlight: {
          // Theme used in all color schemes.
          theme: 'github-dark'
        }
    },
    site: {
        url: 'https://laneparton.com',
    },
    runtimeConfig: {
        instagramToken: process.env.INSTAGRAM_TOKEN,
        public: {
            siteUrl: 'https://laneparton.com',
            siteName: 'Lane Parton',
            siteDescription: 'Just my little home on the internet.',
            language: 'en', // prefer more explicit language codes like `en-AU` over `en`
        }
    },
    image: {
        format: ['webp']
    },
    css: [
        // Load a Node.js module directly (here it's a Sass file).
        '@fortawesome/fontawesome-svg-core/styles.css',
    ],
    build: {
        transpile: [
            '@fortawesome/vue-fontawesome',
            '@yeger/vue-masonry-wall'
        ],
    },
    nitro: {
        prerender: {
            crawlLinks: true
        }
    },
})
