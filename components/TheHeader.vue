<template>
  <header
    id="topnav"
    :class="{ 'sticky top-0 z-50 bg-midnightBlue': isSticky }"
  >
    <div class="container flex py-4">
      <NuxtLink
        class="flex items-center font-normal text-gray-900"
        to="/"
      >
        <nuxt-img
          src="/images/logo.svg"
          alt="Logo"
          width="46"
          height="46"
        />
        <span class="ml-4 text-white text-2xl tracking-wider">lane parton</span>
      </NuxtLink>
      <button
        type="button"
        data-drawer-target="drawer-right-example"
        data-drawer-show="drawer-right-example"
        data-drawer-placement="right"
        aria-controls="drawer-right-example"
        class="ml-auto bg-yellow-300 aspect-square"
      >
        <font-awesome-icon :icon="['fas', 'fa-bars']" />
      </button>

      <div
        id="drawer-right-example"
        class="fixed top-0 right-0 z-40 h-screen p-4 overflow-y-auto transition-transform translate-x-full bg-white w-80 dark:bg-gray-800"
        tabindex="-1"
        aria-labelledby="drawer-right-label"
      >
        <h5
          id="drawer-right-label"
          class="inline-flex items-center mb-4 text-base font-semibold text-gray-500 dark:text-gray-400"
        >
          <svg
            class="w-4 h-4 mr-2.5"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
          </svg>Right drawer
        </h5>
        <button
          type="button"
          data-drawer-hide="drawer-right-example"
          aria-controls="drawer-right-example"
          class="text-gray-400 bg-transparent hover:bg-gray-200 hover:text-gray-900 rounded-lg text-sm w-8 h-8 absolute top-2.5 right-2.5 inline-flex items-center justify-center dark:hover:bg-gray-600 dark:hover:text-white"
        >
          <svg
            class="w-3 h-3"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 14 14"
          >
            <path
              stroke="currentColor"
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
            />
          </svg>
          <span class="sr-only">Close menu</span>
        </button>
        <ul class="navigation-menu toggle-menu-item">
          <li class="has-submenu">
            <NuxtLink
              to="/"
            >
              Home
            </NuxtLink>
          </li>
          <li class="has-submenu">
            <NuxtLink
              to="/about-me"
            >
              About Me
            </NuxtLink>
          </li>
          <li class="has-submenu">
            <NuxtLink
              to="/consulting"
            >
              Consulting
            </NuxtLink>
          </li>
          <li class="has-submenu">
            <NuxtLink
              to="/posts"
            >
              Posts
            </NuxtLink>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup>
import { initFlowbite } from 'flowbite'
import { ref, onMounted, onUnmounted } from "vue"
const isSticky = ref(false)

function handleScroll() {
    const navbar = document.getElementById("topnav")
    if (navbar) {
        isSticky.value = window.pageYOffset >= 50
    }
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

// initialize components based on data attribute selectors
onMounted(() => {
    initFlowbite();
})

</script>

<style>
.sticky {
  box-shadow: 0 0 3px rgba(173,181,189,.15);
}
</style>