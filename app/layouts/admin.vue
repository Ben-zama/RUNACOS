<template>
  <div id="adminDashboard" :class="{ 'sidebar-expanded': isSidebarExpanded }">
    <aside class="sidebar" :class="{ 'is-mobile-open': mobileMenuOpen }">
      <div class="brand">
        <div class="logo-icon">
          <img src="~/assets/logo.png" alt="Runacos Logo" />
        </div>
        <div class="brand-text" v-show="isSidebarExpanded">
          <h2>RUNACOS</h2>
          <span>Admin Portal</span>
        </div>
        <Button
          icon="bi bi-x-lg"
          class="p-button-rounded p-button-text p-button-plain close-btn d-md-none"
          @click="mobileMenuOpen = false"
        />
      </div>

      <Button
        :icon="isSidebarExpanded ? 'bi bi-chevron-left' : 'bi bi-chevron-right'"
        class="p-button-rounded p-button-secondary p-button-outlined expand-toggle-btn d-none d-md-flex"
        @click="isSidebarExpanded = !isSidebarExpanded"
      />

      <nav class="nav-links">
        <NuxtLink
          v-for="link in navLinks"
          :key="link.to"
          :to="link.to"
          active-class="active"
          :exact="link.exact"
          v-ripple
        >
          <i :class="link.icon"></i>
          <span v-show="isSidebarExpanded" class="link-label">{{
            link.label
          }}</span>
        </NuxtLink>
      </nav>

      <div class="sidebar-footer">
        <NuxtLink to="/" class="footer-link" v-ripple>
          <i class="bi bi-house"></i>
          <span v-show="isSidebarExpanded">Home Page</span>
        </NuxtLink>
        <button @click="handleLogout" class="footer-link logout" v-ripple>
          <i class="bi bi-box-arrow-right"></i>
          <span v-show="isSidebarExpanded">Logout</span>
        </button>
      </div>
    </aside>

    <main class="main-content">
      <Toolbar class="topbar">
        <template #start>
          <Button
            icon="bi bi-list"
            class="p-button-text p-button-plain menu-btn d-md-none"
            @click="mobileMenuOpen = true"
            style="font-size: 1.5rem"
          />
          <h2 class="dashboard-title">Dashboard</h2>
        </template>

        <template #end>
          <div class="right-controls">
            <ThemeToggle />
            <div class="user-profile">
              <Avatar
                :label="userInitial"
                shape="circle"
                class="avatar-circle"
                @click="toggleUserMenu"
                aria-haspopup="true"
                aria-controls="user_menu"
              />
              <Menu
                ref="userMenu"
                id="user_menu"
                :model="userMenuItems"
                :popup="true"
                class="user-dropdown"
              >
                <template #start>
                  <div class="user-info">
                    <p class="email">
                      {{ currentUser?.email || "admin@runacos.com" }}
                    </p>
                    <p class="role">Admin</p>
                  </div>
                </template>
                <template #item="{ item, props }">
                  <NuxtLink
                    v-if="item.to"
                    :to="item.to"
                    v-bind="props.action"
                    class="dropdown-item p-menuitem-link"
                    @click="userMenu.hide()"
                  >
                    <i :class="[item.icon, 'p-menuitem-icon text-primary']"></i>
                    <span class="p-menuitem-text text-primary">{{
                      item.label
                    }}</span>
                  </NuxtLink>
                  <a
                    v-else
                    v-bind="props.action"
                    class="dropdown-item p-menuitem-link text-danger"
                    @click="item.command"
                  >
                    <i :class="[item.icon, 'p-menuitem-icon text-danger']"></i>
                    <span class="p-menuitem-text text-danger">{{
                      item.label
                    }}</span>
                  </a>
                </template>
              </Menu>
            </div>
          </div>
        </template>
      </Toolbar>

      <div class="page-wrapper">
        <NuxtPage />
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref, watch, computed } from "vue";
import { useRoute } from "vue-router";
import { useCookie, navigateTo } from "#imports";
import { useAuthStore } from "~/stores/useAuthStore";

