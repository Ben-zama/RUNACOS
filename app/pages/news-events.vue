<template>
  <div id="news-eventPage">
    <section class="news">
      <h3>Latest News & Updates</h3>
      <div class="container">
        <NewsCard
          v-for="article in paginatedNews"
          :key="article.id"
          :to="`/news/${article.id}`" 
          :image="article.image"
          :category="article.category"
          :date="article.date"
          :title="article.title"
          :excerpt="article.excerpt"
        />
      </div>
      <div class="pagination" v-if="totalNewsPages > 1">
        <button :disabled="newsPage === 1" @click="newsPage--">Prev</button>
        <span>Page {{ newsPage }} of {{ totalNewsPages }}</span>
        <button :disabled="newsPage === totalNewsPages" @click="newsPage++">Next</button>
      </div>
    </section>

    <section class="events">
      <h3>Upcoming events</h3>
      <div class="container">
        <EventCard
          v-for="event in paginatedEvents"
          :key="event.id"
          :to="`/events/${event.id}`"
          :image="event.image"
          :title="event.title"
          :date="event.date"
          :location="event.location"
          :description="event.description"
        />
      </div>
      <div class="pagination" v-if="totalEventsPages > 1">
        <button :disabled="eventsPage === 1" @click="eventsPage--">Prev</button>
        <span>Page {{ eventsPage }} of {{ totalEventsPages }}</span>
        <button :disabled="eventsPage === totalEventsPages" @click="eventsPage++">Next</button>
      </div>
    </section>

    <section class="blogs">
      <h3>Latest Blogs</h3>
      <div class="container">
        <BlogCard
          v-for="post in paginatedPosts"
          :key="post.id"
          :to="`/blog/${post.id}`"
          :imageSrc="post.image"
          :tags="post.tags"
          :title="post.title"
          :description="post.description"
          :author="post.author"
          :date="post.date"
        />
      </div>
      <div class="pagination" v-if="totalPostsPages > 1">
        <button :disabled="blogsPage === 1" @click="blogsPage--">Prev</button>
        <span>Page {{ blogsPage }} of {{ totalPostsPages }}</span>
        <button :disabled="blogsPage === totalPostsPages" @click="blogsPage++">Next</button>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, watch } from 'vue';

definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
    },
  },
});

// --- Responsive Items Per Page Logic ---
const itemsPerPage = ref(6);

const updateItemsPerPage = () => {
  const width = window.innerWidth;
  if (width < 600) {
    itemsPerPage.value = 3;
  } else if (width < 1280) {
    itemsPerPage.value = 4;
  } else {
    itemsPerPage.value = 6;
  }
};

onMounted(() => {
  updateItemsPerPage();
  window.addEventListener('resize', updateItemsPerPage);
});

onUnmounted(() => {
  window.removeEventListener('resize', updateItemsPerPage);
});

// --- Pagination State ---
const newsPage = ref(1);
const eventsPage = ref(1);
const blogsPage = ref(1);

watch(itemsPerPage, () => {
  newsPage.value = 1;
  eventsPage.value = 1;
  blogsPage.value = 1;
});

