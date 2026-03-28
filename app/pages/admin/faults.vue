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
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted } from "vue";
import { useFaultsStore } from "~/stores/useFaultsStore";

definePageMeta({ layout: "admin" });

const faultsStore = useFaultsStore();

onMounted(() => {
  faultsStore.fetchFaults();
});

// NEW FUNCTION
const handleDelete = async (id) => {
  if (!id) {
    alert("Error: Cannot find the ID for this fault.");
    return;
  }

  // Ask for confirmation before deleting
  const isConfirmed = confirm(
    "Are you sure you want to permanently delete this fault report?"
  );

  if (isConfirmed) {
    try {
      await faultsStore.deleteFault(id);
    } catch (err) {
      alert("Failed to delete the fault. Please try again.");
    }
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
        width: 25px;
      display: flex;
      align-items: center;
      gap: 10px;
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
</style>