const authStore = useAuthStore();
const route = useRoute();

// Layout States
const mobileMenuOpen = ref(false);
const isSidebarExpanded = ref(false); // Default to mini-sidebar on desktop
const userMenu = ref(null);

// Navigation Links Data (Restored Bootstrap icons)
const navLinks = [
  { to: "/admin", icon: "bi bi-grid-1x2", label: "Overview", exact: true },
  { to: "/admin/student", icon: "bi bi-people", label: "Students" },
  {
    to: "/admin/resources",
    icon: "bi bi-folder2-open",
    label: "Academic Resources",
  },
  { to: "/admin/posts", icon: "bi bi-newspaper", label: "Blog & News" },
  { to: "/admin/events", icon: "bi bi-calendar-event", label: "Events" },
  { to: "/admin/alumni", icon: "bi bi-mortarboard", label: "Alumni Directory" },
  { to: "/admin/faults", icon: "bi bi-radioactive", label: "Faults" },
];

// --- JWT Decoder Helper ---
function parseJwt(token) {
  try {
    if (!token) return null;
    const base64Url = token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );
    return JSON.parse(jsonPayload);
  } catch (e) {
    return null;
  }
}

// --- AUTHENTICATION STATE & LOGIC ---
const authToken = useCookie("auth_token");
const userCookie = useCookie("runacos_user");
const decodedUser = computed(() => parseJwt(authToken.value));

const currentUser = computed(() => {
  return authStore.currentUser || userCookie.value || decodedUser.value || null;
});

const userInitial = computed(
  () => currentUser.value?.email?.charAt(0).toUpperCase() || "A"
);

// PrimeVue Menu Configuration
const toggleUserMenu = (event) => {
  userMenu.value.toggle(event);
};

const handleLogout = () => {
  if (confirm("Are you sure you want to log out?")) {
    if (userMenu.value) userMenu.value.hide();

    if (authStore.logout) {
      authStore.logout();
    } else {
      authToken.value = null;
      useCookie("user_role").value = null;
      authStore.currentUser = null;
      navigateTo("/authentication");
    }
  }
};

const userMenuItems = ref([
  { separator: true },
  { label: "Home Page", icon: "bi bi-house", to: "/" },
  { label: "Logout", icon: "bi bi-box-arrow-right", command: handleLogout },
]);

// Close mobile menu on route change
watch(
  () => route.path,
  () => {
    mobileMenuOpen.value = false;
  }
);
</script>

