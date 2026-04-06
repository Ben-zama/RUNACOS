<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Events Management</h2>
        <p>Schedule and oversee faculty events</p>
      </div>
      <div class="header-actions">
        <button class="glass-btn primary" @click="openModal()">
          <i class="bi bi-plus-lg"></i> Create Event
        </button>
        <button
          class="glass-btn refresh-btn"
          @click="eventsStore.fetchEvents"
          :disabled="eventsStore.isLoading"
        >
          <i
            class="bi bi-arrow-clockwise"
            :class="{ spin: eventsStore.isLoading }"
          ></i>
        </button>
      </div>
    </div>

    <div v-if="eventsStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ eventsStore.error }}
    </div>

    <div
      v-else-if="eventsStore.isLoading && eventsStore.events.length === 0"
      class="loading-state"
    >
      <div class="spinner"></div>
      <p>Loading events...</p>
    </div>

    <div v-else-if="eventsStore.events.length === 0" class="empty-state">
      <i class="bi bi-calendar-x"></i>
      <p>No events found. Create one to get started!</p>
    </div>

    <div v-else class="events-grid">
      <div
        v-for="event in eventsStore.events"
        :key="event.id || event._id"
        class="event-card"
      >
        <div v-if="event.fileUrl" class="card-banner">
          <img :src="event.fileUrl" alt="Event Banner" />
        </div>

        <div class="card-header">
          <div class="title-group">
            <h3>{{ event.title }}</h3>
            <span class="type-badge">{{ event.eventType }}</span>
          </div>
          <div class="card-actions">
            <button
              class="icon-btn edit-btn"
              @click="openModal(event)"
              title="Edit Event"
            >
              <i class="bi bi-pencil-square"></i>
            </button>
            <button
              class="icon-btn delete-btn"
              @click="handleDelete(event.id || event._id)"
              title="Delete Event"
            >
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>

        <div class="card-body">
          <div class="time-block">
            <i class="bi bi-clock-history"></i>
            <span>{{
              new Date(event.eventTime).toLocaleString(undefined, {
                dateStyle: "medium",
                timeStyle: "short",
              })
            }}</span>
          </div>
          <p class="description">{{ event.description }}</p>
          <div class="meta-info">
            <span class="status-badge" :class="event.status">{{
              event.status
            }}</span>
            <span class="student-id"
              ><i class="bi bi-person-badge"></i> {{ event.studentId }}</span
            >
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ isEditing ? "Edit Event" : "Create New Event" }}</h3>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Event Title *</label>
            <input
              v-model="form.title"
              type="text"
              class="glass-input"
              required
              placeholder="e.g., Tech Symposium 2026"
            />
          </div>

          <div class="form-group">
            <label>Event Banner Image <span v-if="!isEditing">*</span></label>
            <input
              type="file"
              @change="handleFileUpload"
              accept="image/*"
              class="glass-input"
              :required="!isEditing"
            />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Event Type *</label>
              <input
                v-model="form.type"
                type="text"
                class="glass-input"
                required
                placeholder="e.g., Seminar, Social"
              />
            </div>
            <div class="form-group half">
              <label>Event Date & Time *</label>
              <input
                v-model="form.eventTime"
                type="datetime-local"
                class="glass-input"
                required
              />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Status *</label>
              <select v-model="form.status" class="glass-input" required>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div class="form-group half">
              <label>Assigned Student ID *</label>
              <input
                v-model="form.studentId"
                type="text"
                class="glass-input"
                required
                placeholder="e.g., RUN/CSC/..."
              />
            </div>
          </div>

          <div class="form-group">
            <label>Description *</label>
            <textarea
              v-model="form.description"
              class="glass-input"
              rows="3"
              required
            ></textarea>
          </div>

          <div class="form-group">
            <label>Admin Response / Notes *</label>
            <textarea
              v-model="form.response"
              class="glass-input"
              rows="2"
              placeholder="Mandatory notes..."
              required
            ></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">
              Cancel
            </button>
            <button
              type="submit"
              class="btn-save"
              :disabled="eventsStore.isLoading"
            >
              {{ eventsStore.isLoading ? "Saving..." : "Save Event" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { useEventsStore } from "~/stores/useEventsStore";

definePageMeta({ layout: "admin", middleware: "admin" });

const eventsStore = useEventsStore();

onMounted(() => {
  eventsStore.fetchEvents();
});

// --- Modal & Form Logic ---
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  title: "",
  type: "",
  eventTime: "",
  status: "upcoming",
  studentId: "",
  description: "",
  response: "",
  imageFile: null,
});

const resetForm = () => {
  Object.assign(form, {
    title: "",
    type: "",
    eventTime: "",
    status: "upcoming",
    studentId: "",
    description: "",
    response: "",
    imageFile: null,
  });
  isEditing.value = false;
  editingId.value = null;

  // Clear file input manually if it exists
  if (typeof document !== "undefined") {
    const fileInput = document.querySelector('input[type="file"]');
    if (fileInput) fileInput.value = "";
  }
};

