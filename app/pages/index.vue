<template>
  <div id="homePage">
    <section class="hero" ref="heroRef">
      <div class="gradient-sphere sphere-1"></div>
      <div class="gradient-sphere sphere-2"></div>
      <div class="noise"></div>
      <div class="grid-overlay"></div>

      <canvas ref="canvasRef" id="particle-canvas"></canvas>

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
          <ctaButton buttonLabel="Student" to="/academics" />
          <ctaButton buttonLabel="Alumni" to="/alumni" />
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
      <div ref="loopWrapperRef" class="loop-wrapper">
        <clientOnly>
          <CurvedLoop
            marquee-text="RUNACOS ✦ RUNACOS ✦"
            :speed="2"
            :curve-amount="400"
            direction="left"
            :interactive="true"
            class="textLoop"
          />
        </clientOnly>
      </div>
    </section>

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

    <section class="executives" ref="executivesRef">
      <div class="pill" ref="executivesPillRef">Staffs & Executives</div>

      <h2 ref="executivesTitleRef">
        Meet the faculty's Staff and student executives
      </h2>

      <div class="container" ref="executivesContainerRef">
        <TeamCarousel :items="team" />
      </div>
    </section>

    <section class="gallery" ref="galleryRef">
      <div class="pill" ref="galleryPillRef">Gallery</div>
      <h2 ref="galleryTitleRef">Explore the RUNACOS gallery</h2>
      <div class="container" ref="galleryContainerRef">
        <ClientOnly>
          <vue3Marquee :duration="50" :clone="true" :pause-on-hover="true">
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
          <vue3Marquee
            :duration="50"
            :clone="true"
            :pause-on-hover="true"
            direction="reverse"
          >
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

    <section class="blogs" ref="blogsRef">
      <div class="pill" ref="blogsPillRef">Blogs</div>
      <h2 ref="blogsTitleRef">Latest blogs from staff, student and alumni</h2>
      <div class="container" ref="blogsContainerRef">
        <BlogCard
          v-for="post in postsStore.posts"
          :key="post.id || post._id"
          :to="`/posts/${post.id || post._id}`"
          :imageSrc="
            post.fileUrl ||
            'https://placehold.co/600x400/151515/8a8a93?text=Update'
          "
          :tags="['Faculty Update']"
          :title="post.title"
          :description="post.content"
          :author="post.authorName"
          :date="formatDate(post.createdAt)"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
definePageMeta({
  layout: {
    props: {
      showPageTitle: false,
    },
  },
});

useHead({
  title: "RUNACOS",
});

import { ref, onMounted, onUnmounted } from "vue";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";
import { useIntersectionObserver } from "@vueuse/core";

gsap.registerPlugin(ScrollTrigger);

import { usePostsStore } from "~/stores/usePostsStore";
const postsStore = usePostsStore();

// Hero section refs
const heroRef = ref(null);
const contentRef = ref(null);
const pillRef = ref(null);
const titleRef = ref(null);
const descRef = ref(null);
const ctasRef = ref(null);
const loopWrapperRef = ref(null);
const canvasRef = ref(null); // Added for Particle Canvas

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
  "/gallery/image1.webp",
  "/gallery/image2.webp",
  "/gallery/image3.webp",
  "/gallery/image4.webp",
  "/gallery/image5.webp",
  "/gallery/image6.webp",
  "/gallery/image7.webp",
  "/gallery/image8.webp",
  "/gallery/image9.webp",
  "/gallery/image10.webp",
]);

const team = ref([
  {
    id: 1,
    name: "Adebiyi Oluwademilade",
    role: "President",
    badge: "executive",
    image: "/executives/president.webp",
  },
  {
    id: 2,
    name: "Favour James",
    role: "Vice President",
    badge: "executive",
    image: "/executives/vice_president.webp",
  },
  {
    id: 3,
    name: "Omobobola Afolabi Ige",
    role: "General Secretary",
    badge: "executive",
    image: "/executives/general_secretary.webp",
  },
  {
    id: 4,
    name: "Sijuade Deborah",
    role: "Assistant General Secretary",
    badge: "executive",
    image: "/executives/ass_general_secretary.webp",
  },
  {
    id: 5,
    name: "Akosshile Marvelous",
    role: "Financial Secretary",
    badge: "executive",
    image: "/executives/financial_secretary.webp",
  },
  {
    id: 6,
    name: "Ikeoluwa Ajayi",
    role: "Treasurer",
    badge: "executive",
    image: "/executives/treasurer.webp",
  },
  {
    id: 7,
    name: "Akwari Ifeanyi Jonah",
    role: "Social Director",
    badge: "executive",
    image: "/executives/social_director.webp",
  },
  {
    id: 8,
    name: "Ogunsesan Daniel",
    role: "Assistant Social Director",
    badge: "executive",
    image: "/executives/ass_social_director.webp",
  },
  {
    id: 9,
    name: "Soloye Oluwaferanmi",
    role: "Sport Director",
    badge: "executive",
    image: "/executives/sport_director.webp",
  },
  {
    id: 10,
    name: "Oso Daniel Ifedayo",
    role: "Public Relations Officer",
    badge: "executive",
    image: "/executives/public_relations_officer.webp",
  },
  {
    id: 11,
    name: "Onuoha Isaac Ebube",
    role: "Assistant Public Relations Officer",
    badge: "executive",
    image: "/executives/ass_public_relations_officer.webp",
  },
  {
    id: 12,
    name: "Ihedoro Chisom",
    role: "Welfare Director",
    badge: "executive",
    image: "/executives/welfare_director.webp",
  },
  {
    id: 13,
    name: "Ojo Oreoluwa",
    role: "Assistant Welfare Director",
    badge: "executive",
    image: "/executives/ass_welfare_director.webp",
  },
  {
    id: 14,
    name: "Olopade Oreoluwa",
    role: "ICT Director",
    badge: "executive",
    image: "/executives/ict_director.webp",
  },
  {
    id: 15,
    name: "Peter Godbless",
    role: "Academic Officer",
    badge: "executive",
    image: "/executives/academic_officer.webp",
  },
  {
    id: 16,
    name: "Shekinah Adekoya",
    role: "Academic Officer II",
    badge: "executive",
    image: "/executives/academic_officer_2.webp",
  },
]);

