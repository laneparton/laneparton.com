<template>
  <div>
    <div class="row justify-content-center">
      <div class="col-12">
        <div class="section-title mb-4 pb-2">
          <h4 class="title mb-4">
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
      class="row g-3"
    >
      <div
        v-for="(project, k) in projects"
        :key="k"
        class="col-md-6 picture-item"
      >
        <div class="card border-0 work-container work-primary work-modern position-relative d-block overflow-hidden rounded">
          <div class="card-body p-0">
            <img
              src="https://picsum.photos/300"
              class="img-fluid"
              alt="work-image"
            >
            <div class="overlay" />
            <div class="icons text-center">
              <a
                href="assets/images/photography/p1.jpg"
                class="work-icon bg-white d-inline-flex rounded-pill lightbox"
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
        class="text-primary"
      >See More <font-awesome-icon icon="fa-solid fa-arrow-right" /></a>
    </div>
  </div><!--end container-->
</template>

<script setup>
const projects = [1, 2]
</script>

<style>

</style>