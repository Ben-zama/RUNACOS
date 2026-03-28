<template>
  <div id="event-details-page">
    <div class="container-wrapper" v-if="event">
      
      <NuxtLink to="/news-events" class="back-link">
        <i class="bi bi-arrow-left"></i> Back to Events
      </NuxtLink>
      
      <div class="event-info glass-panel">
        <div class="image-wrapper">
          <img :src="event.image" :alt="event.title" />
          <div class="overlay"></div>
        </div>
        
        <div class="info-content">
          <div class="meta-tags">
            <span class="pill"><i class="bi bi-calendar3"></i> {{ event.date }}</span>
            <span class="pill"><i class="bi bi-geo-alt-fill"></i> {{ event.location }}</span>
          </div>
          
          <h1>{{ event.title }}</h1>
          <p class="description">{{ event.description }}</p>
          
          <div class="action-section">
            <button class="register-btn" @click="handleRegistration">
              Register Here <i class="bi bi-arrow-right"></i>
            </button>
          </div>
        </div>
      </div>

    </div>
    
    <div v-else class="loading-state">
      <i class="bi bi-arrow-repeat spin"></i>
      <h2>Loading event details...</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'; 

const route = useRoute();
const eventId = route.params.id;

definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
    },
  },
})

const dynamicPageTitle = useState('pageTitle', () => 'Loading...');
const event = ref(null);

// --- Form Handler ---
const handleRegistration = () => {
  // You can trigger a modal here, or route the user to a signup page!
  alert(`Registration initiated for: ${event.value.title}`);
}

// --- Mock Data Fetching ---
const fetchEventDetails = () => {
  const mockDatabase = [
    { id: "tech-summit-2026", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop", title: "Global Tech Summit 2026", date: "March 25, 2026", location: "Main Auditorium, Ede", description: "Join industry leaders and innovators for a full day of keynotes, networking, and deep dives into the future of AI and web development. This summit brings together the brightest minds in the industry." },
    { id: "design-masterclass", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", title: "UI/UX Design Masterclass", date: "April 10, 2026", location: "Virtual Event", description: "Learn the secrets behind modern glassmorphism, advanced animations, and creating intuitive user experiences in this hands-on workshop." },
    { id: "founder-mixer", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop", title: "Startup Founders Mixer", date: "May 5, 2026", location: "Innovation Hub, Lagos", description: "An exclusive evening for startup founders to connect, share ideas, and meet with potential angel investors over drinks and light music." },
    { id: "ai-workshop", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop", title: "AI Integration Workshop", date: "June 12, 2026", location: "Tech Park", description: "Practical session on adding AI to your products." },
    { id: "web3-conference", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", title: "Web3 Developer Conference", date: "July 20, 2026", location: "Virtual Event", description: "Exploring smart contracts and decentralized apps." },
  ];

  event.value = mockDatabase.find(e => e.id === eventId) || mockDatabase[0]; 

  route.meta.pageTitle = event.value.title;
};

onMounted(() => {
  route.meta.pageTitle = 'Loading...';
  fetchEventDetails();
});

onUnmounted(() => {
  dynamicPageTitle.value = '';
})
</script>

<style lang="scss" scoped>
#event-details-page {
  padding: 50px 15px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;

  .container-wrapper {
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 900px; 
    width: 100%;
  }

  .back-link {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: #8a8a93;
    text-decoration: none;
    font-weight: 600;
    transition: color 0.3s ease;
    width: max-content;

    i { transition: transform 0.3s ease; }

    &:hover {
      color: #fff; 
      i { transform: translateX(-5px); }
    }
  }

  /* Shared Glassmorphism Base */
  .glass-panel {
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.04) 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 20px;
    overflow: hidden;
    color: #fff;
  }

  /* Event Info Card */
  .event-info {
    display: flex;
    flex-direction: column;

    .image-wrapper {
      position: relative;
      width: 100%;
      height: 400px; 
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
      }

      .overlay {
        position: absolute;
        inset: 0;
        background: linear-gradient(to top, rgba(0,0,0,0.8) 0%, transparent 60%);
      }
    }

    .info-content {
      padding: 40px;
      display: flex;
      flex-direction: column;
      gap: 25px;

      .meta-tags {
        display: flex;
        flex-wrap: wrap;
        gap: 15px;
        margin-top: -65px; 
        z-index: 2;
        position: relative;

        .pill {
          display: flex;
          align-items: center;
          gap: 8px;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(10px);
          border: 1px solid rgba(255, 255, 255, 0.1);
          padding: 8px 20px;
          border-radius: 30px;
          font-family: $alternate-font; 
          font-size: 0.95rem;
          font-weight: 600;
          color: #fff;

          i { color: $accent-color; } /* You can swap this with your $accent-color variable */
        }
      }

      h1 {
        font-size: 2.5rem;
        margin: 0;
        line-height: 1.2;
        background: linear-gradient(135deg, #fff, #c1c0c0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .description {
        font-size: 1.1rem;
        line-height: 1.8;
        color: rgba(255, 255, 255, 0.85);
        margin: 0;
      }

      /* Registration CTA Button */
      .action-section {
        margin-top: 15px;

        .register-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: $accent-color; /* Use your $accent-color here */
          color: #fff;
          border: none;
          padding: 16px 32px;
          border-radius: 12px;
          font-size: 1.1rem;
          font-weight: 700;
          cursor: pointer;
          transition: all 0.3s ease;
          width: max-content;

          &:hover {
            transform: translateY(-3px);
            background: #2563eb;
          }

          i {
            font-size: 1.2rem;
            transition: transform 0.3s ease;
          }

          &:hover i {
            transform: translateX(5px);
          }
        }
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

    i { font-size: 2.5rem; }
    h2 { font-size: 1.2rem; font-weight: 500; }
    
    .spin { animation: spin 1s linear infinite; }
  }

  @keyframes spin {
    100% { transform: rotate(360deg); }
  }

  /* Responsive Layout */
  @include respond-to(600px, 1023px) {
    padding: 75px 50px;
  }

  @include respond-to($min: 1024px) {
    padding: 100px 50px;

    .event-info .info-content {
      padding: 50px 60px;
      
      h1 { font-size: 3.5rem; }
    }
  }
}
</style>