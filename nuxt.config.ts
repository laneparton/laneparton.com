// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
    extends: ['nuxt-seo-kit'],
    modules: [
        '@nuxt/content',
        '@nuxtjs/eslint-module'
    ],
    content: {
        documentDriven: true,
    },
    runtimeConfig: {
        instagramToken: "IGQVJVUGZAsN2JFX3Bjams3NFVFNTBnMnhndEhfNFBZAbzRNTk5JMUVLMGZAYQlBFckJxM2ZATNVZAMX3FtWF9ub1V1N2NzWmFsMHV1Wkc0Nk1FSHMyZAkQxMWozTHNqVE04MW1kYXRUajFRNldyZAkFjcDhBbAZDZD",
        public: {
            siteUrl: 'https://laneparton.com',
            siteName: 'Lane Parton',
            siteDescription: 'Just my little home on the internet.',
            language: 'en', // prefer more explicit language codes like `en-AU` over `en`
        }
    },
    css: [
        // Load a Node.js module directly (here it's a Sass file).
        '@fortawesome/fontawesome-svg-core/styles.css',
        // CSS file in the project
        '@/assets/styles/main.scss',
    ],
    build: {
        transpile: [
            '@yeger/vue-masonry-wall'
        ],
    },
    nitro: {
        prerender: {
            crawlLinks: true
        }
    },
})
