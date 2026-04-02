<template>
  <div id="event-details-page">
    <div class="container-wrapper" v-if="event && !isLoading">
      
      <NuxtLink to="/news-events" class="back-link">
        <i class="bi bi-arrow-left"></i> Back to Events
      </NuxtLink>
      
      <div class="event-info glass-panel">
        <div class="image-wrapper">
          <img :src="event.fileUrl || 'https://placehold.co/1000x400/151515/8a8a93?text=Event+Banner'" :alt="event.title" />
          <div class="overlay"></div>
        </div>
        
        <div class="info-content">
          <div class="meta-tags">
            <span class="pill"><i class="bi bi-calendar3"></i> {{ formatDate(event.eventTime) }}</span>
            <span class="pill"><i class="bi bi-geo-alt-fill"></i> {{ event.eventType || 'Campus' }}</span>
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
    
    <div v-else-if="error" class="status-state">
      <i class="bi bi-exclamation-triangle"></i>
      <h2>{{ error }}</h2>
      <NuxtLink to="/news-events" class="back-link mt-4">
        <i class="bi bi-arrow-left"></i> Return to Events
      </NuxtLink>
    </div>

    <div v-else class="status-state">
      <i class="bi bi-arrow-repeat spin"></i>
      <h2>Loading event details...</h2>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useRoute } from 'vue-router'; 
import { useRunacosApi } from '~/composables/useRunacosApi';

const route = useRoute();
const eventId = route.params.id;
const { apiFetch } = useRunacosApi();

definePageMeta({
  layout: {
    props: {
      showPageTitle: true,
    },
  },
})

const dynamicPageTitle = useState('pageTitle', () => 'Loading...');
const event = ref(null);
const isLoading = ref(true);
const error = ref(null);

// --- Formatter ---
const formatDate = (dateStr) => {
  if (!dateStr) return "TBA";
  try {
    return new Date(dateStr).toLocaleString('en-US', { 
      weekday: 'long', 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  } catch {
    return dateStr;
  }
};

// --- Form Handler ---
const handleRegistration = () => {
  if (!event.value) return;
  alert(`Registration initiated for: ${event.value.title}`);
}

// --- API Data Fetching ---
const fetchEventDetails = async () => {
  isLoading.value = true;
  error.value = null;
  
  try {
    const data = await apiFetch(`/events/${eventId}`);
    
    // Safely assign event (handling cases where backend wraps in an array)
    event.value = Array.isArray(data) ? data[0] : data;
    
    if (event.value) {
      route.meta.pageTitle = event.value.title;
      dynamicPageTitle.value = event.value.title;
    } else {
      error.value = "Event not found.";
      dynamicPageTitle.value = "Not Found";
    }
  } catch (err) {
    console.error("Failed to load event:", err);
    error.value = "Failed to load event details. Please try again later.";
    dynamicPageTitle.value = "Error";
  } finally {
    isLoading.value = false;
  }
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

          i { color: $accent-color; } 
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
        white-space: pre-wrap; /* Ensures formatting from the backend text area stays intact */
      }

      /* Registration CTA Button */
      .action-section {
        margin-top: 15px;

        .register-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 10px;
          background: $accent-color; 
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

  .status-state {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-top: 100px;
    color: #8a8a93;
    text-align: center;

    i { font-size: 2.5rem; }
    h2 { font-size: 1.2rem; font-weight: 500; margin: 0; }
    
    .spin { animation: spin 1s linear infinite; }
    .mt-4 { margin-top: 1.5rem; }
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