<template>
  <main class="min-h-screen">
    <section class="lg:py-24">
      <div class="container mx-auto">
        <div class="flex flex-wrap gap-4 items-center">
          <div class="w-full lg:w-7/12">
            <h1 class="text-4xl mb-4">
              Hi Again,
            </h1>
            <h3 class="text-3xl">
              In case you missed it, I'm Lane &#128522;
            </h3>
            <p class="mt-4">
              I'm a software engineer living in Raleigh, NC. Professionally, I'm passionate about building intuitive and natural user experiences. Personally, I enjoy traveling, working out, and spending time with my fiancée and &#128054;
            </p>
          </div>
          <div class="w-full lg:w-4/12 lg:ml-4">
            <nuxt-img
              src="/images/about.jpg"
              class="w-full h-auto p-3 rounded-full"
              width="380"
            />
          </div>
          <div class="w-full">
            <h2 class="text-2xl mt-12 mb-4">
              Cliff Notes
            </h2>
          </div>
        </div>
        <div class="w-full grid gap-4 grid-cols-3">
          <div
            v-for="(card, index) in cliffNotes"
            :key="index"
            class="w-full mb-4"
          >
            <CalloutCard>
              <template #content>
                <div class="w-full flex flex-col items-center">
                  <img
                    :src="`/images/icons/${card.icon}`"
                    class="py-3"
                  >
                  <h5 class="text-xl mt-2">
                    {{ card.heading }}
                  </h5>
                </div>
              </template>
            </CalloutCard>
          </div>
        </div>
      </div>
      <div class="mt-24">
        <div class="container mx-auto">
          <h2 class="text-2xl mb-4">
            Recent Memories
          </h2>
          <InstagramBlock />
        </div>
      </div>
    </section>
  </main>
</template>

<script lang="ts" setup>
const cliffNotes = [
  {
    icon: "developer.png",
    heading: "Software Engineer @ Xylem"
  },
  {
    icon: "iu.png",
    heading: "Indiana University Alumni"
  },
  {
    icon: "motocross.png",
    heading: "Motocross Lover"
  },
  {
    icon: "learner.png",
    heading: "Continuous Learner"
  },
  {
    icon: "adventure.png",
    heading: "Adventure Seeker"
  },
  {
    icon: "foodie.png",
    heading: "Self-Proclaimed Foodie"
  },
]
</script>

<style lang="scss" scoped>
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