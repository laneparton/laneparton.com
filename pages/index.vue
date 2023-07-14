<template>
  <main class="page">
    <div class="container intro">
      <div class="row">
        <div class="col-10 col-lg-3 col-md-5 text-center mx-auto">
          <nuxt-img
            src="/images/Headshot.png"
            alt="Headshot of Lane"
            class="img-fluid rounded-circle mb-5 mb-lg-3 px-4"
            width="380"
            format="webp"
          />
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

    <div class="container mt-100">
      <div class="row">
        <div class="col-md-6 mb-4">
          <CalloutCard
            title="Get to Know Me"
            text="Get a glimpse inside who I am and what I love. From my journey as a software engineer to my passions outside of work, like exploring the outdoors with my fianceé and dog, I'm excited to share my story with you."
          >
            <NuxtLink
              to="/about-me"
              class="custom-btn"
            >
              Learn More About Me <font-awesome-icon icon="fa-solid fa-arrow-right" />
            </NuxtLink>
          </CalloutCard>
        </div>
        <div class="col-md-6 mb-4">
          <CalloutCard
            title="Let's Collaborate"
            text="Whether you're a small business or an individual looking to build, maintain, or grow your web presence, I'm here to help. Get in touch to explore personalized web consulting services that fit your unique needs and goals."
          >
            <NuxtLink
              to="/consulting"
              class="custom-btn"
            >
              Explore Services <font-awesome-icon icon="fa-solid fa-arrow-right" />
            </NuxtLink>
          </CalloutCard>
        </div>
      </div>
    </div>

    <div class="container blog">
      <BlogFeed
        :data="data"
        :post-limit="5"
      />
      <div class="row">
        <div class="col mt-4">
          <NuxtLink
            to="/posts"
            class="text-primary"
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
</script>

<style lang="scss" scoped>
.icon-row {
    font-size: 2rem;
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

.intro {
  @media (min-width: 992px) {
    margin-top: 100px;
  }
}
.blog {
  margin-top: 50px;
  @media (min-width: 992px) {
    margin-top: 100px;
    margin-bottom: 50px;
  }
}

</style>