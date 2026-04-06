<template>
  <div id="defaultLayout">
    <div class="page-loader" :class="{ 'is-loaded': !isLoading }">
      <div class="loader">
        <div class="logo">
          <img src="~/assets/logo.png" alt="" />
        </div>
      </div>
    </div>

    <header ref="headerRef" :class="{ scrolled: isScrolled }">
      <div class="logo">
        <NuxtLink to="/">
          <img src="~/assets/logo.png" alt="" />
        </NuxtLink>
      </div>

      <div class="links">
        <NuxtLink to="/about">About</NuxtLink>
        <NuxtLink to="/academics">Academics</NuxtLink>
        <NuxtLink to="/news-events">News & Events</NuxtLink>
        <NuxtLink to="/alumni">Alumni</NuxtLink>
        <NuxtLink to="/contact">Contact</NuxtLink>
      </div>

      <div class="right-actions">

        <ThemeToggle />

        <div class="cta-buttons desktop-only">
          <template v-if="isAuthenticated">
            <ctaButton
              v-if="userRole === 'admin'"
              link="/admin"
              buttonLabel="Dashboard"
            />
            <ctaButton
              v-else
              link="#"
              @click.prevent="handleLogout"
              buttonLabel="Logout"
            />
          </template>
          <template v-else>
            <ctaButton link="/authentication" buttonLabel="Sign In" />
          </template>
        </div>

        <div class="hamburger mobile-only">
          <input
            hidden=""
            class="check-icon"
            id="check-icon"
            name="check-icon"
            type="checkbox"
            v-model="isMenuOpen"
          />
          <label class="icon-menu" for="check-icon">
            <div class="bar bar--1"></div>
            <div class="bar bar--2"></div>
            <div class="bar bar--3"></div>
          </label>
        </div>
      </div>
    </header>

    <div class="menu" :class="{ open: isMenuOpen }">
      <NuxtLink to="/" @click="isMenuOpen = false">Home</NuxtLink>
      <hr />
      <NuxtLink to="/about" @click="isMenuOpen = false">About</NuxtLink>
      <hr />
      <NuxtLink to="/academics" @click="isMenuOpen = false">Academics</NuxtLink>
      <hr />
      <NuxtLink to="/news-events" @click="isMenuOpen = false"
        >News & Events</NuxtLink
      >
      <hr />
      <NuxtLink to="/alumni" @click="isMenuOpen = false">Alumni</NuxtLink>
      <hr />
      <NuxtLink to="/contact" @click="isMenuOpen = false">Contact</NuxtLink>

      <template v-if="!isAuthenticated">
        <hr />
        <NuxtLink
          to="/authentication"
          @click="isMenuOpen = false"
          class="auth-link login-link"
        >
          <i class="bi bi-person-circle"></i> Sign In
        </NuxtLink>
      </template>
    </div>

    <div v-if="showPageTitle" class="pageTitle" :key="route.path">
      <div class="background"></div>
      <div class="backdrop">
        <h2>{{ dynamicPageTitle }}</h2>
      </div>
    </div>

    <NuxtPage />

    <footer>
      <div class="newsletter">
        <div class="text">
          <p>Stay in touch</p>
          <h2>Subscribe to our newsletter</h2>
        </div>
        <form @submit.prevent>
          <input type="email" placeholder="Enter your email" />
          <button>Subscribe</button>
        </form>
      </div>

      <div class="middle">
        <div class="brand">
          <div class="logo">
            <div class="image">
              <img src="~/assets/logo.png" alt="" />
            </div>
            <h1>RUNACOS</h1>
          </div>
          <h3>Follow our socials</h3>
          <div class="socials">
            <a href="https://www.linkedin.com/company/runacos" target="_blank">
              <i class="bi bi-linkedin"></i>
            </a>
            <a href="https://x.com/the_runacoss" target="_blank">
              <i class="bi bi-twitter-x"></i>
            </a>
            <a href="https://www.instagram.com/the_runacos" target="_blank">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="https://www.tiktok.com/@the_runacos" target="_blank">
              <i class="bi-tiktok"></i>
            </a>
            <a href="https://www.snapchat.com/add/the_runacos" target="_blank">
              <i class="bi-snapchat"></i>
            </a>
          </div>
        </div>

        <div class="links">
          <div class="container">
            <h3>Navigation</h3>
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/about">About</NuxtLink>
            <NuxtLink to="/news-events">News & Events</NuxtLink>
            <NuxtLink to="/contact">Contact</NuxtLink>
          </div>
          <div class="container">
            <h3>Quick Links</h3>
            <NuxtLink to="/academics">Academics</NuxtLink>
            <NuxtLink to="/alumni">Alumni</NuxtLink>
            <NuxtLink to="/contact">Report Faults</NuxtLink>
            <NuxtLink to="/authentication">Sign In</NuxtLink>
          </div>
        </div>
      </div>

      <svg
        style="width: 0; height: 0; position: absolute"
        aria-hidden="true"
        focusable="false"
      >
        <defs>
          <linearGradient id="loopGradient" x1="0%" y1="0%" x2="0" y2="100%">
            <stop offset="0%" stop-color="var(--loop-grad-start)" />
            <stop offset="50%" stop-color="var(--loop-grad-mid)" />
            <stop offset="100%" stop-color="var(--loop-grad-end)" />
          </linearGradient>
        </defs>
      </svg>

      <clientOnly>
        <CurvedLoop
          marquee-text="RUNACOS ✦ RUNACOS ✦"
          :speed="2"
          :curve-amount="-400"
          direction="left"
          class="textLoop"
        />
      </clientOnly>

      <p class="copyright">All rights reserved @RUNACOS</p>
    </footer>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from "vue";
