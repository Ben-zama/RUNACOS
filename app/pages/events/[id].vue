<template>
  <div id="event-details-page">
    <div class="glass-container" v-if="event">
      
      <div class="event-info glass-panel">
        <div class="image-wrapper">
          <img :src="event.image" :alt="event.title" />
        </div>
        <div class="info-content">
          <h1>{{ event.title }}</h1>
          <div class="meta">
            <span class="date">📅 {{ event.date }}</span>
            <span class="location">📍 {{ event.location }}</span>
          </div>
          <p class="description">{{ event.description }}</p>
          
          <div class="agenda">
            <h3>What to expect</h3>
            <ul>
              <li>Keynote speakers from top tech firms</li>
              <li>Hands-on networking sessions</li>
              <li>Exclusive Q&A panels</li>
            </ul>
          </div>
        </div>
      </div>

      <div class="registration-form glass-panel">
        <h2>Reserve Your Spot</h2>
        <p>Fill out the form below to secure your ticket.</p>
        
        <form @submit.prevent="submitRegistration">
          <div class="form-group">
            <label for="name">Full Name</label>
            <input type="text" id="name" v-model="form.name" required placeholder="Jane Doe" />
          </div>

          <div class="form-group">
            <label for="email">Email Address</label>
            <input type="email" id="email" v-model="form.email" required placeholder="jane@example.com" />
          </div>

          <button type="submit" class="submit-btn" :disabled="isSubmitting">
            {{ isSubmitting ? 'Processing...' : 'Register Now' }}
          </button>
        </form>
      </div>

    </div>
    
    <div v-else class="not-found">
      <h2>Loading event details...</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'; // or useRoute() directly in Nuxt

const route = useRoute();
const eventId = route.params.id;

definePageMeta({
  showPageTitle: true,
})

const dynamicPageTitle = useState('pageTitle', () => 'Loading...');

// --- State ---
const event = ref(null);
const isSubmitting = ref(false);
const form = ref({
  name: '',
  email: '',
});


