<template>
  <div id="alumniPage">
    <!-- ALumni Spotlight -->
    <section class="spotlight">
      <div class="custom-slider">
        <transition-group name="fade" tag="div" class="slider-track">
          <div
            v-for="(spotlight, index) in spotlights"
            :key="spotlight.id"
            v-show="currentSlide === index"
            class="spotlight-card"
          >
            <div class="content-side">
              <div class="pill">{{ spotlight.type }}</div>
              <h2>{{ spotlight.headline }}</h2>
              <p class="quote">"{{ spotlight.quote }}"</p>

              <div class="alumni-meta">
                <h3 class="name">{{ spotlight.name }}</h3>
                <span class="role">{{ spotlight.role }}</span>
                <span class="dept"
                  >{{ spotlight.department }} • Class of
                  {{ spotlight.year }}</span
                >
              </div>

              <nuxt-link :to="spotlight.link" class="read-more">
                Read Full Story <i class="bi bi-arrow-right"></i>
              </nuxt-link>
            </div>

            <div class="image-side">
              <img :src="spotlight.image" :alt="spotlight.name" />
              <div class="overlay"></div>
            </div>
          </div>
        </transition-group>

        <div class="slider-pagination">
          <button
            v-for="(_, index) in spotlights"
            :key="index"
            class="dot"
            :class="{ active: currentSlide === index }"
            @click="goToSlide(index)"
            aria-label="Go to slide"
          ></button>
        </div>
      </div>
    </section>

    <!-- Alumni Directory -->
    <section class="directory">
      <h2>Alumni Directory</h2>
      <form @submit.prevent class="filter">
        <input
          type="search"
          placeholder="Search by name..."
          aria-label="Search by name"
        />
        <select name="graduationYear" aria-label="Filter by year">
          <option value="">All Years</option>
          <option v-for="year in graduationYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <select name="department" aria-label="Filter by department">
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="Information Technology">Information Technology</option>
        </select>
        <button type="submit">Filter</button>
      </form>
      <div class="container">
        <AlumniCard
          v-for="alumni in displayedAlumni"
          :key="alumni.id"
          :name="alumni.name"
          :year="alumni.year"
          :department="alumni.department"
          :image="alumni.image"
          :linkedIn="alumni.linkedIn"
        />
      </div>
      <div class="pagination"></div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";

definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
      pageTitle: "Alumni",
    },
  },
});

const spotlights = [
  {
    id: 1,
    type: "Innovator Spotlight",
    headline: "Building the Future of Fintech",
    quote:
      "RUNACOS gave me the foundation to build scalable systems that now power millions of transactions across Africa. The late nights in the lab were worth it.",
    name: "Sarah Opeyemi",
    role: "Founder & CTO at TechNova",
    department: "Computer Science",
    year: "2019",
    image:
      "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop", // Tech entrepreneur vibe
    link: "#",
  },
  {
    id: 2,
    type: "Academic Spotlight",
    headline: "Pushing the Boundaries of AI",
    quote:
      "My journey into deep learning started right here. The theoretical rigor of our curriculum prepared me perfectly for advanced research on the global stage.",
    name: "Dr. Femi Olaniyi",
    role: "Lead AI Researcher",
    department: "Information Technology",
    year: "2016",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", // Professional/Academic vibe
    link: "#",
  },
];

const currentSlide = ref(0);
let autoplayInterval = null;

const nextSlide = () => {
  currentSlide.value = (currentSlide.value + 1) % spotlights.length;
};

const goToSlide = (index) => {
  currentSlide.value = index;
  resetAutoplay();
};

const startAutoplay = () => {
  autoplayInterval = setInterval(nextSlide, 6000);
};

const resetAutoplay = () => {
  clearInterval(autoplayInterval);
  startAutoplay();
};

