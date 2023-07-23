<template>
  <div class="min-h-screen container mx-auto mt-24 mb-12">
    <div class="flex flex-wrap">
      <div class="w-full my-12">
        <CalloutCard>
          <template #content>
            <h5 class="relative mb-6 text-lg font-medium text-white">
              &#127793; Heads up, this is a digital garden, not a blog
              <span class="absolute bottom-[-8px] left-0 w-1/2 h-0.5 bg-lightBlue" />
            </h5>
            <p>
              Like many, <nuxt-link
                href="https://joelhooks.com/digital-garden"
              >
                Joel Hooks
              </nuxt-link> introduced me to the idea of a digital garden. Here, I focus on process and ideas rather than fully-baked blog posts. Additionally, if you'd like to learn more about digital gardens, I suggest reading <nuxt-link
                href="https://maggieappleton.com/garden-history"
              >
                <i>A Brief History & Ethos of the Digital Garden</i> by Maggie Appleton
              </nuxt-link>
            </p>
          </template>
        </CalloutCard>
      </div>
    </div>
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