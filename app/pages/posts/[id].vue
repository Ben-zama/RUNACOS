<template>
  <div id="article-reader-page">
    <template v-if="article && !isLoading">
      <header class="article-header">
        <div class="gradient-sphere sphere-1"></div>
        <div class="gradient-sphere sphere-2"></div>
        <div class="noise"></div>
        <div class="grid-overlay"></div>

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
          <img
            :src="
              article.fileUrl ||
              'https://placehold.co/1000x400/151515/8a8a93?text=Post+Banner'
            "
            :alt="article.title"
          />
        </div>

        <article class="glass-panel article-body">
          <div class="markdown-content" v-html="renderedContent"></div>
        </article>
      </div>
    </template>

    <div v-else-if="error" class="loading-state">
      <i class="bi bi-exclamation-triangle"></i>
      <h2>{{ error }}</h2>
      <NuxtLink to="/news-events" class="back-link" style="margin-top: 20px">
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
import { useRunacosApi } from "~/composables/useRunacosApi";

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
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "long",
      day: "numeric",
      year: "numeric",
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
  if (!article.value?.content) return "";
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
    z-index: 1;

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
    height: 250px;
    border-radius: 0 0 20px 20px;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 1;
    margin-bottom: 300px;

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

    .content {
      position: absolute;
      top: 0;
      left: 0;
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

      .tags {
        display: flex;
        flex-wrap: wrap;
        justify-content: center;
        gap: 10px;

        .pill {
          background: color-mix(
            in srgb,
            var(--background-color) 20%,
            transparent
          );
          backdrop-filter: blur(5px);
          border: 1px solid
            color-mix(in srgb, var(--text-color) 10%, transparent);
          padding: 6px 16px;
          border-radius: 30px;
          font-size: 0.85rem;
          font-weight: 600;

          &.type-pill {
            background: rgba($accent-color, 0.7);
            border-color: $accent-color;
            color: #fff;
          }
        }
      }

      h1 {
        font-size: 2.5rem;
        font-weight: 900;
        line-height: 1.1;
        letter-spacing: 1.5px;
        max-width: 700px;
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
      }

      .article-meta {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        font-size: 0.95rem;

        .author {
          display: flex;
          align-items: center;
          gap: 10px;
          font-weight: 600;

          .avatar {
            width: 35px;
            height: 35px;
            background: color-mix(
              in srgb,
              var(--secondary-color) 20%,
              transparent
            );
            border: 1px solid
              color-mix(in srgb, var(--text-color) 10%, transparent);
            backdrop-filter: blur(10px);
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

  .glass-panel {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--secondary-color) 10%, transparent) 0%,
      color-mix(in srgb, var(--alternate-color) 10%, transparent) 100%
    );
    backdrop-filter: blur(10px);
    border: 1px solid color-mix(in srgb, var(--text-color) 20%, transparent);
    border-radius: 20px;
  }

  .article-body {
    padding: 40px;
  }

  :deep(.markdown-content) {
    font-size: 1.1rem;
    line-height: 1.8;

    p {
      margin-bottom: 25px;
      opacity: 0.8;
    }

    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin: 40px 0 20px 0;
      line-height: 1.3;
    }

    h1,
    h2 {
      font-size: 1.8rem;
      border-bottom: 1px solid
        color-mix(in srgb, var(--text-color) 10%, transparent);
      padding-bottom: 10px;
    }
    h3 {
      font-size: 1.5rem;
    }

    blockquote {
      margin: 40px 0;
      padding: 20px 30px;
      background: rgba($accent-color, 0.05);
      border-left: 4px solid $accent-color;
      border-radius: 0 12px 12px 0;
      font-size: 1.2rem;
      font-style: italic;
      color: #fff;

      p:last-child {
        margin-bottom: 0;
      }
    }

    a {
      color: $accent-color;
      text-decoration: none;
      border-bottom: 1px solid transparent;
      transition: 0.3s;
      &:hover {
        border-bottom-color: $accent-color;
      }
    }

    ul,
    ol {
      margin-bottom: 25px;
      padding-left: 20px;
      li {
        margin-bottom: 10px;
      }
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
      border: 1px solid rgba(255, 255, 255, 0.05);
      code {
        background: transparent;
        padding: 0;
        color: #fff;
      }
    }

    img {
      max-width: 100%;
      border-radius: 12px;
      margin: 20px 0;
    }

    hr {
      border: 0;
      border-top: 1px solid
        color-mix(in srgb, var(--text-color) 20%, transparent);
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

    i {
      font-size: 3rem;
    }
    h2 {
      font-size: 1.2rem;
      font-weight: 500;
    }
    .spin {
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin {
    100% {
      transform: rotate(360deg);
    }
  }

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

      .sphere-1 {
        height: 25vw;
        width: 25vw;
      }
      .sphere-2 {
        height: 20vw;
        width: 20vw;
      }

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