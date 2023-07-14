<template>
  <div class="page container mb-50">
    <div class="row">
      <div class="col-12 mb-50">
        <div class="card custom-card shadow-sm">
          <div class="card-body">
            <h5 class="custom-card-title">
              &#127793; Heads up, this is a digital garden, not a blog
            </h5>
            <p class="custom-card-text">
              Like many, <a href="https://joelhooks.com/digital-garden">Joel Hooks</a> introduced me to the idea of a digital garden. Here, I focus on process and ideas rather than fully-baked blog posts. Additionally, if you'd like to learn more about digital gardens, I suggest reading <a href="https://maggieappleton.com/garden-history"><i>A Brief History & Ethos of the Digital Garden</i> by Maggie Appleton</a>
            </p>
          </div>
        </div>
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

<style lang="scss" scoped>
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
    margin-bottom: 1.5rem;

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

</style>
