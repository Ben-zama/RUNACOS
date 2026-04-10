<template>
  <div>
    <ClientOnly>
      <Carousel
        :items-to-show="1"
        :wrap-around="true"
        snap-align="center"
        :autoplay="5000"
        :transition="750"
        :gap="25"
        class="team-carousel"
        :breakpoints="{
          600: {
            itemsToShow: 3,
          },
          1024: {
            itemsToShow: 5,
          },
        }"
      >
        <Slide v-for="item in items" :key="item.id">
          <div class="profile-card">
            <img :src="item.image" :alt="item.name" class="profile-img" />

            <div class="card-overlay">
              <span v-if="item.badge" class="badge">{{ item.badge }}</span>
              <div class="card-info">
                <h3>{{ item.name }}</h3>
                <p>{{ item.role }}</p>
              </div>
            </div>
          </div>
        </Slide>

        <template #addons>
          <pagination />
        </template>
      </Carousel>
    </ClientOnly>
  </div>
</template>

<script setup>
import { Carousel, Slide, Pagination } from "vue3-carousel";
import "vue3-carousel/dist/carousel.css";

defineProps({
  items: {
    type: Array,
    required: true,
  },
});

defineEmits(["cardClick"]);
</script>

<style lang="scss">
.team-carousel {
  width: 100%;
  perspective: 1000px;
  position: relative;
  padding-bottom: 25px;

  .carousel__slide {
    transition: transform 0.75s cubic-bezier(0.25, 1, 0.5, 1);
    transform: scale(0.7) translateY(60px);
    transform-origin: bottom center;
  }

  .carousel__slide--active {
    transform: scale(1) translateY(0) rotate(0deg);
    z-index: 10;
  }

  .carousel__slide--prev {
    transform: scale(0.9) rotate(-10deg);
    z-index: 9;
  }

  .carousel__slide--next {
    transform: scale(0.9) rotate(10deg);
    z-index: 9;
  }

  .profile-card {
    aspect-ratio: 10/15;
    position: relative;
    width: auto;
    height: 400px;
    border-radius: 24px;
    overflow: hidden;
    background: $background-color;
    cursor: grab;
  }

  .profile-img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .card-overlay {
    position: absolute;
    inset: 0;
    background: linear-gradient(
      to bottom,
      transparent 40%,
      rgba($alternate-color, 0.5) 100%
    );
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    padding: 20px;
    text-align: center;
  }

  .badge {
    background: $translucent-secondary-color-50;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    padding: 4px 12px;
    border-radius: 20px;
    font-size: $text-sm;
    font-weight: 600;
    font-family: $alternate-font;
    color: $accent-color;
    align-self: flex-start;
  }

  .card-info h3 {
    margin: 0 0 5px 0;
    font-size: $text-xl;
    color: $secondary-color;
  }

  .card-info p {
    opacity: 0.8;
    margin-bottom: 0;
    color: $secondary-color;
  }

  .carousel__pagination {
    position: absolute;
    bottom: 0;
  }

  button.carousel__pagination-button {
    width: 8px;
    height: 8px;
    border-radius: 50%;
  }

  button.carousel__pagination-button--active {
    background-color: $accent-color;
  }
}

@include respond-to(600px, 1023px) {
  .team-carousel {
    padding-bottom: 50px;

    .profile-card {
      height: 350px;
    }

    .carousel__slide {
      transition: all 0.75s cubic-bezier(0.25, 1, 0.5, 1);
      transform: scale(0.8) translateY(60px);
      transform-origin: bottom center;
    }

    .carousel__slide--active {
      transform: scale(1) translateY(0) rotate(0deg);
      z-index: 10;
    }

    .carousel__slide--prev {
      transform: scale(0.9) rotate(0deg);
      z-index: 9;
    }

    .carousel__slide--next {
      transform: scale(0.9) rotate(0deg);
      z-index: 9;
    }
  }
}

@include respond-to(1024px) {
  .team-carousel {
    padding-bottom: 50px;

    .profile-card {
      height: 350px;
    }

    .carousel__slide {
      transition: all 0.75s cubic-bezier(0.25, 1, 0.5, 1);
      transform: scale(0.8);
      transform-origin: bottom center;
    }

    .carousel__slide--active {
      transform: scale(1) translateY(0) rotate(0deg);
      z-index: 10;
    }

    .carousel__slide--prev {
      transform: scale(0.9) rotate(0deg);
      z-index: 9;
    }

    .carousel__slide--next {
      transform: scale(0.9) rotate(0deg);
      z-index: 9;
    }
  }
}
</style>