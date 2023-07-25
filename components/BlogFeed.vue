<template>
  <div>
    <h2 class="text-3xl text-white mb-4">
      Latest Posts
    </h2>
    <div
      class="flex flex-col border-t border-lightBlue"
    >
      <div class="flex border-b border-lightBlue">
        <div class="flex-1 py-2 px-3 text-left text-sm border-r border-lightBlue">
          <span class="me-2"><font-awesome-icon icon="fas fa-font" /></span>Name
        </div>
        <div class="flex-1 py-2 px-3 text-left text-sm border-r border-lightBlue">
          <span class="me-2"><font-awesome-icon icon="fa-regular fa-calendar" /></span>Date Published
        </div>
        <div class="flex-1 py-2 px-3 text-left text-sm hidden lg:flex">
          <span class="me-2"><font-awesome-icon icon="fas fa-list" /></span>Tags
        </div>
      </div>
      <div
        v-for="(post, k) in props.data"
        :key="k"
        class="flex border-b border-lightBlue"
      >
        <div class="flex-1 py-2 px-3 text-sm border-r border-lightBlue flex items-center">
          <NuxtLink
            v-if="post._path"
            :to="post._path"
            class="font-bold"
          >
            {{ post.title }}
          </NuxtLink>
        </div>
        <div class="flex-1 py-2 px-3 text-sm border-r border-lightBlue flex items-center">
          {{ dayjs(post.published).format("MMMM D, YYYY") }}
        </div>
        <div class="flex-1 py-2 px-3 text-sm hidden lg:flex flex-wrap gap-2 items-center">
          <span
            v-for="tag in post.tags"
            :key="tag"
            class="py-1 px-2 border border-lightBlue text-white text-sm font-normal rounded"
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