// --- Expanded Mock Data (IDs updated to slugs for dynamic routing) ---
const events = [
  { id: "tech-summit-2026", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop", title: "Global Tech Summit 2026", date: "March 25, 2026", location: "Main Auditorium, Ede", description: "Join industry leaders and innovators for a full day of keynotes..." },
  { id: "design-masterclass", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", title: "UI/UX Design Masterclass", date: "April 10, 2026", location: "Virtual Event", description: "Learn the secrets behind modern glassmorphism..." },
  { id: "founder-mixer", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop", title: "Startup Founders Mixer", date: "May 5, 2026", location: "Innovation Hub, Lagos", description: "An exclusive evening for startup founders to connect..." },
  { id: "ai-workshop", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop", title: "AI Integration Workshop", date: "June 12, 2026", location: "Tech Park", description: "Practical session on adding AI to your products." },
  { id: "web3-conference", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", title: "Web3 Developer Conference", date: "July 20, 2026", location: "Virtual Event", description: "Exploring smart contracts and decentralized apps." },
  { id: "fintech-summit", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop", title: "Fintech Innovation Summit", date: "August 15, 2026", location: "Lagos", description: "The future of digital banking and payments." },
  { id: "marketing-expo", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop", title: "Digital Marketing Expo", date: "Sept 10, 2026", location: "Abuja", description: "Latest trends in SEO, content, and growth." },
];

const posts = [
  { id: "scaling-financial", image: "sample.jpg", tags: ["AI", "Growth"], title: "Scaling Financial Services", description: "Coframe Drives over 26% Lift...", author: "Mark Henry", date: "March 13, 2026" },
  { id: "vue3-components", image: "sample.jpg", tags: ["Vue3"], title: "Reusable component system", description: "A deep dive into Nuxt 3 architectures.", author: "Mark Henry", date: "March 13, 2026" },
  { id: "api-design", image: "sample.jpg", tags: ["Engineering"], title: "REST vs GraphQL in 2026", description: "Choosing the right API paradigm.", author: "Jane Doe", date: "March 15, 2026" },
  { id: "css-grid", image: "sample.jpg", tags: ["Design"], title: "Mastering CSS Grid", description: "Advanced layouts made simple.", author: "John Smith", date: "March 16, 2026" },
  { id: "state-management", image: "sample.jpg", tags: ["Vue3"], title: "Pinia Best Practices", description: "Managing global state efficiently.", author: "Mark Henry", date: "March 18, 2026" },
  { id: "serverless", image: "sample.jpg", tags: ["Cloud"], title: "The Serverless Future", description: "Deploying at scale with zero servers.", author: "Alice Kim", date: "March 20, 2026" },
  { id: "web-accessibility", image: "sample.jpg", tags: ["UX"], title: "A11y First Development", description: "Building for everyone.", author: "Bob Lee", date: "March 22, 2026" },
];

const news = [
  { id: "js-framework", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80", category: "Technology", date: "March 18, 2026", title: "New JavaScript Framework", excerpt: "Claims unprecedented load speeds.", author: "Sarah Jenkins" },
  { id: "glassmorphism", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80", category: "Design", date: "March 15, 2026", title: "Evolution of Glassmorphism", excerpt: "How top brands are using translucent layers.", author: "Marcus Chen" },
  { id: "startup-funding", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80", category: "Business", date: "March 10, 2026", title: "EdTech Startup Secures $5M", excerpt: "Expansion plans for interactive tools.", author: "Amina Yusuf" },
  { id: "ai-regulations", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80", category: "Policy", date: "March 20, 2026", title: "New AI Regulations Announced", excerpt: "Government introduces compliance framework.", author: "Sarah Jenkins" },
  { id: "green-tech", image: "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80", category: "Technology", date: "March 22, 2026", title: "Breakthrough in Battery Tech", excerpt: "Smartphones could last a week.", author: "Marcus Chen" },
  { id: "remote-work", image: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80", category: "Business", date: "March 24, 2026", title: "The Return to Office Debate", excerpt: "Companies rethink remote policies.", author: "Amina Yusuf" },
  { id: "cybersecurity", image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80", category: "Technology", date: "March 25, 2026", title: "Major Data Breach Averted", excerpt: "Zero-day vulnerability patched.", author: "Sarah Jenkins" },
];

// --- Computed Properties for Pagination ---
const paginatedNews = computed(() => {
  const start = (newsPage.value - 1) * itemsPerPage.value;
  return news.slice(start, start + itemsPerPage.value);
});
const totalNewsPages = computed(() => Math.ceil(news.length / itemsPerPage.value));

const paginatedEvents = computed(() => {
  const start = (eventsPage.value - 1) * itemsPerPage.value;
  return events.slice(start, start + itemsPerPage.value);
});
const totalEventsPages = computed(() => Math.ceil(events.length / itemsPerPage.value));

const paginatedPosts = computed(() => {
  const start = (blogsPage.value - 1) * itemsPerPage.value;
  return posts.slice(start, start + itemsPerPage.value);
});
const totalPostsPages = computed(() => Math.ceil(posts.length / itemsPerPage.value));

</script>

<style lang="scss">
#news-eventPage {
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  gap: 50px;

  .news,
  .events,
  .blogs {
    display: flex;
    flex-direction: column;
    gap: 15px;
    h3 {
      font-size: $text-xl;
      font-weight: 900;
      line-height: 1.1;
      max-width: 600px;
      background: linear-gradient(135deg, #fff, #c1c0c0);
      background-clip: text;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      color: transparent;
    }
    .container {
      min-width: 100%;
      display: grid;
      gap: 15px;
    }
    
    /* Pagination Styling */
    .pagination {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 15px;
      margin-top: 10px;
      
      button {
        padding: 8px 16px;
        background-color: $translucent-secondary-color-50;
        backdrop-filter: blur(5px);
        color: #fff;
        border: none;
        border-radius: 4px;
        cursor: pointer;
        font-weight: 600;
        transition: opacity 0.2s;

        &:hover:not(:disabled) {
          opacity: 0.8;
        }

        &:disabled {
          background-color: #555;
          color: #888;
          cursor: not-allowed;
        }
      }
      
      span {
        font-size: 0.9rem;
        color: #c1c0c0;
      }
    }
  }

  @include respond-to(600px, 1279px) {
    padding: 50px 25px;
    .news,
    .events,
    .blogs {
      gap: 25px;
      > h3 {
        font-size: $text-2xl;
      }
      .container {
        grid-template-columns: repeat(2, 1fr);
        gap: 25px;
      }
    }
  }

  @include respond-to($min: 1280px) {
    padding: 100px;
    .news,
    .events,
    .blogs {
      gap: 25px;
      > h3 {
        font-size: $text-3xl;
      }
      .container {
        grid-template-columns: repeat(3, 1fr);
        gap: 25px;
      }
    }
  }
}
</style>