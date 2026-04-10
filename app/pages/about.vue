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

    <!-- Mission & vision -->
    <section class="vision-mission" ref="visionMissionRef">
      <div class="header-text">
        <div class="pill">More about us</div>
        <h2>Our Vision, Mission & Core values</h2>
      </div>

      <div class="container hierarchical-grid">
        <div
          v-for="(item, index) in visionMission"
          :key="item.title"
          :class="['card', index === 0 ? 'featured-card' : 'standard-card']"
        >
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
      <div class="departments-wrapper">
        <div class="header-col sticky-content">
          <div class="pill">Our Departments</div>
          <h2>Computing Departments, reimagined</h2>
          <p class="subtitle">
            Our comprehensive programs are designed to address the complex
            challenges of the 21st century. We provide students with
            foundational and advanced knowledge across computing disciplines,
            empowering them to innovate and lead.
          </p>
        </div>

        <div class="cards-col">
          <div
            v-for="dept in academicDepartments"
            :key="dept.id"
            class="dept-card"
          >
            <div class="graphic">
              <img :src="dept.image" :alt="dept.title" />
            </div>
            <div class="content-overlay">
              <div class="text-content">
                <h3>{{ dept.title }}</h3>
                <p>{{ dept.description }}</p>
              </div>
              <div class="action-icon">
                <i class="bi bi-arrow-up-right"></i>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Executives section -->
    <section class="executives">
      <div class="pill">Executives</div>
      <h2>2025/2026 Student Executives</h2>
      <div class="container">
        <TeamCarousel :items="team" />
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
  title: "About Us",
});

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
    text: "To be the premier student-led computing association, nurturing world-class tech innovators and leaders who will shape the future of the digital landscape.",
  },
  {
    title: "Mission",
    icon: "bi bi-bullseye",
    text: "To empower our students with practical tech skills, career-building opportunities, and a collaborative network, bridging the gap between classroom theory and industry demands.",
  },
  {
    title: "Core Values",
    icon: "bi bi-gem",
    text: "We are driven by Innovation, Integrity, Collaboration, Excellence, and a commitment to Continuous Learning in the ever-evolving tech industry.",
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
  
  // about section
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
  }

  // Vision & mission
  .vision-mission {
    padding: 50px 15px;
    background: var(--alternate-color);
    display: flex;
    flex-direction: column;
    gap: 40px;
    align-items: center;

    .header-text {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 15px;

      .pill {
        color: $accent-color;
        background: color-mix(in srgb, var(--secondary-color) 30%, transparent);
        backdrop-filter: blur(15px);
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
    }

    .hierarchical-grid {
      width: 100%;
      display: grid;
      grid-template-columns: 1fr;
      gap: 20px;

      .card {
        background: linear-gradient(
          145deg,
          color-mix(in srgb, var(--secondary-color) 10%, transparent) 0%,
          color-mix(in srgb, var(--alternate-color) 10%, transparent) 100%
        );
        backdrop-filter: blur(10px);
        border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
        border-radius: 20px;
        padding: 40px 30px;
        display: flex;
        flex-direction: column;
        gap: 20px;
        transition: transform 0.4s ease, border-color 0.4s ease,
          box-shadow 0.4s ease;

        &:hover {
          transform: translateY(-5px);
          border-color: rgba($accent-color, 0.4);
          box-shadow: 0 15px 35px rgba(0, 0, 0, 0.2);

          .icon-wrapper {
            background: $accent-color;
            transform: scale(1.1);
            i {
              color: #fff;
            }
          }
        }

        .icon-wrapper {
          width: 65px;
          height: 65px;
          border-radius: 16px; // Changed to soft square for a more premium tech feel
          background: color-mix(
            in srgb,
            var(--alternate-color) 50%,
            transparent
          );
          border: 1px solid
            color-mix(in srgb, var(--text-color) 10%, transparent);
          display: flex;
          justify-content: center;
          align-items: center;
          transition: all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275);

          i {
            color: $accent-color;
            font-size: $text-2xl;
            transition: color 0.4s ease;
          }
        }

        .content {
          h3 {
            font-family: $alternate-font;
            font-size: $text-xl;
            font-weight: bold;
            margin-bottom: 12px;
          }
          p {
            opacity: 0.8;
            line-height: 1.7;
          }
        }
      }
    }
  }

  // Departments (Sticky Scroll Layout)
  .departments {
    padding: 50px 15px;

    .departments-wrapper {
      display: flex;
      flex-direction: column;
      gap: 40px;
      max-width: 1400px;
      margin: 0 auto;
      width: 100%;
    }

    .header-col {
      display: flex;
      flex-direction: column;
      align-items: flex-start;
      gap: 20px;

      .pill {
        color: $accent-color;
        background: color-mix(in srgb, var(--secondary-color) 30%, transparent);
        padding: 6px 20px;
        border-radius: 30px;
        font-family: $alternate-font;
        font-size: $text-sm;
        font-weight: 600;
      }

      h2 {
        font-size: $text-3xl;
        font-weight: 900;
        line-height: 1.2;
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

      .subtitle {
        opacity: 0.8;
        line-height: 1.7;
        font-size: $text-lg;
        max-width: 90%;
      }
    }

    .cards-col {
      display: flex;
      flex-direction: column;
      gap: 25px;

      .dept-card {
        position: relative;
        border-radius: 24px;
        overflow: hidden;
        aspect-ratio: 16 / 10;
        border: 1px solid rgba(255, 255, 255, 0.05);
        cursor: pointer;

        &:hover {
          .graphic img {
            transform: scale(1.08);
          }
          .content-overlay {
            background: linear-gradient(
              to top,
              rgba(0, 0, 0, 0.9) 0%,
              rgba(0, 0, 0, 0.2) 100%
            );
            padding-bottom: 40px; // Slight lift effect
          }
          .action-icon {
            background: $accent-color;
            color: #fff;
            transform: rotate(45deg);
          }
        }

        .graphic {
          position: absolute;
          inset: 0;
          z-index: 1;

          img {
            width: 100%;
            height: 100%;
            object-fit: cover;
            transition: transform 0.8s cubic-bezier(0.25, 1, 0.5, 1);
          }
        }

        .content-overlay {
          position: absolute;
          inset: 0;
          z-index: 2;
          padding: 30px;
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 60%
          );
          transition: all 0.4s ease;

          .text-content {
            max-width: 80%;

            h3 {
              font-family: $alternate-font;
              font-size: $text-2xl;
              font-weight: 700;
              margin-bottom: 8px;
              color: #fff;
            }
            p {
              opacity: 0.85;
              color: #eaeaea;
              line-height: 1.5;
              margin: 0;
            }
          }

          .action-icon {
            width: 45px;
            height: 45px;
            border-radius: 50%;
            background: rgba(255, 255, 255, 0.1);
            backdrop-filter: blur(5px);
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            font-size: 1.2rem;
            transition: all 0.3s ease;
          }
        }
      }
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
      .hierarchical-grid {
        grid-template-columns: repeat(2, 1fr);
        .featured-card {
          grid-column: span 2;
          flex-direction: row; // Horizontal layout for the featured card
          align-items: center;

          .content {
            max-width: 70%;
          }
        }
        .standard-card {
          grid-column: span 1;
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
    .executives {
      padding: 50px;
      h2 {
        font-size: $text-3xl;
      }
      .container {
        margin: 0;
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

    // Vision & mission
    .vision-mission {
      .hierarchical-grid {
        grid-template-columns: repeat(2, 1fr);
        max-width: 1200px;

        .featured-card {
          grid-column: span 2;
          flex-direction: row;
          align-items: center;
          padding: 50px;

          .icon-wrapper {
            width: 80px;
            height: 80px;
            flex-shrink: 0;
            i {
              font-size: $text-3xl;
            }
          }
        }
        .standard-card {
          padding: 40px;
        }
      }
    }

    /* Departments */
    .departments {
      padding: 100px 75px;

      .departments-wrapper {
        flex-direction: row;
        align-items: flex-start;
      }

      .header-col {
        width: 40%;
        position: sticky;
        top: 120px; // Adjust this based on your navbar height
        padding-right: 40px;

        h2 {
          font-size: $text-4xl;
        }
      }

      .cards-col {
        width: 60%;
        gap: 40px;

        .dept-card {
          aspect-ratio: 16 / 9;
        }
      }
    }

    // Executives
    .executives {
      padding: 75px;
      h2 {
        font-size: $text-4xl;
      }
      .container {
        margin-top: 25px;
      }
    }
  }
}
</style>