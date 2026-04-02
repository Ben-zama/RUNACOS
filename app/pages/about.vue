<template>
  <div id="aboutPage">
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
    </section>

    <!-- Vision & mission -->
    <section class="vision-mission" ref="visionMissionRef">
      <div class="header-text">
        <div class="pill">More about us</div>
        <h2>Our Vision, Mission & Core values</h2>
      </div>

      <div class="container">
        <div v-for="item in visionMission" :key="item.title" class="card">
          <div class="icon-wrapper">
            <i :class="item.icon"></i>
          </div>
          <div class="content">
            <h3>{{ item.title }}</h3>
            <p>{{ item.text }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Departments -->
    <section class="departments" ref="departmentsRef">
      <div class="header-text">
        <div class="pill">Our Departments</div>
        <h2>Computing Departments, reimagined</h2>
        <p class="subtitle">
          Our comprehensive programs are designed to address the complex
          challenges of the 21st century. We provide students with foundational
          and advanced knowledge across computing disciplines, empowering them
          to innovate and lead.
        </p>
      </div>

      <div class="bento-grid">
        <div class="bento-card logo">
          <img src="~/assets/logo.png" />
        </div>
        <div
          v-for="dept in academicDepartments"
          :key="dept.id"
          class="bento-card"
          :class="dept.id"
        >
          <div class="graphic">
            <img :src="dept.image" :alt="dept.title" />
          </div>
          <div class="content bottom-left">
            <h3>{{ dept.title }}</h3>
            <p>{{ dept.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- Staff section -->
    <section class="staff">
      <h2>Current Faculty Staff</h2>
      <div class="container">
        <Carousel :items="team" />
      </div>
    </section>

    <!-- Executives section -->
    <section class="executives">
      <h2>2025/2026 Student Executives</h2>
      <div class="container">
        <Carousel :items="team" />
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

definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
      pageTitle: "About Us",
    },
  },
});

useHead({
  title: 'About Us',
})

const aboutRef = ref(null);
const aboutPillRef = ref(null);
const aboutInfoRef = ref(null);
const countUpRef = ref(null);
const aboutBtnRef = ref(null);
const countUpTriggerRef = ref(null);
const startCounting = ref(false);

const visionMission = [
  {
    title: "Vision",
    icon: "bi bi-eye-fill",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque varius.",
  },
  {
    title: "Mission",
    icon: "bi bi-bullseye",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque varius.",
  },
  {
    title: "Core Values",
    icon: "bi bi-gem",
    text: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Pellentesque varius.",
  },
];

