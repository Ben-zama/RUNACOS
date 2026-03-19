<template>
  <div id="homePage">
    <!-- Hero Section -->
    <section class="hero" ref="heroRef">
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

      <!-- Hero Content -->
      <div class="content" ref="contentRef">
        <div class="pill" ref="pillRef">Welcome to Our Platform</div>
        <h1 ref="titleRef">
          Redeemer's University Association of Computing Students
        </h1>
        <p ref="descRef">
          The official website of redeemer's university faculty of computing and
          digital technologies
        </p>
        <div class="ctas" ref="ctasRef">
          <ctaButton buttonLabel="Student" to="/student" />
          <ctaButton buttonLabel="Alumni" to="/alumni" />
        </div>
      </div>

      <!-- Curved Text Loop -->
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
      <div ref="loopWrapperRef" class="loop-wrapper">
        <clientOnly>
          <CurvedLoop
            marquee-text="RUNACOS ✦ RUNACOS ✦"
            :speed="2"
            :curve-amount="-400"
            direction="left"
            :interactive="true"
            class="textLoop"
          />
        </clientOnly>
      </div>
    </section>

    <!-- About -->
    <section ref="aboutRef" class="about">
      <div ref="aboutPillRef" class="pill">About Us</div>
      <div class="info">
        <p ref="aboutInfoRef">
          The Redeemer's University Association of Computing Students (RUNACOS)
          is dedicated to fostering academic excellence, innovation, and
          community among computing students. Established to bridge the gap
          between theoretical knowledge and practical application, we provide a
          platform for growth and collaboration.
        </p>
      </div>
      <div class="statistics" ref="countUpTriggerRef">
        <div class="container" ref="countUpRef">
          <CountUp
            :from="0"
            :to="1500"
            separator=","
            direction="up"
            :duration="0.5"
            :delay="0"
            :start-when="startCounting"
            class="countUp"
          />
          <span>+</span>
          <p>Undergraduate students</p>
        </div>
        <div class="container" ref="countUpRef">
          <CountUp
            :from="0"
            :to="500"
            separator=","
            direction="up"
            :duration="0.5"
            :delay="0"
            :start-when="startCounting"
            class="countUp"
          />
          <span>+</span>
          <p>Active alumni</p>
        </div>
        <div class="container" ref="countUpRef">
          <CountUp
            :from="0"
            :to="50"
            separator=","
            direction="up"
            :duration="0.5"
            :delay="0"
            :start-when="startCounting"
            class="countUp"
          />
          <span>%</span>
          <p>First class graduates</p>
        </div>
      </div>
      <ctaButton
        ref="aboutBtnRef"
        button-label="See more about us"
        link="/about"
      />
    </section>

    <!-- Executives -->
    <section class="executives" ref="executivesRef">
      <div class="pill" ref="executivesPillRef">Staffs & Executives</div>

      <h2 ref="executivesTitleRef">
        Meet the faculty's Staff and student executives
      </h2>

      <div class="container" ref="executivesContainerRef">
        <Carousel :items="team" />
      </div>
    </section>

    <!-- Gallery -->
    <section class="gallery" ref="galleryRef">
      <div class="pill" ref="galleryPillRef">Gallery</div>
      <h2 ref="galleryTitleRef">Explore the RUNACOS gallery</h2>
      <div class="container" ref="galleryContainerRef">
        <ClientOnly>
          <vue3Marquee :duration="20" :clone="true">
            <div
              v-for="(img, index) in images"
              :key="index"
              class="imageWrapper"
            >
              <img :src="img" />
            </div>
          </vue3Marquee>
        </ClientOnly>
        <ClientOnly>
          <vue3Marquee :duration="20" :clone="true" direction="reverse">
            <div
              v-for="(img, index) in images"
              :key="index"
              class="imageWrapper"
            >
              <img :src="img" />
            </div>
          </vue3Marquee>
        </ClientOnly>
      </div>
    </section>

    <!-- Blogs -->
   <section class="blogs" ref="blogsRef">
      <div class="pill" ref="blogsPillRef">Blogs</div>
      <h2 ref="blogsTitleRef">Latest blogs from staff, student and alumni</h2>
      <div class="container" ref="blogsContainerRef">
        <BlogCard 
          v-for="post in posts" 
          :key="post.id"
          :to="post.link"
          :imageSrc="post.image"
          :tags="post.tags"
          :title="post.title"
          :description="post.description"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useIntersectionObserver } from "@vueuse/core";