<style lang="scss">
#adminDashboard {
  display: flex;
  min-height: 100vh;
  font-family: inherit;

  /* --- Reusable Glass Mixin --- */
  @mixin glass-panel {
    background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--secondary-color) 10%, transparent) 0%,
      color-mix(in srgb, var(--alternate-color) 10%, transparent) 100%
    );
    backdrop-filter: blur(15px);
    border: 1px solid color-mix(in srgb, var(--text-color) 20%, transparent);
    border-radius: 16px;
  }

  /* PrimeVue Overrides for Global Components */
  .p-toolbar {
    background: transparent;
    border: none;
    padding: 0;
  }

  .glass-card {
    @include glass-panel;
    padding: 25px;
  }

  /* --- Sidebar Configuration --- */
  .sidebar {
    width: 80px; /* Mini default */
    background: var(--background-color);
    border-right: 1px solid
      color-mix(in srgb, var(--text-color) 15%, transparent);
    display: flex;
    flex-direction: column;
    padding: 25px 10px;
    position: fixed;
    top: 0;
    left: 0;
    height: 100vh;
    z-index: 50;
    transition: width 0.3s ease, transform 0.3s ease;

    .brand {
      display: flex;
      align-items: center;
      gap: 12px;
      margin-bottom: 40px;
      padding: 0 5px;
      overflow: hidden;
      white-space: nowrap;

      .logo-icon img {
        width: 40px;
        height: 40px;
        border-radius: 10px;
        object-fit: contain;
      }

      .brand-text h2 {
        margin: 0;
        font-size: 1.25rem;
      }
      .brand-text span {
        font-size: 0.8rem;
        color: #8a8a93;
      }

      .close-btn {
        position: absolute;
        right: 25px;
        color: var(--text-color);
        transition: none;
        height: 35px;
        width: 35px;
        border-radius: 50%;
        &:hover {
          background: rgba($accent-color, 0.15);
        }
      }
    }

    .expand-toggle-btn {
      position: absolute;
      top: 30px;
      right: -15px;
      width: 30px;
      height: 30px;
      background: var(--background-color);
      z-index: 60;
    }

    .nav-links {
      display: flex;
      flex-direction: column;
      gap: 10px;
      flex: 1;

      a {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        padding: 12px;
        color: #75757b;
        text-decoration: none;
        border-radius: 10px;
        transition: all 0.3s ease;
        font-weight: 500;
        overflow: hidden;
        white-space: nowrap;

        i {
          font-size: 1.2rem;
          min-width: 24px;
          text-align: center;
        }

        &:hover {
          color: var(--text-color);
          background: color-mix(in srgb, var(--text-color) 5%, transparent);
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
      border-top: 1px solid
        color-mix(in srgb, var(--text-color) 15%, transparent);
      padding-top: 20px;
      overflow: hidden;

      .footer-link {
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 15px;
        padding: 12px;
        color: #8a8a93;
        text-decoration: none;
        border-radius: 10px;
        transition: 0.3s;
        background: transparent;
        border: none;
        cursor: pointer;
        font-family: inherit;
        font-size: 1rem;
        white-space: nowrap;

        i {
          font-size: 1.2rem;
          min-width: 24px;
          text-align: center;
        }

        &:hover {
          color: var(--text-color);
          background: color-mix(in srgb, var(--text-color) 5%, transparent);
        }
        &.logout:hover {
          color: #ff4757;
          background: rgba(255, 71, 87, 0.1);
        }
      }
    }
  }

  /* Sidebar Expanded State */
  &.sidebar-expanded .sidebar {
    width: 280px;
    padding: 25px 20px;
    .nav-links {
      a {
        justify-content: start;
      }
    }
    .sidebar-footer {
      .footer-link {
        justify-content: start;
      }
    }
  }

  /* --- Main Content --- */
  .main-content {
    flex: 1;
    margin-left: 80px; /* Base Mini Sidebar width */
    display: flex;
    flex-direction: column;
    min-height: 100vh;
    transition: margin-left 0.3s ease;
  }

  &.sidebar-expanded .main-content {
    margin-left: 280px;
  }

  .topbar {
    padding: 20px 40px;
    backdrop-filter: blur(20px);
    position: sticky;
    top: 0;
    z-index: 40;
    border-bottom: 1px solid
      color-mix(in srgb, var(--text-color) 10%, transparent);

    .menu-btn {
      color: var(--text-color);
      transition: none;
      height: 35px;
      width: 35px;
      border-radius: 50%;
      &:hover {
        background: rgba($accent-color, 0.15);
      }
    }

    .dashboard-title {
      margin: 0;
      font-size: 1.25rem;
      margin-left: 10px;
      color: var(--text-color);
    }

    .right-controls {
      display: flex;
      align-items: center;
      gap: 20px;

      .avatar-circle {
        width: 35px;
        height: 35px;
        background: $accent-color;
        color: #fff;
        font-weight: bold;
        cursor: pointer;
        border: 2px solid $accent-color;
        transition: all 0.3s ease;

        &:hover {
          border-color: color-mix(in srgb, var(--text-color) 50%, transparent);
          transform: scale(1.05);
        }
      }
    }
  }

  /* PrimeVue Overlay Menu Styling overrides */
  .user-dropdown.p-menu {
    background: var(--alternate-color);
    border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
    border-radius: 12px;
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.3);
    padding: 10px;
    min-width: 220px;

    .user-info {
      display: flex;
      flex-direction: column;
      gap: 4px;
      border-bottom: 1px solid
        color-mix(in srgb, var(--text-color) 15%, transparent);
      padding: 10px;
      margin-bottom: 5px;

      .email {
        margin: 0;
        font-weight: bold;
        font-size: 0.95rem;
        word-break: break-all;
      }
      .role {
        margin: 0;
        color: $accent-color;
        font-size: 0.85rem;
      }
    }

    .p-menuitem-link {
      border-radius: 6px;
      padding: 10px 12px;

      &:hover {
        background: rgba(255, 255, 255, 0.05);
      }

      &.text-danger:hover {
        background: rgba(255, 71, 87, 0.2);
      }
    }
  }

  .page-wrapper {
    padding: 40px;
  }

  /* Utilities */
  .d-none {
    display: none !important;
  }
  @media (min-width: 768px) {
    .d-md-flex {
      display: flex !important;
    }
    .d-md-none {
      display: none !important;
    }
  }

  /* --- Responsive Shell Design --- */
  @media (max-width: 767px) {
    .sidebar {
      transform: translateX(-100%);
      width: 280px;
      padding: 25px 20px;

      .nav-links {
        a {
          justify-content: start;
        }
      }

      .sidebar-footer {
        .footer-link {
          justify-content: start;
        }
      }

      &.is-mobile-open {
        transform: translateX(0);
        box-shadow: 20px 0 50px rgba(0, 0, 0, 0.3);
      }

      .brand-text,
      .link-label,
      .footer-link span {
        display: block !important;
      }
    }

    .main-content {
      margin-left: 0 !important;
    }

    .topbar {
      padding: 15px 20px;
    }

    .page-wrapper {
      padding: 20px;
    }
  }
}

