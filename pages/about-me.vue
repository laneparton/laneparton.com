<template>
  <main class="page">
    <!-- Start Home -->
    <!-- <section class="bg-half">
      <div class="bg-overlay bg-linear-gradient-2" />
      <div class="section-title position-absolute bottom-0 text-center end-0 start-0">
        <h2 class="text-muted title-dark-50 mb-0 fs-5">
          Hey there! I'm Lane.
        </h2>
        <h1 class="mt-0">
          Get to Know Me
        </h1>
      </div>
    </section> -->

    <section class="intro">
      <div class="container">
        <div class="row gy-4 align-items-center">
          <div class="col-lg-7">
            <h1>Hi Again,</h1>
            <h3>In case you missed it, I'm Lane Parton &#128522;</h3>
            <p>
              I'm a software engineer living in Raleigh, NC. Professionally, I'm passionate about building intuitive and natural user experiences. Personally, I enjoy traveling, working out, and spending time with my fiancée and &#128054;
            </p>
          </div>
          <div class="col-lg-4 offset-lg-1">
            <img
              src="/images/about.jpg"
              class="img-fluid p-3 rounded-circle"
            >
          </div>
          <div class="col-12">
            <h2 class="mt-50 mb-0">
              Cliff Notes
            </h2>
          </div>
          <div
            v-for="(card, index) in cliffNotes"
            :key="index"
            class="col-md-4"
          >
            <div class="card custom-card shadow-sm">
              <div class="card-body">
                <img
                  :src="`/images/icons/${card.icon}`"
                  class="py-3"
                >
                <h5 class="custom-card-title">
                  {{ card.heading }}
                </h5>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="mt-100">
        <div class="container">
          <h2 class="mb-4">
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
.intro {
  position: relative;
  padding: 100px 0;
}
.custom-card {
    background-color: #212f40;
    border: 1px solid #2f435b;
    border-radius: 5px;
    height: 100%;
    padding: 1rem;

    .card-body {
        text-align: center;
    }
}

.custom-card-title {
    font-size: 1.25rem;
    font-weight: 500;
    position: relative;
    margin-bottom: 0;
}

.custom-btn {

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
