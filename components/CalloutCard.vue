<template>
  <div class="card custom-card shadow-sm">
    <div class="card-body">
      <h5 class="custom-card-title">
        {{ props.title }}
      </h5>
      <p class="custom-card-text">
        {{ props.text }}
      </p>
      <slot />
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
    title: String,
    text: String,
})

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
