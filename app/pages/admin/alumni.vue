<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Alumni Database</h2>
        <p>Manage registered alumni profiles and graduation records.</p>
      </div>
      <div class="header-actions">
        <button
          class="glass-btn primary-hover"
          @click="alumniStore.fetchAlumni"
          :disabled="alumniStore.isLoading"
        >
          <i
            class="bi bi-arrow-clockwise"
            :class="{ spin: alumniStore.isLoading }"
          ></i>
          Refresh
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

      <div
        v-if="alumniStore.isLoading && alumniStore.alumni.length === 0"
        class="loading-state"
      >
        <div class="spinner"></div>
        <p>Loading alumni records...</p>
      </div>
      <div v-else-if="filteredAlumni.length === 0" class="empty-state">
        <i class="bi bi-person-x"></i>
        <p>No alumni match your search criteria.</p>
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
              <td data-label="Alumni Name">
                <div class="user-cell">
                  <img
                    :src="`https://placehold.co/100x100/151515/8a8a93?text=${getInitial(
                      alumni.username
                    )}`"
                    class="avatar-sm"
                  />
                  <div>
                    {{ alumni.username }}
                    <div class="text-xs text-gray-400">{{ alumni.email }}</div>
                  </div>
                </div>
              </td>
              <td data-label="Department">
                {{ alumni.studentInfo?.department || "N/A" }}
              </td>
              <td data-label="Class Of">
                {{ extractYear(alumni.alumniInfo?.graduationYear) }}
              </td>
              <td data-label="Current Job" class="desktop-only">
                {{ alumni.alumniInfo?.jobTitle || "Unspecified" }}
              </td>
              <td data-label="Status">
                <span
                  v-if="alumni.alumniInfo?.isStar"
                  class="pill verified star-alumni"
                >
                  <i class="bi bi-star-fill"></i> Star Alumni
                </span>
                <span v-else class="pill verified">
                  <i class="bi bi-check-circle-fill"></i> Verified
                </span>
              </td>
              <td data-label="Actions" class="actions-cell">
                <button class="action-btn" @click="openEditModal(alumni)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="action-btn danger"
                  @click="handleDelete(alumni.id || alumni._id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="showModal" class="modal-overlay" @click.self="closeModal">
      <div class="modal-content glass-card">
        <h3>Edit Alumni Profile</h3>

        <form @submit.prevent="submitForm" class="alumni-form">
          <div class="form-group">
            <label>Username *</label>
            <input
              v-model="formData.username"
              type="text"
              class="glass-input"
              required
            />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <input
              v-model="formData.email"
              type="email"
              class="glass-input"
              required
            />
          </div>

          <hr class="divider" />

          <div class="form-row">
            <div class="form-group">
              <label>Department *</label>
              <input
                v-model="formData.studentInfo.department"
                type="text"
                class="glass-input"
                required
              />
            </div>
            <div class="form-group">
              <label>Matric Number *</label>
              <input
                v-model="formData.studentInfo.matricNumber"
                type="text"
                class="glass-input"
                required
              />
            </div>
          </div>

          <hr class="divider" />

          <div class="form-row">
            <div class="form-group">
              <label>Job Title</label>
              <input
                v-model="formData.alumniInfo.jobTitle"
                type="text"
                class="glass-input"
              />
            </div>
            <div class="form-group">
              <label>Company</label>
              <input
                v-model="formData.alumniInfo.currentCompany"
                type="text"
                class="glass-input"
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group">
              <label>Graduation Date</label>
              <input
                v-model="formData.alumniInfo.graduationYear"
                type="date"
                class="glass-input"
              />
            </div>
            <div class="form-group checkbox-group">
              <label>
                <input v-model="formData.alumniInfo.isStar" type="checkbox" />
                Mark as Star Alumni
              </label>
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="glass-btn" @click="closeModal">
              Cancel
            </button>
            <button
              type="submit"
              class="glass-btn primary-hover"
              :disabled="alumniStore.isLoading"
            >
              Save Changes
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useAlumniStore } from "~/stores/useAlumniStore";

definePageMeta({ layout: "admin", middleware: "admin" });

const alumniStore = useAlumniStore();

// Filter State
const searchQuery = ref("");
const selectedYear = ref("");

// Modal State
const showModal = ref(false);
const currentAlumniId = ref(null);

const defaultForm = () => ({
  username: "",
  email: "",
  password: "",
  studentInfo: { department: "", matricNumber: "" },
  alumniInfo: {
    currentCompany: "",
    graduationYear: "",
    jobTitle: "",
    isStar: false,
  },
});

const formData = ref(defaultForm());

onMounted(() => {
  alumniStore.fetchAlumni();
});

const getInitial = (name) => {
  return name ? name.charAt(0).toUpperCase() : "?";
};

const extractYear = (isoDateString) => {
  if (!isoDateString) return "N/A";
  return isoDateString.substring(0, 4);
};

const uniqueGradYears = computed(() => {
  const years = alumniStore.alumni
    .map((a) => extractYear(a.alumniInfo?.graduationYear))
    .filter((year) => year !== "N/A");
  return [...new Set(years)].sort((a, b) => b - a);
});

const filteredAlumni = computed(() => {
  if (!alumniStore.alumni) return [];
  return alumniStore.alumni.filter((alumni) => {
    const safeName = (alumni.username || "").toLowerCase();
    const safeDept = (alumni.studentInfo?.department || "").toLowerCase();
    const safeQuery = searchQuery.value.toLowerCase();
    const alumniYear = extractYear(alumni.alumniInfo?.graduationYear);

    const matchesSearch =
      safeName.includes(safeQuery) || safeDept.includes(safeQuery);
    const matchesYear =
      selectedYear.value === "" || alumniYear === selectedYear.value;

    return matchesSearch && matchesYear;
  });
});

// Action Handlers
const openEditModal = (alumni) => {
  currentAlumniId.value = alumni.id || alumni._id;

  // Format date for HTML input type="date"
  let gradDate = "";
  if (alumni.alumniInfo?.graduationYear) {
    gradDate = alumni.alumniInfo.graduationYear.split("T")[0];
  }

  formData.value = {
    username: alumni.username || "",
    email: alumni.email || "",
    password: "", // Leave empty so we don't accidentally update it
    studentInfo: {
      department: alumni.studentInfo?.department || "",
      matricNumber: alumni.studentInfo?.matricNumber || "",
    },
    alumniInfo: {
      currentCompany: alumni.alumniInfo?.currentCompany || "",
      graduationYear: gradDate,
      jobTitle: alumni.alumniInfo?.jobTitle || "",
      isStar: alumni.alumniInfo?.isStar || false,
    },
  };
  showModal.value = true;
};

const closeModal = () => {
  showModal.value = false;
  currentAlumniId.value = null;
  formData.value = defaultForm();
};

const submitForm = async () => {
  try {
    // Format payload date to ISO if present
    const payload = JSON.parse(JSON.stringify(formData.value));
    if (payload.alumniInfo.graduationYear) {
      payload.alumniInfo.graduationYear = new Date(
        payload.alumniInfo.graduationYear
      ).toISOString();
    } else {
      delete payload.alumniInfo.graduationYear;
    }

    // Remove empty password so we don't accidentally update it
    if (!payload.password) delete payload.password;

    // Await the store update. If successful, close the modal.
    await alumniStore.updateAlumni(currentAlumniId.value, payload);
    closeModal();
  } catch (error) {
    // Error is handled in the store and displayed via the alert UI
    console.error("Update failed:", error);
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to remove this alumni record?")) return;
  try {
    await alumniStore.deleteAlumni(id);
  } catch {
    alert("Failed to delete record.");
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
  color: #fff;
}
.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  .titles h2 {
    font-size: 2rem;
    margin: 0 0 5px 0;
  }
  .titles p {
    color: #8a8a93;
    margin: 0;
  }
  .header-actions {
    display: flex;
    gap: 10px;
  }
}

.glass-btn {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 8px;
  transition: 0.3s;
  &:hover {
    background: rgba(255, 255, 255, 0.2);
  }
  &.primary-hover:hover {
    background: rgba(52, 152, 219, 0.3);
    border-color: rgba(52, 152, 219, 0.4);
    color: #3498db;
  }
}
.spin {
  animation: spin 1s linear infinite;
}

.table-card {
  padding: 20px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: linear-gradient(
    145deg,
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  backdrop-filter: blur(10px);
}
.table-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  .glass-input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 10px 15px;
    border-radius: 8px;
    outline: none;
    width: 100%;
    &:focus {
      border-color: #3b82f6;
    }
    &.search-input {
      flex: 1;
      max-width: 400px;
    }
  }
  select.glass-input {
    max-width: 200px;
    appearance: none;
    cursor: pointer;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%238a8a93" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
    background-repeat: no-repeat;
    background-position-x: 95%;
    background-position-y: 50%;
    padding-right: 30px;
    option {
      color: #000;
    }
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
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  color: #8a8a93;
  font-weight: 500;
  font-size: 0.9rem;
}
td {
  padding: 15px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  font-size: 0.95rem;
  vertical-align: middle;
}

.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar-sm {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid rgba(255, 255, 255, 0.2);
}
.text-xs {
  font-size: 0.75rem;
}
.text-gray-400 {
  color: #9ca3af;
}

.pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 5px;
  white-space: nowrap;
  &.verified {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
  }
  &.star-alumni {
    background: rgba(255, 171, 0, 0.1);
    color: #ffab00;
  }
}

.actions-cell {
  display: flex;
  gap: 8px;
  .action-btn {
    background: transparent;
    border: none;
    cursor: pointer;
    padding: 6px;
    border-radius: 6px;
    transition: 0.2s;
    color: #3498db;
    &:hover {
      background: rgba(52, 152, 219, 0.1);
    }
    &.danger {
      color: #ff4757;
      &:hover {
        background: rgba(255, 71, 87, 0.1);
      }
    }
  }
}

.empty-state,
.loading-state,
.error-alert {
  text-align: center;
  padding: 50px;
  color: #8a8a93;
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  margin-top: 20px;
  i {
    font-size: 3rem;
    margin-bottom: 10px;
    opacity: 0.5;
  }
}
.error-alert {
  border-color: rgba(255, 71, 87, 0.3);
  color: #ff4757;
  background: rgba(255, 71, 87, 0.05);
  padding: 20px;
  i {
    font-size: 1.5rem;
    margin-bottom: 0;
    margin-right: 10px;
    opacity: 1;
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: $translucent-background-color-50;
  backdrop-filter: blur(20px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}
.modal-content {
  background: #1e1e24;
  padding: 30px;
  border-radius: 12px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.5rem;
  }
}
.alumni-form {
  display: flex;
  flex-direction: column;
  gap: 15px;
}
.form-row {
  display: flex;
  gap: 15px;
}
.form-group {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 5px;
  label {
    font-size: 0.85rem;
    color: #8a8a93;
  }
  .glass-input {
    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 15px; border-radius: 8px; outline: none; width: 100%;
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
.checkbox-group {
  justify-content: flex-end;
  padding-bottom: 10px;
  flex-direction: row;
  align-items: center;
  label {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    color: #fff;
  }
}
.divider {
  border: 0;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  margin: 10px 0;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}

/* --- MOBILE RESPONSIVENESS --- */
*,
*::before,
*::after {
  box-sizing: border-box;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }

  /* Fix Modal Inputs */
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  .modal-content {
    width: 95%;
    padding: 20px;
    margin: 10px auto;
  }

  /* Fix Page Header */
  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    text-align: center;
  }
  .header-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  /* Fix Filters */
  .table-filters {
    flex-direction: column;
  }
  .table-filters .search-input,
  .table-filters select {
    width: 100%;
    max-width: 100%;
  }

  /* Transform Table into Cards */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
    width: 100%;
  }

  /* Hide standard table headers */
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }

  tr {
    margin-bottom: 15px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px;
    background: rgba(0, 0, 0, 0.15);
    padding: 5px 10px;
  }

  td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: right;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding: 12px 5px;
    font-size: 0.9rem;
  }

  td:last-child {
    border-bottom: none;
  }

  /* Create mobile headers using the data-label attribute */
  td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #8a8a93;
    text-transform: uppercase;
    font-size: 0.75rem;
    text-align: left;
    padding-right: 15px;
  }

  /* Adjust internal cell layouts for mobile */
  .user-cell {
    justify-content: flex-end;
    text-align: right;
  }
  .actions-cell {
    justify-content: flex-end;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .page-header .titles h2 {
    font-size: 1.5rem;
  }
  .glass-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}
</style>