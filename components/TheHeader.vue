<template>
  <header
    id="topnav"
    :class="{ 'sticky-shadow': isSticky }"
    class="w-full fixed z-10 top-0 px-4 bg-midnightBlue"
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
        aria-controls="nav-drawer"
        class="ml-auto nav-button"
        @click="toggleNav"
      >
        <font-awesome-icon :icon="['fas', 'fa-bars']" />
      </button>

      <div
        id="nav-drawer"
        class="fixed inset-y-0 z-50 right-0 w-full lg:w-96 bg-midnightBlue shadow-lg transform ease-in-out duration-300 translate-x-full"
        tabindex="-1"
        :class="{ show: isNavOpen }"
      >
        <div class="px-4 border-b flex border-faintBlue">
          <button
            type="button"
            class="mr-4 ml-auto text-3xl py-4 text-white"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            @click="toggleNav"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>
        <div class="h-full flex items-center justify-center">
          <ul class="text-center">
            <li
              v-for="(link, index) of navLinks"
              :key="index"
              class="py-4 text-xl uppercase font-bold"
            >
              <NuxtLink
                :to="link.to"
                @click="toggleNav"
              >
                {{ link.text }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>
    </div>
    <div
      id="backdrop"
      class="fixed inset-0 z-40 bg-black opacity-0 transition-opacity duration-300 pointer-events-none"
      :class="{ show: isNavOpen }"
      @click="toggleNav"
    />
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
const isSticky = ref(false)
const isNavOpen = ref(false)
const navLinks = [
  {
    text: "Home",
    to: "/"
  },
  {
    text: "About Me",
    to: "/about-me"
  },
  {
    text: "Consulting",
    to: "/consulting"
  },
  {
    text: "Posts",
    to: "/posts"
  }
]

function toggleNav() {
    isNavOpen.value = !isNavOpen.value
}

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
</script>

<style>
.sticky-shadow {
  box-shadow: 0 0 3px rgba(173,181,189,.15);
}

#nav-drawer.show {
  @apply translate-x-0 visible;
}

#backdrop.show {
  @apply opacity-75 pointer-events-auto;
}

.nav-button {
  @apply text-white bg-lightOrange rounded-sm;
  height: 40px;
  width: 40px;
  display: inline-block;
  line-height: 24px;
}

</style>