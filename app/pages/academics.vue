<template>
  <div id="academicsPage">
    
    <section class="resources">
      <section class="page-header">
      <div class="pill">Study Materials</div>
      <h2>Academic Resources</h2>
      <p class="subtitle">
        Access thousands of past questions, lecture notes, and study guides
        uploaded by faculty and top students to help you ace your exams.
      </p>
    </section>

    <section class="filters-section">
      <div class="glass-card filter-bar">
        <div class="search-box">
          <i class="bi bi-search"></i>
          <input
            type="search"
            v-model="searchQuery"
            placeholder="Search by course code or title..."
          />
        </div>

        <div class="dropdowns">
          <select v-model="selectedDepartment" class="glass-select">
            <option value="">All Departments</option>
            <option value="Computer Science">Computer Science</option>
            <option value="Cyber Security">Cyber Security</option>
            <option value="Information Technology">
              Information Technology
            </option>
          </select>

          <select v-model="selectedType" class="glass-select">
            <option value="">All Types</option>
            <option value="Past Question">Past Questions</option>
            <option value="Lecture Note">Lecture Notes</option>
            <option value="Study Guide">Study Guides</option>
          </select>
        </div>
      </div>
    </section>

    <section class="resources-section">
      <div v-if="filteredResources.length === 0" class="empty-state glass-card">
        <i class="bi bi-folder-x"></i>
        <h3>No resources found</h3>
        <p>We couldn't find any files matching your search criteria.</p>
        <button class="glass-btn sm" @click="resetFilters">
          Clear Filters
        </button>
      </div>

      <div v-else class="resources-grid">
        <div
          v-for="file in filteredResources"
          :key="file.id"
          class="glass-card resource-card"
        >
          <div class="card-top">
            <div class="file-icon" :class="file.format">
              <i
                v-if="file.format === 'pdf'"
                class="bi bi-file-earmark-pdf-fill"
              ></i>
              <i
                v-else-if="file.format === 'doc'"
                class="bi bi-file-earmark-word-fill"
              ></i>
              <i
                v-else-if="file.format === 'ppt'"
                class="bi bi-file-earmark-slides-fill"
              ></i>
              <i v-else class="bi bi-file-earmark-text-fill"></i>
            </div>
            <div class="badges">
              <span class="pill type-pill">{{ file.type }}</span>
            </div>
          </div>

          <div class="card-middle">
            <span class="course-code">{{ file.code }}</span>
            <h3 class="file-title">{{ file.title }}</h3>
            <span class="department"
              >{{ file.department }} • {{ file.year }}</span
            >
          </div>

          <div class="card-bottom">
            <span class="file-size">{{ file.size }}</span>
            <button class="download-btn">
              <i class="bi bi-cloud-download"></i> Download
            </button>
          </div>
        </div>
      </div>
    </section>
    </section>

    <!-- Blogs -->
    <section class="blogs" ref="blogsRef">
      <div class="pill" ref="blogsPillRef">Blogs</div>
      <h2 ref="blogsTitleRef">Latest academic blogs</h2>
      <div class="container" ref="blogsContainerRef">
        <BlogCard
          v-for="post in posts"
          :key="post.id"
          :to="post.link"
          :imageSrc="post.image"
          :tags="post.tags"
          :title="post.title"
          :description="post.description"
          :author="post.author"
          :date="post.date"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";

definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
      pageTitle: "Academics",
    },
  },
});

useHead({
  title: 'Academics',
})

// Filter States
const searchQuery = ref("");
const selectedDepartment = ref("");
const selectedType = ref("");

const resetFilters = () => {
  searchQuery.value = "";
  selectedDepartment.value = "";
  selectedType.value = "";
};

// Dummy Resource Data
const resources = [
  {
    id: 1,
    code: "CSC 301",
    title: "Compiler Construction Comprehensive PQ",
    type: "Past Question",
    format: "pdf",
    department: "Computer Science",
    year: "2023",
    size: "2.4 MB",
  },
  {
    id: 2,
    code: "CYS 205",
    title: "Intro to Cryptography & Network Security",
    type: "Lecture Note",
    format: "ppt",
    department: "Cyber Security",
    year: "2024",
    size: "5.1 MB",
  },
  {
    id: 3,
    code: "IFT 402",
    title: "Cloud Architecture Deployment Guide",
    type: "Study Guide",
    format: "doc",
    department: "Information Technology",
    year: "2023",
    size: "1.8 MB",
  },
  {
    id: 4,
    code: "CSC 101",
    title: "Introduction to Computing First Semester",
    type: "Past Question",
    format: "pdf",
    department: "Computer Science",
    year: "2024",
    size: "3.2 MB",
  },
  {
    id: 5,
    code: "MTH 201",
    title: "Mathematical Methods I Notes",
    type: "Lecture Note",
    format: "pdf",
    department: "Computer Science",
    year: "2022",
    size: "4.5 MB",
  },
  {
    id: 6,
    code: "CYS 302",
    title: "Ethical Hacking Lab Manual",
    type: "Study Guide",
    format: "pdf",
    department: "Cyber Security",
    year: "2024",
    size: "8.0 MB",
  },
  {
    id: 7,
    code: "IFT 204",
    title: "Database Management Systems PQ",
    type: "Past Question",
    format: "doc",
    department: "Information Technology",
    year: "2023",
    size: "1.2 MB",
  },
  {
    id: 8,
    code: "CSC 411",
    title: "Artificial Intelligence Seminar Slides",
    type: "Lecture Note",
    format: "ppt",
    department: "Computer Science",
    year: "2025",
    size: "12.4 MB",
  },
];

