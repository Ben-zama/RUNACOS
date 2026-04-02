<template>
  <div id="alumniPage">
    <section class="spotlight">
      <div v-if="alumniStore.isLoading && spotlights.length === 0" class="loading-state">
        <div class="spinner"></div>
        <p>Loading Spotlights...</p>
      </div>
      <div v-else class="custom-slider">
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

    <section class="directory">
      <h2>Alumni Directory</h2>
      <form @submit.prevent class="filter">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by name..."
          aria-label="Search by name"
        />
        <select v-model="selectedYear" aria-label="Filter by year">
          <option value="">All Years</option>
          <option v-for="year in graduationYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
        <select v-model="selectedDept" aria-label="Filter by department">
          <option value="">All Departments</option>
          <option value="Computer Science">Computer Science</option>
          <option value="Cyber Security">Cyber Security</option>
          <option value="Information Technology">Information Technology</option>
        </select>
      </form>

      <div v-if="alumniStore.isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Loading directory...</p>
      </div>

      <div v-else-if="displayedAlumni.length === 0" class="empty-state">
        <i class="bi bi-people"></i>
        <h3>No alumni found</h3>
        <p>Try adjusting your search or filters.</p>
        <button class="glass-btn sm mt-3" @click="resetFilters">Clear Filters</button>
      </div>

      <div v-else class="container">
        <AlumniCard
          v-for="alumni in displayedAlumni"
          :key="alumni.id || alumni._id"
          :name="alumni.username"
          :year="getYear(alumni.alumniInfo?.graduationYear)"
          :department="alumni.studentInfo?.department || 'N/A'"
          :image="`https://placehold.co/400x400/151515/8a8a93?text=${alumni.username?.charAt(0).toUpperCase() || 'A'}`"
          linkedIn="#"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { useAlumniStore } from "~/stores/useAlumniStore";

definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
      pageTitle: "Alumni",
    },
  },
});

useHead({
  title: 'Alumni',
})

const alumniStore = useAlumniStore();

// Filter States
const searchQuery = ref("");
const selectedYear = ref("");
const selectedDept = ref("");

const resetFilters = () => {
  searchQuery.value = "";
  selectedYear.value = "";
  selectedDept.value = "";
};

// Default Mock Spotlights (Used as fallback if no "Star Alumni" are found in DB)
const defaultSpotlights = [
  {
    id: 'mock1',
    type: "Innovator Spotlight",
    headline: "Building the Future of Fintech",
    quote: "RUNACOS gave me the foundation to build scalable systems that now power millions of transactions across Africa. The late nights in the lab were worth it.",
    name: "Sarah Opeyemi",
    role: "Founder & CTO at TechNova",
    department: "Computer Science",
    year: "2019",
    image: "https://images.unsplash.com/photo-1573164713988-8665fc963095?q=80&w=1000&auto=format&fit=crop", 
    link: "#",
  },
  {
    id: 'mock2',
    type: "Academic Spotlight",
    headline: "Pushing the Boundaries of AI",
    quote: "My journey into deep learning started right here. The theoretical rigor of our curriculum prepared me perfectly for advanced research on the global stage.",
    name: "Dr. Femi Olaniyi",
    role: "Lead AI Researcher",
    department: "Information Technology",
    year: "2016",
    image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", 
    link: "#",
  },
];

// Dynamically compute spotlights based on `isStar` flag in the DB
const spotlights = computed(() => {
  if (!alumniStore.alumni || alumniStore.alumni.length === 0) return defaultSpotlights;
  
  const starAlumni = alumniStore.alumni.filter(a => a.alumniInfo?.isStar);
  
  if (starAlumni.length === 0) return defaultSpotlights;

  return starAlumni.map((star, index) => ({
    id: star.id || star._id,
    type: "Featured Alumni",
    headline: star.alumniInfo?.jobTitle || "Making an Impact",
    quote: `Meet ${star.username}, excelling in their career at ${star.alumniInfo?.currentCompany || 'their current company'}.`,
    name: star.username,
    role: star.alumniInfo?.jobTitle || 'Alumni',
    department: star.studentInfo?.department || 'N/A',
    year: getYear(star.alumniInfo?.graduationYear),
    image: `https://placehold.co/1000x600/151515/8a8a93?text=${encodeURIComponent(star.username)}`, // Fallback image placeholder
    link: "#"
  })).slice(0, 3); // Max 3 spotlights
});

// Slider Logic
const currentSlide = ref(0);
let autoplayInterval = null;

const nextSlide = () => {
  if (spotlights.value.length > 0) {
    currentSlide.value = (currentSlide.value + 1) % spotlights.value.length;
  }
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

// Helper to extract year from ISO string
const getYear = (isoString) => {
  if (!isoString) return 'N/A';
  try {
    return new Date(isoString).getFullYear().toString();
  } catch {
    return 'N/A';
  }
};

// Extract unique graduation years dynamically from the database
const graduationYears = computed(() => {
  if (!alumniStore.alumni) return [];
  const years = alumniStore.alumni
    .map(a => getYear(a.alumniInfo?.graduationYear))
    .filter(y => y !== 'N/A');
  
  return [...new Set(years)].sort((a, b) => b - a);
});

// Filter the full alumni list based on search/dropdowns
const filteredAlumni = computed(() => {
  if (!alumniStore.alumni) return [];
  
  return alumniStore.alumni.filter(alumni => {
    const nameMatch = (alumni.username || "").toLowerCase().includes(searchQuery.value.toLowerCase());
    const yearMatch = selectedYear.value === "" || getYear(alumni.alumniInfo?.graduationYear) === selectedYear.value;
    const deptMatch = selectedDept.value === "" || alumni.studentInfo?.department === selectedDept.value;
    
    return nameMatch && yearMatch && deptMatch;
  });
});

// Responsive Pagination Logic
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

const displayedAlumni = computed(() => {
  return filteredAlumni.value.slice(0, itemsToShow.value);
});

onMounted(() => {
  alumniStore.fetchAlumni();
  startAutoplay();
  updateItemsToShow();
  window.addEventListener("resize", updateItemsToShow);
});

onUnmounted(() => {
  clearInterval(autoplayInterval);
  window.removeEventListener("resize", updateItemsToShow);
});
</script>

<style lang="scss">
#alumniPage {
  padding: 25px 15px;
  position: relative;

  /* Shared Utility Classes */
  .loading-state, .empty-state {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    padding: 60px 20px; text-align: center; color: #8a8a93; gap: 15px;
    background: rgba(255, 255, 255, 0.03); border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 16px;
    i { font-size: 3rem; }
    h3 { color: #fff; margin: 0; }
    p { margin: 0; }
  }

  .spinner {
    width: 40px; height: 40px; border: 3px solid rgba(255, 255, 255, 0.1);
    border-left-color: $accent-color; border-radius: 50%;
    animation: spin 1s linear infinite;
  }

  @keyframes spin { 100% { transform: rotate(360deg); } }

  .glass-btn {
    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff; padding: 8px 16px; border-radius: 8px; cursor: pointer; transition: 0.3s;
    &:hover { background: rgba($accent-color, 0.2); color: $accent-color; border-color: rgba($accent-color, 0.3); }
    &.sm { padding: 6px 12px; font-size: 0.85rem; }
  }
  .mt-3 { margin-top: 15px; }

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