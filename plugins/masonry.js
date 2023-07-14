import MasonryWall from '@yeger/vue-masonry-wall'

// eslint-disable-next-line no-undef
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(MasonryWall)
})