// Academic blogs
const posts = [
  {
    id: 1,
    link: "/blog/scaling-financial-services",
    image: "sample.jpg",
    tags: ["Customer Stories", "AI", "Growth"],
    title: "Scaling Financial Services Personalization for $100Bn+ Enterprise",
    description: "Coframe Drives over 26% Lift in Financial Services",
    author: "Mark Henry",
    date: "March 13, 2026",
  },
  {
    id: 2,
    link: "/blog/next-post",
    image: "sample.jpg",
    tags: ["Engineering", "Vue3"],
    title: "How we built a reusable component system",
    description: "A deep dive into Nuxt 3 architectures.",
    author: "Mark Henry",
    date: "March 13, 2026",
  },
  {
    id: 3,
    link: "/blog/next-post",
    image: "sample.jpg",
    tags: ["Engineering", "Vue3"],
    title: "How we built a reusable component system",
    description: "A deep dive into Nuxt 3 architectures.",
    author: "Mark Henry",
    date: "March 13, 2026",
  },
];

// Vue Computed Property to instantly filter the grid
const filteredResources = computed(() => {
  return resources.filter((file) => {
    const matchesSearch =
      file.title.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
      file.code.toLowerCase().includes(searchQuery.value.toLowerCase());

    const matchesDept =
      selectedDepartment.value === "" ||
      file.department === selectedDepartment.value;
    const matchesType =
      selectedType.value === "" || file.type === selectedType.value;

    return matchesSearch && matchesDept && matchesType;
  });
});
</script>

