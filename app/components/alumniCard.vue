<template>
  <div class="alumni-card">
    <div class="avatar-wrapper">
      <img :src="image" :alt="name" class="avatar" />
    </div>

    <div class="info">
      <h3 class="name">{{ name }}</h3>

      <div class="badges">
        <div class="badge year">
          <i class="bi bi-mortarboard-fill"></i>
          <span>Class of {{ year }}</span>
        </div>

        <div class="badge department" :class="departmentClass">
          <i :class="departmentIcon"></i>
          <span>{{ department }}</span>
        </div>
      </div>
    </div>

    <a v-if="linkedIn" :href="linkedIn" target="_blank" class="connect-btn">
      <i class="bi bi-linkedin"></i> Connect
    </a>
  </div>
</template>

<script setup>
import { computed } from "vue";

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  year: {
    type: [String, Number],
    required: true,
  },
  department: {
    type: String,
    required: true, // Expected: 'Computer Science', 'Cyber Security', or 'Information Technology'
  },
  image: {
    type: String,
    default: "https://placehold.co/400x400/151515/8a8a93?text=Alumni", // Fallback image
  },
  linkedIn: {
    type: String,
    required: false,
  },
});

// Automatically assign an icon based on the department
const departmentIcon = computed(() => {
  const dept = props.department.toLowerCase();
  if (dept.includes("computer science")) return "bi bi-code-slash";
  if (dept.includes("cyber security")) return "bi bi-shield-check";
  if (dept.includes("information technology")) return "bi bi-hdd-network";
  return "bi bi-laptop"; // fallback icon
});

// Optional: Assign a specific class if you want to color-code departments later
const departmentClass = computed(() => {
  const dept = props.department.toLowerCase();
  if (dept.includes("computer science")) return "dept-cs";
  if (dept.includes("cyber security")) return "dept-cyber";
  if (dept.includes("information technology")) return "dept-it";
  return "";
});
</script>

<style lang="scss" scoped>
.alumni-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 30px 20px;
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.04) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 16px;
  transition: transform 0.4s ease, border-color 0.4s ease, box-shadow 0.4s ease;

  &:hover {
    transform: translateY(-8px);
    border-color: rgba($accent-color, 0.5);
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);

    .avatar-wrapper img {
      transform: scale(1.05);
    }

    .connect-btn {
      background: rgba(255, 255, 255, 0.1);
      color: $accent-color;
    }
  }

  .avatar-wrapper {
    width: 100px;
    height: 100px;
    border-radius: 50%;
    margin-bottom: 20px;
    overflow: hidden;
    border: 2px solid rgba(255, 255, 255, 0.1);
    background: #111;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.4s ease;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 15px;
    margin-bottom: 25px;
    flex-grow: 1;

    .name {
      font-family: $alternate-font;
      font-size: $text-xl;
      font-weight: 600;
      color: #fff;
      margin: 0;
    }

    .badges {
      display: flex;
      flex-direction: column;
      gap: 8px;
      align-items: center;

      .badge {
        display: flex;
        align-items: center;
        gap: 6px;
        padding: 4px 12px;
        background: rgba(255, 255, 255, 0.05);
        border: 1px solid rgba(255, 255, 255, 0.05);
        border-radius: 20px;
        font-size: 0.85rem;
        color: #8a8a93;

        i {
          color: $accent-color;
        }
      }
    }
  }

  .connect-btn {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    padding: 10px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    border-radius: 8px;
    color: #8a8a93;
    text-decoration: none;
    font-size: $text-sm;
    transition: 0.3s ease;

    i {
      font-size: 1.1em;
    }
  }
}
</style>