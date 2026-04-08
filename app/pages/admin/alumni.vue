<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Alumni Database</h2>
        <p>Manage registered alumni profiles and graduation records.</p>
      </div>
      <div class="header-actions">
        <Button
          label="Refresh"
          icon="bi bi-arrow-clockwise"
          class="glass-action-btn primary-hover"
          @click="alumniStore.fetchAlumni"
          :disabled="alumniStore.isLoading"
          :class="{ 'spin-icon': alumniStore.isLoading }"
        />
      </div>
    </div>

    <div v-if="alumniStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ alumniStore.error }}
    </div>

    <div class="glass-card table-card">
      <div class="table-filters">
        <span class="p-input-icon-left search-full-wrapper">
          <i class="bi bi-search" style="color: #8a8a93; margin-left: 10px;"></i>
          <InputText
            v-model="searchQuery"
            placeholder="Search by name or department..."
            class="glass-input search-input pl-5"
          />
        </span>
        
        <select v-model="selectedYear" class="glass-input filter-select">
          <option value="">All Years</option>
          <option v-for="year in uniqueGradYears" :key="year" :value="year">
            {{ year }}
          </option>
        </select>
      </div>

      <DataTable
        :value="filteredAlumni"
        :loading="alumniStore.isLoading"
        responsiveLayout="scroll"
        class="glass-datatable"
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} alumni"
      >
        <template #loading>
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading alumni records...</p>
          </div>
        </template>

        <template #empty>
          <div class="empty-state">
            <i class="bi bi-person-x"></i>
            <p>No alumni match your search criteria.</p>
          </div>
        </template>

        <Column field="username" header="Alumni Name">
          <template #body="{ data }">
            <div class="user-cell">
              <img
                :src="`https://placehold.co/100x100/151515/8a8a93?text=${getInitial(data.username)}`"
                class="avatar-sm"
                alt="Avatar"
              />
              <div>
                <div class="highlight">{{ data.username }}</div>
                <div class="text-xs text-gray-400">{{ data.email }}</div>
              </div>
            </div>
          </template>
        </Column>

        <Column field="studentInfo.department" header="Department">
          <template #body="{ data }">
            {{ data.studentInfo?.department || "N/A" }}
          </template>
        </Column>

        <Column field="alumniInfo.graduationYear" header="Class Of">
          <template #body="{ data }">
            {{ extractYear(data.alumniInfo?.graduationYear) }}
          </template>
        </Column>

        <Column field="alumniInfo.jobTitle" header="Current Job" class="desktop-only">
          <template #body="{ data }">
            {{ data.alumniInfo?.jobTitle || "Unspecified" }}
          </template>
        </Column>

        <Column field="alumniInfo.isStar" header="Status">
          <template #body="{ data }">
            <span v-if="data.alumniInfo?.isStar" class="pill star-alumni">
              <i class="bi bi-star-fill"></i> Star Alumni
            </span>
            <span v-else class="pill verified">
              <i class="bi bi-check-circle-fill"></i> Verified
            </span>
          </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
          <template #body="{ data }">
            <div class="actions-cell">
              <Button
                icon="bi bi-pencil"
                class="p-button-rounded p-button-text action-btn"
                @click="openEditModal(data)"
                title="Edit Alumni"
              />
              <Button
                icon="bi bi-trash"
                class="p-button-rounded p-button-text action-btn danger"
                @click="handleDelete(data.id || data._id)"
                title="Delete Alumni"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="showModal"
      header="Edit Alumni Profile"
      :modal="true"
      :style="{ width: '100%', maxWidth: '650px' }"
      class="glass-dialog"
      :closable="false"
    >
      <form @submit.prevent="submitForm" class="alumni-form">
        <div class="form-row mt-3">
          <div class="form-group">
            <label>Username *</label>
            <InputText
              v-model="formData.username"
              class="glass-input w-full"
              required
            />
          </div>
          <div class="form-group">
            <label>Email *</label>
            <InputText
              v-model="formData.email"
              type="email"
              class="glass-input w-full"
              required
            />
          </div>
        </div>

        <hr class="divider" />

        <div class="form-row">
          <div class="form-group">
            <label>Department *</label>
            <InputText
              v-model="formData.studentInfo.department"
              class="glass-input w-full"
              required
            />
          </div>
          <div class="form-group">
            <label>Matric Number *</label>
            <InputText
              v-model="formData.studentInfo.matricNumber"
              class="glass-input w-full"
              required
            />
          </div>
        </div>

        <hr class="divider" />

        <div class="form-row">
          <div class="form-group">
            <label>Job Title</label>
            <InputText
              v-model="formData.alumniInfo.jobTitle"
              class="glass-input w-full"
            />
          </div>
          <div class="form-group">
            <label>Company</label>
            <InputText
              v-model="formData.alumniInfo.currentCompany"
              class="glass-input w-full"
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group">
            <label>Graduation Date</label>
            <input
              v-model="formData.alumniInfo.graduationYear"
              type="date"
              class="glass-input w-full"
            />
          </div>
          <div class="form-group checkbox-group">
            <label class="star-toggle">
              <input v-model="formData.alumniInfo.isStar" type="checkbox" />
              <i :class="formData.alumniInfo.isStar ? 'bi bi-star-fill text-warning' : 'bi bi-star'"></i>
              Mark as Star Alumni
            </label>
          </div>
        </div>

        <div class="modal-actions">
          <Button
            label="Cancel"
            icon="bi bi-x"
            class="p-button-text btn-cancel"
            @click="closeModal"
          />
          <Button
            type="submit"
            :label="alumniStore.isLoading ? 'Saving...' : 'Save Changes'"
            icon="bi bi-check"
            class="btn-save"
            :loading="alumniStore.isLoading"
          />
        </div>
      </form>
    </Dialog>
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

  let gradDate = "";
  if (alumni.alumniInfo?.graduationYear) {
    gradDate = alumni.alumniInfo.graduationYear.split("T")[0];
  }

  formData.value = {
    username: alumni.username || "",
    email: alumni.email || "",
    password: "", 
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
    const payload = JSON.parse(JSON.stringify(formData.value));
    if (payload.alumniInfo.graduationYear) {
      payload.alumniInfo.graduationYear = new Date(
        payload.alumniInfo.graduationYear
      ).toISOString();
    } else {
      delete payload.alumniInfo.graduationYear;
    }

    if (!payload.password) delete payload.password;

    await alumniStore.updateAlumni(currentAlumniId.value, payload);
    closeModal();
  } catch (error) {
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
/* Box Sizing Reset */
*, *::before, *::after {
  box-sizing: border-box;
}

.page-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
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

    .spin-icon :deep(span.p-button-icon) {
      animation: spin 1s linear infinite;
    }
  }
}

