<template>
  <main class="page">
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
            <nuxt-img
              src="/images/about.jpg"
              class="img-fluid p-3 rounded-circle"
              width="380"
            />
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
  @media (min-width: 992px) {
    padding: 100px 0;
  }
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
