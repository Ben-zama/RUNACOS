<template>
  <div id="article-reader-page">
    
    <template v-if="article">
      

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
            <span v-for="tag in article.tags" :key="tag" class="pill">{{ tag }}</span>
            <span class="pill type-pill">{{ article.type.toUpperCase() }}</span>
          </div>

          <h1>{{ article.title }}</h1>

          <div class="article-meta">
            <div class="author">
              <div class="avatar">
                <i class="bi bi-person-fill"></i>
              </div>
              <span>{{ article.author }}</span>
            </div>
            <span class="divider">•</span>
            <span class="date">{{ article.date }}</span>
          </div>
        </div>
      </header>

            <NuxtLink to="/news-events" class="back-link">
        <i class="bi bi-arrow-left"></i> Back to News & Blogs
      </NuxtLink>

      <div class="article-container">
        <div class="hero-image">
          <img :src="article.image" :alt="article.title" />
        </div>

        <article class="glass-panel article-body">
          <p class="lead">{{ article.description }}</p>

          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do
            eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad
            minim veniam, quis nostrud exercitation ullamco laboris nisi ut
            aliquip ex ea commodo consequat.
          </p>

          <h3>The Impact on the Industry</h3>
          <p>
            Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
            dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non
            proident, sunt in culpa qui officia deserunt mollit anim id est
            laborum.
          </p>

          <blockquote>
            "This represents a massive shift in how we approach problem-solving in
            this sector. The results speak for themselves."
            <cite>- {{ article.author }}</cite>
          </blockquote>

          <p>
            Sed ut perspiciatis unde omnis iste natus error sit voluptatem
            accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae
            ab illo inventore veritatis et quasi architecto beatae vitae dicta
            sunt explicabo.
          </p>
        </article>
      </div>

    </template>

    <div v-else class="loading-state">
      <i class="bi bi-file-earmark-x"></i>
      <h2>Loading article...</h2>
    </div>

  </div>
</template>


<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const articleId = route.params.id;

definePageMeta({
  layout: {
    props: {
      showPageTitle: false, // Turn off global title to let the article title shine
    },
  },
});

const article = ref(null);

// --- Mock Data Fetching ---
const fetchArticleDetails = () => {
  // We combine both arrays here just like a backend query would search both tables
  const allArticles = [
    {
      id: "scaling-financial",
      type: "blog",
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80",
      tags: ["AI", "Growth"],
      title: "Scaling Financial Services",
      description:
        "Coframe Drives over 26% Lift in conversion rates using new predictive models.",
      author: "Mark Henry",
      date: "March 13, 2026",
    },
    {
      id: "vue3-components",
      type: "blog",
      image: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80",
      tags: ["Vue3"],
      title: "Reusable component system",
      description:
        "A deep dive into Nuxt 3 architectures and how to build scalable UI libraries.",
      author: "Mark Henry",
      date: "March 13, 2026",
    },
    {
      id: "api-design",
      type: "blog",
      image:
        "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80",
      tags: ["Engineering"],
      title: "REST vs GraphQL in 2026",
      description:
        "Choosing the right API paradigm for your next major tech stack.",
      author: "Jane Doe",
      date: "March 15, 2026",
    },
    {
      id: "js-framework",
      type: "news",
      image:
        "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80",
      tags: ["Technology"],
      title: "New JavaScript Framework",
      description:
        "Claims unprecedented load speeds and a completely novel approach to state.",
      author: "Sarah Jenkins",
      date: "March 18, 2026",
    },
    {
      id: "glassmorphism",
      type: "news",
      image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80",
      tags: ["Design"],
      title: "Evolution of Glassmorphism",
      description:
        "How top brands are using translucent layers to create depth in 2026.",
      author: "Marcus Chen",
      date: "March 15, 2026",
    },
    {
      id: "startup-funding",
      type: "news",
      image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80",
      tags: ["Business"],
      title: "EdTech Startup Secures $5M",
      description:
        "Expansion plans for interactive tools aimed at university students globally.",
      author: "Amina Yusuf",
      date: "March 10, 2026",
    },
  ];

  article.value = allArticles.find((a) => a.id === articleId);
};

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
    z-index: 10; // Ensure it stays clickable above backgrounds

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

    // The actual text content
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
       background: $translucent-background-color; // Darkens the bright colors slightly
      backdrop-filter: blur(10px); // Blurs the ColorBends effect
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
        text-shadow: 0 4px 15px rgba(0,0,0,0.5); // Helps text pop off the background
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
    color: rgba(255, 255, 255, 0.85);
    font-size: 1.1rem;
    line-height: 1.8;

    .lead {
      font-size: 1.3rem;
      font-weight: 500;
      color: #fff;
      margin-top: 0;
      margin-bottom: 30px;
    }

    p {
      margin-bottom: 25px;
    }

    h3 {
      font-size: 1.5rem;
      color: #fff;
      margin: 40px 0 20px 0;
    }

    blockquote {
      margin: 40px 0;
      padding: 30px;
      background: rgba($accent-color, 0.05);
      border-left: 4px solid $accent-color;
      border-radius: 0 12px 12px 0;
      font-size: 1.3rem;
      font-style: italic;
      color: #fff;

      cite {
        display: block;
        margin-top: 15px;
        font-size: 0.95rem;
        font-style: normal;
        color: $accent-color;
        font-weight: 600;
      }
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
      min-height: 500px; // Larger header on desktop
      
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