<style lang="scss">
/* --- Reusable Glass Mixin --- */
@mixin glass-panel {
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  backdrop-filter: blur(15px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
}

#academicsPage {
  display: flex;
  flex-direction: column;
  width: 100%;

  /* --- Top Section (Header, Filters, Grid) --- */
  .resources {
    padding: 50px 15px;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 40px;
    width: 100%;

    /* Header */
    .page-header {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      gap: 15px;
      max-width: 800px;

      .pill {
        width: max-content;
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
        font-size: $text-3xl;
        font-weight: 900;
        letter-spacing: 1px;
        background: linear-gradient(135deg, #fff, #c1c0c0);
        background-clip: text;
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        color: transparent;
        margin: 0;
      }

      .subtitle {
        opacity: 0.8;
        line-height: 1.6;
      }
    }

    /* Filters Section */
    .filters-section {
      width: 100%;
      max-width: 1200px;

      .filter-bar {
        @include glass-panel;
        display: flex;
        flex-direction: column;
        gap: 15px;
        padding: 20px;

        .search-box {
          flex: 1;
          position: relative;
          display: flex;
          align-items: center;

          i {
            position: absolute;
            left: 15px;
            color: #8a8a93;
          }

          input {
            width: 100%;
            background: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 12px 15px 12px 40px;
            border-radius: 10px;
            font-size: 1rem;
            outline: none;
            transition: border-color 0.3s;

            &:focus {
              border-color: $accent-color;
            }
            &::placeholder {
              color: #8a8a93;
            }
          }
        }

        .dropdowns {
          display: flex;
          flex-direction: column;
          gap: 15px;

          .glass-select {
            width: 100%;
            background-color: rgba(0, 0, 0, 0.2);
            border: 1px solid rgba(255, 255, 255, 0.1);
            color: #fff;
            padding: 12px 15px;
            border-radius: 10px;
            font-size: 1rem;
            outline: none;
            cursor: pointer;
            appearance: none;
            background-image: url('data:image/svg+xml;utf8,<svg fill="%238a8a93" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
            background-repeat: no-repeat;
            background-position-x: 95%;
            background-position-y: 50%;
            transition: border-color 0.3s;

            &:focus {
              border-color: $accent-color;
            }
            option {
              color: #000;
            }
          }
        }
      }
    }

    /* Resources Grid */
    .resources-section {
      width: 100%;
      max-width: 1200px;

      .empty-state {
        @include glass-panel;
        padding: 60px 20px;
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 15px;

        i {
          font-size: 3rem;
          color: #8a8a93;
        }
        h3 {
          font-size: 1.5rem;
          margin: 0;
          color: #fff;
        }
        p {
          color: #8a8a93;
          margin-bottom: 10px;
        }

        .glass-btn {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          color: #fff;
          padding: 8px 20px;
          border-radius: 8px;
          cursor: pointer;
          transition: 0.3s;
          &:hover {
            background: rgba($accent-color, 0.2);
            color: $accent-color;
          }
        }
      }

      .resources-grid {
        display: grid;
        grid-template-columns: 1fr;
        gap: 20px;

        .resource-card {
          @include glass-panel;
          padding: 25px;
          display: flex;
          flex-direction: column;
          gap: 20px;
          transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;

          &:hover {
            transform: translateY(-5px);
            border-color: rgba($accent-color, 0.4);
            box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

            .download-btn {
              background: rgba($accent-color, 0.15);
              color: $accent-color;
              border-color: rgba($accent-color, 0.3);
            }
          }

          .card-top {
            display: flex;
            justify-content: space-between;
            align-items: flex-start;

            .file-icon {
              width: 50px;
              height: 50px;
              border-radius: 12px;
              display: flex;
              justify-content: center;
              align-items: center;
              font-size: 1.5rem;

              &.pdf {
                background: rgba(231, 76, 60, 0.15);
                color: #e74c3c;
              }
              &.doc {
                background: rgba(52, 152, 219, 0.15);
                color: #3498db;
              }
              &.ppt {
                background: rgba(243, 156, 18, 0.15);
                color: #f39c12;
              }
            }

            .type-pill {
              padding: 4px 12px;
              font-size: 0.75rem;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.05);
              border-radius: 20px;
              color: #ccc;
            }
          }

          .card-middle {
            display: flex;
            flex-direction: column;
            flex-grow: 1;

            .course-code {
              font-size: 0.85rem;
              font-weight: 700;
              color: $accent-color;
              margin-bottom: 5px;
            }

            .file-title {
              font-size: 1.1rem;
              font-family: $alternate-font;
              color: #fff;
              margin: 0 0 10px 0;
              line-height: 1.4;
            }

            .department {
              font-size: 0.85rem;
              color: #8a8a93;
              margin-top: auto;
            }
          }

          .card-bottom {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding-top: 15px;
            border-top: 1px solid rgba(255, 255, 255, 0.05);

            .file-size {
              font-size: 0.85rem;
              color: #8a8a93;
            }

            .download-btn {
              display: flex;
              align-items: center;
              gap: 8px;
              background: rgba(255, 255, 255, 0.03);
              border: 1px solid rgba(255, 255, 255, 0.08);
              color: #fff;
              padding: 8px 16px;
              border-radius: 8px;
              font-size: 0.9rem;
              cursor: pointer;
              transition: all 0.3s ease;

              i {
                font-size: 1.1rem;
              }
            }
          }
        }
      }
    }
  }

  /* --- Blogs Section --- */
  .blogs {
    padding: 50px 15px;
    display: flex;
    flex-direction: column;
    align-items: center; // Center items for better desktop flow
    gap: 15px;
    background: $alternate-color;
    width: 100%;

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
      text-align: center;
      margin-bottom: 10px;
    }

    .container {
      width: 100%;
      max-width: 1200px;
      margin-top: 15px;
      display: flex;
      flex-direction: column;
      gap: 25px;
    }
  }

  /* --- Media Queries --- */
  @include respond-to(600px, 1023px) {
    .resources {
      padding: 75px 50px;

      .page-header h2 {
        font-size: $text-4xl;
      }

      .filters-section .filter-bar {
        flex-direction: row;
        align-items: center;

        .dropdowns {
          flex-direction: row;
          width: 100%;
          max-width: 450px;
        }
      }

      .resources-section .resources-grid {
        grid-template-columns: repeat(2, 1fr);
      }
    }

    .blogs {
      padding: 75px 50px;
      h2 {
        font-size: $text-3xl;
      }
      .container {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 30px;
      }
    }
  }

  @include respond-to($min: 1024px) {
    .resources {
      padding: 100px 75px;

      .page-header h2 {
        font-size: $text-4xl;
      }

      .filters-section .filter-bar {
        flex-direction: row;
        align-items: center;

        .dropdowns {
          flex-direction: row;
          width: 100%;
          max-width: 500px;
        }
      }

      .resources-section .resources-grid {
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
      }
    }

    .blogs {
      padding: 100px 75px;
      h2 {
        font-size: $text-4xl;
      }
      .container {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        gap: 40px;
      }
    }
  }

  @media (min-width: 1440px) {
    .resources .resources-section .resources-grid {
      grid-template-columns: repeat(4, 1fr);
    }
  }
}
</style>