const alumniList = [
  {
    id: 1,
    name: "David Olatunji",
    year: "2023",
    department: "Computer Science",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    linkedIn: "#",
  },
  {
    id: 2,
    name: "Aisha Bello",
    year: "2024",
    department: "Cyber Security",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop",
    linkedIn: "#",
  },
  {
    id: 3,
    name: "Samuel Eze",
    year: "2021",
    department: "Information Technology",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    linkedIn: "#",
  },
  {
    id: 4,
    name: "Grace Okafor",
    year: "2025",
    department: "Computer Science",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    linkedIn: "#",
  },
  {
    id: 5,
    name: "David Olatunji",
    year: "2023",
    department: "Computer Science",
    image:
      "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=400&auto=format&fit=crop",
    linkedIn: "#",
  },
  {
    id: 6,
    name: "Aisha Bello",
    year: "2024",
    department: "Cyber Security",
    image:
      "https://images.unsplash.com/photo-1531123897727-8f129e1688ce?q=80&w=400&auto=format&fit=crop",
    linkedIn: "#",
  },
  {
    id: 7,
    name: "Samuel Eze",
    year: "2021",
    department: "Information Technology",
    image:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=400&auto=format&fit=crop",
    linkedIn: "#",
  },
  {
    id: 8,
    name: "Grace Okafor",
    year: "2025",
    department: "Computer Science",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=400&auto=format&fit=crop",
    linkedIn: "#",
  },
];

const graduationYears = computed(() => {
  const years = [];
  for (let year = 2025; year >= 2009; year--) {
    years.push(year);
  }
  return years;
});

const itemsToShow = ref(8);

const updateItemsToShow = () => {
  const width = window.innerWidth;

  if (width >= 1280) {
    itemsToShow.value = 8;
  } else if (width >= 901) {
    itemsToShow.value = 6;
  } else if (width >= 600) {
    itemsToShow.value = 4;
  } else {
    itemsToShow.value = 3;
  }
};

onMounted(() => {
  startAutoplay();

  updateItemsToShow();
  window.addEventListener("resize", updateItemsToShow);
});

onUnmounted(() => {
  clearInterval(autoplayInterval);

  window.removeEventListener("resize", updateItemsToShow);
});

const displayedAlumni = computed(() => {
  return alumniList.slice(0, itemsToShow.value);
});
</script>

