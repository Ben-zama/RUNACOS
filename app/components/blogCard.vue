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
  }
})
</script>

<style lang="scss" scoped>
/* Added 'scoped' so these styles only apply to this component */
.blogCard {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 10px;
  cursor: pointer;
  
  .image {
    width: 100%;
    height: 250px;
    border-radius: 16px;
    overflow: hidden;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  
  .tags {
    display: flex;
    gap: 5px;
    flex-wrap: wrap; /* Added flex-wrap so tags don't overflow on small screens */
    .tag {
      padding: 2px 8px;
      background: $translucent-secondary-color-50;
      backdrop-filter: blur(5px);
      -webkit-backdrop-filter: blur(5px);
      border: 1px solid $background-color;
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
      flex-shrink: 1;
      font-size: $text-lg;
      margin: 0;
      transition: .3s;
    }
    .icon {
      position: relative;
      flex-shrink: 0;
      width: 30px;
      height: 30px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      background: $secondary-color;
      overflow: hidden;
      transition: .3s;
      i {
        color: $background-color;
        transition: 0.3s;
      }
    }
  }
  
  p {
    opacity: 0.8;
    margin: 0;
  }
  
  &:hover {
    .span {
        h3 {
            color: $accent-color;
        }
        .icon {
            background: $accent-color;
            i {
                color: $secondary-color;
            }
        }
    }
  }
}
</style>