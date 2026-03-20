<template>
  <div id="news-eventPage">
    <section class="news">
      <h3>Latest News & Updates</h3>
      <div class="container">
        <NewsCard
          v-for="article in news"
          :key="article.id"
          :to="article.to"
          :image="article.image"
          :category="article.category"
          :date="article.date"
          :title="article.title"
          :excerpt="article.excerpt"
        />
      </div>
    </section>

    <section class="events">
      <h3>Upcoming events</h3>
      <div class="container">
        <EventCard
          v-for="event in events"
          :key="event.id"
          :to="event.to"
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
definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
      pageTitle: "News & Events",
    },
  },
});

const events = [
  {
    id: 1,
    to: "/events/tech-summit-2026",
    image:
      "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop",
    title: "Global Tech Summit 2026",
    date: "March 25, 2026",
    location: "Main Auditorium, Ede",
    description:
      "Join industry leaders and innovators for a full day of keynotes, networking, and deep dives into the future of AI and web development.",
  },
  {
    id: 2,
    to: "/events/design-masterclass",
    image:
      "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop",
    title: "UI/UX Design Masterclass",
    date: "April 10, 2026",
    location: "Virtual Event",
    description:
      "Learn the secrets behind modern glassmorphism, advanced CSS animations, and creating intuitive user experiences in this hands-on workshop.",
  },
  {
    id: 3,
    to: "/events/founder-mixer",
    image:
      "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop",
    title: "Startup Founders Mixer",
    date: "May 5, 2026",
    location: "Innovation Hub, Lagos",
    description:
      "An exclusive evening for startup founders to connect, share ideas, and meet with potential angel investors over drinks and light music.",
  },
];

const posts = [
  {
    id: 1,
    link: "/blog/scaling-financial-services",
    image: "sample.jpg",
    tags: ["Customer Stories", "AI", "Growth"],
    title: "Scaling Financial Services Personalization for $100Bn+ Enterprise",
    description: "Coframe Drives over 26% Lift in Financial Services",
    author: "Mark Henry",
    date: "March 13, 2026"
  },
  {
    id: 2,
    link: "/blog/next-post",
    image: "sample.jpg",
    tags: ["Engineering", "Vue3"],
    title: "How we built a reusable component system",
    description: "A deep dive into Nuxt 3 architectures.",
    author: "Mark Henry",
    date: "March 13, 2026"
  },
  {
    id: 3,
    link: "/blog/next-post",
    image: "sample.jpg",
    tags: ["Engineering", "Vue3"],
    title: "How we built a reusable component system",
    description: "A deep dive into Nuxt 3 architectures.",
    author: "Mark Henry",
    date: "March 13, 2026"
  },
];

const news = [
  {
    id: 1,
    to: "/news/js-framework-release",
    image:
      "https://images.unsplash.com/photo-1498050108023-c5249f4df085?q=80&w=1000&auto=format&fit=crop",
    category: "Technology",
    date: "March 18, 2026",
    title: "New JavaScript Framework Promises 10x Faster Renders",
    excerpt:
      "A group of open-source developers just dropped a revolutionary front-end framework that completely rethinks the virtual DOM, claiming unprecedented load speeds.",
    author: "Sarah Jenkins",
  },
  {
    id: 2,
    to: "/news/glassmorphism-evolution",
    image:
      "https://images.unsplash.com/photo-1558655146-d09347e92766?q=80&w=1000&auto=format&fit=crop",
    category: "Design",
    date: "March 15, 2026",
    title: "The Evolution of Glassmorphism in Modern UI",
    excerpt:
      "What started as a fleeting trend has evolved into a staple of premium web design. Here is how top brands are using translucent layers to create depth.",
    author: "Marcus Chen",
  },
  {
    id: 3,
    to: "/news/local-startup-funding",
    image:
      "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?q=80&w=1000&auto=format&fit=crop",
    category: "Business",
    date: "March 10, 2026",
    title: "Local EdTech Startup Secures $5M in Series A Funding",
    excerpt:
      "The Kano-based education platform plans to use the fresh capital to expand its interactive learning tools and reach an additional one million students.",
    author: "Amina Yusuf",
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