/* Global dashboard styles */

.table-card {
  width: 100%;
  overflow: hidden;
}

/* Modal */
/* PrimeVue Dialog overrides */
.glass-dialog {
  background: var(--background-color) !important;
  border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
  border-radius: 12px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);
  
  .p-dialog-header {
    background: transparent;
    border-bottom: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
    padding: 20px 25px;
    color: var(--text-color);
  }
  .p-dialog-content {
    background: transparent;
    padding: 20px 25px;
    color: var(--text-color);
  }
}

/* Forms inside Dialog */
.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 15px;
  overflow-x: scroll;
  
  label {
    font-size: 0.85rem;
    color: #aaa;
  }
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 25px;
  border-top: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
  padding-top: 20px;

  .btn-cancel {
    color: #aaa;
    &:hover { color: var(--text-color); background: transparent; }
  }
  .btn-save {
    background: $accent-color;
    border: none;
    transition: transform .3s;
    &:hover { background: $accent-color; border: none; transform: scale(1.05); }
  }
}

/* Glass action button */

.glass-action-btn {
  background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
  color: var(--text-color);
  &:hover:not(:disabled) {
    background: rgba($accent-color, 0.1);
    border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
    color: $accent-color;
  }
}

/* pagination */
.p-datatable-paginator-bottom {
  border: none;
}
.p-paginator {
  --p-select-color: var(--text-color);
  background: transparent;
  border: none;
  padding: 15px 0 0 0;
  margin-top: 10px;

  .p-paginator-current {
    color: #8a8a93;
    font-size: 0.85rem;
  }

  .p-paginator-page,
  .p-paginator-next,
  .p-paginator-last,
  .p-paginator-first,
  .p-paginator-prev {
    background: transparent;
    color: #8a8a93;
    border-radius: 8px;
    border: 1px solid transparent;
    min-width: 2.5rem;
    height: 2.5rem;
    transition: 0.2s ease;

    &:hover {
      background: color-mix(in srgb, var(--text-color) 10%, transparent);
      color: var(--text-color);
    }

    &.p-highlight {
      background: rgba(52, 152, 219, 0.15);
      color: #3498db;
      border: 1px solid rgba(52, 152, 219, 0.3);
    }
  }

  .p-select {
    background: transparent;
  }

  .p-dropdown {
    background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
    border-radius: 8px;

    .p-dropdown-trigger {
      color: #8a8a93;
    }

    &:hover {
      border-color: color-mix(in srgb, var(--text-color) 30%, transparent);
    }
  }
}
</style>