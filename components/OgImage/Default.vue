<!-- eslint-disable vue/multi-word-component-names -->
<script setup lang="ts">
// inherited attrs can mess up the satori parser
defineOptions({
  inheritAttrs: false,
})

const props = defineProps({
  title: String,
})
</script>

<template>
  <div class="w-full h-full flex text-white bg-blue-500 items-center justify-center">
    <h1>
      {{ title }} 👋
    </h1>
  </div>
</template>

<style scoped>
h1 {
  font-size: 70px;
}
</style>