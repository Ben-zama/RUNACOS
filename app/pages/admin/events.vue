<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Events Management</h2>
        <p>Schedule and oversee faculty events</p>
      </div>
      <div class="header-actions">
        <Button 
          label="Create Event" 
          icon="bi bi-plus-lg" 
          class="glass-action-btn primary-hover" 
          @click="openModal()" 
        />
        <Button
          icon="bi bi-arrow-clockwise"
          class="p-button-rounded glass-action-btn"
          @click="eventsStore.fetchEvents"
          :disabled="eventsStore.isLoading"
          :class="{ 'spin-icon': eventsStore.isLoading }"
          aria-label="Refresh"
        />
      </div>
    </div>

    <div v-if="eventsStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ eventsStore.error }}
    </div>

    <div v-else-if="eventsStore.isLoading && eventsStore.events.length === 0" class="events-grid">
      <div v-for="i in 3" :key="i" class="event-card skeleton-card">
        <Skeleton width="100%" height="200px" />
        <div class="p-4 flex flex-column gap-3">
          <Skeleton width="70%" height="2rem" />
          <Skeleton width="40%" height="1rem" />
          <Skeleton width="100%" height="4rem" />
          <div class="flex justify-content-between mt-3">
            <Skeleton width="30%" height="1.5rem" />
            <Skeleton width="30%" height="1.5rem" />
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="eventsStore.events.length === 0" class="empty-state">
      <i class="bi bi-calendar-x"></i>
      <p>No events found. Create one to get started!</p>
    </div>

    <div v-else>
      <div class="events-grid">
        <div
          v-for="event in paginatedEvents"
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
              <Button
                icon="bi bi-pencil-square"
                class="p-button-rounded p-button-text action-btn edit-btn"
                @click="openModal(event)"
                title="Edit Event"
              />
              <Button
                icon="bi bi-trash"
                class="p-button-rounded p-button-text action-btn delete-btn"
                @click="handleDelete(event.id || event._id)"
                title="Delete Event"
              />
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
              <Tag 
                :value="event.status" 
                class="custom-status-tag" 
                :class="event.status" 
                rounded 
              />
              <span class="student-id">
                <i class="bi bi-person-badge"></i> {{ event.studentId }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div class="pagination-wrapper glass-card mt-4">
        <Paginator
          v-model:first="first"
          :rows="rows"
          :totalRecords="eventsStore.events.length"
          :rowsPerPageOptions="[3, 6, 12]"
          template="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport"
          currentPageReportTemplate="Showing {first} to {last} of {totalRecords} events"
        ></Paginator>
      </div>
    </div>

    <Dialog
      v-model:visible="isModalOpen"
      :header="isEditing ? 'Edit Event' : 'Create New Event'"
      :modal="true"
      :style="{ width: '100%', maxWidth: '650px' }"
      class="glass-dialog"
      :closable="false"
    >
      <form @submit.prevent="handleSubmit">
        <div class="form-group mt-3">
          <label>Event Title *</label>
          <InputText
            v-model="form.title"
            class="glass-input w-full"
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
            class="glass-input file-input w-full"
            :required="!isEditing"
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>Event Type *</label>
            <InputText
              v-model="form.type"
              class="glass-input w-full"
              required
              placeholder="e.g., Seminar, Social"
            />
          </div>
          <div class="form-group half">
            <label>Event Date & Time *</label>
            <input
              v-model="form.eventTime"
              type="datetime-local"
              class="glass-input w-full"
              required
            />
          </div>
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>Status *</label>
            <select v-model="form.status" class="glass-input w-full" required>
              <option value="upcoming">Upcoming</option>
              <option value="ongoing">Ongoing</option>
              <option value="completed">Completed</option>
              <option value="cancelled">Cancelled</option>
            </select>
          </div>
          <div class="form-group half">
            <label>Assigned Student ID *</label>
            <InputText
              v-model="form.studentId"
              class="glass-input w-full"
              required
              placeholder="e.g., RUN/CSC/..."
            />
          </div>
        </div>

        <div class="form-group">
          <label>Description *</label>
          <Textarea
            v-model="form.description"
            class="glass-input w-full"
            rows="3"
            required
            autoResize
          />
        </div>

        <div class="form-group">
          <label>Admin Response / Notes *</label>
          <Textarea
            v-model="form.response"
            class="glass-input w-full"
            rows="2"
            placeholder="Mandatory notes..."
            required
            autoResize
          />
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
            :label="eventsStore.isLoading ? 'Saving...' : 'Save Event'"
            icon="bi bi-check"
            class="btn-save"
            :loading="eventsStore.isLoading"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { useEventsStore } from "~/stores/useEventsStore";

definePageMeta({ layout: "admin", middleware: "admin" });

const eventsStore = useEventsStore();

// Pagination State
const first = ref(0);
const rows = ref(12);

onMounted(() => {
  eventsStore.fetchEvents();
});

// Computed property to slice the events array for the current page
const paginatedEvents = computed(() => {
  if (!eventsStore.events) return [];
  return eventsStore.events.slice(first.value, first.value + rows.value);
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
      
      // Reset to first page when new event is added
      first.value = 0; 
    }

    closeModal();
  } catch (err) {
    console.error(err);
    alert(`Failed to ${isEditing.value ? "update" : "create"} event. Check console for details.`);
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this event?")) return;
  try {
    await eventsStore.deleteEvent(id);
    
    // Safety check: if deleting the last item on a page, go back one page
    if (paginatedEvents.value.length === 1 && first.value > 0) {
      first.value -= rows.value;
    }
  } catch {
    alert("Failed to delete event.");
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
    height: 200px;
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
      line-height: 1.3;
    }
    .type-badge {
      font-size: 0.75rem;
      background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
      padding: 3px 8px;
      border-radius: 12px;
      display: inline-block;
      margin-top: 5px;
    }
    .card-actions {
      display: flex;
      gap: 2px;
      
      .action-btn {
        width: 35px;
        height: 35px;
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
      -webkit-line-clamp: 4;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }
    .meta-info {
      display: flex;
      justify-content: space-between;
      align-items: center;
      font-size: 0.85rem;
      border-top: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
      padding-top: 15px;
      
      .student-id { color: #8a8a93; }
    }
  }
}

/* Pagination Overrides */
.pagination-wrapper {
  padding: 10px;
  border-radius: 12px;
  background: color-mix(in srgb, var(--secondary-color) 10%, transparent);
  border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
}
.mt-4 { margin-top: 1.5rem; }

/* Skeleton Overrides */
.skeleton-card {
  padding: 0;
  .p-4 { padding: 20px; }
  .mb-3 { margin-bottom: 15px; }
  .mb-2 { margin-bottom: 10px; }
  .mt-3 { margin-top: 15px; }
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
  
  &.upcoming { background: rgba(52, 152, 219, 0.2); color: #3498db; }
  &.ongoing { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
  &.completed { background: rgba(40, 167, 69, 0.2); color: #28a745; }
  &.cancelled { background: rgba(255, 71, 87, 0.2); color: #ff4757; }
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
  .header-actions {
    width: 100%;
    justify-content: flex-start;
  }
  .form-row {
    flex-direction: column;
    gap: 0;
  }
  
  :deep(.p-paginator) {
    flex-wrap: wrap;
    justify-content: center;
  }
}
@media (max-width: 480px) {
  .page-header .titles h2 { font-size: 1.5rem; }
}
</style>