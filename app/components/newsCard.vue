<template>
  <nuxt-link class="newsCard" :to="to">
    <div class="image">
      <img :src="image" :alt="title" />
    </div>
    
    <div class="meta" v-if="category || date">
      <div class="meta-item category" v-if="category">
        <span>{{ category }}</span>
      </div>
      <div class="meta-item" v-if="date">
        <i class="bi bi-clock"></i>
        <span>{{ date }}</span>
      </div>
    </div>
    
    <div class="span">
      <h3>{{ title }}</h3>
      <div class="icon">
        <i class="bi bi-arrow-up-right"></i>
      </div>
    </div>

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
  category: {
    type: String,
    required: true
  },
  date: {
    type: String,
    required: true
  },
  title: {
    type: String,
    required: true
  },
})
</script>

<style lang="scss" scoped>
.newsCard {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 15px;
  cursor: pointer;
  text-decoration: none;
  color: inherit;
  
  /* Bento Card Base Styles */
  padding: 20px;
  background: linear-gradient(
    145deg,
    $translucent-alternate-color 0%,
    $translucent-secondary-color 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid $translucent-secondary-color-50;
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

  /* Styling for Category and Date */
  .meta {
    display: flex;
    gap: 10px;
    flex-wrap: wrap;
    align-items: center;
    
    .meta-item {
      display: flex;
      align-items: center;
      gap: 6px;
      padding: 4px 10px;
      background: rgba(255, 255, 255, 0.05); 
      border: 1px solid $translucent-secondary-color-50;
      font-family: $alternate-font;
      font-size: $text-sm;
      border-radius: 6px;

      i {
        color: $accent-color;
        font-size: 0.95em;
      }
    }

    /* Make the category tag pop just a little bit more */
    .category {
      color: $accent-color;
      font-weight: 600;
      border-color: rgba($accent-color, 0.3);
    }
  }

  .span {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 25px;
    
    h3 {
      flex-shrink: 1;
      font-size: $text-lg;
      line-height: 1.3;
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
      background: rgba(255, 255, 255, 0.05);
      border: 1px solid $translucent-secondary-color-50;
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
    /* Truncate text after 3 lines */
    display: -webkit-box;
    -webkit-line-clamp: 3;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }

  /* Author section */
  .author-footer {
    display: flex;
    align-items: center;
    gap: 8px;
    margin-top: auto; /* Pushes the author to the bottom if cards are different heights in a grid */
    padding-top: 10px;
    border-top: 1px solid $translucent-secondary-color-50;
    font-size: $text-sm;
    opacity: 0.9;

    i {
      color: $accent-color;
    }
  }

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