<style lang="scss">
#alumniPage {
  padding: 25px 15px;
  position: relative;

  // Spotlight
  .spotlight {
    position: relative;
    width: 100%;
    margin-bottom: 50px;

    .custom-slider {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    .slider-track {
      display: grid; // The magic layout trick for crossfading
      width: 100%;
    }

    /* --- Vue Transition Classes --- */
    .fade-enter-active,
    .fade-leave-active {
      transition: opacity 0.8s ease, transform 0.8s ease;
    }
    .fade-enter-from,
    .fade-leave-to {
      opacity: 0;
      transform: translateY(10px); // Adds a subtle upward lift on load
    }

    .spotlight-card {
      grid-area: 1 / 1; // Stacks all cards exactly on top of each other
      width: 100%;
      display: flex;
      flex-direction: column-reverse;
      background: linear-gradient(
        145deg,
        rgba(255, 255, 255, 0.05) 0%,
        rgba(255, 255, 255, 0.01) 100%
      );
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.08);
      border-radius: 20px;
      overflow: hidden;
      text-align: left;

      /* Content side styles remain exactly the same */
      .content-side {
        padding: 30px 20px;
        display: flex;
        flex-direction: column;
        justify-content: center;
        gap: 15px;
        flex: 1;

        .pill {
          width: max-content;
          color: $accent-color;
          background: rgba($accent-color, 0.1);
          border: 1px solid rgba($accent-color, 0.3);
          padding: 6px 16px;
          border-radius: 30px;
          font-family: $alternate-font;
          font-size: $text-sm;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 1px;
        }

        h2 {
          font-size: $text-2xl;
          font-weight: 900;
          line-height: 1.2;
          background: linear-gradient(135deg, #fff, #c1c0c0);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .quote {
          font-size: $text-lg;
          font-style: italic;
          color: rgba(255, 255, 255, 0.85);
          line-height: 1.6;
          border-left: 3px solid $accent-color;
          padding-left: 15px;
        }

        .alumni-meta {
          display: flex;
          flex-direction: column;
          gap: 4px;
          margin-top: 10px;

          .name {
            font-size: $text-xl;
            color: #fff;
            margin: 0;
          }
          .role {
            color: $accent-color;
            font-weight: 500;
          }
          .dept {
            font-size: $text-sm;
            color: #8a8a93;
          }
        }

        .read-more {
          margin-top: 15px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: #fff;
          text-decoration: none;
          font-weight: 600;
          transition: color 0.3s ease;
          width: max-content;

          i {
            transition: transform 0.3s ease;
          }

          &:hover {
            color: $accent-color;
            i {
              transform: translateX(5px);
            }
          }
        }
      }

      .image-side {
        position: relative;
        width: 100%;
        height: 300px;
        flex: 1;

        img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.8) 0%,
            transparent 50%
          );
        }
      }
    }

    /* --- Custom Pagination Dots --- */
    .slider-pagination {
      display: flex;
      justify-content: center;
      gap: 12px;
      margin-top: 10px;

      .dot {
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: rgba(255, 255, 255, 0.2);
        border: none;
        cursor: pointer;
        padding: 0;
        transition: background-color 0.3s ease, transform 0.3s ease;

        &.active {
          background-color: $accent-color;
          transform: scale(1.3);
        }

        &:hover {
          background-color: rgba(255, 255, 255, 0.5);
        }
      }
    }
  }

  // Alumni direectory
  .directory {
    display: flex;
    flex-direction: column;
    align-items: start;
    gap: 15px;
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
    .filter {
      width: 100%;
      display: flex;
      flex-direction: column;
      gap: 15px;

      input,
      select {
        width: 100%;
        padding: 12px 15px;
        border: 1px solid rgba(255, 255, 255, 0.2);
        border-radius: 8px;
        background-color: transparent;
        color: inherit;
        font-size: 1rem;
        outline: none;
        transition: border-color 0.3s ease;

        &:focus {
          border-color: #fff;
        }
      }

      select {
        cursor: pointer;
        appearance: none;
        background-image: url('data:image/svg+xml;utf8,<svg fill="gray" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
        background-repeat: no-repeat;
        background-position-x: 95%;
        background-position-y: 50%;

        option {
          color: #000;
        }
      }

      button {
        padding: 12px 25px;
        background-color: #fff;
        color: #000;
        border: none;
        border-radius: 8px;
        font-weight: bold;
        cursor: pointer;
        transition: opacity 0.3s ease;

        &:hover {
          opacity: 0.8;
        }
      }

      @include respond-to($min: 600px) {
        flex-direction: row;
        align-items: center;
        input[type="search"] {
          flex: 1;
        }
        select {
          width: 200px;
        }
        button {
          width: auto;
        }
      }
    }
    .container {
      min-width: 100%;
      display: grid;
      gap: 15px;

      @include respond-to(600px, 900px) {
        grid-template-columns: repeat(2, 1fr);
      }

      @include respond-to(901px, 1279px) {
        grid-template-columns: repeat(3, 1fr);
      }

      @include respond-to($min: 1280px) {
        grid-template-columns: repeat(4, 1fr);
      }
    }
  }

  @include respond-to(600px, 1023px) {
    padding: 50px;

    // Directory
    .directory {
      gap: 25px;
      h2 {
        font-size: $text-3xl;
      }
    }
  }

  @include respond-to($min: 1024px) {
    padding: 75px 100px;

    // Spotlight
    .spotlight {
      margin-bottom: 75px;

      .spotlight-card {
        flex-direction: row; // Side-by-side
        min-height: 450px;

        .content-side {
          padding: 50px;
          gap: 20px;
          flex: 1;

          h2 {
            font-size: $text-3xl;
          }
          .quote {
            font-size: $text-lg;
          }
        }

        .image-side {
          height: auto;
          flex: 1;

          .overlay {
            background: linear-gradient(
              to right,
              rgba(0, 0, 0, 0.8) 0%,
              transparent 50%
            );
          }
        }
      }
    }

    // Directory
    .directory {
      gap: 25px;
      h2 {
        font-size: $text-4xl;
      }
    }
  }
}
</style>