const academicDepartments = [
  {
    id: "cs-card",
    title: "Computer Science",
    description: "Core foundations of software and system design.",
    image:
      "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "cyber-card",
    title: "Cyber Security",
    description: "Defending networks and data.",
    image:
      "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=1000&auto=format&fit=crop",
  },
  {
    id: "it-card",
    title: "Information Technology",
    description: "Managing enterprise systems and cloud infrastructure.",
    image:
      "https://images.unsplash.com/photo-1451187580459-43490279c0fa?q=80&w=1000&auto=format&fit=crop",
  },
];

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
    role: "Treasure",
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
#aboutPage {
  padding: 25px 0;

  // about section
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
  }

  // Vision & mission
  .vision-mission {
    padding: 50px 15px;
    background: $alternate-color;
    display: flex;
    flex-direction: column;
    gap: 30px;
    align-items: center;

    .header-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 15px;

      .pill {
        color: $accent-color;
        background: rgba(255, 255, 255, 0.05); // Subtle background for the pill
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 6px 20px;
        border-radius: 30px;
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
    }

    .container {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;

      .card {
        background: linear-gradient(
          145deg,
          rgba(255, 255, 255, 0.03) 0%,
          rgba(255, 255, 255, 0.01) 100%
        );
        backdrop-filter: blur(10px);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 16px;
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        align-items: center;
        text-align: center;
        gap: 15px;
        transition: transform 0.4s ease, border-color 0.4s ease,
          box-shadow 0.4s ease;

        &:hover {
          transform: translateY(-8px);
          border-color: rgba($accent-color, 0.5);
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

          .icon-wrapper {
            background: $accent-color;
            i {
              color: #fff;
            }
          }
        }

        .icon-wrapper {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          display: flex;
          justify-content: center;
          align-items: center;
          transition: 0.4s ease;

          i {
            color: $accent-color;
            font-size: $text-2xl;
            transition: 0.4s ease;
          }
        }

        .content {
          h3 {
            font-family: $alternate-font;
            font-size: $text-xl;
            color: #fff; // Override the global gradient for better readability inside cards
            margin-bottom: 10px;
          }
          p {
            opacity: 0.8;
            line-height: 1.6;
          }
        }
      }
    }
  }

  // Departments
  .departments {
    padding: 50px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 50px;

    .header-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 15px;
      max-width: 1000px;

      .pill {
        color: $accent-color;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.1);
        padding: 6px 20px;
        border-radius: 30px;
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

      .subtitle {
        max-width: 800px;
        opacity: 0.8;
        line-height: 1.6;
      }
    }

    .bento-grid {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      gap: 15px;

      .logo {
        display: none !important;
        justify-content: center;
        align-items: center;
        img {
          width: 75%;
          height: 75%;
          object-fit: contain;
        }
      }

      .bento-card {
        position: relative;
        display: flex;
        flex-direction: column;
        background: linear-gradient(
          135deg,
          #0b0f1a 0%,
          #0d1323 40%,
          #0a0e18 100%
        );
        border: 1px solid rgba(255, 255, 255, 0.08);
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5),
          inset 0 1px 0 rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        overflow: hidden;
        min-height: 350px;
        transition: transform 0.4s ease, border-color 0.4s ease;
        &::before {
          content: "";
          position: absolute;
          inset: 0;
          opacity: 0.05;
          background-image: repeating-radial-gradient(
            circle,
            #ffffff 0px,
            #ffffff 1px,
            transparent 1px,
            transparent 2px
          );
        }
        &::after {
          content: "";
          position: absolute;
          inset: 0;
          background: linear-gradient(45deg, #47466950, #33615d50);
          mix-blend-mode: screen;
          pointer-events: none;
        }

        &:hover {
          .graphic img {
            transform: scale(1.05);
          }
        }

        .graphic {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 1;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            opacity: 0.6;
            transition: transform 0.6s ease;
          }

          &::after {
            content: "";
            position: absolute;
            inset: 0;
            background: linear-gradient(to top, #111111 10%, transparent 60%);
          }
        }

        .content {
          position: relative;
          z-index: 2;
          padding: 35px;
          display: flex;
          flex-direction: column;
          height: 100%;

          h3 {
            font-family: $alternate-font;
            font-size: $text-xl;
            font-weight: 600;
            margin-bottom: 8px;
          }

          p {
            font-size: $text-sm;
            line-height: 1.5;
            margin: 0;
            opacity: 0.8;
          }
          &.centered {
            justify-content: center;
            align-items: center;
            text-align: center;
            background: radial-gradient(
              circle at center,
              rgba(0, 0, 0, 0.5) 0%,
              transparent 70%
            );

            h3 {
              font-size: $text-2xl;
            }
          }

          &.bottom-left {
            justify-content: flex-end;
            align-items: flex-start;
            text-align: left;
          }
        }
      }
    }
  }

  // Executives and staff
  .staff,
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
      min-width: 100%;
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

    // Vision & mission
    .vision-mission {
      padding: 75px 50px;

      .header-text h2 {
        font-size: $text-3xl;
      }

      .container {
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;

        .card:last-child:nth-child(odd) {
          grid-column: span 2;
          max-width: 50%;
          margin: 0 auto;
        }
      }
    }

    // Departments
    .departments {
      padding: 75px 50px;

      .header-text h2 {
        font-size: $text-3xl;
      }

      .bento-grid {
        grid-template-columns: repeat(2, 1fr);

        .cs-card {
          grid-column: span 2;
        }
      }
    }

    // Staff & Executive
    .staff,
    .executives {
      padding: 50px;
      h2 {
        font-size: $text-3xl;
      }
      .container {
        margin: 0;
      }
    }

    .staff {
      padding-bottom: 25px;
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

    // Vision & mission
    .vision-mission {
      padding: 100px 75px;

      .header-text {
        max-width: 800px;
        margin-bottom: 20px;

        h2 {
          font-size: $text-4xl;
        }
      }

      .container {
        max-width: 1100px;
        grid-template-columns: repeat(3, 1fr);
        gap: 40px;

        .card {
          padding: 50px 40px;

          .icon-wrapper {
            width: 80px;
            height: 80px;
            margin-bottom: 10px;
            i {
              font-size: $text-3xl;
            }
          }

          .content {
            h3 {
              font-size: $text-2xl;
            }
            p {
              font-size: $text-lg;
            }
          }
        }
      }
    }

    // Departments
    .departments {
      padding: 100px 75px;

      .header-text h2 {
        font-size: $text-4xl;
      }

      .bento-grid {
        max-width: 1500px;
        grid-template-columns: repeat(10, 1fr);
        grid-template-rows: repeat(2, 350px);
        .logo {
          display: flex !important;
          grid-column: span 4;
        }
        .cs-card {
          grid-column: span 6;
        }

        .cyber-card {
          grid-column: span 6;
        }
        .it-card {
          grid-column: span 4;
        }
      }
    }

    // Staff & Executives
    .staff,
    .executives {
      padding: 75px;
      h2 {
        font-size: $text-4xl;
      }
      .container {
        margin-top: 25px;
      }
    }
    .staff {
      padding-bottom: 25px;
    }
  }
}
</style>