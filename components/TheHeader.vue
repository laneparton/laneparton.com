<template>
  <header
    id="topnav"
    :class="{ 'nav-sticky': isSticky }"
  >
    <div class="container">
      <NuxtLink
        class="logo"
        to="/"
      >
        <img src="/images/logo.svg">
        <span>lane parton</span>
      </NuxtLink>
      <ul class="buy-button list-inline mb-0">
        <li class="list-inline-item mb-0">
          <a
            data-bs-toggle="offcanvas"
            data-bs-target="#offcanvasRight"
            aria-controls="offcanvasRight"
            @click="toggleNav"
          >
            <span class="btn btn-icon btn-pills btn-primary">
              <font-awesome-icon :icon="['fas', 'fa-bars']" />
            </span>
          </a>
        </li>
      </ul>

      <div
        id="offcanvasRight"
        class="offcanvas offcanvas-end shadow border-0"
        tabindex="-1"
        aria-labelledby="offcanvasRightLabel"
        :class="{ show: isNavOpen }"
      >
        <div class="offcanvas-header px-4 border-bottom">
          <button
            type="button"
            class="btn-close d-flex align-items-center text-dark"
            data-bs-dismiss="offcanvas"
            aria-label="Close"
            @click="toggleNav"
          >
            <font-awesome-icon icon="fa-solid fa-xmark" />
          </button>
        </div>

        <div class="offcanvas-body d-flex align-items-center align-items-center">
          <div class="container">
            <div class="row">
              <div class="col-12">
                <div
                  id="navigation"
                  class="toggle-menu"
                >
                  <!-- Navigation Menu-->
                  <ul class="navigation-menu toggle-menu-item">
                    <li class="has-submenu">
                      <NuxtLink
                        to="/"
                        @click="toggleNav"
                      >
                        Home
                      </NuxtLink>
                    </li>
                    <li class="has-submenu">
                      <NuxtLink
                        to="/about-me"
                        @click="toggleNav"
                      >
                        About Me
                      </NuxtLink>
                    </li>
                    <li class="has-submenu">
                      <NuxtLink
                        to="/consulting"
                        @click="toggleNav"
                      >
                        Consulting
                      </NuxtLink>
                    </li>
                    <li class="has-submenu">
                      <NuxtLink
                        to="/posts"
                        @click="toggleNav"
                      >
                        Posts
                      </NuxtLink>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        class="offcanvas-backdrop fade"
        :class="{ show: isNavOpen }"
        @click="toggleNav"
      />
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue"
const isSticky = ref(false)
const isNavOpen = ref(false)

function handleScroll() {
    const navbar = document.getElementById("topnav")
    if (navbar) {
        isSticky.value = window.pageYOffset >= 50
    }
}

function toggleNav() {
    isNavOpen.value = !isNavOpen.value
}

onMounted(() => {
    window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
    window.removeEventListener('scroll', handleScroll)
})

</script>

<style lang="scss">
.logo {
    font-weight: normal;

    img {
        margin-right: 16px;
    }
}
.offcanvas-backdrop.fade {
    display: none;
}

.offcanvas-backdrop.show {
    display: block;
}

.offcanvas-header {
    justify-content: flex-end;

    .btn-close {
        font-size: 1.5rem;
    }
}
</style>