.table-card {
  padding: 20px;
  border-radius: 12px;
}

.table-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;

  .search-full-wrapper {
    width: 100%;
    max-width: 400px;
    position: relative;
    
    i {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .search-input {
    width: 100%;
    padding-left: 2.5rem !important; 
  }

  .filter-select {
    max-width: 200px;
    appearance: none;
    cursor: pointer;
    background-image: url('data:image/svg+xml;utf8,<svg fill="%238a8a93" height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg"><path d="M7 10l5 5 5-5z"/><path d="M0 0h24v24H0z" fill="none"/></svg>');
    background-repeat: no-repeat;
    background-position-x: 95%;
    background-position-y: 50%;
    padding-right: 30px;
  }
}

/* Glass Input Override */
.glass-input {
  background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
  padding: 10px 15px;
  border-radius: 8px;
  outline: none;
  color: var(--text-color);
  font-family: inherit;
  
  &::placeholder { color: #8a8a93; }
  &:focus { border-color: $accent-color; }
  option {
    background: var(--background-color, #1a1a1a);
    color: var(--text-color, #fff);
  }
}

.w-full { width: 100%; }
.mt-3 { margin-top: 1rem; }

/* PrimeVue DataTable Overrides */
:deep(.glass-datatable) {
  .p-datatable-header, .p-datatable-footer {
    background: transparent;
    border: none;
  }
  .p-datatable-thead > tr > th {
    background: transparent;
    color: #8a8a93;
    border-bottom: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
    font-weight: 500;
    padding: 15px;
  }
  .p-datatable-tbody > tr {
    background: transparent;
    color: var(--text-color);
  }
  .p-datatable-tbody > tr > td {
    border-bottom: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
    padding: 15px;
    font-size: 0.95rem;
  }
  .p-datatable-tbody > tr:hover {
    background: color-mix(in srgb, var(--text-color) 5%, transparent);
  }
  .p-datatable-loading-overlay {
    background: color-mix(in srgb, var(--background-color) 50%, transparent);
    backdrop-filter: blur(2px);
  }

  /* Pagination Glassmorphism Styles */
  .p-paginator {
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

    .p-dropdown {
      background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
      border-radius: 8px;
      
      .p-dropdown-label { color: var(--text-color); }
      .p-dropdown-trigger { color: #8a8a93; }
      
      &:hover { border-color: color-mix(in srgb, var(--text-color) 30%, transparent); }
    }
  }
}

/* User Cell Styles */
.user-cell {
  display: flex;
  align-items: center;
  gap: 12px;
}
.avatar-sm {
  width: 35px;
  height: 35px;
  border-radius: 50%;
  object-fit: cover;
  border: 1px solid color-mix(in srgb, var(--text-color) 20%, transparent);
}
.highlight { font-weight: 600; }
.text-xs { font-size: 0.75rem; }
.text-gray-400 { color: #9ca3af; }

/* Status Pills */
.pill {
  padding: 5px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  white-space: nowrap;
  font-weight: 600;
  
  &.verified {
    background: rgba(46, 213, 115, 0.1);
    color: #2ed573;
    border: 1px solid rgba(46, 213, 115, 0.2);
  }
  &.star-alumni {
    background: rgba(255, 171, 0, 0.1);
    color: #ffab00;
    border: 1px solid rgba(255, 171, 0, 0.2);
  }
}

/* Actions */
.actions-cell {
  display: flex;
  gap: 8px;

  .action-btn {
    color: #3498db;
    &:hover { background: rgba(52, 152, 219, 0.1) !important; }
    
    &.danger {
      color: #ff4757;
      &:hover { background: rgba(255, 71, 87, 0.1) !important; }
    }
  }
}


.divider {
  border: 0;
  border-top: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
  margin: 5px 0;
}
.checkbox-group {
  justify-content: flex-end;
  padding-bottom: 5px;
  
  .star-toggle {
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
    background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
    border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
    padding: 10px 15px;
    border-radius: 8px;
    transition: 0.2s;
    
    input { display: none; }
    &:hover { border-color: $accent-color; }
  }
}
.text-warning { color: #ffab00; }

.empty-state, .loading-state, .error-alert {
  text-align: center;
  padding: 50px;
  border-radius: 12px;
  margin-top: 20px;
  i { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; }
}

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-left-color: $accent-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
}

.error-alert {
  border-color: rgba(255, 71, 87, 0.3);
  color: #ff4757;
  background: rgba(255, 71, 87, 0.05);
  padding: 20px;
  i { font-size: 1.5rem; margin-bottom: 0; margin-right: 10px; opacity: 1; }
}

@keyframes spin { 100% { transform: rotate(360deg); } }

/* --- MOBILE RESPONSIVENESS --- */
@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  .table-filters {
    flex-direction: column;
    .search-full-wrapper, .filter-select {
      max-width: 100%;
    }
  }
  .form-row {
    flex-direction: column;
    gap: 15px;
  }
  
  :deep(.p-paginator) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
@media (max-width: 768px) {
  :deep(.desktop-only) { display: none; }
}
@media (max-width: 480px) {
  .page-header .titles h2 { font-size: 1.5rem; }
}
</style>