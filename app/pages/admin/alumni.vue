<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Alumni Database</h2>
        <p>Manage registered alumni profiles and graduation records.</p>
      </div>
      <div class="header-actions">
        <button class="glass-btn primary-hover" @click="alumniStore.fetchAlumni" :disabled="alumniStore.isLoading">
          <i class="bi bi-arrow-clockwise" :class="{ 'spin': alumniStore.isLoading }"></i> Refresh
        </button>
        <button class="glass-btn primary-hover">
          <i class="bi bi-person-plus"></i> Add Alumni
        </button>
      </div>
    </div>

    <div v-if="alumniStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ alumniStore.error }}
    </div>

    <div class="glass-card table-card">
      <div class="table-filters">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by name or department..."
          class="glass-input search-input"
        />
        <select v-model="selectedYear" class="glass-input">
          <option value="">All Years</option>
          <option v-for="year in uniqueGradYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <div v-if="alumniStore.isLoading && alumniStore.alumni.length === 0" class="loading-state">
        <div class="spinner"></div><p>Loading alumni records...</p>
      </div>
      <div v-else-if="filteredAlumni.length === 0" class="empty-state">
        <i class="bi bi-person-x"></i><p>No alumni match your search criteria.</p>
      </div>

      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Alumni Name</th>
              <th>Department</th>
              <th>Class Of</th>
              <th class="desktop-only">Current Job</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumni in filteredAlumni" :key="alumni.id || alumni._id">
              <td class="highlight user-cell">
                <img :src="`https://placehold.co/100x100/151515/8a8a93?text=${getInitial(alumni.username)}`" class="avatar-sm" />
                {{ alumni.username }}
              </td>
              <td>{{ alumni.studentInfo?.department || 'N/A' }}</td>
              <td>{{ extractYear(alumni.alumniInfo?.graduationYear) }}</td>
              <td class="desktop-only">{{ alumni.alumniInfo?.jobTitle || 'Unspecified' }}</td>
              <td>
                <span v-if="alumni.alumniInfo?.isStar" class="pill verified star-alumni">
                  <i class="bi bi-star-fill"></i> Star Alumni
                </span>
                <span v-else class="pill verified">
                  <i class="bi bi-check-circle-fill"></i> Verified
                </span>
              </td>
              <td class="actions-cell">
                <button class="action-btn"><i class="bi bi-eye"></i></button>
                <button class="action-btn"><i class="bi bi-pencil"></i></button>
                </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAlumniStore } from '~/stores/useAlumniStore'

definePageMeta({ layout: "admin" })

const alumniStore = useAlumniStore()

// Filter State
const searchQuery = ref('')
const selectedYear = ref('')

onMounted(() => {
  alumniStore.fetchAlumni()
})

// Helper functions for UI formatting
const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : '?'
}

const extractYear = (isoDateString) => {
  if (!isoDateString) return 'N/A'
  // Grabs the first 4 characters of "2023-10-01T00:00:00Z"
  return isoDateString.substring(0, 4) 
}

// Dynamically generate the dropdown list of years based on actual data
const uniqueGradYears = computed(() => {
  const years = alumniStore.alumni
    .map(a => extractYear(a.alumniInfo?.graduationYear))
    .filter(year => year !== 'N/A')
  
  // Return unique years sorted highest to lowest
  return [...new Set(years)].sort((a, b) => b - a)
})

// Filter Logic
const filteredAlumni = computed(() => {
  if (!alumniStore.alumni) return []

  return alumniStore.alumni.filter(alumni => {
    const safeName = (alumni.username || '').toLowerCase()
    const safeDept = (alumni.studentInfo?.department || '').toLowerCase()
    const safeQuery = searchQuery.value.toLowerCase()
    const alumniYear = extractYear(alumni.alumniInfo?.graduationYear)

    const matchesSearch = safeName.includes(safeQuery) || safeDept.includes(safeQuery)
    const matchesYear = selectedYear.value === '' || alumniYear === selectedYear.value

    return matchesSearch && matchesYear
  })
})

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to remove this alumni record?")) return;
  try {
    await alumniStore.deleteAlumni(id);
  } catch {
    alert("Failed to delete record.");
  }
}
</script>

<style lang="scss" scoped>
/* Keep all your existing CSS the exact same, just add these few utility lines at the bottom */
.page-container { display: flex; flex-direction: column; gap: 30px; color: #fff; }
.page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  .titles h2 { font-size: 2rem; margin: 0 0 5px 0; }
  .titles p { color: #8a8a93; margin: 0; }
  .header-actions { display: flex; gap: 10px; }
}

.glass-btn {
  background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff; padding: 10px 20px; border-radius: 8px; cursor: pointer;
  display: flex; align-items: center; gap: 8px; transition: 0.3s;
  &:hover { background: rgba(255, 255, 255, 0.2); }
  &.primary-hover:hover { background: rgba(52, 152, 219, 0.3); border-color: rgba(52, 152, 219, 0.4); color: #3498db; }
}
.spin { animation: spin 1s linear infinite; }

.table-card { padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%); backdrop-filter: blur(10px); }
.table-filters {
  display: flex; gap: 15px; margin-bottom: 20px;
  .glass-input {
    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 15px; border-radius: 8px; outline: none;
    &:focus { border-color: #3b82f6; }
    &.search-input { flex: 1; max-width: 400px; }
  }
  select.glass-input {
    appearance: none; cursor: pointer;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%238a8a93" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
    background-repeat: no-repeat; background-position-x: 95%; background-position-y: 50%; padding-right: 30px;
    option { color: #000; }
  }
}

.table-responsive { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; text-align: left; }
th { padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #8a8a93; font-weight: 500; font-size: 0.9rem; }
td { padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.95rem; vertical-align: middle; }

.user-cell { display: flex; align-items: center; gap: 12px; }
.avatar-sm { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255, 255, 255, 0.2); }

.pill {
  padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 5px; white-space: nowrap;
  &.verified { background: rgba(46, 213, 115, 0.1); color: #2ed573; }
  &.star-alumni { background: rgba(255, 171, 0, 0.1); color: #ffab00; }
}

.actions-cell {
  display: flex; gap: 8px;
  .action-btn { 
    background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s; color: #3498db;
    &:hover { background: rgba(52, 152, 219, 0.1); }
    &.danger { color: #ff4757; &:hover { background: rgba(255, 71, 87, 0.1); } }
  }
}

.empty-state, .loading-state, .error-alert { text-align: center; padding: 50px; color: #8a8a93; border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 12px; margin-top: 20px; i { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; } }
.error-alert { border-color: rgba(255, 71, 87, 0.3); color: #ff4757; background: rgba(255, 71, 87, 0.05); padding: 20px; i { font-size: 1.5rem; margin-bottom: 0; margin-right: 10px; opacity: 1; } }

@keyframes spin { 100% { transform: rotate(360deg); } }

@media (max-width: 768px) { .desktop-only { display: none; } }
@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .table-filters { flex-direction: column; .search-input { max-width: 100%; } }
}
</style>