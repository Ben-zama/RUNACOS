<template>
  <nuxt-link class="eventCard" :to="to">
    <div class="image">
      <img :src="image" :alt="title" />
    </div>
    
    <div class="meta" v-if="date || location">
      <div class="meta-item" v-if="date">
        <i class="bi bi-calendar3"></i>
        <span>{{ date }}</span>
      </div>
      <div class="meta-item" v-if="location">
        <i class="bi bi-geo-alt"></i>
        <span>{{ location }}</span>
      </div>
    </div>
    
    <div class="span">
      <h3>{{ title }}</h3>
      <div class="icon">
        <i class="bi bi-arrow-up-right"></i>
      </div>
    </div>
    
    <p v-if="description">{{ description }}</p>
  </nuxt-link>
</template>

<script setup>
defineProps({
  to: {
    type: [String, Object],
    required: false,
    default: '/'
  },
  image: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  location: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  }
})
</script>

<style lang="scss" scoped>
.eventCard {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  padding: 20px;
  background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--secondary-color) 10%, transparent) 0%,
      color-mix(in srgb, var(--alternate-color) 10%, transparent) 100%
    );
  backdrop-filter: blur(10px);
  border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
  border-radius: 8px;
  transition: transform 0.3s ease, border-color 0.3s ease;

  .image {
    width: 100%;
    height: 220px;
    border-radius: 6px;
    overflow: hidden;
    
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.5s ease;
    }
  }

  /* Styling for Date and Location */
  .meta {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 6px 12px;
      background: color-mix(in srgb, var(--secondary-color) 15%, transparent); 
            border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
      font-family: $alternate-font;
      font-size: $text-sm;
      border-radius: 6px;

      i {
        color: $accent-color;
        font-size: 0.95em;
      }
    }
  }

  .span {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    
    h3 {
      font-size: $text-xl;
            font-weight: 900;
            line-height: 1.1;
            max-width: 600px;
            background: linear-gradient(135deg, var(--text-color), var(--text-gradient-color));
            background-clip: text;
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            color: transparent;
            flex-shrink: 1;
            margin: 0;
            transition: 0.3s;
    }
    
    .icon {
      position: relative;
      flex-shrink: 0;
      width: 35px;
      height: 35px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: color-mix(in srgb, var(--secondary-color) 15%, transparent); 
            border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
      overflow: hidden;
      transition: 0.3s;
      
      i {
        color: $accent-color;
        transition: 0.3s;
      }
    }
  }

  p {
    opacity: 0.8;
    margin: 0;
    line-height: 1.5;
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* --- Hover States --- */
  &:hover {
    border-color: $accent-color;
    transform: translateY(-5px);

    .image {
      img {
        transform: scale(1.05);
      }
    }

    .span {
      h3 {
        color: $accent-color;
      }
      .icon {
        background: $accent-color;
        border-color: $accent-color;
        i {
          color: #fff;
        }
      }
    }
  }
}
</style>