// --- Mock Data Fetching ---
// In a real app, replace this with an API call: await useFetch(`/api/events/${eventId}`)
const fetchEventDetails = () => {
  const mockDatabase = [
  { id: "tech-summit-2026", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop", title: "Global Tech Summit 2026", date: "March 25, 2026", location: "Main Auditorium, Ede", description: "Join industry leaders and innovators for a full day of keynotes..." },
  { id: "design-masterclass", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", title: "UI/UX Design Masterclass", date: "April 10, 2026", location: "Virtual Event", description: "Learn the secrets behind modern glassmorphism..." },
  { id: "founder-mixer", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop", title: "Startup Founders Mixer", date: "May 5, 2026", location: "Innovation Hub, Lagos", description: "An exclusive evening for startup founders to connect..." },
  { id: "ai-workshop", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop", title: "AI Integration Workshop", date: "June 12, 2026", location: "Tech Park", description: "Practical session on adding AI to your products." },
  { id: "web3-conference", image: "https://images.unsplash.com/photo-1552664730-d307ca884978?q=80&w=1000&auto=format&fit=crop", title: "Web3 Developer Conference", date: "July 20, 2026", location: "Virtual Event", description: "Exploring smart contracts and decentralized apps." },
  { id: "fintech-summit", image: "https://images.unsplash.com/photo-1511795409834-ef04bbd61622?q=80&w=1000&auto=format&fit=crop", title: "Fintech Innovation Summit", date: "August 15, 2026", location: "Lagos", description: "The future of digital banking and payments." },
  { id: "marketing-expo", image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=1000&auto=format&fit=crop", title: "Digital Marketing Expo", date: "Sept 10, 2026", location: "Abuja", description: "Latest trends in SEO, content, and growth." },
];

  event.value = mockDatabase.find(e => e.id === eventId) || mockDatabase[0]; // Fallback to first item for testing

  route.meta.pageTitle = event.value.title;
};

onMounted(() => {
route.meta.pageTitle = 'Loading...';
  fetchEventDetails();
});

onUnmounted(() => {
  dynamicPageTitle.value = '';
  route.meta.pageTitle = '';
})

// --- Form Handler ---
const submitRegistration = async () => {
  isSubmitting.value = true;
  
  // Simulate API delay
  setTimeout(() => {
    console.log('Registration Submitted:', form.value, 'for event:', eventId);
    alert(`Thanks for registering, ${form.value.name}! Check your email for details.`);
    isSubmitting.value = false;
    
    // Reset form
    form.value = { name: '', email: '', ticketType: 'standard' };
  }, 1500);
};
</script>

<style lang="scss" scoped>
/* Base page styling assuming a dark or textured background exists to show off the glass */


#event-details-page {
  padding: 50px 15px;
  min-height: 100vh;
  display: flex;
  justify-content: center;
  align-items: flex-start;

  .glass-container {
    display: grid;
    grid-template-columns: 1fr;
    gap: 30px;
    max-width: 1200px;
    width: 100%;
  }

  /* Shared Glassmorphism Base */
  .glass-panel {
    background: rgba(255, 255, 255, 0.05); /* Adjust opacity based on your theme */
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border: 1px solid rgba(255, 255, 255, 0.1);
    box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2);
    border-radius: 20px;
    overflow: hidden;
    color: #fff; /* Assuming a dark theme for glass effect. Change to dark gray if light theme */
  }

  /* Left Side: Event Info */
  .event-info {
    display: flex;
    flex-direction: column;

    .image-wrapper {
      width: 100%;
      height: 300px;
      overflow: hidden;
      
      img {
        width: 100%;
        height: 100%;
        object-fit: cover;
        transition: transform 0.3s ease;
        
        &:hover {
          transform: scale(1.05);
        }
      }
    }

    .info-content {
      padding: 30px;

      h1 {
        font-size: 2.5rem;
        margin-bottom: 15px;
        line-height: 1.2;
        background: linear-gradient(135deg, #fff, #c1c0c0);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
      }

      .meta {
        display: flex;
        gap: 20px;
        margin-bottom: 25px;
        font-weight: 600;
        color: rgba(255, 255, 255, 0.8);
      }

      .description {
        font-size: 1.1rem;
        line-height: 1.6;
        color: rgba(255, 255, 255, 0.9);
        margin-bottom: 30px;
      }

      .agenda {
        h3 {
          font-size: 1.5rem;
          margin-bottom: 15px;
        }
        ul {
          list-style-type: disc;
          padding-left: 20px;
          li {
            margin-bottom: 10px;
            color: rgba(255, 255, 255, 0.8);
          }
        }
      }
    }
  }

  /* Right Side: Form */
  .registration-form {
    padding: 40px 30px;
    height: fit-content;

    h2 {
      font-size: 2rem;
      margin-bottom: 10px;
    }

    p {
      color: rgba(255, 255, 255, 0.7);
      margin-bottom: 30px;
    }

    form {
      display: flex;
      flex-direction: column;
      gap: 20px;

      .form-group {
        display: flex;
        flex-direction: column;
        gap: 8px;

        label {
          font-size: 0.95rem;
          font-weight: 500;
          color: rgba(255, 255, 255, 0.9);
        }

        /* Glassmorphic Inputs */
        input, select {
          width: 100%;
          padding: 14px;
          background: rgba(255, 255, 255, 0.08);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 10px;
          color: #fff;
          font-size: 1rem;
          outline: none;
          transition: border-color 0.2s, background 0.2s;

          &::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }

          &:focus {
            background: rgba(255, 255, 255, 0.12);
            border-color: rgba(255, 255, 255, 0.5);
          }
          
          option {
            background-color: #333; /* Fallback for native select dropdowns */
            color: #fff;
          }
        }
      }

      .submit-btn {
        margin-top: 10px;
        padding: 16px;
        background: #fff;
        color: #000;
        border: none;
        border-radius: 10px;
        font-size: 1.1rem;
        font-weight: bold;
        cursor: pointer;
        transition: transform 0.2s, opacity 0.2s;

        &:hover:not(:disabled) {
          transform: translateY(-2px);
          opacity: 0.9;
        }

        &:disabled {
          background: rgba(255, 255, 255, 0.3);
          cursor: not-allowed;
        }
      }
    }
  }

  /* Responsive Layout */
  @include respond-to($min: 992px) {
    .glass-container {
      grid-template-columns: 3fr 2fr; /* 60% Event / 40% Form */
      align-items: start;
    }
  }
}
</style>