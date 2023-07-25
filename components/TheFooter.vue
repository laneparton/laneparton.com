<template>
  <footer
    id="footer"
    class="bg-navyBlue mt-8 py-6 shadow-inner footer"
    role="contentinfo"
  >
    <div class="container mx-auto">
      <div class="flex flex-wrap justify-between items-center">
        <div class="w-full md:w-1/2 text-center md:text-left">
          <p class="mb-0">
            &copy; {{ currentYear }} Lane Parton
          </p>
        </div>
        <nav
          class="w-full md:w-1/2 text-center md:text-right text-white text-3xl"
          role="navigation"
          aria-label="Footer Social Links Menu"
        >
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
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </a>
        </nav>
      </div>
    </div>
  </footer>
</template>

<script lang="ts" setup>
import { computed } from 'vue'
const currentYear = computed(() => getCurrentYear())

function getCurrentYear() {
  const currentDate = new Date();
  const currentYear = currentDate.getFullYear();
  return currentYear;
}
</script>

<style scoped>
.footer {
  box-shadow: inset 0 0 3px #adb5bd26;
}
</style>
