<template>
  <div id="article-reader-page">
    
    <template v-if="article && !isLoading">
      
      <header class="article-header">
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

        <div class="content">
          <div class="tags">
            <span class="pill type-pill">ARTICLE</span>
          </div>

          <h1>{{ article.title }}</h1>

          <div class="article-meta">
            <div class="author">
              <div class="avatar">
                <i class="bi bi-person-fill"></i>
              </div>
              <span>{{ article.authorName }}</span>
            </div>
            <span class="divider">•</span>
            <span class="date">{{ formatDate(article.createdAt) }}</span>
          </div>
        </div>
      </header>

      <NuxtLink to="/news-events" class="back-link">
        <i class="bi bi-arrow-left"></i> Back to News & Blogs
      </NuxtLink>

      <div class="article-container">
        <div class="hero-image">
          <img :src="article.fileUrl || 'https://placehold.co/1000x400/151515/8a8a93?text=Post+Banner'" :alt="article.title" />
        </div>

        <article class="glass-panel article-body">
          <div class="markdown-content" v-html="renderedContent"></div>
        </article>
      </div>

    </template>

    <div v-else-if="error" class="loading-state">
      <i class="bi bi-exclamation-triangle"></i>
      <h2>{{ error }}</h2>
      <NuxtLink to="/news-events" class="back-link" style="margin-top: 20px;">
        <i class="bi bi-arrow-left"></i> Return to News & Blogs
      </NuxtLink>
    </div>

    <div v-else class="loading-state">
      <i class="bi bi-arrow-repeat spin"></i>
      <h2>Loading article...</h2>
    </div>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import { marked } from "marked";
import { useRunacosApi } from '~/composables/useRunacosApi';

const route = useRoute();
const articleId = route.params.id;
const { apiFetch } = useRunacosApi();

definePageMeta({
  layout: {
    props: {
      showPageTitle: false, // Turn off global title to let the article title shine
    },
  },
});

const article = ref(null);
const isLoading = ref(true);
const error = ref(null);

// --- Formatter ---
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

// --- API Data Fetching ---
const fetchArticleDetails = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const data = await apiFetch(`/posts/${articleId}`);
    
    // Safely assign post (handling cases where backend wraps in an array)
    article.value = Array.isArray(data) ? data[0] : data;
    
    if (!article.value) {
      error.value = "Article not found.";
    }
  } catch (err) {
    console.error("Failed to load article:", err);
    error.value = "Failed to load the article. Please try again later.";
  } finally {
    isLoading.value = false;
  }
};

// --- Markdown Rendering ---
const renderedContent = computed(() => {
  if (!article.value?.content) return '';
  // Parse the markdown string into HTML
  return marked.parse(article.value.content);
});

onMounted(() => {
  fetchArticleDetails();
});
</script>

<style lang="scss" scoped>
#article-reader-page {
  padding: 50px 15px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .article-container {
    display: flex;
    flex-direction: column;
    max-width: 800px; 
    width: 100%;
  }

  .back-link {
    margin-top: 450px;
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #8a8a93;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
    width: max-content;
    margin-bottom: 30px;
    z-index: 10; 

    i {
      transition: transform 0.3s ease;
    }

    &:hover {
      color: $accent-color;
      i {
        transform: translateX(-5px);
      }
    }
  }

  /* --- Article Header with ColorBends Background --- */
  .article-header {
    position: absolute;
    width: 100%;
    height: 400px;
    border-radius: 0 0 20px 20px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    margin-bottom: 300px;

    .content {
      position: absolute;
      z-index: 3;
      display: flex;
      flex-direction: column;
      justify-content: center;
      align-items: center;
      text-align: center;
      gap: 20px;
      padding: 40px;
      width: 100%;
      height: 100%;
      background: $translucent-background-color; 
      backdrop-filter: blur(10px); 
      -webkit-backdrop-filter: blur(10px);

      .tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;

        .pill {
          background: $translucent-background-color;
          backdrop-filter: blur(5px);
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;

          &.type-pill {
            background: rgba($accent-color, 0.8);
            border-color: $accent-color;
          }
        }
      }

      h1 {
        font-size: 2.5rem;
        line-height: 1.2;
        margin: 0;
        color: #fff;
        text-shadow: 0 4px 15px rgba(0,0,0,0.5); 
      }

      .article-meta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        color: rgba(255, 255, 255, 0.9);
        font-size: 0.95rem;

        .author {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;

          .avatar {
            width: 35px;
            height: 35px;
            background: rgba(0, 0, 0, 0.5);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 50%;
            display: flex;
            justify-content: center;
            align-items: center;
          }
        }
      }
    }
  }

  /* --- Hero Image --- */
  .hero-image {
    width: 100%;
    height: 400px;
    border-radius: 20px;
    overflow: hidden;
    margin: 20px 0;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  /* --- Article Body --- */
  .glass-panel {
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.03) 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
  }

  .article-body {
    padding: 40px;
  }

  /* --- Markdown Content Styling --- */
  /* Using :deep() to target the injected HTML from Marked.js */
  :deep(.markdown-content) {
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.1rem;
    line-height: 1.8;

    p {
      margin-bottom: 25px;
    }

    h1, h2, h3, h4, h5, h6 {
      color: #fff;
      margin: 40px 0 20px 0;
      line-height: 1.3;
    }

    h2 { font-size: 1.8rem; border-bottom: 1px solid rgba(255,255,255,0.1); padding-bottom: 10px; }
    h3 { font-size: 1.5rem; }

    blockquote {
      margin: 40px 0;
      padding: 20px 30px;
      background: rgba($accent-color, 0.05);
      border-left: 4px solid $accent-color;
      border-radius: 0 12px 12px 0;
      font-size: 1.2rem;
      font-style: italic;
      color: #fff;

      p:last-child { margin-bottom: 0; }
    }

    a {
      color: $accent-color;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: 0.3s;
      &:hover { border-bottom-color: $accent-color; }
    }

    ul, ol {
      margin-bottom: 25px;
      padding-left: 20px;
      li { margin-bottom: 10px; }
    }

    code {
      background: rgba(0, 0, 0, 0.3);
      padding: 2px 6px;
      border-radius: 4px;
      font-family: monospace;
      font-size: 0.9em;
      color: #f8a5c2;
    }

    pre {
      background: #111;
      padding: 20px;
      border-radius: 12px;
      overflow-x: auto;
      margin-bottom: 25px;
      border: 1px solid rgba(255,255,255,0.05);
      code { background: transparent; padding: 0; color: #fff; }
    }

    img {
      max-width: 100%;
      border-radius: 12px;
      margin: 20px 0;
    }
    
    hr {
      border: 0;
      border-top: 1px solid rgba(255,255,255,0.1);
      margin: 40px 0;
    }
  }

  .loading-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: 100px;
    color: #8a8a93;

    i { font-size: 3rem; }
    h2 { font-size: 1.2rem; font-weight: 500; }
    .spin { animation: spin 1s linear infinite; }
  }

  @keyframes spin { 100% { transform: rotate(360deg); } }

  /* --- Media Queries --- */
  @include respond-to(600px, 1023px) {
    padding: 75px 50px;
    
    .article-header {
      min-height: 450px;
    }
  }

  @include respond-to($min: 1024px) {
    padding: 100px 50px;

    .article-header {
      min-height: 500px; 
      
      .content h1 {
        font-size: 3.5rem;
      }
    }
    
    .article-body {
      padding: 60px;
    }
  }
}
</style>