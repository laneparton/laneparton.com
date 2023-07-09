<template>
  <div class="page container">
    <BlogFeed
      :data="data"
      :post-limit="99"
    />
  </div>
</template>

<script lang="ts" setup>
const { data } = await useAsyncData("posts", () =>
  queryContent("posts").sort({ published: -1 }).find()
);
</script>

<style>
.page-title {
    padding-top: 75px;
}
.post-content {
    padding: 1rem 0;
    border-bottom: 1px solid #2f435b;
}
</style>
