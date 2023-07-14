<template>
  <div>
    <h2>Latest Posts</h2>
    <div
      class="blog-post-list"
    >
      <div class="blog-post-row blog-post-header">
        <div class="blog-post-col blog-post-title">
          <span class="icon"><font-awesome-icon icon="fas fa-font" /></span>Name
        </div>
        <div class="blog-post-col blog-post-date">
          <span class="icon"><font-awesome-icon icon="fa-regular fa-calendar" /></span>Date Published
        </div>
        <div class="blog-post-col blog-post-tags">
          <span class="icon"><font-awesome-icon icon="fas fa-list" /></span>Tags
        </div>
      </div>
      <div
        v-for="(post, k) in props.data"
        :key="k"
        class="blog-post-row"
      >
        <div class="blog-post-col blog-post-title">
          <NuxtLink
            v-if="post._path"
            :to="post._path"
          >
            {{ post.title }}
          </NuxtLink>
        </div>
        <div class="blog-post-col blog-post-date">
          {{ dayjs(post.published).format("MMMM D, YYYY") }}
        </div>
        <div class="blog-post-col blog-post-tags">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="badge"
          >{{
            tag
          }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import dayjs from "dayjs";
const props = defineProps({
  data: Array<Object>,
  postLimit: Number
})

</script>

<style lang="scss">
.blog-post-list {
  display: flex;
  flex-direction: column;
  border-top: 1px solid #9bacc4;
}

.blog-post-row {
  display: flex;
  border-bottom: 1px solid #9bacc4;
}

.blog-post-col {
  flex: 1;
  padding: 0.75rem;
  text-align: left;
  font-size: 14px;
}

.blog-post-header .blog-post-col {
  padding: 0.5rem;
}

.blog-post-title a {
  font-weight: bold;
  border-bottom: 1px solid rgba(55, 53, 47, 0.16);
}

.blog-post-title {
  border-right: 1px solid #9bacc4;
}

.blog-post-date {
  max-width: 40%;
  @media (min-width: 992px) {
    max-width: 25%;
    border-right: 1px solid #9bacc4;
  }
}

.blog-post-header .icon {
  margin-right: 5px;
}

.blog-post-tags {
  display: none;

  @media (min-width: 992px) {
    display: flex;
    flex-wrap: wrap;
    gap: 10px;
    align-items: flex-start;
  }

  .badge {
    font-size: 14px;
    border: 1px solid #9bacc4;
    font-weight: normal;
  }
}
</style>