const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    form.imageFile = file;
  }
};

const openModal = (event = null) => {
  if (event) {
    isEditing.value = true;
    editingId.value = event.id || event._id;

    let localEventTime = "";
    if (event.eventTime) {
      // Convert to HTML datetime-local format (YYYY-MM-DDThh:mm)
      const d = new Date(event.eventTime);
      localEventTime = d.toISOString().slice(0, 16);
    }

    Object.assign(form, {
      title: event.title || "",
      type: event.eventType || "",
      eventTime: localEventTime,
      status: event.status || "upcoming",
      studentId: event.studentId || "",
      description: event.description || "",
      description: event.description || "",
      response: event.response || "",
      imageFile: null,
    });
  } else {
    resetForm();
  }
  isModalOpen.value = true;
};

const closeModal = () => {
  isModalOpen.value = false;
  resetForm();
};

const handleSubmit = async () => {
  if (!form.imageFile && !isEditing.value) {
    alert("Please select an Event Banner Image before saving!");
    return;
  }

  try {
    const combinedDateTime = new Date(form.eventTime).toISOString();

    if (isEditing.value) {
      // Send standard JSON for PATCH requests
      const jsonPayload = {
        title: form.title,
        description: form.description,
        eventTime: combinedDateTime,
        eventType: form.type,
        studentId: form.studentId,
        status: form.status,
        response: form.response,
      };

      await eventsStore.updateEvent(editingId.value, jsonPayload);
    } else {
      // Send FormData for POST requests (to support the image upload)
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("description", form.description);
      formData.append("eventTime", combinedDateTime);
      formData.append("eventType", form.type);
      formData.append("studentId", form.studentId);
      formData.append("status", form.status);
      formData.append("response", form.response);

      if (form.imageFile) {
        formData.append("file", form.imageFile);
      }

      await eventsStore.createEvent(formData);
    }

    closeModal();
  } catch (err) {
    console.error(err);
    alert(
      `Failed to ${
        isEditing.value ? "update" : "create"
      } event. Check console for details.`
    );
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this event?")) return;
  try {
    await eventsStore.deleteEvent(id);
  } catch {
    alert("Failed to delete event.");
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
    .spin {
      animation: spin 1s linear infinite;
    }
  }
}

.events-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

.event-card {
  background: linear-gradient(
      145deg,
      color-mix(in srgb, var(--secondary-color) 10%, transparent) 0%,
      color-mix(in srgb, var(--alternate-color) 10%, transparent) 100%
    );
    border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  backdrop-filter: blur(10px);
  overflow: hidden;

  .card-banner {
    width: 100%;
    height: 250px;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  .card-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    padding: 20px 20px 0;
    .title-group h3 {
      margin: 0 0 5px 0;
      font-size: 1.2rem;
    }
    .type-badge {
      font-size: 0.75rem;
      background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
      padding: 3px 8px;
      border-radius: 12px;
    }
    .card-actions {
      display: flex;
      gap: 5px;
      .icon-btn {
        background: transparent;
        border: none;
        cursor: pointer;
        padding: 5px;
        border-radius: 8px;
        transition: 0.2s;
        &.edit-btn {
          color: $accent-color;
          &:hover {
            background: rgba($accent-color, 0.1);
          }
        }
        &.delete-btn {
          color: #ff4757;
          &:hover {
            background: rgba(255, 71, 87, 0.1);
          }
        }
      }
    }
  }

  .card-body {
    padding: 15px 20px 20px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    .time-block {
      display: flex;
      align-items: center;
      gap: 8px;
      color: $accent-color;
      font-weight: 500;
      font-size: 0.9rem;
      margin-bottom: 10px;
    }
    .description {
      opacity: 0.8;
      font-size: 0.9rem;
      line-height: 1.5;
      margin: 0 0 15px 0;
      flex-grow: 1;
      display: -webkit-box;
    -webkit-line-clamp: 5;
    -webkit-box-orient: vertical;
    overflow: hidden;
    }
    .meta-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 15px;
      .student-id {
        color: #8a8a93;
      }
      .status-badge {
        padding: 4px 10px;
        border-radius: 20px;
        text-transform: capitalize;
        &.upcoming {
          background: rgba(52, 152, 219, 0.2);
          color: #3498db;
        }
        &.ongoing {
          background: rgba(255, 193, 7, 0.2);
          color: #ffc107;
        }
        &.completed {
          background: rgba(40, 167, 69, 0.2);
          color: #28a745;
        }
        &.cancelled {
          background: rgba(255, 71, 87, 0.2);
          color: #ff4757;
        }
      }
    }
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
  .glass-modal .form-row {
    flex-direction: column;
    gap: 0;
  }
}
</style>