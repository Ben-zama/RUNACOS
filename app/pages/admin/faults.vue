<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Faults</h2>
        <p>View reported faults</p>
      </div>
      <button
        class="refresh-btn"
        @click="faultsStore.fetchFaults"
        :disabled="faultsStore.isLoading"
      >
        <i
          class="bi bi-arrow-clockwise"
          :class="{ spin: faultsStore.isLoading }"
        ></i>
        Refresh
      </button>
    </div>

    <div v-if="faultsStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ faultsStore.error }}
    </div>

    <div
      v-else-if="faultsStore.isLoading && faultsStore.faults.length === 0"
      class="loading-state"
    >
      <div class="spinner"></div>
      <p>Loading faults...</p>
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
            <span class="status-badge" :class="fault.status.toLowerCase()">
              {{ fault.status }}
            </span>
            <button
              class="icon-btn edit-btn"
              @click="openEditModal(fault)"
              title="Update Status"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
            <button
              class="icon-btn delete-btn"
              @click="handleDelete(fault.id || fault._id)"
              title="Delete Fault"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <div class="card-body">
          <p class="description">{{ fault.description }}</p>
          <div class="meta-info">
            <span class="student-id"
              ><i class="bi bi-person-badge"></i> {{ fault.studentId }}</span
            >
          </div>
        </div>

        <div class="card-footer">
          <strong>Admin Response:</strong>
          <p>{{ fault.response || 'No response yet.' }}</p>
        </div>
      </div>
    </div>
  </div>

  <div v-if="isModalOpen" class="modal-overlay" @click.self="closeEditModal">
    <div class="glass-modal">
      <h3>Update Fault</h3>

      <form @submit.prevent="handleUpdate">
        <div class="form-group">
          <label for="status">Status</label>
          <select id="status" v-model="editingFault.status" class="glass-input">
            <option value="pending">Pending</option>
            <option value="in-progress">In Progress</option>
            <option value="resolved">Resolved</option>
          </select>
        </div>

        <div class="form-group">
          <label for="response">Admin Response</label>
          <textarea
            id="response"
            v-model="editingFault.response"
            class="glass-input"
            placeholder="Explain the fix or next steps..."
            rows="4"
          ></textarea>
        </div>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="closeEditModal">
            Cancel
          </button>
          <button
            type="submit"
            class="btn-save"
            :disabled="faultsStore.isLoading"
          >
            {{ faultsStore.isLoading ? "Saving..." : "Save Changes" }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useFaultsStore } from "~/stores/useFaultsStore";

definePageMeta({ layout: "admin" });

const faultsStore = useFaultsStore();

// --- Modal State ---
const isModalOpen = ref(false);
const editingFault = ref({ id: "", status: "", response: "" });

onMounted(() => {
  faultsStore.fetchFaults();
});

const handleDelete = async (id) => {
  if (!id) return;
  if (
    confirm("Are you sure you want to permanently delete this fault report?")
  ) {
    try {
      await faultsStore.deleteFault(id);
    } catch (err) {
      alert("Failed to delete the fault.");
    }
  }
};

// --- Update Logic ---
const openEditModal = (fault) => {
  // Copy the data so we don't accidentally edit the live card before saving
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
    closeEditModal(); // Close modal on success
  } catch (err) {
    alert("Failed to update fault. Please try again.");
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

  .refresh-btn {
    background: rgba(255, 255, 255, 0.1);
    border: 1px solid rgba(255, 255, 255, 0.2);
    color: #fff;
    padding: 8px 16px;
    border-radius: 8px;
    cursor: pointer;
    display: flex;
    align-items: center;
    gap: 8px;
    transition: background 0.3s;

    &:hover {
      background: rgba(255, 255, 255, 0.2);
    }
    &:disabled {
      opacity: 0.5;
      cursor: not-allowed;
    }

    .spin {
      animation: spin 1s linear infinite;
    }
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
    rgba(255, 255, 255, 0.05) 0%,
    rgba(255, 255, 255, 0.01) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
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
    }

    .header-actions {
      display: flex;
      align-items: center;
      gap: 10px;

      .status-badge {
        font-size: 0.75rem;
        padding: 4px 8px;
        border-radius: 20px;
        text-transform: capitalize;
        font-weight: 500;
        white-space: nowrap;

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

      .icon-btn.delete-btn {
        background: transparent;
        border: none;
        color: #ff4757;
        cursor: pointer;
        padding: 5px;
        border-radius: 6px;
        display: flex;
        align-items: center;
        justify-content: center;
        transition: all 0.2s ease;
        opacity: 0.7;

        &:hover {
          opacity: 1;
          background: rgba(255, 71, 87, 0.1);
          transform: scale(1.05);
        }
      }

      .icon-btn.edit-btn {
        background: transparent;
        border: none;
        color: $accent-color;
        cursor: pointer;
        padding: 5px;
        border-radius: 6px;
        transition: all 0.2s ease;
        opacity: 0.8;

        &:hover {
          opacity: 1;
          background: rgba(52, 152, 219, 0.1);
          transform: scale(1.05);
        }
      }
    }
  }

  .card-body {
    .description {
      color: #ccc;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0 0 15px 0;
    }

    .meta-info {
      display: flex;
      gap: 15px;
      font-size: 0.85rem;
      color: #8a8a93;
    }
  }

  .card-footer {
    margin-top: auto;
    padding-top: 15px;
    border-top: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.85rem;

    strong {
      color: #fff;
      display: block;
      margin-bottom: 5px;
    }
    p {
      margin: 0;
      color: #aaa;
      font-style: italic;
    }
  }
}

/* UI States */
.error-alert {
  background: rgba(255, 71, 87, 0.1);
  color: #ff4757;
  padding: 15px;
  border-radius: 8px;
  border: 1px solid rgba(255, 71, 87, 0.3);
}

.empty-state,
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 50px;
  color: #8a8a93;
  background: rgba(255, 255, 255, 0.02);
  border-radius: 12px;
  border: 1px dashed rgba(255, 255, 255, 0.1);

  i {
    font-size: 3rem;
    margin-bottom: 10px;
    opacity: 0.5;
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
}

.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background: rgba(0, 0, 0, 0.6);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.glass-modal {
  background: linear-gradient(
    145deg,
    rgba(30, 30, 30, 0.9) 0%,
    rgba(20, 20, 20, 0.95) 100%
  );
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  padding: 25px;
  width: 100%;
  max-width: 400px;
  box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5);

  h3 {
    margin-top: 0;
    margin-bottom: 20px;
    font-size: 1.3rem;
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-bottom: 15px;

    label {
      font-size: 0.85rem;
      color: #aaa;
    }

    .glass-input {
      width: 100%;
      background: rgba(0, 0, 0, 0.3);
      border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff;
      padding: 10px 12px;
      border-radius: 8px;
      outline: none;
      font-family: inherit;

      &:focus {
        border-color: $accent-color;
      }

      option {
        background: #1a1a1a;
        color: #fff;
      }
    }
  }

  .modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 10px;
    margin-top: 20px;

    button {
      padding: 10px 15px;
      border-radius: 8px;
      border: none;
      cursor: pointer;
      font-weight: 500;
      transition: all 0.2s;
    }

    .btn-cancel {
      background: transparent;
      color: #aaa;
      &:hover {
        color: #fff;
        background: rgba(255, 255, 255, 0.05);
      }
    }

    .btn-save {
      background: $accent-color;
      color: #fff;
      &:hover:not(:disabled) {
        background: #2980b9;
      }
      &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
      }
    }
  }
}
</style>