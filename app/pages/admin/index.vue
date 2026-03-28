<template>
  <div class="dashboard-grid">
    <div class="kpi-row">
      <div class="glass-card kpi-card" v-for="stat in stats" :key="stat.title">
        <div class="icon-wrapper">
          <i :class="stat.icon"></i>
        </div>
        <div class="kpi-info">
          <span class="label">{{ stat.title }}</span>
          <h3 class="value">{{ stat.value }}</h3>
        </div>
      </div>
    </div>

    <div class="middle-row">
      <div class="glass-card table-card resources-panel">
        <div class="card-header">
          <h3>Recent Academic Resources</h3>
          <NuxtLink to="/admin/resources" class="view-all">View All</NuxtLink>
        </div>
        <div class="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Course Code</th>
                <th class="desktop-only">Year</th>
                <th class="desktop-only">Uploaded By</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="resource in recentResources" :key="resource.code">
                <td class="highlight">{{ resource.code }}</td>
                <td class="desktop-only">{{ resource.year }}</td>
                <td class="desktop-only">{{ resource.uploadedBy }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <div class="glass-card actions-panel">
        <h3>Quick Actions</h3>
        <div class="action-buttons">
          <button class="glass-btn primary-hover">
            <i class="bi bi-cloud-arrow-up"></i> Upload PQ
          </button>
          <button class="glass-btn primary-hover">
            <i class="bi bi-pencil-square"></i> Draft Blog Post
          </button>
          <button class="glass-btn primary-hover">
            <i class="bi bi-calendar-plus"></i> Schedule Event
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' });

const stats = [
  { title: "Registered Students", value: "1,524", icon: "bi bi-people" },
  { title: "Active Alumni", value: "512", icon: "bi bi-mortarboard" },
  { title: "Resources Uploaded", value: "340", icon: "bi bi-file-earmark-arrow-up" }
];

const recentResources = [
  { code: "CSC 301 - Compiler Constr.", year: "2023", uploadedBy: "Dr. Olatunji" },
  { code: "CYS 205 - Network Security", year: "2024", uploadedBy: "Prof. Aisha" },
  { code: "IFT 402 - Cloud Computing", year: "2023", uploadedBy: "Dr. Samuel" },
];
</script>

<style lang="scss" scoped>
.dashboard-grid {
  display: flex;
  flex-direction: column;
  gap: 30px;
}
.kpi-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 25px;
}
.middle-row {
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 25px;
}
.kpi-card {
  display: flex;
  align-items: center;
  gap: 20px;
  .icon-wrapper {
    width: 60px;
    height: 60px;
    border-radius: 15px;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.05);
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 1.5rem;
    color: #3b82f6; /* Use your $accent-color here */
  }
  .kpi-info {
    display: flex;
    flex-direction: column;
    gap: 5px;
    .label { color: #8a8a93; font-size: 0.9rem; }
    .value { margin: 0; font-size: 2rem; font-weight: 800; }
  }
}
.actions-panel {
  display: flex;
  flex-direction: column;
  gap: 20px;
  .action-buttons {
    display: flex;
    flex-direction: column;
    gap: 15px;
    button { width: 100%; justify-content: flex-start; padding-left: 20px; }
  }
}
@media (max-width: 1024px) {
  .kpi-row { grid-template-columns: repeat(2, 1fr); }
  .middle-row { grid-template-columns: 1fr; }
}
@media (max-width: 768px) {
  .kpi-row { grid-template-columns: 1fr; }
  .desktop-only {
    display: none;
  }
}
</style>