let heroTl;
let aboutTl;
let executivesTl;
let galleryTl;
let blogsTl;
let animationFrameId; // Track animation frame for cleanup
let handleResize; // Track resize listener for cleanup

onMounted(() => {
  // --- Particle Canvas Setup ---
  const canvas = canvasRef.value;
  if (canvas) {
    const ctx = canvas.getContext("2d");

    handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = heroRef.value?.offsetHeight || window.innerHeight;
    };
    window.addEventListener("resize", handleResize);
    handleResize();

    let particlesArray = [];

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2;
        this.speedX = Math.random() * 0.5 - 0.25;
        this.speedY = Math.random() * 0.5 - 0.25;
        this.opacity = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.speedX;
        this.y += this.speedY;
        if (this.x < 0) this.x = canvas.width;
        if (this.x > canvas.width) this.x = 0;
        if (this.y < 0) this.y = canvas.height;
        if (this.y > canvas.height) this.y = 0;
      }
      draw() {
        ctx.fillStyle = `rgba(255, 255, 255, ${this.opacity})`;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    function initParticles() {
      particlesArray = [];
      let numberOfParticles = (canvas.width * canvas.height) / 9000;
      for (let i = 0; i < numberOfParticles; i++) {
        particlesArray.push(new Particle());
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      for (let i = 0; i < particlesArray.length; i++) {
        particlesArray[i].update();
        particlesArray[i].draw();
      }
      animationFrameId = requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
  }

  // --- Hero animations ---
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

  // --- About animations ---
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

  // --- Executive animation ---
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

  // --- Gallery animations ---
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

  // --- Blogs animations ---
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
    .fromTo(
      blogsContainerRef.value.children,
      {
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      },
      {
        y: 0,
        opacity: 1,
      },
      "-=0.4"
    );

  postsStore.fetchPosts();
});

onUnmounted(() => {
  if (heroTl) heroTl.kill();
  if (aboutTl) aboutTl.kill();
  if (executivesTl) executivesTl.kill();
  if (galleryTl) galleryTl.kill();
  if (blogsTl) blogsTl.kill();
  ScrollTrigger.getAll().forEach((trigger) => trigger.kill());

  // Clean up canvas event listeners & animation frame
  if (animationFrameId) cancelAnimationFrame(animationFrameId);
  if (handleResize) window.removeEventListener("resize", handleResize);
});

const formatDate = (dateStr) => {
  if (!dateStr) return "TBA";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

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
    max-height: 1000px;
    overflow: hidden;
    background-color: var(--background-color);

    /* Background Gradient Spheres */
    .gradient-sphere {
      position: absolute;
      border-radius: 50%;
      filter: blur(100px);
      z-index: 0;
      opacity: 0.6;
      pointer-events: none; /* Prevents spheres from blocking clicks */
    }

    .sphere-1 {
      width: 40vw;
      height: 40vw;
      background: linear-gradient(
        40deg,
        var(--text-color),
        color-mix(in srgb, var(--text-color) 50%, transparent)
      );
      top: -10%;
      left: -10%;
      animation: float-1 5s ease-in-out infinite alternate;
    }

    .sphere-2 {
      width: 45vw;
      height: 45vw;
      background: linear-gradient(
        240deg,
        rgba(72, 0, 255, 0.8),
        rgba(0, 183, 255, 0.4)
      );
      bottom: -20%;
      right: -10%;
      animation: float-2 8s ease-in-out infinite alternate;
    }

    .noise {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.05;
      z-index: 5;
      background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E");
    }

    .grid-overlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-size: 40px 40px;
      background-image: linear-gradient(
          to right,
          color-mix(in srgb, var(--text-color) 5%, transparent) 1px,
          transparent 1px
        ),
        linear-gradient(
          to bottom,
          color-mix(in srgb, var(--text-color) 5%, transparent) 1px,
          transparent 1px
        );
      z-index: 1;
    }

    /* Particle Canvas */
    #particle-canvas {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      z-index: 1;
      pointer-events: none;
    }

    /* Content wrapper needs to sit on top of the canvas and spheres */
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
      z-index: 2;
