<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Content Hub</h2>
        <p>Manage your faculty blog posts, news, and announcements.</p>
      </div>
      <div class="header-actions">
        <button class="glass-btn primary-hover" @click="openModal()">
          <i class="bi bi-pencil-square"></i> Draft New Post
        </button>
        <button class="glass-btn refresh-btn" @click="postsStore.fetchPosts" :disabled="postsStore.isLoading">
          <i class="bi bi-arrow-clockwise" :class="{ 'spin': postsStore.isLoading }"></i>
        </button>
      </div>
    </div>

    <div v-if="postsStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ postsStore.error }}
    </div>
    <div v-else-if="postsStore.isLoading && postsStore.posts.length === 0" class="loading-state">
      <div class="spinner"></div><p>Loading posts...</p>
    </div>
    <div v-else-if="postsStore.posts.length === 0" class="empty-state">
      <i class="bi bi-journal-x"></i><p>No posts found. Start drafting!</p>
    </div>

    <div v-else class="glass-card table-card">
      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Headline</th>
              <th>Category</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in postsStore.posts" :key="post.id || post._id">
              <td class="title-cell highlight">{{ post.title }}</td>
              <td>{{ post.category }}</td>
              <td>
                <span class="status-badge" :class="(post.status || 'draft').toLowerCase()">
                  {{ post.status || 'Draft' }}
                </span>
              </td>
              <td>{{ formatDate(post.date) }}</td>
              <td class="actions-cell">
                <button class="action-btn" @click="openModal(post)"><i class="bi bi-pencil"></i></button>
                <button class="action-btn danger" @click="handleDelete(post.id || post._id)"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="glass-modal">
        <h3>{{ isEditing ? 'Edit Post' : 'Draft New Post' }}</h3>
        
        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Headline / Title</label>
            <input v-model="form.title" type="text" class="glass-input" required placeholder="e.g., New JavaScript Framework..." />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Category</label>
              <input v-model="form.category" type="text" class="glass-input" required placeholder="e.g., Technology, Design" />
            </div>
            <div class="form-group half">
              <label>Status</label>
              <select v-model="form.status" class="glass-input" required>
                <option value="Draft">Draft</option>
                <option value="Scheduled">Scheduled</option>
                <option value="Published">Published</option>
              </select>
            </div>
          </div>

          <div class="form-group">
            <label>Content</label>
            <textarea v-model="form.content" class="glass-input" rows="6" required placeholder="Write your post content here..."></textarea>
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">Cancel</button>
            <button type="submit" class="btn-save" :disabled="postsStore.isLoading">
              {{ postsStore.isLoading ? 'Saving...' : 'Save Post' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from 'vue';
import { usePostsStore } from '~/stores/usePostsStore';

definePageMeta({ layout: 'admin' });

const postsStore = usePostsStore();

onMounted(() => {
  postsStore.fetchPosts();
});

// Helper to safely format dates
const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

// --- Modal & Form Logic ---
const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  title: '',
  category: '',
  status: 'Draft',
  content: ''
});

const resetForm = () => {
  Object.assign(form, { title: '', category: '', status: 'Draft', content: '' });
  isEditing.value = false;
  editingId.value = null;
};

const openModal = (post = null) => {
  if (post) {
    isEditing.value = true;
    editingId.value = post.id || post._id;
    Object.assign(form, {
      title: post.title,
      category: post.category,
      status: post.status || 'Draft',
      content: post.content || ''
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
    const payload = {
      title: form.title,
      category: form.category,
      status: form.status,
      content: form.content,
      date: new Date().toISOString() // Auto-attach current date on save
    };

    if (isEditing.value) {
      await postsStore.updatePost(editingId.value, payload);
    } else {
      await postsStore.createPost(payload);
    }
    closeModal();
  } catch (err) {
    alert(`Failed to ${isEditing.value ? 'update' : 'create'} post. Check console for details.`);
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this post?")) return;
  try {
    await postsStore.deletePost(id);
  } catch {
    alert("Failed to delete post.");
  }
};
</script>

<style lang="scss" scoped>
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
      &.primary-hover:hover { background: rgba(52, 152, 219, 0.3); border-color: rgba(52, 152, 219, 0.4); color: #3498db; }
    }
    .spin { animation: spin 1s linear infinite; }
  }
}

/* Table Styles */
.table-card { padding: 20px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.1); background: linear-gradient(145deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%); backdrop-filter: blur(10px); }
.table-responsive { overflow-x: auto; }
table { width: 100%; border-collapse: collapse; text-align: left; }
th { padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.1); color: #8a8a93; font-weight: 500; font-size: 0.9rem; }
td { padding: 15px; border-bottom: 1px solid rgba(255, 255, 255, 0.05); font-size: 0.95rem; vertical-align: middle; }
.title-cell { max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; font-weight: 500; }

.status-badge {
  padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600; text-transform: capitalize;
  &.published { background: rgba(46, 213, 115, 0.1); color: #2ed573; border: 1px solid rgba(46, 213, 115, 0.2); }
  &.draft { background: rgba(255, 255, 255, 0.05); color: #ccc; border: 1px solid rgba(255, 255, 255, 0.1); }
  &.scheduled { background: rgba(255, 165, 2, 0.1); color: #ffa502; border: 1px solid rgba(255, 165, 2, 0.2); }
}

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
.form-row { display: flex; gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; width: 100%; &.half { flex: 1; } }
.form-group label { font-size: 0.85rem; color: #aaa; }
.glass-input { width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 12px; border-radius: 8px; outline: none; font-family: inherit; &:focus { border-color: #3498db; } option { background: #1a1a1a; color: #fff; } }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; }
.modal-actions button { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; transition: 0.2s; }
.btn-cancel { background: transparent; color: #aaa; &:hover { color: #fff; background: rgba(255, 255, 255, 0.05); } }
.btn-save { background: #3498db; color: #fff; &:hover:not(:disabled) { background: #2980b9; } &:disabled { opacity: 0.6; cursor: not-allowed; } }

.empty-state, .loading-state { text-align: center; padding: 50px; color: #8a8a93; border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 12px; i { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; } }
@keyframes spin { 100% { transform: rotate(360deg); } }
@media (max-width: 600px) { .page-header { flex-direction: column; align-items: flex-start; gap: 15px; } .form-row { flex-direction: column; } }
</style>