<template>
  <div class="dashboard-container">
    <div class="page-header">
      <div class="titles">
        <h2>Dashboard Overview</h2>
        <p>Welcome back! Here is what's happening in your faculty today.</p>
      </div>
    </div>

    <div class="kpi-row">
      <div
        class="glass-card kpi-card"
        v-for="stat in computedStats"
        :key="stat.title"
      >
        <div class="icon-wrapper" :class="stat.colorClass">
          <i :class="stat.icon"></i>
        </div>
        <div class="kpi-info">
          <span class="label">{{ stat.title }}</span>
          <h3 class="value">
            <span v-if="isLoadingAny" class="spinner-small"></span>
            <span v-else>{{ stat.value }}</span>
          </h3>
        </div>
      </div>
    </div>

    <div class="middle-row">
      <div class="glass-card table-card resources-panel">
        <div class="card-header">
          <div>
            <h3>Recent Academic Resources</h3>
            <p class="subtitle">Latest study materials uploaded</p>
          </div>
          <NuxtLink to="/admin/resources" class="view-all glass-btn sm"
            >View All</NuxtLink
          >
        </div>

        <div
          v-if="
            resourcesStore.isLoading && resourcesStore.resources.length === 0
          "
          class="empty-state"
        >
          <span class="spinner"></span>
        </div>
        <div v-else-if="recentResources.length === 0" class="empty-state">
          <p>No resources uploaded yet.</p>
        </div>
        <div v-else class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Title / Course</th>
                <th class="desktop-only">Type</th>
                <th>Date Added</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="res in recentResources" :key="res.id || res._id">
                <td class="highlight">
                  <div class="cell-content">
                    <span class="font-bold">{{ res.title || "Untitled" }}</span>
                    <span class="text-xs text-gray-400">{{
                      res.courseCode
                    }}</span>
                  </div>
                </td>
                <td class="desktop-only">
                  <span class="pill">{{ res.resourceType }}</span>
                </td>
                <td>{{ formatDate(res.createdAt || new Date()) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="right-column">
        <div class="glass-card actions-panel">
          <h3>Quick Links</h3>
          <div class="action-grid">
            <NuxtLink to="/admin/resources" class="action-box">
              <i class="bi bi-cloud-arrow-up text-blue"></i>
              <span>Upload PQ</span>
            </NuxtLink>
            <NuxtLink to="/admin/posts" class="action-box">
              <i class="bi bi-pencil-square text-green"></i>
              <span>Draft Post</span>
            </NuxtLink>
            <NuxtLink to="/admin/events" class="action-box">
              <i class="bi bi-calendar-plus text-purple"></i>
              <span>Add Event</span>
            </NuxtLink>
            <NuxtLink to="/admin/alumni" class="action-box">
              <i class="bi bi-people text-orange"></i>
              <span>Manage Users</span>
            </NuxtLink>
          </div>
        </div>

        <div class="glass-card next-event-panel" v-if="nextUpcomingEvent">
          <div class="panel-header">
            <h3>Next Up</h3>
            <span class="pulse-badge">Upcoming</span>
          </div>
          <div class="event-details">
            <h4>{{ nextUpcomingEvent.title }}</h4>
            <div class="meta">
              <span
                ><i class="bi bi-calendar"></i>
                {{ formatDate(nextUpcomingEvent.eventTime) }}</span
              >
              <span
                ><i class="bi bi-geo-alt"></i>
                {{ nextUpcomingEvent.eventType || "Campus" }}</span
              >
            </div>
          </div>
          <NuxtLink
            to="/admin/events"
            class="glass-btn primary-hover w-full center"
          >
            Manage Event
          </NuxtLink>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useUsersStore } from "~/stores/useUsersStore";
import { useResourcesStore } from "~/stores/useResourcesStore";
import { useEventsStore } from "~/stores/useEventsStore";
import { usePostsStore } from "~/stores/usePostsStore";

definePageMeta({ layout: "admin", middleware: "admin" });

// Initialize all stores
const usersStore = useUsersStore();
const resourcesStore = useResourcesStore();
const eventsStore = useEventsStore();
const postsStore = usePostsStore();

// Fetch all dashboard data on mount
onMounted(() => {
  usersStore.fetchUsers();
  resourcesStore.fetchResources();
  eventsStore.fetchEvents();
  postsStore.fetchPosts();
});

const isLoadingAny = computed(() => {
  return (
    usersStore.isLoading ||
    resourcesStore.isLoading ||
    eventsStore.isLoading ||
    postsStore.isLoading
  );
});

// Dynamic KPIs based on real data
const computedStats = computed(() => [
  {
    title: "Registered Users",
    value: usersStore.users?.length || 0,
    icon: "bi bi-mortarboard-fill",
    colorClass: "blue-theme",
  },
  {
    title: "Total Resources",
    value: resourcesStore.resources?.length || 0,
    icon: "bi bi-file-earmark-text-fill",
    colorClass: "green-theme",
  },
  {
    title: "Upcoming Events",
    value:
      eventsStore.events?.filter((e) => e.status === "upcoming").length || 0,
    icon: "bi bi-calendar-event-fill",
    colorClass: "purple-theme",
  },
  {
    title: "Published Posts",
    value: postsStore.posts?.length || 0,
    icon: "bi bi-journal-richtext",
    colorClass: "orange-theme",
  },
]);

// Get the 4 most recently added resources
const recentResources = computed(() => {
  if (!resourcesStore.resources) return [];
  // Assuming the API returns them in chronological order, we reverse to get newest first
  return [...resourcesStore.resources].reverse().slice(0, 4);
});

// Find the closest upcoming event
const nextUpcomingEvent = computed(() => {
  if (!eventsStore.events) return null;
  const upcoming = eventsStore.events.filter((e) => e.status === "upcoming");
  if (upcoming.length === 0) return null;

  // Sort by closest date
  upcoming.sort((a, b) => new Date(a.eventTime) - new Date(b.eventTime));
  return upcoming[0];
});

// Date Formatter
const formatDate = (dateStr) => {
  if (!dateStr) return "N/A";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};
</script>

<style lang="scss" scoped>
.dashboard-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.page-header {
  .titles h2 {
    font-size: 2rem;
    margin: 0 0 5px 0;
  }
  .titles p {
    color: #8a8a93;
    margin: 0;
  }
}

.w-full {
  width: 100%;
}

/* KPI Row */
.kpi-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 20px;
}
.kpi-card {
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 20px;

  .icon-wrapper {
    width: 55px;
    height: 55px;
    border-radius: 14px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;

    &.blue-theme {
      background: rgba(52, 152, 219, 0.15);
      color: #3498db;
    }
    &.green-theme {
      background: rgba(46, 213, 115, 0.15);
      color: #2ed573;
    }
    &.purple-theme {
      background: rgba(155, 89, 182, 0.15);
      color: #9b59b6;
    }
    &.orange-theme {
      background: rgba(255, 165, 2, 0.15);
      color: #ffa502;
    }
  }

  .kpi-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    .label {
      color: #8a8a93;
      font-size: 0.85rem;
      font-weight: 500;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .value {
      margin: 0;
      font-size: 1.8rem;
      font-weight: 800;
      display: flex;
      align-items: center;
      height: 35px;
    }
  }
}