/*       background: color-mix(in srgb, var(--background-color) 10%, transparent);
      backdrop-filter: blur(1px); */

      .pill {
        width: max-content;
        background: color-mix(in srgb, var(--secondary-color) 80%, transparent);
        backdrop-filter: blur(50px);
        padding: 6px 20px;
        border-radius: 30px;
        color: var(--alternate-color);
        font-family: $alternate-font;
        font-size: $text-sm;
        font-weight: 700;
      }
      h1 {
        font-size: clamp($text-2xl, 5vw, $text-4xl);
        font-weight: 900;
        line-height: 1.1;
        max-width: 600px;
        background: linear-gradient(
          135deg,
          var(--text-color),
          var(--text-gradient-color)
        );
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        filter: drop-shadow(
          0 4px 6px color-mix(in srgb, var(--alternate-color) 30%, transparent)
        );
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
      bottom: 10%;
      left: 0;
      width: 100%;
      z-index: 2; /* Needs to sit above the particles too */

      @include respond-to(600px, 1023px) {
        bottom: 10%;
      }
      @include respond-to(1024px, 1279px) {
        bottom: 10%;
        left: 50%;
        transform: translateX(-50%);
      }
      @include respond-to(1280px, 1600px) {
        bottom: 15%;
        left: 52%;
        transform: translateX(-50%);
      }
      @include respond-to($min: 1600px) {
        bottom: 15%;
        max-width: 90%;
        left: 52%;
        transform: translateX(-50%);
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
        textpath {
          font-size: 125px;
        }
      }
      @include respond-to(1024px, 1279px) {
        textpath {
          font-size: 125px;
        }
      }
      @include respond-to(1280px, 1599px) {
        textpath {
          font-size: 100px;
        }
      }
      @include respond-to($min: 1600px) {
        textpath {
          font-size: 80px;
        }
      }
    }
  }

  @keyframes float-1 {
    0% {
      transform: translate(0, 0) scale(1);
    }
    100% {
      transform: translate(10%, 10%) scale(1.1);
    }
  }

  @keyframes float-2 {
    0% {
      transform: translate(0, 0) scale(1);
    }
    100% {
      transform: translate(-10%, -5%) scale(1.15);
    }
  }

  /* About section */
  .about {
    padding: 50px 15px;
    display: flex;
    flex-direction: column;
    gap: 25px;
    .pill {
      width: max-content;
      background: color-mix(in srgb, var(--secondary-color) 30%, transparent);
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
    background: var(--secondary-color);
    display: flex;
    flex-direction: column;
    gap: 15px;
    .pill {
      width: max-content;
      background: color-mix(in srgb, var(--background-color) 50%, transparent);
      backdrop-filter: blur(15px);
      padding: 6px 20px;
      border-radius: 30px;
      color: var(--secondary-color);
      font-family: $alternate-font;
      font-size: $text-sm;
      font-weight: 600;
    }
    h2 {
      font-size: $text-2xl;
      font-weight: 900;
      letter-spacing: 1px;
      background: linear-gradient(
        135deg,
        var(--alternate-color),
        var(--reverse-text-gradient-color)
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .container {
      width: 100%;
      min-width: 100%;
    }
  }

  // Gallery
  .gallery {
    padding: 50px 0;
    overflow: hidden;
    .pill {
      margin: 0 15px;
      width: max-content;
      background: color-mix(in srgb, var(--secondary-color) 30%, transparent);
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
      background: linear-gradient(
        135deg,
        var(--text-color),
        var(--text-gradient-color)
      );
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
    background: var(--alternate-color);

    .pill {
      width: max-content;
      background: color-mix(in srgb, var(--secondary-color) 30%, transparent);
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
      background: linear-gradient(
        135deg,
        var(--text-color),
        var(--text-gradient-color)
      );
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .container {
      width: 100%;
      min-width: 100%;
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 25px;
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
        gap: 50px;
      }
    }
  }

  @include respond-to($min: 1024px) {
    // Hero secrion
    .hero {
      .sphere-1 {
        height: 35vw;
        width: 35vw;
      }
      .sphere-2 {
        height: 30vw;
        width: 30vw;
      }
      .content {
        h1 {
          max-width: 800px;
        }
      }
    }

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
        gap: 50px;
      }
    }
  }
}
</style>