gsap.registerPlugin(ScrollTrigger);

// Hero section refs
const heroRef = ref(null);
const contentRef = ref(null);
const pillRef = ref(null);
const titleRef = ref(null);
const descRef = ref(null);
const ctasRef = ref(null);
const loopWrapperRef = ref(null);

// About section refs
const aboutRef = ref(null);
const aboutPillRef = ref(null);
const aboutInfoRef = ref(null);
const countUpRef = ref(null);
const aboutBtnRef = ref(null);
const countUpTriggerRef = ref(null);
const startCounting = ref(false);

// Executives Refs
const executivesRef = ref(null);
const executivesPillRef = ref(null);
const executivesTitleRef = ref(null);
const executivesContainerRef = ref(null);

// Gallery Refs
const galleryRef = ref(null);
const galleryPillRef = ref(null);
const galleryTitleRef = ref(null);
const galleryContainerRef = ref(null);

// Blog Refs
const blogsRef = ref(null);
const blogsPillRef = ref(null);
const blogsTitleRef = ref(null);
const blogsContainerRef = ref(null);

const images = ref([
  "https://placehold.co/600x400",
  "https://placehold.co/600x400",
  "https://placehold.co/600x400",
  "https://placehold.co/600x400",
  "https://placehold.co/600x400",
  "https://placehold.co/600x400",
]);

const team = ref([
  {
    id: 1,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#d91f26",
    image: "https://placehold.co/400x600/transparent/white?text=Person+1",
  },
  {
    id: 2,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#182b3a",
    image: "https://placehold.co/400x600/transparent/white?text=Person+2",
  },
  {
    id: 3,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#111111",
    image: "https://placehold.co/400x600/transparent/white?text=Person+3",
  },
  {
    id: 4,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#d97b1f",
    image: "https://placehold.co/400x600/transparent/white?text=Person+4",
  },
  {
    id: 5,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#e0e0e0",
    image: "https://placehold.co/400x600/transparent/333?text=Person+5",
  },
  {
    id: 6,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#e0e0e0",
    image: "https://placehold.co/400x600/transparent/333?text=Person+6",
  },
  {
    id: 7,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#e0e0e0",
    image: "https://placehold.co/400x600/transparent/333?text=Person+7",
  },
  {
    id: 8,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#e0e0e0",
    image: "https://placehold.co/400x600/transparent/333?text=Person+8",
  },
  {
    id: 9,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#e0e0e0",
    image: "https://placehold.co/400x600/transparent/333?text=Person+9",
  },
  {
    id: 10,
    name: "Angelina Smith",
    role: "President",
    badge: "Staff",
    bgColor: "#e0e0e0",
    image: "https://placehold.co/400x600/transparent/333?text=Person+10",
  },
]);

const posts = [
  {
    id: 1,
    link: '/blog/scaling-financial-services',
    image: 'sample.jpg',
    tags: ['Customer Stories', 'AI', 'Growth'],
    title: 'Scaling Financial Services Personalization for $100Bn+ Enterprise',
    description: 'Coframe Drives over 26% Lift in Financial Services'
  },
  {
    id: 2,
    link: '/blog/next-post',
    image: 'sample.jpg',
    tags: ['Engineering', 'Vue3'],
    title: 'How we built a reusable component system',
    description: 'A deep dive into Nuxt 3 architectures.'
  },
  {
    id: 3,
    link: '/blog/next-post',
    image: 'sample.jpg',
    tags: ['Engineering', 'Vue3'],
    title: 'How we built a reusable component system',
    description: 'A deep dive into Nuxt 3 architectures.'
  }
]

let heroTl;
let aboutTl;
let executivesTl;
let galleryTl;
let blogsTl;

