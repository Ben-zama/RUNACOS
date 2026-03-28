<template>
  <div id="adminDashboard">
    <aside class="sidebar" :class="{ 'is-open': mobileMenuOpen }">
      <div class="brand">
        <div class="logo-icon">
            <img src="~/assets/logo.png" alt="">
        </div>
        <div class="brand-text">
          <h2>RUNACOS</h2>
          <span>Admin Portal</span>
        </div>
        <button class="close-btn" @click="mobileMenuOpen = false">
          <i class="bi bi-x-lg"></i>
        </button>
      </div>

      <nav class="nav-links">
        <NuxtLink to="/admin" active-class="active" exact><i class="bi bi-grid-1x2"></i> Overview</NuxtLink>
        <NuxtLink to="/admin/resources" active-class="active"><i class="bi bi-folder2-open"></i> Academic Resources</NuxtLink>
        <NuxtLink to="/admin/news" active-class="active"><i class="bi bi-newspaper"></i> Blog & News</NuxtLink>
        <NuxtLink to="/admin/events" active-class="active"><i class="bi bi-calendar-event"></i> Events</NuxtLink>
        <NuxtLink to="/admin/alumni" active-class="active"><i class="bi bi-people"></i> Alumni Directory</NuxtLink>
        <NuxtLink to="/admin/faults" active-class="active"><i class="bi bi-radioactive"></i> Faults</NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <NuxtLink to="/" class="home"><i class="bi bi-house"></i>Home Page</NuxtLink>
        <a href="#" class="logout"><i class="bi bi-box-arrow-right"></i> Logout</a>
      </div>
    </aside>

    <main class="main-content">
      <header class="topbar">
        <div class="left-controls">
          <button class="menu-btn" @click="mobileMenuOpen = true">
            <i class="bi bi-list"></i>
          </button>
          <h2>Dashboard</h2>
        </div>
        <div class="right-controls">
          <div class="profile-avatar">
            <img src="https://placehold.co/100x100/151515/8a8a93?text=A" alt="Admin" />
          </div>
        </div>
      </header>

      <div class="page-wrapper">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const mobileMenuOpen = ref(false);
const route = useRoute();

// Automatically close mobile menu when a link is clicked
watch(() => route.path, () => {
  mobileMenuOpen.value = false;
});
</script>

