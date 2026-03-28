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
        <button class="glass-btn refresh-btn" @click="eventsStore.fetchEvents" :disabled="eventsStore.isLoading">
          <i class="bi bi-arrow-clockwise" :class="{ 'spin': eventsStore.isLoading }"></i>
        </button>
      </div>
    </div>

    <div v-if="eventsStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ eventsStore.error }}
    </div>
    <div v-else-if="eventsStore.isLoading && eventsStore.events.length === 0" class="loading-state">
      <div class="spinner"></div><p>Loading events...</p>
    </div>
    <div v-else-if="eventsStore.events.length === 0" class="empty-state">
      <i class="bi bi-calendar-x"></i><p>No events found. Create one to get started!</p>
    </div>

    <div v-else class="events-grid">
      <div v-for="event in eventsStore.events" :key="event.id || event._id" class="event-card">
        <div class="card-header">
          <div class="title-group">
            <h3>{{ event.title }}</h3>
            <span class="type-badge">{{ event.type }}</span>
          </div>
          <div class="card-actions">
            <button class="icon-btn edit-btn" @click="openModal(event)" title="Edit Event"><i class="bi bi-pencil-square"></i></button>
            <button class="icon-btn delete-btn" @click="handleDelete(event.id || event._id)" title="Delete Event"><i class="bi bi-trash"></i></button>
          </div>
        </div>
        
        <div class="card-body">
          <div class="time-block">
            <i class="bi bi-clock-history"></i>
            <span>{{ new Date(event.eventTime).toLocaleString() }}</span>
          </div>
          <p class="description">{{ event.description }}</p>
          <div class="meta-info">
             <span class="status-badge" :class="event.status">{{ event.status }}</span>
             <span class="student-id"><i class="bi bi-person-badge"></i> {{ event.studentId }}</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="glass-modal">
        <h3>{{ isEditing ? 'Edit Event' : 'Create New Event' }}</h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Event Title</label>
            <input v-model="form.title" type="text" class="glass-input" required placeholder="e.g., Tech Symposium 2026" />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Event Type</label>
              <input v-model="form.type" type="text" class="glass-input" required placeholder="e.g., Seminar, Social" />
            </div>
            <div class="form-group half">
              <label>Event Date & Time</label>
              <input v-model="form.eventTime" type="datetime-local" class="glass-input" required />
            </div>
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Status</label>
              <select v-model="form.status" class="glass-input" required>
                <option value="upcoming">Upcoming</option>
                <option value="ongoing">Ongoing</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>
            <div class="form-group half">
              <label>Assigned Student ID</label>
              <input v-model="form.studentId" type="text" class="glass-input" required placeholder="e.g., RUN/CSC/..." />
            </div>
          </div>

          <div class="form-group">
            <label>Description</label>
            <textarea v-model="form.description" class="glass-input" rows="3" required></textarea>
          </div>
          
          <div class="form-group">
            <label>Admin Response / Notes</label>
            <textarea v-model="form.response" class="glass-input" rows="2" placeholder="Optional notes..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-save" :disabled="eventsStore.isLoading">
              {{ eventsStore.isLoading ? 'Saving...' : 'Save Event' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { useEventsStore } from '../../stores/useEventsStore';

definePageMeta({ layout: 'admin' });

const eventsStore = useEventsStore();

onMounted(() => {
  eventsStore.fetchEvents();
});

// --- Modal & Form Logic ---
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

// Helper to format API ISO strings for the <input type="datetime-local">
const formatForInput = (isoString) => {
  if (!isoString) return '';
  const date = new Date(isoString);
  // Returns YYYY-MM-DDThh:mm
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 16);
};

const form = reactive({
  title: '',
  type: '',
  studentId: '',
  status: 'upcoming',
  response: '',
  eventTime: '',
  description: ''
});

const resetForm = () => {
  Object.assign(form, {
    title: '', type: '', studentId: '', status: 'upcoming', response: '', eventTime: '', description: ''
  });
  isEditing.value = false;
  editingId.value = null;
};

const openModal = (event = null) => {
  if (event) {
    isEditing.value = true;
    editingId.value = event.id || event._id;
    Object.assign(form, {
      ...event,
      eventTime: formatForInput(event.eventTime) 
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
  try {
    // Convert local datetime back to ISO string for the API
    const payload = {
      ...form,
      eventTime: new Date(form.eventTime).toISOString()
    };

    if (isEditing.value) {
      await eventsStore.updateEvent(editingId.value, payload);
    } else {
      await eventsStore.createEvent(payload);
    }
    closeModal();
  } catch (err) {
    alert(`Failed to ${isEditing.value ? 'update' : 'create'} event. Check console for details.`);
  }
};

const handleDelete = async (id) => {
  if (!id) return;
  if (confirm("Are you sure you want to delete this event?")) {
    try {
      await eventsStore.deleteEvent(id);
    } catch (err) {
      alert("Failed to delete the event.");
    }
  }
};
</script>

<style lang="scss" scoped>
/* Reusing your excellent glassmorphic aesthetic */
.page-container { display: flex; flex-direction: column; gap: 30px; color: #fff; }

.page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  .titles h2 { font-size: 2rem; margin: 0 0 5px 0; }
  .titles p { color: #8a8a93; margin: 0; }
  
  .header-actions {
    display: flex; gap: 10px;
    .glass-btn {
      background: rgba(255, 255, 255, 0.1); border: 1px solid rgba(255, 255, 255, 0.2);
      color: #fff; padding: 10px 20px; border-radius: 8px; cursor: pointer;
      display: flex; align-items: center; gap: 8px; transition: 0.3s;
      &:hover { background: rgba(255, 255, 255, 0.2); }
      &.primary { background: rgba(52, 152, 219, 0.2); border-color: rgba(52, 152, 219, 0.4); color: #3498db; }
      &.primary:hover { background: rgba(52, 152, 219, 0.3); }
    }
    .spin { animation: spin 1s linear infinite; }
  }
}

.events-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 20px;
}

.event-card {
  background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 20px;
  display: flex; flex-direction: column; gap: 15px; backdrop-filter: blur(10px);

  .card-header {
    display: flex; justify-content: space-between; align-items: flex-start;
    .title-group h3 { margin: 0 0 5px 0; font-size: 1.2rem; }
    .type-badge { font-size: 0.75rem; background: rgba(255,255,255,0.1); padding: 3px 8px; border-radius: 12px; }
    
    .card-actions {
      display: flex; gap: 5px;
      .icon-btn { 
        background: transparent; border: none; cursor: pointer; padding: 5px; border-radius: 6px; transition: 0.2s; 
        &.edit-btn { color: #3498db; &:hover { background: rgba(52, 152, 219, 0.1); } }
        &.delete-btn { color: #ff4757; &:hover { background: rgba(255, 71, 87, 0.1); } }
      }
    }
  }

  .card-body {
    .time-block { display: flex; align-items: center; gap: 8px; color: #3498db; font-weight: 500; font-size: 0.9rem; margin-bottom: 10px;}
    .description { color: #ccc; font-size: 0.9rem; line-height: 1.5; margin: 0 0 15px 0; }
    .meta-info { 
      display: flex; justify-content: space-between; align-items: center; font-size: 0.85rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 15px;
      .student-id { color: #8a8a93; }
      .status-badge { 
        padding: 4px 10px; border-radius: 20px; text-transform: capitalize;
        &.upcoming { background: rgba(52, 152, 219, 0.2); color: #3498db; }
        &.ongoing { background: rgba(255, 193, 7, 0.2); color: #ffc107; }
        &.completed { background: rgba(40, 167, 69, 0.2); color: #28a745; }
        &.cancelled { background: rgba(255, 71, 87, 0.2); color: #ff4757; }
      }
    }
  }
}

/* Modal Styles */
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100vw; height: 100vh;
  background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px);
  display: flex; justify-content: center; align-items: center; z-index: 1000;
}

.glass-modal {
  background: linear-gradient(145deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 30px;
  width: 100%; max-width: 600px; box-shadow: 0 15px 30px rgba(0,0,0,0.5);
  max-height: 90vh; overflow-y: auto;

  h3 { margin-top: 0; margin-bottom: 25px; font-size: 1.5rem; }

  .form-row { display: flex; gap: 15px; }
  .form-group {
    display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; width: 100%;
    &.half { flex: 1; }
    label { font-size: 0.85rem; color: #aaa; }
    .glass-input {
      width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1);
      color: #fff; padding: 12px; border-radius: 8px; outline: none; font-family: inherit;
      &:focus { border-color: #3498db; }
      option { background: #1a1a1a; color: #fff; }
    }
  }

  .modal-actions {
    display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 20px;
    button { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; transition: 0.2s; }
    .btn-cancel { background: transparent; color: #aaa; &:hover { color: #fff; background: rgba(255,255,255,0.05); } }
    .btn-save { background: #3498db; color: #fff; &:hover:not(:disabled) { background: #2980b9; } &:disabled { opacity: 0.6; cursor: not-allowed; } }
  }
}

.empty-state, .loading-state { text-align: center; padding: 50px; color: #8a8a93; border: 1px dashed rgba(255,255,255,0.1); border-radius: 12px; i { font-size: 3rem; margin-bottom: 10px; opacity: 0.5;} }
@keyframes spin { 100% { transform: rotate(360deg); } }
</style>