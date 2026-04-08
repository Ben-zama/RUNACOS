<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>User Management</h2>
        <p>View and manage registered students and admins.</p>
      </div>
      <div class="header-actions">
        <Button
          icon="bi bi-arrow-clockwise"
          class="p-button-rounded glass-action-btn"
          @click="usersStore.fetchUsers"
          :disabled="usersStore.isLoading"
          :class="{ 'spin-icon': usersStore.isLoading }"
          aria-label="Refresh"
        />
      </div>
    </div>

    <div v-if="usersStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ usersStore.error }}
    </div>

    <div class="glass-card table-card">
      <div class="table-filters">
        <span class="p-input-icon-left search-full-wrapper">
          <i class="bi bi-search" style="color: #8a8a93; margin-left: 10px;"></i>
          <InputText
            v-model="searchQuery"
            placeholder="Search by username..."
            class="glass-input search-full pl-5"
          />
        </span>
      </div>

      <DataTable
        :value="filteredUsers"
        :loading="usersStore.isLoading"
        responsiveLayout="scroll"
        class="glass-datatable"
        paginator
        :rows="10"
        :rowsPerPageOptions="[5, 10, 20, 50]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} users"
      >
        <template #loading>
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading users...</p>
          </div>
        </template>

        <template #empty>
          <div class="empty-state">
            <i class="bi bi-people"></i>
            <p>No users match your search.</p>
          </div>
        </template>

        <Column field="username" header="Username">
          <template #body="{ data }">
            <span class="highlight">{{ data.username }}</span>
          </template>
        </Column>

        <Column field="role" header="Role">
          <template #body="{ data }">
            <Tag
              :value="data.role === 'admin' ? 'Admin' : 'Student'"
              :severity="data.role === 'admin' ? 'danger' : 'info'"
              rounded
              class="custom-tag"
              :class="data.role === 'admin' ? 'admin-pill' : 'student-pill'"
            />
          </template>
        </Column>

        <Column field="studentInfo.department" header="Department" class="desktop-only">
          <template #body="{ data }">
            {{ data.studentInfo?.department || "N/A" }}
          </template>
        </Column>

        <Column field="email" header="Email" class="desktop-only"></Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
          <template #body="{ data }">
            <div class="actions-cell">
              <Button
                icon="bi bi-pencil"
                class="p-button-rounded p-button-text action-btn"
                @click="openModal(data)"
              />
              <Button
                icon="bi bi-trash"
                class="p-button-rounded p-button-text action-btn danger"
                @click="handleDelete(data.id || data._id)"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="isModalOpen"
      header="Edit User"
      :modal="true"
      :style="{ width: '100%', maxWidth: '400px' }"
      class="glass-dialog"
      :closable="false"
    >
      <form @submit.prevent="handleSubmit">
        <div class="form-group mt-3">
          <label>Username (Full Name)</label>
          <InputText
            v-model="form.username"
            class="glass-input w-full"
            required
          />
        </div>

        <div class="form-group">
          <label>Role</label>
          <select
            v-model="form.role"
            class="glass-input glass-select w-full"
            required
          >
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
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
            :label="usersStore.isLoading ? 'Saving...' : 'Save Changes'"
            icon="bi bi-check"
            class="btn-save"
            :loading="usersStore.isLoading"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { useUsersStore } from "~/stores/useUsersStore";

definePageMeta({ layout: "admin", middleware: "admin" });

const usersStore = useUsersStore();

// Search State
const searchQuery = ref("");

onMounted(() => {
  usersStore.fetchUsers();
});

// Filter out alumni, keeping only students and admins
const filteredUsers = computed(() => {
  if (!usersStore.users) return [];

  return usersStore.users.filter((user) => {
    if (user.role !== "student" && user.role !== "admin") return false;

    const safeUsername = user.username || "";
    const safeQuery = searchQuery.value || "";

    return safeUsername.toLowerCase().includes(safeQuery.toLowerCase());
  });
});

// --- Modal & Form Logic ---
const isModalOpen = ref(false);
const editingId = ref(null);

const form = reactive({
  username: "",
  role: "student",
});

const resetForm = () => {
  form.username = "";
  form.role = "student";
  editingId.value = null;
};

const openModal = (user) => {
  editingId.value = user.id || user._id;
  form.username = user.username || "";
  form.role = user.role || "student";
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const handleSubmit = async () => {
  try {
    const payload = {
      username: form.username,
      role: form.role,
    };
    await usersStore.updateUser(editingId.value, payload);
    closeModal();
  } catch (err) {
    alert("Failed to update user. Check console.");
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to remove this user?")) return;
  try {
    await usersStore.deleteUser(id);
  } catch {
    alert("Failed to delete user.");
  }
};
</script>

<style lang="scss" scoped>
.page-container {
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  
  .titles {
    h2 {
      font-size: 2rem;
      margin: 0 0 5px 0;
    }
    p {
      color: #8a8a93;
      margin: 0;
    }
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

  .search-full {
    width: 100%;
    padding-left: 2.5rem !important; 
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
  
  &::placeholder {
    color: #8a8a93;
  }
  &:focus {
    border-color: $accent-color;
  }
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
}

.highlight { font-weight: 600; }

/* Custom Tag Overrides */
.custom-tag {
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 600;
}
.student-pill {
  background: rgba(52, 152, 219, 0.1) !important;
  color: #3498db !important;
}
.admin-pill {
  background: rgba(255, 71, 87, 0.1) !important;
  color: #ff4757 !important;
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

.empty-state, .loading-state, .error-alert {
  text-align: center;
  padding: 50px;
  border-radius: 12px;
  margin-top: 20px;
  i {
    font-size: 3rem;
    margin-bottom: 10px;
    opacity: 0.5;
  }
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
  i {
    font-size: 1.5rem;
    margin-bottom: 0;
    margin-right: 10px;
    opacity: 1;
  }
}

@keyframes spin { 100% { transform: rotate(360deg); } }

/* Responsiveness */
@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .table-filters {
    flex-direction: column;
    .search-full-wrapper {
      max-width: 100%;
    }
  }
  
  /* Make paginator stack on tiny screens */
  :deep(.p-paginator) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
@media (max-width: 768px) {
  :deep(.desktop-only) {
    display: none;
  }
}
</style>