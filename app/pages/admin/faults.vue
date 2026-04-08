<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Faults</h2>
        <p>View reported faults</p>
      </div>
      <Button
        label="Refresh"
        icon="bi bi-arrow-clockwise"
        class="glass-action-btn primary-hover"
        @click="faultsStore.fetchFaults"
        :disabled="faultsStore.isLoading"
        :class="{ 'spin-icon': faultsStore.isLoading }"
      />
    </div>

    <div v-if="faultsStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ faultsStore.error }}
    </div>

    <div v-else-if="faultsStore.isLoading && faultsStore.faults.length === 0" class="faults-grid">
      <div v-for="i in 3" :key="i" class="fault-card skeleton-card">
        <div class="card-header">
          <Skeleton width="60%" height="1.5rem" />
          <Skeleton width="20%" height="1.5rem" borderRadius="20px" />
        </div>
        <div class="card-body">
          <Skeleton width="100%" height="1rem" class="mb-2" />
          <Skeleton width="80%" height="1rem" class="mb-3" />
          <Skeleton width="40%" height="1rem" />
        </div>
        <div class="card-footer">
          <Skeleton width="30%" height="1rem" class="mb-2" />
          <Skeleton width="90%" height="1rem" />
        </div>
      </div>
    </div>

    <div v-else-if="faultsStore.faults.length === 0" class="empty-state">
      <i class="bi bi-inbox"></i>
      <p>No faults have been reported yet.</p>
    </div>

    <div v-else class="faults-grid">
      <div
        v-for="(fault, index) in faultsStore.faults"
        :key="index"
        class="fault-card"
      >
        <div class="card-header">
          <h3>{{ fault.title }}</h3>
          <div class="header-actions">
            <Tag 
              :value="fault.status" 
              class="custom-status-tag" 
              :class="fault.status.toLowerCase()" 
              rounded 
            />
            <Button
              icon="bi bi-pencil-square"
              class="p-button-rounded p-button-text action-btn edit-btn"
              @click="openEditModal(fault)"
              title="Update Status"
            />
            <Button
              icon="bi bi-trash"
              class="p-button-rounded p-button-text action-btn delete-btn"
              @click="handleDelete(fault.id || fault._id)"
              title="Delete Fault"
            />
          </div>
        </div>

        <div class="card-body">
          <p class="description">{{ fault.description }}</p>
          <div class="meta-info">
            <span class="student-id">
              <i class="bi bi-person-badge"></i> {{ fault.studentId }}
            </span>
          </div>
        </div>

        <div class="card-footer">
          <strong>Admin Response:</strong>
          <p>{{ fault.response || 'No response yet.' }}</p>
        </div>
      </div>
    </div>

    <Dialog
      v-model:visible="isModalOpen"
      header="Update Fault"
      :modal="true"
      :style="{ width: '100%', maxWidth: '450px' }"
      class="glass-dialog"
      :closable="false"
    >
      <form @submit.prevent="handleUpdate">
        <div class="form-group mt-3">
          <label for="status">Status</label>
          <select id="status" v-model="editingFault.status" class="glass-input w-full">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div class="form-group">
          <label for="response">Admin Response</label>
          <Textarea
            id="response"
            v-model="editingFault.response"
            class="glass-input w-full"
            placeholder="Explain the fix or next steps..."
            rows="4"
            autoResize
          />
        </div>

        <div class="modal-actions">
          <Button
            label="Cancel"
            icon="bi bi-x"
            class="p-button-text btn-cancel"
            @click="closeEditModal"
          />
          <Button
            type="submit"
            :label="faultsStore.isLoading ? 'Saving...' : 'Save Changes'"
            icon="bi bi-check"
            class="btn-save"
            :loading="faultsStore.isLoading"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useFaultsStore } from "~/stores/useFaultsStore";

definePageMeta({ layout: "admin", middleware: "admin" });

const faultsStore = useFaultsStore();

