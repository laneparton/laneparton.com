<template>
  <div>
    <div class="flex justify-center">
      <div class="w-full">
        <div class="mb-4 pb-2">
          <h4 class="mb-4 text-lg font-bold">
            Latest Projects
          </h4>
          <p class="mb-0">
            As a Freelance Designer & Developer, I am here to make you
            stand out in the digital world and my passion for design and your vision will ensure a great end
            result.
          </p>
        </div>
      </div><!--end col-->
    </div><!--end row-->

    <div
      id="grid"
      class="flex flex-wrap gap-3"
    >
      <div
        v-for="(project, k) in projects"
        :key="k"
        class="w-full md:w-1/2"
      >
        <div class="relative overflow-hidden border-0 rounded card work-container work-primary work-modern">
          <div class="p-0">
            <img
              src="https://picsum.photos/300"
              class="w-full h-auto"
              alt="work-image"
            >
            <div class="overlay" />
            <div class="flex justify-center">
              <a
                href="assets/images/photography/p1.jpg"
                class="work-icon rounded-full bg-white inline-flex lightbox"
              >
                <font-awesome-icon icon="fa-solid fa-arrow-right" />
              </a>
            </div>
          </div>
        </div>
      </div><!--end col-->
    </div><!--end row-->

    <div class="mt-4">
      <a
        href="photography-portfolio.html"
        class="text-blue-500"
      >See More <font-awesome-icon icon="fa-solid fa-arrow-right" /></a>
    </div>
  </div><!--end container-->
</template>

<script setup>
const projects = [1, 2]
</script>