<style lang="scss">
/* Scoped to prevent dashboard styles from bleeding into the main site */
#adminDashboard {
  display: flex;
  min-height: 100vh;
  color: #fff;
  font-family: inherit;

  /* --- Reusable Glass Mixin --- */
  @mixin glass-panel {
    background: linear-gradient(
      145deg,
      rgba(255, 255, 255, 0.04) 0%,
      rgba(255, 255, 255, 0.01) 100%
    );
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 16px;
  }

  /* --- Global Admin Components (Used across multiple pages) --- */
  .glass-card {
    @include glass-panel;
    padding: 25px;
  }

  .glass-btn {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 10px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 12px 20px;
    border-radius: 10px;
    font-size: 0.95rem;
    cursor: pointer;
    transition: all 0.3s ease;

    &.sm { padding: 8px 15px; font-size: 0.85rem; }

    &.primary-hover:hover {
      background: rgba($accent-color, 0.15);
      border-color: rgba($accent-color, 0.4);
      color: $accent-color;
      transform: translateY(-2px);
    }
  }

  /* --- Global Table Styles (Used across all admin pages) --- */
  .table-card {
    display: flex;
    flex-direction: column;
    gap: 20px;

    .card-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      
      h3 { margin: 0; font-size: 1.2rem; }
      .view-all { color: $accent-color; text-decoration: none; font-size: 0.9rem; }
    }

    .table-responsive {
      width: 100%;
      overflow-x: auto;
    }

    table {
      width: 100%;
      border-collapse: collapse;
      text-align: left;

      th {
        color: #8a8a93;
        font-weight: 500;
        font-size: 0.9rem;
        padding-bottom: 15px;
        border-bottom: 1px solid rgba(255, 255, 255, 0.05);
      }

      td {
        padding: 15px 0;
        border-bottom: 1px solid rgba(255, 255, 255, 0.02);
        color: #ccc;
        font-size: 0.95rem;

        &.highlight { color: #fff; font-weight: 600; }
        
        /* Ensures long titles get truncated with "..." instead of breaking the layout */
        &.title-cell { 
          color: #fff; 
          max-width: 300px; 
          white-space: nowrap; 
          overflow: hidden; 
          text-overflow: ellipsis; 
        }
      }

      .actions-cell {
        display: flex;
        gap: 10px;
      }

      .action-btn {
        background: none;
        border: none;
        color: #8a8a93;
        font-size: 1.1rem;
        cursor: pointer;
        padding: 5px;
        transition: 0.3s;

        &:hover { color: $accent-color; }
        &.danger:hover { color: #ff4757; }
      }
    }
  }

  /* --- Sidebar --- */
  .sidebar {
    width: 280px;
    background: $background-color;
    border-right: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    flex-direction: column;
    padding: 25px 20px;
    position: fixed;
    height: 100vh;
    z-index: 50;
    transition: transform 0.3s ease;

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 40px;

      .logo-icon {
        width: 40px;
        height: 40px;        border-radius: 10px;
        display: flex;
        justify-content: center;
        align-items: center;
        font-size: 1.2rem;
      }

      .brand-text {
        h2 { margin: 0; font-size: $text-xl; }
        span { font-size: 0.8rem; color: #8a8a93; }
      }

      .close-btn {
        display: none;
        margin-left: auto;
        background: none;
        border: none;
        color: #fff;
        font-size: 1.5rem;
      }
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;

      a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 12px 16px;
        color: #8a8a93;
        text-decoration: none;
        border-radius: 10px;
        transition: all 0.3s ease;
        font-weight: 500;

        i { font-size: 1.1rem; }

        &:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.03);
        }

        &.active {
          color: $accent-color;
          background: rgba($accent-color, 0.1);
          border: 1px solid rgba($accent-color, 0.2);
        }
      }
    }

    .sidebar-footer {
      display: flex;
      flex-direction: column;
      gap: 10px;
      border-top: 1px solid rgba(255, 255, 255, 0.05);
      padding-top: 20px;

      a {
        display: flex;
        align-items: center;
        gap: 12px;
        padding: 10px 16px;
        color: #8a8a93;
        text-decoration: none;
        border-radius: 10px;
        transition: 0.3s;

        &:hover { color: #fff; }
        &.logout:hover { color: #ff4757; background: rgba(255, 71, 87, 0.1); }
      }
    }
  }

  /* --- Main Content --- */
  .main-content {
    flex: 1;
    margin-left: 280px;
    display: flex;
    flex-direction: column;
    min-height: 100vh;
  }

  .topbar {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25px 40px;
    backdrop-filter: blur(10px);
    position: sticky;
    top: 0;
    z-index: 40;
    border-bottom: 1px solid rgba(255, 255, 255, 0.03);

    .left-controls {
      display: flex;
      align-items: center;
      gap: 15px;

      .menu-btn {
        display: none;
        background: none;
        border: none;
        color: #fff;
        font-size: 1.5rem;
      }

      h2 {
        margin: 0;
        font-size: $text-xl;
      }
    }

    .right-controls {
      display: flex;
      align-items: center;

      .profile-avatar {
        width: 40px;
        height: 40px;
        border-radius: 50%;
        overflow: hidden;
        border: 2px solid rgba(255, 255, 255, 0.1);
        img { width: 100%; height: 100%; object-fit: cover; }
      }
    }
  }

  .page-wrapper {
    padding: 40px;
  }

  /* --- Responsive Shell Design --- */
  @media (max-width: 768px) {
    .sidebar {
      transform: translateX(-100%);
      &.is-open { 
        transform: translateX(0); 
        box-shadow: 20px 0 50px rgba(0,0,0,0.5); 
      }
      .brand .close-btn { display: block; }
    }

    .main-content { margin-left: 0; }
    
    .topbar {
      padding: 20px;
      .left-controls .menu-btn { display: block; }
      .left-controls h2 { font-size: 1.2rem; }
    }

    .page-wrapper { padding: 20px; }
  }
}
</style>