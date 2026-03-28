<template>
  <div id="news-eventPage">
    <section class="news">
      <h3>Latest News & Updates</h3>
      <div class="container">
        <NewsCard
          v-for="article in news"
          :key="article.id"
          :to="`/posts/${article.id}`"
          :image="article.image"
          :category="article.tags[0]"
          :date="article.date"
          :title="article.title"
          :excerpt="article.description"
        />
      </div>
    </section>

    <section class="events">
      <h3>Upcoming events</h3>
      <div class="container">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :to="`/events/${event.id}`"
          :image="event.image"
          :title="event.title"
          :date="event.date"
          :location="event.location"
          :description="event.description"
        />
      </div>
    </section>

    <section class="blogs">
      <h3>Latest Blogs</h3>
      <div class="container">
        <BlogCard
          v-for="post in posts"
          :key="post.id"
          :to="`/posts/${post.id}`"
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
definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
    },
  },
});

useHead({
  title: 'Latest news & events',
})

// --- Mock Data (IDs updated to slugs for dynamic routing) ---
const events = [
  {
    id: "tech-summit-2026",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    title: "Global Tech Summit 2026",
    date: "March 25, 2026",
    location: "Main Auditorium, Ede",
    description:
      "Join industry leaders and innovators for a full day of keynotes...",
  },
  {
    id: "design-masterclass",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop",
    title: "UI/UX Design Masterclass",
    date: "April 10, 2026",
    location: "Virtual Event",
    description: "Learn the secrets behind modern glassmorphism...",
  },
  {
    id: "founder-mixer",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    title: "Startup Founders Mixer",
    date: "May 5, 2026",
    location: "Innovation Hub, Lagos",
    description: "An exclusive evening for startup founders to connect...",
  },
];

const posts = [
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
    image: "https://images.unsplash.com/photo-1516116216624-53e697fedbea?q=80",
    tags: ["Engineering"],
    title: "REST vs GraphQL in 2026",
    description:
      "Choosing the right API paradigm for your next major tech stack.",
    author: "Jane Doe",
    date: "March 15, 2026",
  },
];

const news = [
  {
    id: "js-framework",
    type: "news",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80",
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