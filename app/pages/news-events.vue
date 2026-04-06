<template>
  <div id="news-eventPage">
    
    <section class="events">
      <h3>Upcoming Events</h3>
      
      <div v-if="eventsStore.isLoading" class="status-state">
        <div class="spinner"></div><p>Loading events...</p>
      </div>
      <div v-else-if="eventsStore.events.length === 0" class="status-state empty">
        <p>No upcoming events at the moment.</p>
      </div>
      
      <div v-else class="container">
        <EventCard
          v-for="event in eventsStore.events"
          :key="event.id || event._id"
          :to="`/events/${event.id || event._id}`"
          :image="event.fileUrl || 'https://placehold.co/600x400/151515/8a8a93?text=Event'"
          :title="event.title"
          :date="formatDate(event.eventTime)"
          :location="event.eventType || 'Campus'"
          :description="event.description"
        />
      </div>
    </section>

    <section class="posts">
      <h3>Latest News & Blogs</h3>
      
      <div v-if="postsStore.isLoading" class="status-state">
        <div class="spinner"></div><p>Loading posts...</p>
      </div>
      <div v-else-if="postsStore.posts.length === 0" class="status-state empty">
        <p>No news or blog posts found.</p>
      </div>

      <div v-else class="container">
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
import { onMounted } from "vue";
import { useEventsStore } from "~/stores/useEventsStore";
import { usePostsStore } from "~/stores/usePostsStore";

definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
    },
  },
});

useHead({
  title: 'Latest News & Events',
})

const eventsStore = useEventsStore();
const postsStore = usePostsStore();

// Fetch live data on mount
onMounted(() => {
  eventsStore.fetchEvents();
  postsStore.fetchPosts();
});

// Helper to format ISO dates beautifully
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
</script>

<style lang="scss">
#news-eventPage {
  padding: 25px 15px;
  display: flex;
  flex-direction: column;
  gap: 50px;

  .events,
  .posts {
    display: flex;
    flex-direction: column;
    gap: 15px;
    
    h3 {
      font-size: $text-xl;
      font-weight: 900;
      line-height: 1.1;
      max-width: 600px;
      background: linear-gradient(
          135deg,
          var(--text-color),
          var(--text-gradient-color)
        );
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

  /* Loading & Empty States */
  .status-state {
    padding: 40px;
    border: 1px dashed rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    text-align: center;
    color: #8a8a93;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;

    .spinner {
      width: 30px;
      height: 30px;
      border: 3px solid rgba(255, 255, 255, 0.1);
      border-left-color: $accent-color;
      border-radius: 50%;
      animation: spin 1s linear infinite;
    }
  }

  @keyframes spin { 100% { transform: rotate(360deg); } }

  @include respond-to(600px, 1279px) {
    padding: 50px 25px;
    .events,
    .posts {
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
    .events,
    .posts {
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