onMounted(() => {
  // Hero animations
  const textElements = [
    pillRef.value,
    titleRef.value,
    descRef.value,
    ctasRef.value,
  ];
  gsap.set(heroRef.value, {
    clipPath: "polygon(0% 50%, 100% 50%, 100% 50%, 0% 50%)",
  });
  gsap.set(contentRef.value, { perspective: 1000 });
  gsap.set(textElements, {
    y: 120,
    rotationX: -80,
    rotationZ: -5,
    opacity: 0,
    transformOrigin: "50% 100%",
  });
  gsap.set(loopWrapperRef.value, {
    y: 200,
    rotationZ: 15,
    opacity: 0,
  });
  heroTl = gsap.timeline();
  heroTl
    .to(heroRef.value, {
      clipPath: "polygon(0% 0%, 100% 0%, 100% 100%, 0% 100%)",
      duration: 1.2,
      ease: "expo.inOut",
    })
    // Animate texts
    .to(
      textElements,
      {
        y: 0,
        rotationX: 0,
        rotationZ: 0,
        opacity: 1,
        duration: 1.2,
        stagger: 0.15,
        ease: "back.out(1.5)",
      },
      "-=0.6"
    )
    // Animate curved text
    .to(
      loopWrapperRef.value,
      {
        y: 0,
        rotationZ: 0,
        opacity: 1,
        duration: 1.8,
        ease: "elastic.out(1, 0.6)",
      },
      "-=1.2"
    );

  //About animations
  if (aboutInfoRef.value) {
    const text = aboutInfoRef.value.innerText;
    const words = text.split(" ");
    aboutInfoRef.value.innerHTML = "";

    words.forEach((word) => {
      const span = document.createElement("span");
      span.innerText = word + "\u00A0";
      span.style.display = "inline-block";
      span.style.opacity = "0.15";
      span.classList.add("reveal-word");
      aboutInfoRef.value.appendChild(span);
    });

    aboutTl = gsap.timeline({
      scrollTrigger: {
        trigger: aboutRef.value,
        start: "top 75%",
        toggleActions: "play none none reverse",
      },
    });
    aboutTl
      .from(aboutPillRef.value, {
        y: 30,
        opacity: 0,
        duration: 0.6,
        ease: "power2.out",
      })
      .from(
        aboutInfoRef.value.querySelectorAll(".reveal-word"),
        {
          y: 20,
          opacity: 0,
          duration: 0.4,
          stagger: 0.03,
          ease: "power2.out",
        },
        "-=0.3"
      )
      .from(
        countUpRef.value,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.2"
      )
      .from(
        aboutBtnRef.value?.$el,
        {
          y: 30,
          opacity: 0,
          duration: 0.6,
          ease: "power2.out",
        },
        "-=0.4"
      );
    gsap.to(aboutInfoRef.value.querySelectorAll(".reveal-word"), {
      opacity: 1,
      stagger: 0.1,
      ease: "none",
      scrollTrigger: {
        trigger: aboutInfoRef.value,
        start: "top 85%",
        end: "bottom 55%",
        scrub: 0.5,
      },
    });
  }

  // Executive animation
  executivesTl = gsap.timeline({
    scrollTrigger: {
      trigger: executivesRef.value,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });

  executivesTl
    .from(executivesPillRef.value, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    })
    .from(
      executivesTitleRef.value,
      { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .from(
      executivesContainerRef.value,
      { y: 50, opacity: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

  // Gallery animations
  galleryTl = gsap.timeline({
    scrollTrigger: {
      trigger: galleryRef.value,
      start: "top 75%",
      toggleActions: "play none none reverse",
    },
  });
  galleryTl
    .from(galleryPillRef.value, {
      y: 30,
      opacity: 0,
      duration: 0.6,
      ease: "power2.out",
    })
    .from(
      galleryTitleRef.value,
      { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .from(
      galleryContainerRef.value,
      { y: 50, opacity: 0, duration: 0.8, ease: "power2.out" },
      "-=0.4"
    );

    //Blogs animations
    blogsTl = gsap.timeline({
  scrollTrigger: {
    trigger: blogsRef.value,
    start: "top 75%",
    toggleActions: "play none none reverse",
  },
});

blogsTl
  .from(blogsPillRef.value, {
    y: 30,
    opacity: 0,
    duration: 0.6,
    ease: "power2.out",
  })
    .from(
      blogsTitleRef.value,
      { y: 30, opacity: 0, duration: 0.6, ease: "power2.out" },
      "-=0.4"
    )
    .from(
      // Target the children (the BlogCards) for a staggered entrance
      blogsContainerRef.value.children,
      { 
        y: 50, 
        opacity: 0, 
        duration: 0.8, 
        stagger: 0.15, // Cascades the animation across the cards
        ease: "power2.out" 
      },
      "-=0.4"
    );
});

onUnmounted(() => {
  if (heroTl) heroTl.kill();
  if (aboutTl) aboutTl.kill();
  if (executivesTl) executivesTl.kill();
  if (galleryTl) galleryTl.kill();
  if (blogsTl) blogsTl.kill();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());
});

// Countup intersection observer
const { stop } = useIntersectionObserver(
  countUpTriggerRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      startCounting.value = true;
      stop();
    }
  },
  {
    threshold: 0.1,
  }
);
</script>

<style lang="scss">
#homePage {
  .hero {
    position: relative;
    width: 100%;
    height: 100dvh;
    min-height: 600px;
    max-height: 900px;
    overflow: hidden;

    // content
    .content {
      position: absolute;
      top: 0;
      left: 0;
      padding: 0 15px;
      width: 100%;
      height: 100%;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      text-align: center;
      gap: 15px;
      background: $translucent-background-color;
      backdrop-filter: blur(5px);
      .pill {
        margin-top: -50px;
        background: $translucent-secondary-color;
        backdrop-filter: blur(6px);
        padding: 6px 20px;
        border-radius: 30px;
        color: $text-color;
        font-family: $alternate-font;
        font-size: $text-sm;
        font-weight: 600;
      }
      h1 {
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
        @include respond-to($min: "lg") {
          max-width: 900px;
        }
      }
      p {
        line-height: 1.5;
        max-width: 600px;
        opacity: 0.9;
      }
      .ctas {
        display: flex;
        gap: 15px;
      }
    }

    // curved text
    .loop-wrapper {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;

      @include respond-to(600px, 1023px) {
        bottom: -10%;
      }
      @include respond-to(1024px, 1279px) {
        bottom: -20%;
      }
      @include respond-to($min: 1280px) {
        bottom: -30%;
      }
    }

    .textLoop {
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      min-height: max-content;
      textPath {
        font-family: $header-font;
        font-size: 200px;
        fill: url(#loopGradient);
      }
      @include respond-to(600px, 1023px) {
        bottom: -10%;
        textpath {
          font-size: 125px;
        }
      }
      @include respond-to(1024px, 1279px) {
        bottom: -20%;
        textpath {
          font-size: 125px;
        }
      }
      @include respond-to($min: 1280px) {
        bottom: -30%;
        textpath {
          font-size: 100px;
        }
      }
    }
  }

  // About section
  .about {
    padding: 50px 15px;
    display: flex;
    flex-direction: column;
    gap: 25px;
    .pill {
      width: max-content;
      background: $translucent-secondary-color-50;
      backdrop-filter: blur(15px);
      padding: 6px 20px;
      border-radius: 30px;
      color: $accent-color;
      font-family: $alternate-font;
      font-size: $text-sm;
      font-weight: 600;
    }
    .info {
      font-family: $alternate-font;
      font-size: $text-lg;
    }
    .statistics {
      display: flex;
      flex-direction: column;
      gap: 15px;
      .container {
        .countUp {
          font-family: $alternate-font;
          font-size: $text-2xl;
          + span {
            margin-left: 2px;
            font-family: $alternate-font;
            font-size: $text-2xl;
            color: $accent-color;
          }
        }
      }
    }
    .button {
      width: max-content;
    }
  }

  // Executives
  .executives {
    padding: 25px 15px;
    background: $secondary-color;
    color: $background-color;
    display: flex;
    flex-direction: column;
    gap: 15px;
    .pill {
      width: max-content;
      background: $translucent-background-color-50;
      backdrop-filter: blur(15px);
      padding: 6px 20px;
      border-radius: 30px;
      color: $alternate-color;
      font-family: $alternate-font;
      font-size: $text-sm;
      font-weight: 600;
    }
    h2 {
      font-size: $text-2xl;
      font-weight: 900;
      letter-spacing: 1px;
      background: linear-gradient(135deg, $background-color, #3a3a3a);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .container {
      width: 100%;
    }
  }

  // Gallery
  .gallery {
    padding: 50px 0;
    overflow: hidden;
    .pill {
      margin: 0 15px;
      width: max-content;
      background: $translucent-secondary-color-50;
      backdrop-filter: blur(15px);
      padding: 6px 20px;
      border-radius: 30px;
      color: $accent-color;
      font-family: $alternate-font;
      font-size: $text-sm;
      font-weight: 600;
    }
    h2 {
      margin: 15px;
      font-size: $text-2xl;
      font-weight: 900;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #fff, #c1c0c0);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .container {
      min-width: 105%;
      margin-top: 50px;
      transform: rotate(-1deg) translateX(-5px);
      display: flex;
      flex-direction: column;
      gap: 10px;
      > * {
        background: transparent;
      }
      .imageWrapper {
        margin-right: 10px;
        height: 150px;
        width: auto;
        border-radius: 16px;
        overflow: hidden;
        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }
      }
    }
  }

  // Blogs
  .blogs {
    padding: 25px 15px;
    display: flex;
    flex-direction: column;
    gap: 15px;
    background: $alternate-color;

    .pill {
      width: max-content;
      background: $translucent-secondary-color-50;
      backdrop-filter: blur(15px);
      padding: 6px 20px;
      border-radius: 30px;
      color: $accent-color;
      font-family: $alternate-font;
      font-size: $text-sm;
      font-weight: 600;
    }
    h2 {
      font-size: $text-2xl;
      font-weight: 900;
      letter-spacing: 1px;
      background: linear-gradient(135deg, #fff, #c1c0c0);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .container {
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 50px;
    }
  }

  @include respond-to(600px, 1023px) {
    // About section
    .about {
      padding: 75px 50px;
      .info {
        font-size: $text-xl;
      }
      .statistics {
        flex-direction: row;
        .container {
          width: calc(100% / 3);
          .countUp {
            font-size: $text-3xl;
          }
        }
      }
    }

    // Executives
    .executives {
      padding: 50px;
      h2 {
        font-size: $text-3xl;
      }
      .container {
        margin: 0;
      }
    }

    // Gallery
    .gallery {
      .pill {
        margin: 0 50px;
      }
      h2 {
        margin: 0 50px;
        font-size: $text-3xl;
      }
      .container {
        .imageWrapper {
          height: 200px;
        }
      }
    }

    //Blogs 
    .blogs {
      padding: 75px 50px;
      h2 {
        font-size: $text-3xl;
      }
      .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
      }
    }
  }

  @include respond-to($min: 1024px) {
    // About section
    .about {
      padding: 75px;
      align-items: center;
      .info {
        max-width: 1000px;
        font-size: $text-2xl;
        text-align: center;
      }
      .statistics {
        max-width: 1000px;
        flex-direction: row;
        gap: 50px;
        .container {
          width: max-content;
          .countUp {
            font-size: $text-4xl;
            + span {
              font-size: $text-3xl;
            }
          }
        }
      }
    }

    // Executive
    .executives {
      padding: 75px;
      h2 {
        font-size: $text-4xl;
      }
      .container {
        margin-top: 25px;
      }
    }

    // Gallery
    .gallery {
      .pill {
        margin: 0 75px;
      }
      h2 {
        margin: 0 75px;
        font-size: $text-4xl;
      }
      .container {
        .imageWrapper {
          height: 250px;
        }
      }
    }

    // Blogs
    .blogs {
      padding: 75px;
      h2 {
        font-size: $text-4xl;
      }
      .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
      }
    }
  }
}
</style>