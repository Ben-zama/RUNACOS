<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>User Management</h2>
        <p>View and manage registered students and admins.</p>
      </div>
      <div class="header-actions">
        <button
          class="glass-btn refresh-btn"
          @click="usersStore.fetchUsers"
          :disabled="usersStore.isLoading"
        >
          <i
            class="bi bi-arrow-clockwise"
            :class="{ spin: usersStore.isLoading }"
          ></i>
        </button>
      </div>
    </div>

    <div v-if="usersStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ usersStore.error }}
    </div>

    <div class="glass-card table-card">
      <div class="table-filters">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by username..."
          class="glass-input search-full"
        />
      </div>

      <div
        v-if="usersStore.isLoading && usersStore.users.length === 0"
        class="loading-state"
      >
        <div class="spinner"></div>
        <p>Loading users...</p>
      </div>
      <div v-else-if="filteredUsers.length === 0" class="empty-state">
        <i class="bi bi-people"></i>
        <p>No users match your search.</p>
      </div>

      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Role</th>
              <th class="desktop-only">Department</th>
              <th class="desktop-only">Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="user in filteredUsers" :key="user.id || user._id">
              <td class="highlight">{{ user.username }}</td>
              <td>
                <span
                  class="pill"
                  :class="user.role === 'admin' ? 'admin-pill' : 'student-pill'"
                >
                  {{ user.role === "admin" ? "Admin" : "Student" }}
                </span>
              </td>
              <td class="desktop-only">
                {{ user.studentInfo?.department || "N/A" }}
              </td>
              <td class="desktop-only">{{ user.email }}</td>
              <td class="actions-cell">
                <button class="action-btn" @click="openModal(user)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="action-btn danger"
                  @click="handleDelete(user.id || user._id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>Edit User</h3>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Username (Full Name)</label>
            <input
              v-model="form.username"
              type="text"
              class="glass-input"
              required
            />
          </div>

          <div class="form-group">
            <label>Role</label>
            <select
              v-model="form.role"
              class="glass-input glass-select"
              required
            >
              <option value="student">Student</option>
              <option value="admin">Admin</option>
            </select>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">
              Cancel
            </button>
            <button
              type="submit"
              class="btn-save"
              :disabled="usersStore.isLoading"
            >
              {{ usersStore.isLoading ? "Saving..." : "Save Changes" }}
            </button>
          </div>
        </form>
      </div>
    </div>
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
    // Only show users who are either students or admins
    if (user.role !== "student" && user.role !== "admin") return false;

    const safeUsername = user.username || "";
    const safeQuery = searchQuery.value || "";

    return safeUsername.toLowerCase().includes(safeQuery.toLowerCase());
  });
});

// --- Modal & Form Logic ---
const isModalOpen = ref(false);
const editingId = ref(null);

// Form structured to ONLY contain patchable fields
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

  // Safely populate form with only editable fields
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
    // Payload ONLY contains username and role
    const payload = {
      username: form.username,
      role: form.role,
    };

    // Update the user via the store
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
    .spin {
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
  .search-full {
    width: 100%;
    max-width: 400px;
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
  font-weight: 500;
  font-size: 0.9rem;
}
td {
  padding: 15px;
  font-size: 0.95rem;
  vertical-align: middle;
}

/* Custom Pill Styling for Roles */
.pill {
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  white-space: nowrap;
  font-weight: 600;
}
.student-pill {
  background: rgba(52, 152, 219, 0.1);
  color: #3498db;
}
.admin-pill {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
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

@keyframes spin {
  100% {
    transform: rotate(360deg);
  }
}
@media (max-width: 600px) {
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 15px;
  }
  .table-filters {
    flex-direction: column;
    .glass-input {
      max-width: 100%;
    }
  }
}
@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  .table-responsive table {
    width: 100%;
  }
}
</style>