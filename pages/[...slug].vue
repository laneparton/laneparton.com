<template>
  <main class="page">
    <article class="container">
      <ContentDoc v-slot="{ doc }">
        <div v-if="doc.hero">
          <img class="hero-image rounded-3" :src="doc.hero">
        </div>
        <h1 class="mb-0">{{ doc.title }}</h1>
        <div class="byline">
          Published: <time :datetime="doc.published">{{ dayjs(doc.published).format("MMMM D, YYYY") }}</time>
        </div>
        <div class="article-content">
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
.hero-image {
  max-height: 300px;
  width: 100%;
  object-fit: cover;
  margin-bottom: 50px;
}

.byline {
  margin-bottom: 50px;
  font-size: 1.2rem;
}

.article-content > * {
  font-size: 1.1rem;
}
</style>

<style lang="scss">
.article-content pre,
.article-content aside {
  background-color: #212f40;
  border: 1px solid #2f435b;
  border-radius: 5px;
  height: 100%;
  padding: 1rem;
  margin: 2rem 0;
}

.article-content h2 {
  margin-top: 4rem;
}
</style>