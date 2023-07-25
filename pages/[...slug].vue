<template>
  <main class="min-h-screen container">
    <article class="my-36 mx-auto prose prose-invert">
      <ContentDoc
        v-slot="{ doc }"
        class="prose prose-invert"
      >
        <div v-if="doc.hero">
          <img
            class="w-full h-72 object-cover mb-12 rounded-lg"
            :src="doc.hero"
          >
        </div>
        <h1 class="text-3xl mb-0">
          {{ doc.title }}
        </h1>
        <div class="mt-4 text-lg">
          Published: <time :datetime="doc.published">{{ dayjs(doc.published).format("MMMM D, YYYY") }}</time>
        </div>
        <div class="mt-4 text-base">
          <ContentRenderer :value="doc" />
        </div>
      </ContentDoc>
    </article>
  </main>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
</script>

<style lang="scss" scoped>
.article-content > * {
  font-size: 1.1rem;
}
</style>

<style lang="scss">
.article-content pre,
.article-content aside {
  @apply bg-blue-900 border-blue-800 border-2 h-full p-4 my-8 rounded-lg;
}

.article-content h2 {
  margin-top: 4rem;
}
</style>