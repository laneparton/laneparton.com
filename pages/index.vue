<template>
  <main class="page">
    <div class="entry-content pt-40">
      <div class="container mt-100 mt-35-res">
        <div class="row">
          <div class="col-12 col-lg-3 col-md-6 text-center">
            <img
              src="/images/Headshot.png"
              alt="Placeholder Headshot"
              class="img-fluid rounded-circle mb-3 mb-md-0 px-4"
            >
          </div>
          <div class="col-12 col-md-6 col-lg-9 d-flex flex-column justify-content-center">
            <h2>Hey! I'm Lane.</h2>
            <p>
              As a <strong style="color: #fff">Software Engineer</strong> with proven experience in design and user experiences, I'm dedicated to creating intuitive and engaging interfaces that push the boundaries of what technology can do.
            </p>
            <p>
              At <a
                href="https://www.xylem.com/"
                target="_blank"
                style="font-weight: 600;"
              >Xylem</a>, I collaborate with a talented team to develop innovative solutions that bring smart metering data straight to our customers.
            </p>
            <div class="icon-row d-flex">
              <a
                href="https://github.com/laneparton/"
                class="mx-2"
                target="_blank"
              >
                <font-awesome-icon icon="fa-brands fa-github" />
              </a>
              <a
                href="https://www.linkedin.com/in/lane-parton/"
                class="mx-2"
                target="_blank"
              >
                <font-awesome-icon icon="fa-brands fa-linkedin" />
              </a>
              <a
                href="https://twitter.com/laneparton"
                class="mx-2"
                target="_blank"
              >
                <font-awesome-icon icon="fa-brands fa-twitter" />
              </a>
            </div>
          </div>
        </div>
      </div>

      <div class="container mt-100">
        <div class="row">
          <div class="col-md-6 mb-4">
            <div class="card custom-card shadow-sm">
              <div class="card-body">
                <h5 class="custom-card-title">
                  Discover My Story
                </h5>
                <p class="custom-card-text">
                  Ready to get to know me a little better? From my journey as a software engineer to my passions outside of work, like exploring the outdoors and racing motocross, I'm excited to share my story with you.
                </p>
                <NuxtLink
                  to="/about-me"
                  class="custom-btn"
                >
                  Learn More About Me <font-awesome-icon icon="fa-solid fa-arrow-right" />
                </NuxtLink>
              </div>
            </div>
          </div>
          <div class="col-md-6 mb-4">
            <div class="card custom-card shadow-sm">
              <div class="card-body">
                <h5 class="custom-card-title">
                  Let's Collaborate
                </h5>
                <p class="custom-card-text">
                  Whether you're a small business or an individual looking to build, maintain, or grow your web presence, I'm here to help. Get in touch to explore personalized web consulting services that fit your unique needs and goals.
                </p>
                <NuxtLink
                  to="/consulting"
                  class="custom-btn"
                >
                  Explore Services <font-awesome-icon icon="fa-solid fa-arrow-right" />
                </NuxtLink>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="container py-115">
        <BlogFeed
          :data="data"
          :post-limit="5"
        />
        <div class="mt-4">
          <NuxtLink
            to="/posts"
            class="text-primary"
          >
            See More <font-awesome-icon icon="fa-solid fa-arrow-right" />
          </NuxtLink>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
// import { useTwitterFeed } from '../composables/use-twitter-feed'

// const { tweets } = useTwitterFeed()

const { data } = await useAsyncData("posts", () =>
  queryContent("posts").sort({ published: -1 }).limit(5).find()
);

</script>

<style lang="scss" scoped>
.icon-row {
    font-size: 2rem;
}

.custom-card {
    background-color: #212f40;
    border: 1px solid #2f435b;
    border-radius: 5px;
    height: 100%;
    padding: 1rem;

    .card-body {
        display: flex;
        flex-direction: column;
        align-items: flex-start;

        .custom-btn {
            margin-top: auto;
        }
    }
}

.custom-card-title {
    font-size: 1.25rem;
    font-weight: 500;
    position: relative;

    &::after {
        content: "";
        position: absolute;
        bottom: -8px;
        left: 0;
        width: 50%;
        height: 2px;
        background-color: #9bacc4;
    }

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