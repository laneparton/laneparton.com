<template>
  <main class="min-h-screen">
    <div class="container py-6 mt-36">
      <div class="flex flex-wrap">
        <div class="w-full lg:w-1/4 md:w-1/2 text-center mx-auto">
          <nuxt-img
            src="/images/Headshot.png"
            alt="Headshot of Lane"
            class="w-full h-auto rounded-full mb-5 lg:mb-3 pe-8"
            width="380"
            format="webp"
          />
        </div>
        <div class="w-full md:w-1/2 lg:w-3/4 flex flex-col justify-center">
          <h2 class="text-4xl text-white mb-4">
            Hey! I'm Lane.
          </h2>
          <p class="mb-6">
            As a <strong class="text-white">Software Engineer</strong> with proven experience in design and user experiences, I'm dedicated to creating intuitive and engaging interfaces that push the boundaries of what technology can do.
          </p>
          <p class="mb-6">
            At <a
              href="https://www.xylem.com/"
              target="_blank"
              class="font-semibold"
            >Xylem</a>, I collaborate with a talented team to develop innovative solutions that bring smart metering data straight to our customers.
          </p>
          <div class="flex text-white text-4xl">
            <a
              href="https://github.com/laneparton/"
              class="mx-2"
              target="_blank"
              aria-label="GitHub"
            >
              <font-awesome-icon icon="fa-brands fa-github" />
            </a>
            <a
              href="https://www.linkedin.com/in/lane-parton/"
              class="mx-2"
              target="_blank"
              aria-label="LinkedIn"
            >
              <font-awesome-icon icon="fa-brands fa-linkedin" />
            </a>
            <a
              href="https://twitter.com/laneparton"
              class="mx-2"
              target="_blank"
              aria-label="Twitter"
            >
              <font-awesome-icon :icon="['fab', 'twitter']" />
            </a>
          </div>
        </div>
      </div>
    </div>

    <div class="container mt-24">
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div class="w-full mb-4">
          <CalloutCard>
            <template #content>
              <h5 class="relative mb-6 text-lg font-medium text-white">
                Get to Know Me
                <span class="absolute bottom-[-8px] left-0 w-1/2 h-0.5 bg-lightBlue" />
              </h5>
              <p class="mb-3">
                Get a glimpse inside who I am and what I love. From my journey as a software engineer to my passions outside of work, like exploring the outdoors with my fianceé and dog, I'm excited to share my story with you.
              </p>
              <NuxtLink
                to="/about-me"
                class="btn-custom"
              >
                Learn More About Me <font-awesome-icon icon="fa-solid fa-arrow-right" />
              </NuxtLink>
            </template>
          </CalloutCard>
        </div>
        <div class="w-full mb-4">
          <CalloutCard>
            <template #content>
              <h5 class="relative mb-6 text-lg font-medium text-white">
                Let's Collaborate
                <span class="absolute bottom-[-8px] left-0 w-1/2 h-0.5 bg-lightBlue" />
              </h5>
              <p class="mb-3">
                Whether you're a small business or an individual looking to build, maintain, or grow your web presence, I'm here to help. Get in touch to explore personalized web consulting services that fit your unique needs and goals.
              </p>
              <NuxtLink
                to="/consulting"
                class="btn-custom"
              >
                Explore Services <font-awesome-icon icon="fa-solid fa-arrow-right" />
              </NuxtLink>
            </template>
          </CalloutCard>
        </div>
      </div>
    </div>

    <div class="container mt-12 lg:mt-24 lg:mb-12">
      <BlogFeed
        :data="data"
        :post-limit="5"
      />
      <div class="flex flex-wrap">
        <div class="w-full mt-4">
          <NuxtLink
            to="/posts"
            class="text-primary btn-custom"
          >
            See More Posts <font-awesome-icon icon="fa-solid fa-arrow-right" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
const { data } = await useAsyncData("posts", () =>
  queryContent("posts").sort({ published: -1 }).limit(5).find()
);

const ogImageOptions = {
  title: 'My little home on the internet',
}
// a. Use the Composition API
defineOgImage(ogImageOptions)
</script>

<style lang="scss" scoped>
.icon-row {
    font-size: 2rem;
}

.btn-custom {

    &:hover {
        svg {
            margin-left: 8px;
        }
    }

    svg {
        color: #f7961c;
        margin-left: 3px;
        transition: 0.2s all ease-in-out;
    }
}
</style>