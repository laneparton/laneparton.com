<template>
  <footer
    id="footer"
    class="site-footer"
    role="contentinfo"
  >
    <div class="container">
      <div class="row">
        <div class="site-info col-md-6 col-12">
          <p class="copyright">
            &copy; {{ currentYear }} Lane Parton
          </p>
        </div>
        <nav
          class="footer-socials col-md-6 col-12"
          role="navigation"
          aria-label="Footer Social Links Menu"
        >
          <ul
            id="social-media-footer"
            class="social-links-menu"
          >
            <li class="has-submenu">
              <a
                href="https://github.com/laneparton/"
                class="mx-2"
                target="_blank"
              >
                <font-awesome-icon icon="fa-brands fa-github" />
              </a>
            </li>
            <li class="has-submenu">
              <a
                href="https://www.linkedin.com/in/lane-parton/"
                class="mx-2"
                target="_blank"
              >
                <font-awesome-icon icon="fa-brands fa-linkedin" />
              </a>
            </li>
            <li class="has-submenu">
              <a
                href="https://twitter.com/laneparton"
                class="mx-2"
                target="_blank"
              >
                <font-awesome-icon icon="fa-brands fa-twitter" />
              </a>
            </li>
          </ul>
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

<style lang="scss" scoped>
@import 'bootstrap/scss/bootstrap-grid';
.site-footer {
    box-shadow: inset 0 0 3px rgba(173, 181, 189, 0.15);
    padding: 1.5rem;
    background-color: #212f40;
    color: white;
    @include media-breakpoint-down(md) {
        text-align: center;
    }

    .site-info {
        text-align: center;

        @include media-breakpoint-up(md) {
            display: flex;
            align-items: center;
            text-align: unset;
        }
    }
    
    .footer-socials {
        @include media-breakpoint-up(md) {
            text-align: right;
        }
    }

    p {
        margin-bottom: 0;
    }

    ul {
        padding: 0;
        margin-bottom: 0;
        list-style-type: none;

        li {
            display: inline-block;
            font-size: 2rem;
        }
    }
}
</style>