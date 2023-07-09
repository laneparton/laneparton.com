<template>
  <masonry-wall
    :items="data"
    :ssr-columns="1"
    :column-width="300"
    :gap="16"
  >
    <template #default="{ item }">
      <img
        :src="item.media_url"
        :alt="item.caption"
      >
    </template>
  </masonry-wall>
</template>

<script setup lang="ts">
const { data } = await useFetch('/api/get-instagram-posts')
</script>

<style lang="scss">
.masonry-item {
  img {
    max-width: 100%;
  }
}
</style>