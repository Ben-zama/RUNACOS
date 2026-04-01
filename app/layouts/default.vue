<template>
  <div id="defaultLayout">
    <div class="page-loader" :class="{ 'is-loaded': !isLoading }">
      <div class="loader">
        <div class="logo">
          <img src="~/assets/logo.png" alt="">
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

      <div class="hamburger">
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

      <div class="cta">
        <ctaButton button-label="Sign In" />
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
    </div>

    <div v-if="showPageTitle" class="pageTitle" :key="route.path">
      <ClientOnly>
        <ColorBends
          :rotation="0"
          :speed="0.2"
          transparent
          :autoRotate="0"
          :scale="1"
          :frequency="1"
          :warpStrength="1"
          :mouseInfluence="0"
          :parallax="0.5"
          :noise="0.5"
        />
      </ClientOnly>
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
            <a href="#">
              <i class="bi bi-linkedin"></i>
            </a>
            <a href="#">
              <i class="bi bi-twitter-x"></i>
            </a>
            <a href="#">
              <i class="bi bi-instagram"></i>
            </a>
            <a href="#">
              <i class="bi-tiktok"></i>
            </a>
          </div>
        </div>

        <div class="links">
          <div class="container">
            <h3>Navigation</h3>
            <NuxtLink to="/">Home</NuxtLink>
            <NuxtLink to="/">About</NuxtLink>
            <NuxtLink to="/">News & Events</NuxtLink>
            <NuxtLink to="/">Contact</NuxtLink>
          </div>
          <div class="container">
            <h3>Quick Links</h3>
            <NuxtLink to="/">Student Portal</NuxtLink>
            <NuxtLink to="/">Alumni Portal</NuxtLink>
            <NuxtLink to="/">Report Faults</NuxtLink>
            <NuxtLink to="/">Something Else</NuxtLink>
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
            <stop offset="0%" stop-color="#ffffff" />
            <stop offset="50%" stop-color="#c1c0c0" />
            <stop offset="100%" stop-color="#6a6a6a" />
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
import { useRoute, useNuxtApp } from "#imports";

const route = useRoute();
const nuxtApp = useNuxtApp();

const dynamicPageTitle = computed(() => route.meta.pageTitle || '');

const props = defineProps({
  showPageTitle: {
    type: Boolean,
    default: true
  }, 
})

const isMenuOpen = ref(false);
const headerRef = ref(null);
const isScrolled = ref(false);

// Loader State
const isLoading = ref(true);

// Hook into Nuxt routing to show/hide loader on page change
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
  
  // Hide loader on initial mount if the document is already complete
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
#defaultLayout {
  /* Page Loader */
  .page-loader {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: $translucent-background-color-50;
  backdrop-filter: blur(50px);
  -webkit-backdrop-filter: blur(50px);
  z-index: 9999;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: opacity 0.5s ease, visibility 0.5s ease;
  overflow: hidden; // Important: Prevents the large slider from causing scrollbars

  &.is-loaded {
    opacity: 0;
    visibility: hidden;
  }

  .logo {
    position: relative;
    width: 250px;
    height: 250px;

    img {
      width: 100%;
      height: 100%;
      object-fit: contain;
      position: relative;
      z-index: 1;
    }
  }

  // The Full-Screen Glass Slider
  &::after {
    content: "";
    position: absolute;
    // Oversize it so the rotated edges don't show on screen
    top: -100%;
    left: -100%;
    width: 300%; 
    height: 30vh; // Thickness of the glass pane
    z-index: 2;
    pointer-events: none; // Ensures the slider doesn't accidentally intercept clicks
    
    // The visual "glass" gradient
    background: linear-gradient(
      to bottom,
      rgba(255, 255, 255, 0) 0%,
      $translucent-secondary-color 50%,
      rgba(255, 255, 255, 0) 100%
    );

    // Animate the sweep across the entire screen
    animation: glass-slide-fullscreen 2s cubic-bezier(0.4, 0, 0.2, 1) infinite;
  }
}

// Keyframes for the full-screen diagonal sweep
@keyframes glass-slide-fullscreen {
  0% {
    transform: rotate(45deg) translateY(-150vh);
  }
  100% {
    transform: rotate(45deg) translateY(150vh);
  }
}

  /* Header */
  header {
    position: absolute;
    top: 0;
    width: 100%;
    height: 75px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    z-index: 10;
    transition: background-color 0.3s ease;

    &.scrolled {
      position: fixed;
      background: $translucent-secondary-color;
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
      width: 25%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      a {
        width: 50%;
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
        &:hover, &.router-link-exact-active {
          color: $accent-color;
        }
      }
    }

    .hamburger {
      width: 25%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
    }

    .cta {
      width: 25%;
      display: none;
    }
  }

  // Mobile menu
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
    background: $translucent-alternate-color;
    backdrop-filter: blur(50px);
    -webkit-backdrop-filter: blur(50px);
    z-index: 5;
    border: solid $translucent-secondary-color-50;
    border-width: 0 0 1px 0;
    border-radius: 0 0 30px 30px;
    transition: 0.3s;
    overflow-y: scroll;
    &.open {
      top: 0;
    }
    hr {
      border-color: $translucent-secondary-color-50;
    }
    a {
      font-family: $alternate-font;
      font-size: $text-lg;
      font-weight: bold;
      &:hover, &.router-link-exact-active {
        color: $accent-color;
      }
    }
    @include respond-to($min: 600px) {
      border-radius: 0 0 0 30px;
      border-width: 0 0 1px 1px;
    }
  }

  // Page Title
  .pageTitle {
    position: relative;
    width: 100%;
    height: 250px;
    animation: slideDownTitle 3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
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
      background: $translucent-background-color;
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
      h2 {
        margin-top: 25px;
        font-size: clamp($text-2xl, 5vw, $text-4xl);
        font-weight: 900;
        line-height: 1.1;
        max-width: 700px;
        background: linear-gradient(135deg, #fff, #c1c0c0);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.3));
      }
    }
    @keyframes slideDownTitle {
      from {
        opacity: 0;
        transform: translateY(-30px); // Starts slightly higher
      }
      to {
        opacity: 1;
        transform: translateY(0); // Rests in normal position
      }
    }
  }

  /* Footer */
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
      background-image: linear-gradient(
          0deg,
          transparent 24%,
          $translucent-secondary-color 25%,
          $translucent-secondary-color 26%,
          transparent 27%,
          transparent 74%,
          $translucent-secondary-color 75%,
          $translucent-secondary-color 76%,
          transparent 77%,
          transparent
        ),
        linear-gradient(
          90deg,
          transparent 24%,
          $translucent-secondary-color 25%,
          $translucent-secondary-color 26%,
          transparent 27%,
          transparent 74%,
          $translucent-secondary-color 75%,
          $translucent-secondary-color 76%,
          transparent 77%,
          transparent
        );
      background-size: 55px 55px;

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
        color: $alternate-color;
        overflow: hidden;
        input {
          padding: 12px 20px;
          width: 100%;
          background: $secondary-color;
          border-radius: 20px;
        }
        button {
          width: max-content;
          padding: 12px 50px;
          background: $accent-color;
          color: $text-color;
          border-radius: 20px;
          transition: 0.3s;
          &:hover {
            box-shadow: inset 200px 0 $background-color,
              2px 2px 8px $background-color;
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

@include respond-to(600px, 1023px) {
  #defaultLayout {
    header {
      height: 100px;
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
      .links {
        display: flex;
      }
      .hamburger {
        display: none;
      }
      .cta {
        display: flex;
        justify-content: center;
        align-items: center;
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
          background: $secondary-color;
          border-radius: 25px;
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