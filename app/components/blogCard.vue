<template>
  <nuxt-link class="blogCard" :to="to">
    <div class="image">
      <img :src="imageSrc" :alt="imageAlt" />
    </div>
    
    <div class="tags" v-if="tags && tags.length">
      <div 
        class="tag" 
        v-for="(tag, index) in tags" 
        :key="index"
      >
        {{ tag }}
      </div>
    </div>
    
    <div class="span">
      <h3>{{ title }}</h3>
      <div class="icon">
        <i class="bi bi-arrow-up-right"></i>
      </div>
    </div>
    
    <p v-if="description">{{ description }}</p>

    <hr>

    <div class="card-footer" v-if="author || date">
      <div class="author" v-if="author">
        <i class="bi bi-person-circle"></i>
        <span>{{ author }}</span>
      </div>
      <div class="date" v-if="date">
        <i class="bi bi-calendar3"></i>
        <span>{{ date }}</span>
      </div>
    </div>
  </nuxt-link>
</template>

<script setup>
// Define the props this component will accept
defineProps({
  to: {
    type: [String, Object],
    required: true,
    default: '/'
  },
  imageSrc: {
    type: String,
    required: true
  },
  imageAlt: {
    type: String,
    default: 'Blog post image'
  },
  tags: {
    type: Array,
    default: () => [] // Accepts an array of strings
  },
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: false
  },
  // New props for Author and Date
  author: {
    type: String,
    required: false
  },
  date: {
    type: String,
    required: false
  }
})
</script>

<style lang="scss" scoped>
.blogCard {
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
      transition: transform 0.5s ease; /* Smooth zoom setup */
    }
  }

  .tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
    
    .tag {
      padding: 4px 10px;
      background: color-mix(in srgb, var(--secondary-color) 15%, transparent); 
      border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
      font-family: $alternate-font;
      font-size: $text-sm;
      border-radius: 6px;
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

  hr {
    border-color: color-mix(in srgb, var(--text-color) 20%, transparent);
  }

  .card-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 15px;
    flex-wrap: wrap;
    margin-top: auto; /* Pushes to the very bottom */
    padding-top: 15px;
    border-top: 1px solid color-mix(in srgb, var(--alternate-color) 50%, transparent);
    font-size: $text-sm;
    font-family: $alternate-font;
    opacity: 0.9;

    .author, .date {
      display: flex;
      align-items: center;
      gap: 6px;

      i {
        color: $accent-color;
      }
    }
  }
  
  &:hover {
    border-color: $accent-color;
    transform: translateY(-5px); /* Gentle lift effect */

    .image {
      img {
        transform: scale(1.05); /* Gentle image zoom */
      }
    }

    .span {
      .icon {
        background: $accent-color;
        border-color: $accent-color;
        i {
          color: #fff; /* Swap to white on hover */
        }
      }
    }
  }
}
</style>