import { useRoute, useNuxtApp, navigateTo, useCookie } from "#imports";
import { useAuthStore } from "~/stores/useAuthStore";

const route = useRoute();
const nuxtApp = useNuxtApp();
const authStore = useAuthStore();

const dynamicPageTitle = computed(() => route.meta.pageTitle || "");

const props = defineProps({
  showPageTitle: {
    type: Boolean,
    default: true,
  },
});

const isMenuOpen = ref(false);
const headerRef = ref(null);
const isScrolled = ref(false);
const isLoading = ref(true);

// --- JWT Decoder Helper ---
function parseJwt(token) {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// --- AUTHENTICATION STATE & LOGIC ---
const authToken = useCookie("auth_token");
const userRole = useCookie("user_role");

const isAuthenticated = computed(() => !!authToken.value);

const decodedUser = computed(() => parseJwt(authToken.value));

const currentUser = computed(() => {
  return authStore.currentUser || decodedUser.value || null;
});

const isUserMenuOpen = ref(false);

const handleLogout = () => {
  isUserMenuOpen.value = false;
  isMenuOpen.value = false;

  if (authStore.logout) {
    authStore.logout();
  } else {
    authToken.value = null;
    userRole.value = null;
    authStore.currentUser = null;
    navigateTo("/authentication");
  }
};

// --- LIFECYCLE HOOKS ---
nuxtApp.hook("page:start", () => {
  isLoading.value = true;
});

nuxtApp.hook("page:finish", () => {
  isLoading.value = false;
});

const handleScroll = () => {
  if (window.scrollY > 150) {
    isScrolled.value = true;
  } else {
    isScrolled.value = false;
  }
};

onMounted(() => {
  window.addEventListener("scroll", handleScroll);

  if (document.readyState === "complete") {
    isLoading.value = false;
  } else {
    window.addEventListener("load", () => {
      isLoading.value = false;
    });
  }
});

onUnmounted(() => {
  window.removeEventListener("scroll", handleScroll);
});
</script>

<style lang="scss">
/* Existing Layout CSS */
#defaultLayout {
  .page-loader {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background-color: color-mix(in srgb, var(--background-color) 75%, transparent);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
    z-index: 9999;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: opacity 0.5s ease, visibility 0.5s ease, transform 0.5s ease;

    &.is-loaded {
      opacity: 0;
      visibility: hidden;
      transform: scale(1.05);
    }

    .loader {
      position: relative;
      display: flex;
      justify-content: center;
      align-items: center;

      &::before {
        content: "";
        position: absolute;
        width: 160%;
        height: 160%;
        border-radius: 50%;
        border: 2px solid transparent;
        border-top-color: $accent-color;
        border-right-color: rgba($accent-color, 0.3);
        animation: spin-ring 1s cubic-bezier(0.68, -0.55, 0.265, 1.55) infinite;
        z-index: 2;
      }

      &::after {
        content: "";
        position: absolute;
        width: 100%;
        height: 100%;
        border-radius: 50%;
        background-color: $accent-color;
        filter: blur(40px);
        animation: pulse-glow 2s ease-in-out infinite;
        z-index: 0;
      }
    }

    .logo {
      position: relative;
      width: 120px;
      height: 120px;
      z-index: 1;
      animation: float-logo 3s ease-in-out infinite;

      img {
        width: 100%;
        height: 100%;
        object-fit: contain;
        position: relative;
      }
    }
  }

  @keyframes spin-ring {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
  @keyframes pulse-glow {
    0%,
    100% {
      opacity: 0.1;
      transform: scale(0.8);
    }
    50% {
      opacity: 0.4;
      transform: scale(1.2);
    }
  }
  @keyframes float-logo {
    0%,
    100% {
      transform: translateY(0) scale(1);
    }
    50% {
      transform: translateY(-8px) scale(1.05);
    }
  }

  /* Header */
  header {
    position: absolute;
    top: 0;
    width: 100%;
    height: 75px;
    padding: 0 25px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    transition: background-color 0.3s ease;

    &.scrolled {
      position: fixed;
      background: color-mix(in srgb, var(--secondary-color) 20%, transparent);
      backdrop-filter: blur(50px);
      -webkit-backdrop-filter: blur(50px);
      animation: slideDown 0.3s ease-out forwards;
    }

    @keyframes slideDown {
      from {
        transform: translateY(-100%);
      }
      to {
        transform: translateY(0);
      }
    }

    .logo {
      height: 100%;
      display: flex;
      align-items: center;
      a {
        height: 50%;
        img {
          width: 100%;
          height: 100%;
          object-fit: contain;
        }
      }
    }

    .links {
      display: none;
      width: 100%;
      height: 100%;
      justify-content: center;
      align-items: center;
      gap: 25px;
      a {
        font-weight: bold;
        font-family: $alternate-font;
        transition: 0.2s;
        &:hover,
        &.router-link-exact-active {
          color: $accent-color;
        }
      }
    }

    /* Right Actions Container */
    .right-actions {
      display: flex;
      align-items: center;
      gap: 15px;
      height: 100%;
      justify-content: flex-end;

      .desktop-only {
        display: none;
      }
      .mobile-only {
        display: flex;
      }

      .hamburger {
        display: flex;
        justify-content: center;
        align-items: center;
      }

      .cta-buttons {
        display: none;
        align-items: center;
        gap: 15px;
      }
    }
  }

  /* Mobile menu */
  .menu {
    position: fixed;
    top: -150%;
    right: 0;
    padding: 100px 25px 50px 25px;
    width: 100%;
    max-width: 500px;
    max-height: 100dvh;
    display: flex;
    flex-direction: column;
    gap: 25px;
    background: color-mix(in srgb, var(--alternate-color) 15%, transparent);
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    z-index: 5;
    border: solid color-mix(in srgb, var(--text-color) 20%, transparent);
    border-width: 0 0 1px 0;
    border-radius: 0 0 30px 30px;
    transition: 0.3s;
    overflow-y: auto;

    &.open {
      top: 0;
    }
    hr {
      border-color: color-mix(in srgb, var(--text-color) 20%, transparent);
    }
    a {
      font-family: $alternate-font;
      font-size: $text-lg;
      font-weight: bold;
      &:hover,
      &.router-link-exact-active {
        color: $accent-color;
      }
    }

    .auth-link {
      display: flex;
      align-items: center;
      gap: 10px;
      &.login-link {
        color: $accent-color;
      }
    }

    @include respond-to($min: 600px) {
      border-radius: 0 0 0 30px;
      border-width: 0 0 1px 1px;
    }
  }

  .pageTitle {
    position: relative;
    width: 100%;
    height: 250px;
    animation: slideDownTitle 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
    .background {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 304 304' width='304' height='304'%3E%3Cpath fill='%23bf903d' fill-opacity='0.2' d='M44.1 224a5 5 0 1 1 0 2H0v-2h44.1zm160 48a5 5 0 1 1 0 2H82v-2h122.1zm57.8-46a5 5 0 1 1 0-2H304v2h-42.1zm0 16a5 5 0 1 1 0-2H304v2h-42.1zm6.2-114a5 5 0 1 1 0 2h-86.2a5 5 0 1 1 0-2h86.2zm-256-48a5 5 0 1 1 0 2H0v-2h12.1zm185.8 34a5 5 0 1 1 0-2h86.2a5 5 0 1 1 0 2h-86.2zM258 12.1a5 5 0 1 1-2 0V0h2v12.1zm-64 208a5 5 0 1 1-2 0v-54.2a5 5 0 1 1 2 0v54.2zm48-198.2V80h62v2h-64V21.9a5 5 0 1 1 2 0zm16 16V64h46v2h-48V37.9a5 5 0 1 1 2 0zm-128 96V208h16v12.1a5 5 0 1 1-2 0V210h-16v-76.1a5 5 0 1 1 2 0zm-5.9-21.9a5 5 0 1 1 0 2H114v48H85.9a5 5 0 1 1 0-2H112v-48h12.1zm-6.2 130a5 5 0 1 1 0-2H176v-74.1a5 5 0 1 1 2 0V242h-60.1zm-16-64a5 5 0 1 1 0-2H114v48h10.1a5 5 0 1 1 0 2H112v-48h-10.1zM66 284.1a5 5 0 1 1-2 0V274H50v30h-2v-32h18v12.1zM236.1 176a5 5 0 1 1 0 2H226v94h48v32h-2v-30h-48v-98h12.1zm25.8-30a5 5 0 1 1 0-2H274v44.1a5 5 0 1 1-2 0V146h-10.1zm-64 96a5 5 0 1 1 0-2H208v-80h16v-14h-42.1a5 5 0 1 1 0-2H226v18h-16v80h-12.1zm86.2-210a5 5 0 1 1 0 2H272V0h2v32h10.1zM98 101.9V146H53.9a5 5 0 1 1 0-2H96v-42.1a5 5 0 1 1 2 0zM53.9 34a5 5 0 1 1 0-2H80V0h2v34H53.9zm60.1 3.9V66H82v64H69.9a5 5 0 1 1 0-2H80V64h32V37.9a5 5 0 1 1 2 0zM101.9 82a5 5 0 1 1 0-2H128V37.9a5 5 0 1 1 2 0V82h-28.1zm16-64a5 5 0 1 1 0-2H146v44.1a5 5 0 1 1-2 0V18h-26.1zm102.2 270a5 5 0 1 1 0 2H98v14h-2v-16h124.1zM242 149.9V160h16v34h-16v62h48v48h-2v-46h-48v-66h16v-30h-16v-12.1a5 5 0 1 1 2 0zM53.9 18a5 5 0 1 1 0-2H64V2H48V0h18v18H53.9zm112 32a5 5 0 1 1 0-2H192V0h50v2h-48v48h-28.1zm-48-48a5 5 0 0 1-9.8-2h2.07a3 3 0 1 0 5.66 0H178v34h-18V21.9a5 5 0 1 1 2 0V32h14V2h-58.1zm0 96a5 5 0 1 1 0-2H137l32-32h39V21.9a5 5 0 1 1 2 0V66h-40.17l-32 32H117.9zm28.1 90.1a5 5 0 1 1-2 0v-76.51L175.59 80H224V21.9a5 5 0 1 1 2 0V82h-49.59L146 112.41v75.69zm16 32a5 5 0 1 1-2 0v-99.51L184.59 96H300.1a5 5 0 0 1 3.9-3.9v2.07a3 3 0 0 0 0 5.66v2.07a5 5 0 0 1-3.9-3.9H185.41L162 121.41v98.69zm-144-64a5 5 0 1 1-2 0v-3.51l48-48V48h32V0h2v50H66v55.41l-48 48v2.69zM50 53.9v43.51l-48 48V208h26.1a5 5 0 1 1 0 2H0v-65.41l48-48V53.9a5 5 0 1 1 2 0zm-16 16V89.41l-34 34v-2.82l32-32V69.9a5 5 0 1 1 2 0zM12.1 32a5 5 0 1 1 0 2H9.41L0 43.41V40.6L8.59 32h3.51zm265.8 18a5 5 0 1 1 0-2h18.69l7.41-7.41v2.82L297.41 50H277.9zm-16 160a5 5 0 1 1 0-2H288v-71.41l16-16v2.82l-14 14V210h-28.1zm-208 32a5 5 0 1 1 0-2H64v-22.59L40.59 194H21.9a5 5 0 1 1 0-2H41.41L66 216.59V242H53.9zm150.2 14a5 5 0 1 1 0 2H96v-56.6L56.6 162H37.9a5 5 0 1 1 0-2h19.5L98 200.6V256h106.1zm-150.2 2a5 5 0 1 1 0-2H80v-46.59L48.59 178H21.9a5 5 0 1 1 0-2H49.41L82 208.59V258H53.9zM34 39.8v1.61L9.41 66H0v-2h8.59L32 40.59V0h2v39.8zM2 300.1a5 5 0 0 1 3.9 3.9H3.83A3 3 0 0 0 0 302.17V256h18v48h-2v-46H2v42.1zM34 241v63h-2v-62H0v-2h34v1zM17 18H0v-2h16V0h2v18h-1zm273-2h14v2h-16V0h2v16zm-32 273v15h-2v-14h-14v14h-2v-16h18v1zM0 92.1A5.02 5.02 0 0 1 6 97a5 5 0 0 1-6 4.9v-2.07a3 3 0 1 0 0-5.66V92.1zM80 272h2v32h-2v-32zm37.9 32h-2.07a3 3 0 0 0-5.66 0h-2.07a5 5 0 0 1 9.8 0zM5.9 0A5.02 5.02 0 0 1 0 5.9V3.83A3 3 0 0 0 3.83 0H5.9zm294.2 0h2.07A3 3 0 0 0 304 3.83V5.9a5 5 0 0 1-3.9-5.9zm3.9 300.1v2.07a3 3 0 0 0-1.83 1.83h-2.07a5 5 0 0 1 3.9-3.9zM97 100a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-48 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 96a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-144a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm96 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM49 36a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-32 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM33 68a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 240a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm80-176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 48a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm112 176a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm-16 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 180a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0 16a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm0-32a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16 0a3 3 0 1 0 0-6 3 3 0 0 0 0 6zM17 84a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm32 64a3 3 0 1 0 0-6 3 3 0 0 0 0 6zm16-16a3 3 0 1 0 0-6 3 3 0 0 0 0 6z'%3E%3C/path%3E%3C/svg%3E");
    }
    .backdrop {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: center;
      text-align: center;
      background: color-mix(in srgb, var(--background-color) 30%, transparent);
      backdrop-filter: blur(20px);
      -webkit-backdrop-filter: blur(20px);
      h2 {
        margin-top: 25px;
        font-size: clamp($text-2xl, 5vw, $text-4xl);
        font-weight: 900;
        line-height: 1.1;
        letter-spacing: 1.5px;
        max-width: 700px;
        background: linear-gradient(135deg, var(--text-color), var(--text-gradient-color));
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        filter: drop-shadow(0 4px 6px color-mix(in srgb, var(--alternate-color) 30%, transparent));
      }
    }
    @keyframes slideDownTitle {
      from {
        opacity: 0;
        transform: translateY(-30px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  }

  footer {
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 50px;
    overflow: hidden;
    .newsletter {
      padding: 25px 15px;
      display: flex;
      flex-direction: column;
      gap: 15px;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='100' height='100' viewBox='0 0 100 100'%3E%3Cg fill-rule='evenodd'%3E%3Cg fill='%23bf903d' fill-opacity='0.1'%3E%3Cpath opacity='.5' d='M96 95h4v1h-4v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4h-9v4h-1v-4H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15v-9H0v-1h15V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h9V0h1v15h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9h4v1h-4v9zm-1 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm9-10v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-10 0v-9h-9v9h9zm-9-10h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9zm10 0h9v-9h-9v9z'/%3E%3Cpath d='M6 5V0H5v5H0v1h5v94h1V6h94V5H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");

      .text {
        p {
          font-size: $text-lg;
          font-family: $alternate-font;
          opacity: 0.6;
        }
        h2 {
          font-size: $text-xl;
          font-family: $alternate-font;
          font-weight: 900;
        }
      }
      form {
        width: 100%;
        display: flex;
        flex-direction: column;
        gap: 15px;
        color: var(--alternate-color);
        backdrop-filter: blur(10px);
        overflow: hidden;
        input {
          padding: 12px 20px;
          width: 100%;
          background: color-mix(in srgb, var(--secondary-color) 80%, transparent);
          backdrop-filter: blur(10px);
          border-radius: 20px;
        }
        button {
          width: max-content;
          padding: 12px 50px;
          background: $accent-color;
          color: #fff;
          border-radius: 20px;
          transition: 0.3s;
          &:hover {
            box-shadow: inset 200px 0 var(--background-color),
              2px 2px 8px var(--background-color);
          }
        }
      }
    }
    .middle {
      padding: 0 15px;
      display: flex;
      flex-direction: column;
      gap: 50px;
      .brand {
        .logo {
          display: flex;
          align-items: center;
          gap: 25px;
          .image {
            width: 75px;
            height: 75px;
            img {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
          }
          h1 {
            font-size: $text-3xl;
            letter-spacing: 5px;
          }
        }
        h3 {
          margin-top: 25px;
          font-family: $alternate-font;
          color: $accent-color;
          font-size: $text-lg;
          font-weight: bold;
        }
        .socials {
          display: flex;
          gap: 25px;
          a {
            font-size: $text-lg;
            i {
              transition: 0.3s;
              &:hover {
                color: $accent-color;
                margin-left: 5px;
              }
            }
          }
        }
      }
      .links {
        display: flex;
        flex-direction: column;
        gap: 25px;
        .container {
          display: flex;
          flex-direction: column;
          gap: 5px;
          h3 {
            margin-bottom: 5px;
            font-size: $text-xl;
            color: $accent-color;
          }
          a {
            transition: 0.3s;
            &:hover {
              margin-left: 2.5px;
              color: $accent-color;
            }
          }
        }
      }
    }
    .textLoop {
      margin-top: 50px;
      width: 100%;
      min-height: max-content;
      textPath {
        font-family: $header-font;
        font-size: 200px;
        fill: url(#loopGradient);
      }
      @include respond-to(600px, 920px) {
        transform: translateY(100%);
        textpath {
          font-size: 150px;
        }
      }
      @include respond-to(921px, 1279px) {
        transform: translateY(75%);
        textpath {
          font-size: 125px;
        }
      }
      @include respond-to(1280px, 1599px) {
        transform: translateY(80%);
        textpath {
          font-size: 100px;
        }
      }
      @include respond-to($min: 1600px) {
        transform: translateY(80%);
        textpath {
          font-size: 80px;
        }
      }
      @media (min-height: 1200px) {
        margin: 75px 0 -50px 0;
        textpath {
          font-size: 150px;
        }
      }
    }
    .copyright {
      position: absolute;
      bottom: 10px;
      left: 50%;
      transform: translateX(-50%);
      width: 100%;
      text-align: center;
      font-family: $alternate-font;
    }
  }
}

/* Breakpoints */
@include respond-to(600px, 1023px) {
  #defaultLayout {
    header {
      height: 100px;
      padding: 0 50px;
    }
    .menu {
      padding: 125px 25px 50px 25px;
    }
    .pageTitle {
      height: 350px;
    }
    footer {
      gap: 100px;
      .newsletter {
        padding: 50px 25px;
        flex-direction: row;
        align-items: center;
        gap: 25px;
        .text {
          width: 50%;
          h2 {
            font-size: $text-2xl;
          }
        }
        form {
          width: 50%;
        }
      }
      .middle {
        padding: 0 25px;
        flex-direction: row;
        .brand {
          width: 50%;
        }
        .links {
          flex-direction: row;
          gap: 50px;
          .container {
            width: max-content;
          }
        }
      }
    }
  }
}

@include respond-to($min: 1024px) {
  #defaultLayout {
    header {
      height: 100px;
      padding: 0 75px;
      .logo {
        width: 20%;
      }
      .links {
        display: flex;
      }

      .right-actions {
        width: 20%;
        .desktop-only {
          display: flex;
        }
        .mobile-only {
          display: none;
        }
      }
    }
    .pageTitle {
      height: 400px;
    }
    footer {
      gap: 100px;
      .newsletter {
        padding: 50px;
        flex-direction: row;
        justify-content: space-between;
        align-items: center;
        .text {
          width: 40%;
          h2 {
            font-size: $text-3xl;
          }
        }
        form {
          width: 50%;
          max-width: 600px;
          flex-direction: row;
          background: color-mix(in srgb, var(--secondary-color) 80%, transparent);
          border-radius: 25px;
          input {            
            background: transparent;
          }
          button {
            margin: 5px;
            padding: 10px 50px;
          }
        }
      }
      .middle {
        padding: 0 50px;
        flex-direction: row;
        justify-content: space-between;
        .brand {
          width: 50%;
        }
        .links {
          margin-right: 100px;
          flex-direction: row;
          gap: 50px;
          .container {
            width: max-content;
          }
        }
      }
    }
  }
}
</style>

<style lang="scss">
/* Hamburger styling */
.icon-menu {
  --gap: 5px;
  --height-bar: 2.5px;
  --pos-y-bar-one: 0;
  --pos-y-bar-three: 0;
  --scale-bar: 1;
  --rotate-bar-one: 0;
  --rotate-bar-three: 0;
  width: 25px;
  display: flex;
  flex-direction: column;
  gap: var(--gap);
  cursor: pointer;
  position: relative;
}
.bar {
  position: relative;
  height: var(--height-bar);
  width: 100%;
  border-radius: 0.5rem;
  background-color: $accent-color;
}
.bar--1 {
  top: var(--pos-y-bar-one);
  transform: rotate(var(--rotate-bar-one));
  transition: top 200ms 100ms, transform 100ms;
}
.bar--2 {
  transform: scaleX(var(--scale-bar));
  transition: transform 150ms 100ms;
}
.bar--3 {
  bottom: var(--pos-y-bar-three);
  transform: rotate(var(--rotate-bar-three));
  transition: bottom 200ms 100ms, transform 100ms;
}
.check-icon:checked + .icon-menu > .bar--1 {
  transition: top 200ms, transform 200ms 100ms;
}
.check-icon:checked + .icon-menu > .bar--3 {
  transition: bottom 200ms, transform 200ms 100ms;
}
.check-icon:checked + .icon-menu {
  --pos-y-bar-one: calc(var(--gap) + var(--height-bar));
  --pos-y-bar-three: calc(var(--gap) + var(--height-bar));
  --scale-bar: 0;
  --rotate-bar-one: 45deg;
  --rotate-bar-three: -45deg;
}
</style>