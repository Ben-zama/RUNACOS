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
          <select v-model="selectedType" class="glass-select">
            <option value="">All Resource Types</option>
            <option value="Past Question">Past Questions</option>
            <option value="Lecture Note">Lecture Notes</option>
            <option value="Study Material">Study Materials</option>
          </select>
        </div>
      </div>
    </section>

    <section class="resources-section">
      <div v-if="resourcesStore.error" class="error-alert glass-card" style="margin-bottom: 20px;">
        <i class="bi bi-exclamation-triangle"></i> {{ resourcesStore.error }}
      </div>

      <div v-if="resourcesStore.isLoading && resourcesStore.resources.length === 0" class="empty-state glass-card">
        <div class="spinner" style="margin-bottom: 15px;"></div>
        <p>Loading academic resources...</p>
      </div>

      <div v-else-if="filteredResources.length === 0" class="empty-state glass-card">
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
          :key="file.id || file._id"
          class="glass-card resource-card"
        >
          <div class="card-top">
            <div class="file-icon" :class="getFileFormat(file.fileUrl)">
              <i v-if="getFileFormat(file.fileUrl) === 'pdf'" class="bi bi-file-earmark-pdf-fill"></i>
              <i v-else-if="getFileFormat(file.fileUrl) === 'doc'" class="bi bi-file-earmark-word-fill"></i>
              <i v-else-if="getFileFormat(file.fileUrl) === 'ppt'" class="bi bi-file-earmark-slides-fill"></i>
              <i v-else class="bi bi-file-earmark-text-fill"></i>
            </div>
            <div class="badges">
              <span class="pill type-pill">{{ file.resourceType }}</span>
            </div>
          </div>

          <div class="card-middle">
            <span class="course-code">{{ file.courseCode }}</span>
            <h3 class="file-title">{{ file.title }}</h3>
            <span class="department">
              By {{ file.uploadedBy || 'Admin' }} • {{ getYear(file.createdAt) }}
            </span>
          </div>

          <div class="card-bottom">
            <span class="file-size">Document</span>
            <a :href="file.fileUrl" target="_blank" class="download-btn">
              <i class="bi bi-cloud-download"></i> Download
            </a>
          </div>
        </div>
      </div>
    </section>
    </section>

    <section class="blogs" ref="blogsRef">
      <div class="pill" ref="blogsPillRef">Blogs</div>
      <h2 ref="blogsTitleRef">Latest academic blogs</h2>
      <div class="container" ref="blogsContainerRef">
        <BlogCard
          v-for="post in postsStore.posts"
          :key="post.id || post._id"
          :to="`/posts/${post.id || post._id}`"
          :imageSrc="post.fileUrl || 'https://placehold.co/600x400/151515/8a8a93?text=Update'"
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
import { ref, computed, onMounted } from "vue";
import { useResourcesStore } from "~/stores/useResourcesStore";
import { usePostsStore } from "~/stores/usePostsStore";

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

const resourcesStore = useResourcesStore();
const postsStore = usePostsStore();

// Filter States
const searchQuery = ref("");
const selectedType = ref("");

const resetFilters = () => {
  searchQuery.value = "";
  selectedType.value = "";
};

// Fetch data on mount
onMounted(() => {
  resourcesStore.fetchResources();
  postsStore.fetchPosts();
});



// Helper functions for UI mapping
const getFileFormat = (url) => {
  if (!url) return 'unknown';
  const lowerUrl = url.toLowerCase();
  if (lowerUrl.endsWith('.pdf')) return 'pdf';
  if (lowerUrl.endsWith('.doc') || lowerUrl.endsWith('.docx')) return 'doc';
  if (lowerUrl.endsWith('.ppt') || lowerUrl.endsWith('.pptx')) return 'ppt';
  return 'unknown';
};

const getYear = (dateStr) => {
  if (!dateStr) return 'N/A';
  try {
    return new Date(dateStr).getFullYear();
  } catch {
    return 'N/A';
  }
};

const formatDate = (dateStr) => {
  if (!dateStr) return "TBA";
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { 
      month: 'long', 
      day: 'numeric', 
      year: 'numeric' 
    });
  } catch {
    return dateStr;
  }
};

// Computed property to instantly filter the grid
const filteredResources = computed(() => {
  if (!resourcesStore.resources) return [];

  return resourcesStore.resources.filter((file) => {
    const safeTitle = (file.title || '').toLowerCase();
    const safeCode = (file.courseCode || '').toLowerCase();
    const query = searchQuery.value.toLowerCase();

    const matchesSearch = safeTitle.includes(query) || safeCode.includes(query);
    const matchesType = selectedType.value === "" || file.resourceType === selectedType.value;

    return matchesSearch && matchesType;
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

/* Spinner CSS */
.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255, 255, 255, 0.1);
  border-left-color: #3498db;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}
@keyframes spin { 100% { transform: rotate(360deg); } }

.error-alert { 
  text-align: center; 
  padding: 20px; 
  color: #ff4757; 
  border: 1px solid rgba(255, 71, 87, 0.3); 
  background: rgba(255, 71, 87, 0.05); 
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
              background: rgba(255, 255, 255, 0.1); /* fallback */
              color: #fff;

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
              text-decoration: none;
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