// --- Modal State ---
const isModalOpen = ref(false);
const editingFault = ref({ id: "", status: "", response: "" });

onMounted(() => {
  faultsStore.fetchFaults();
});

const handleDelete = async (id) => {
  if (!id) return;
  if (confirm("Are you sure you want to permanently delete this fault report?")) {
    try {
      await faultsStore.deleteFault(id);
    } catch (err) {
      alert("Failed to delete the fault.");
    }
  }
};

// --- Update Logic ---
const openEditModal = (fault) => {
  editingFault.value = {
    id: fault.id || fault._id,
    status: fault.status,
    response: fault.response || "",
  };
  isModalOpen.value = true;
};

const closeEditModal = () => {
  isModalOpen.value = false;
};

const handleUpdate = async () => {
  try {
    const payload = {
      status: editingFault.value.status,
      response: editingFault.value.response,
    };

    await faultsStore.updateFault(editingFault.value.id, payload);
    closeEditModal(); 
  } catch (err) {
    alert("Failed to update fault. Please try again.");
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

  .spin-icon :deep(span.p-button-icon) {
    animation: spin 1s linear infinite;
  }
}

/* Grid & Cards */
.faults-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
}

.fault-card {
  background: linear-gradient(
    145deg,
    color-mix(in srgb, var(--secondary-color) 10%, transparent) 0%,
    color-mix(in srgb, var(--alternate-color) 10%, transparent) 100%
  );
  border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  backdrop-filter: blur(10px);
  overflow: hidden;

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    gap: 10px;

    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
      line-height: 1.4;
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 5px;

      .action-btn {
        width: 32px;
        height: 32px;
        padding: 0;
        
        &.edit-btn {
          color: $accent-color;
          &:hover { background: rgba($accent-color, 0.1) !important; }
        }
        &.delete-btn {
          color: #ff4757;
          &:hover { background: rgba(255, 71, 87, 0.1) !important; }
        }
      }
    }
  }

  .card-body {
    .description {
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0 0 15px 0;
      opacity: 0.8;
    }

    .meta-info {
      display: flex;
      gap: 15px;
      font-size: 0.85rem;
      opacity: 0.6;
    }
  }

  .card-footer {
    margin-top: auto;
    padding-top: 15px;
    border-top: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
    font-size: 0.85rem;

    strong {
      display: block;
      margin-bottom: 5px;
    }
    p {
      margin: 0;
      opacity: 0.6;
      font-style: italic;
    }
  }
}

/* Skeleton Overrides */
.skeleton-card {
  gap: 15px;
  .mb-3 { margin-bottom: 15px; }
  .mb-2 { margin-bottom: 10px; }
}
:deep(.p-skeleton) {
  background-color: color-mix(in srgb, var(--secondary-color) 20%, transparent);
  &::after {
    background: linear-gradient(90deg, transparent, color-mix(in srgb, var(--text-color) 5%, transparent), transparent);
  }
}

/* Tag Overrides for Status */
:deep(.custom-status-tag) {
  text-transform: capitalize;
  font-weight: 600;
  padding: 4px 10px;
  font-size: 0.75rem;
  
  &.in-progress { 
    background: rgba(255, 193, 7, 0.2); 
    color: #ffc107; 
    border: 1px solid rgba(255, 193, 7, 0.3); 
  }
  &.resolved { 
    background: rgba(40, 167, 69, 0.2); 
    color: #28a745; 
    border: 1px solid rgba(40, 167, 69, 0.3); 
  }
  &.pending { 
    background: rgba(23, 162, 184, 0.2); 
    color: #17a2b8; 
    border: 1px solid rgba(23, 162, 184, 0.3); 
  }
}

.empty-state, .error-alert {
  text-align: center;
  padding: 50px;
  border-radius: 12px;
  margin-top: 20px;
  i { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; }
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
  .glass-action-btn {
    width: 100%;
    justify-content: center;
  }
}
</style>