/* Middle Layout */
.middle-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}
.right-column {
  display: flex;
  flex-direction: column;
  gap: 25px;
}

/* Tables */
.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 20px;
  h3 {
    margin: 0 0 5px 0;
    font-size: 1.2rem;
  }
  .subtitle {
    margin: 0;
    font-size: 0.85rem;
    color: #8a8a93;
  }
}
.table-responsive {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
th {
  padding: 12px 15px;
  font-weight: 500;
  font-size: 0.85rem;
}
td {
  padding: 15px;
  font-size: 0.9rem;
  vertical-align: middle;
}
.cell-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.font-bold {
  font-weight: 600;
}
.text-xs {
  font-size: 0.75rem;
}


/* Action Grid */
.actions-panel h3 {
  margin: 0 0 20px 0;
  font-size: 1.2rem;
}
.action-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 15px;

  .action-box {
    background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
    border-radius: 12px;
    padding: 20px 15px;
    text-align: center;
    text-decoration: none;
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: 10px;
    transition: 0.3s;

    span {
      font-size: 0.85rem;
      font-weight: 500;
    }
    i {
      font-size: 1.5rem;
    }

    .text-blue {
      color: #3498db;
    }
    .text-green {
      color: #2ed573;
    }
    .text-purple {
      color: #9b59b6;
    }
    .text-orange {
      color: #ffa502;
    }

    &:hover {
      background: color-mix(in srgb, var(--secondary-color) 50%, transparent);
      border-color: color-mix(in srgb, var(--text-color) 50%, transparent);
      transform: translateY(-3px);
    }
  }
}

/* Next Event Widget */
.next-event-panel {

  .panel-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 20px;
    h3 {
      margin: 0;
      font-size: 1.1rem;
    }
    .pulse-badge {
      background: rgba(231, 76, 60, 0.2);
      color: #e74c3c;
      padding: 4px 10px;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 600;
      animation: pulse 2s infinite;
    }
  }

  .event-details {
    margin-bottom: 25px;
    h4 {
      margin: 0 0 10px 0;
      font-size: 1.3rem;
    }
    .meta {
      display: flex;
      flex-direction: column;
      gap: 8px;
      opacity: 0.8;
      font-size: 0.9rem;
      i {
        color: $accent-color;
        margin-right: 5px;
      }
    }
  }

  .glass-btn {
        background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
  }
}

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
@keyframes pulse {
  0% {
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0.4);
  }
  70% {
    box-shadow: 0 0 0 6px rgba(231, 76, 60, 0);
  }
  100% {
    box-shadow: 0 0 0 0 rgba(231, 76, 60, 0);
  }
}

/* Responsiveness */
@media (max-width: 1200px) {
  .kpi-row {
    grid-template-columns: repeat(2, 1fr);
  }
  .middle-row {
    grid-template-columns: 1fr;
  }
  .right-column {
    flex-direction: row;
  }
  .actions-panel,
  .next-event-panel {
    flex: 1;
  }
}
@media (max-width: 768px) {
  .right-column {
    flex-direction: column;
  }
  .desktop-only {
    display: none;
  }
}
@media (max-width: 480px) {
  .kpi-row {
    grid-template-columns: 1fr;
  }
}
</style>