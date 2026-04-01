<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Registered Students</h2>
        <p>View and manage registered students.</p>
      </div>
      <div class="header-actions">
        <button class="glass-btn refresh-btn" @click="usersStore.fetchUsers" :disabled="usersStore.isLoading">
          <i class="bi bi-arrow-clockwise" :class="{ 'spin': usersStore.isLoading }"></i>
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
          placeholder="Search by username or matric number..." 
          class="glass-input search-full" 
        />
      </div>

      <div v-if="usersStore.isLoading && usersStore.users.length === 0" class="loading-state">
        <div class="spinner"></div><p>Loading students...</p>
      </div>
      <div v-else-if="filteredStudents.length === 0" class="empty-state">
        <i class="bi bi-people"></i><p>No students match your search.</p>
      </div>

      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Username</th>
              <th>Matric Number</th>
              <th class="desktop-only">Department</th>
              <th class="desktop-only">Email</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="student in filteredStudents" :key="student.id || student._id">
              <td class="highlight">{{ student.username }}</td>
              <td><span class="pill">{{ student.studentInfo?.matricNumber || 'N/A' }}</span></td>
              <td class="desktop-only">{{ student.studentInfo?.department || 'N/A' }}</td>
              <td class="desktop-only">{{ student.email }}</td>
              <td class="actions-cell">
                <button class="action-btn" @click="openModal(student)"><i class="bi bi-pencil"></i></button>
                <button class="action-btn danger" @click="handleDelete(student.id || student._id)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="glass-modal">
        <h3>Edit Student</h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Username</label>
            <input v-model="form.username" type="text" class="glass-input" required />
          </div>

          <div class="form-group">
            <label>Email Address</label>
            <input v-model="form.email" type="email" class="glass-input" required />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Department</label>
              <select v-model="form.studentInfo.department" class="glass-input glass-select" required>
                <option value="Computer Science">Computer Science</option>
                <option value="Cyber Security">Cyber Security</option>
                <option value="Information Technology">Information Tech</option>
              </select>
            </div>

            <div class="form-group half">
              <label>Matric Number</label>
              <input v-model="form.studentInfo.matricNumber" type="text" class="glass-input" required />
            </div>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-save" :disabled="usersStore.isLoading">
              {{ usersStore.isLoading ? 'Saving...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from 'vue';
// Make sure to create this store to interact with the /user endpoints
import { useUsersStore } from '~/stores/useUsersStore';

definePageMeta({ layout: 'admin' });

const usersStore = useUsersStore();

// Search State
const searchQuery = ref('');

onMounted(() => {
  usersStore.fetchUsers();
});

// Crash-Proof Live Filtering Logic
const filteredStudents = computed(() => {
  if (!usersStore.users) return [];
  
  return usersStore.users.filter((user) => {
    // Only show users who are registered as students
    if (user.role !== 'student') return false;

    const safeUsername = user.username || '';
    const safeMatric = user.studentInfo?.matricNumber || '';
    const safeQuery = searchQuery.value || '';
    
    return safeUsername.toLowerCase().includes(safeQuery.toLowerCase()) || 
           safeMatric.toLowerCase().includes(safeQuery.toLowerCase());
  });
});

// --- Modal & Form Logic ---
const isModalOpen = ref(false);
const editingId = ref(null);

// Form structured to match your OpenAPI User schema
const form = reactive({
  username: '',
  email: '',
  studentInfo: {
    department: '',
    matricNumber: ''
  }
});

const resetForm = () => {
  form.username = '';
  form.email = '';
  form.studentInfo.department = '';
  form.studentInfo.matricNumber = '';
  editingId.value = null;
};

const openModal = (student) => {
  editingId.value = student.id || student._id;
  
  // Safely populate form
  form.username = student.username || '';
  form.email = student.email || '';
  form.studentInfo.department = student.studentInfo?.department || '';
  form.studentInfo.matricNumber = student.studentInfo?.matricNumber || '';
  
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
      email: form.email,
      studentInfo: {
        department: form.studentInfo.department,
        matricNumber: form.studentInfo.matricNumber
      }
    };

    // Update the user via the store
    await usersStore.updateUser(editingId.value, payload);
    closeModal();
  } catch (err) {
    alert('Failed to update student. Check console.');
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to remove this student?")) return;
  try {
    await usersStore.deleteUser(id);
  } catch {
    alert("Failed to delete student.");
  }
};
</script>

<style lang="scss" scoped>
/* Keeping your existing styles intact, just adding the .form-row utility */
.page-container { display: flex; flex-direction: column; gap: 30px; color: #fff; }
.page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  .titles {
    h2 { font-size: 2rem; margin: 0 0 5px 0; }
    p { color: #8a8a93; margin: 0; }
  }
  .header-actions {
    display: flex; gap: 10px;
    .glass-btn {
      background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff; padding: 10px 20px; border-radius: 8px; cursor: pointer;
      display: flex; align-items: center; gap: 8px; transition: 0.3s;
      &:hover { background: rgba(255, 255, 255, 0.2); }
      &.primary-hover:hover { background: rgba(52, 152, 219, 0.3); border-color: rgba(52, 152, 219, 0.4); color: #3498db; }
    }
    .spin { animation: spin 1s linear infinite; }
  }
}

.table-card { padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%); backdrop-filter: blur(10px); }
.table-filters {
  display: flex; gap: 15px; margin-bottom: 20px;
  .glass-input {
    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 10px 15px; border-radius: 8px; outline: none;
    &::placeholder { color: #8a8a93; }
    &:focus { border-color: #3b82f6; }
  }
  .search-full { width: 100%; max-width: 400px; }
}
.table-responsive { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; text-align: left; }
th { padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #8a8a93; font-weight: 500; font-size: 0.9rem; }
td { padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.95rem; vertical-align: middle; }
.pill { background: rgba(255, 255, 255, 0.1); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; white-space: nowrap; }

.actions-cell {
  display: flex; gap: 8px;
  .action-btn { 
    background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s; color: #3498db;
    &:hover { background: rgba(52, 152, 219, 0.1); }
    &.danger { color: #ff4757; &:hover { background: rgba(255, 71, 87, 0.1); } }
  }
}

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.glass-modal { background: linear-gradient(145deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 30px; width: 100%; max-width: 600px; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5); max-height: 90vh; overflow-y: auto; }
.glass-modal h3 { margin-top: 0; margin-bottom: 25px; font-size: 1.5rem; }

/* Added form-row to keep layout clean for side-by-side inputs */
.form-row { display: flex; gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; width: 100%; }
.form-group.half { flex: 1; }
.form-group label { font-size: 0.85rem; color: #aaa; }

.glass-input { width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 12px; border-radius: 8px; outline: none; font-family: inherit; &:focus { border-color: #3498db; } option { background: #1a1a1a; color: #fff; } }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; }
.modal-actions button { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; transition: 0.2s; }
.btn-cancel { background: transparent; color: #aaa; &:hover { color: #fff; background: rgba(255, 255, 255, 0.05); } }
.btn-save { background: #3498db; color: #fff; &:hover:not(:disabled) { background: #2980b9; } &:disabled { opacity: 0.6; cursor: not-allowed; } }

.empty-state, .loading-state, .error-alert { text-align: center; padding: 50px; color: #8a8a93; border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 12px; margin-top: 20px; i { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; } }
.error-alert { border-color: rgba(255, 71, 87, 0.3); color: #ff4757; background: rgba(255, 71, 87, 0.05); padding: 20px; i { font-size: 1.5rem; margin-bottom: 0; margin-right: 10px; opacity: 1; } }

@keyframes spin { 100% { transform: rotate(360deg); } }
@media (max-width: 600px) { .page-header { flex-direction: column; align-items: flex-start; gap: 15px; } .table-filters { flex-direction: column; .glass-input { max-width: 100%; } } .form-row { flex-direction: column; gap: 0; } }
@media (max-width: 768px) { .desktop-only { display: none; } .table-responsive table { width: 100%; } }
</style>