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
              <th class="desktop-only">Author</th>
              <th class="desktop-only">Date Posted</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="post in postsStore.posts" :key="post.id || post._id">
              <td data-label="Headline" class="title-cell highlight">
                <div class="cell-content">
                  <span class="headline-text">{{ post.title }}</span>
                  <div class="mobile-only text-xs text-gray-400 mt-1">
                    {{ formatDate(post.createdAt) }} • By {{ post.authorName }}
                  </div>
                </div>
              </td>
              <td data-label="Author" class="desktop-only">{{ post.authorName }}</td>
              <td data-label="Date Posted" class="desktop-only">{{ formatDate(post.createdAt) }}</td>
              <td data-label="Actions" class="actions-cell">
                <div class="action-buttons">
                  <a v-if="post.fileUrl" :href="post.fileUrl" target="_blank" class="action-btn" title="View Media">
                    <i class="bi bi-image"></i>
                  </a>
                  <button class="action-btn" @click="openModal(post)" title="Edit Post">
                    <i class="bi bi-pencil"></i>
                  </button>
                  <button class="action-btn danger" @click="handleDelete(post.id || post._id)" title="Delete Post">
                    <i class="bi bi-trash"></i>
                  </button>
                </div>
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
            <label>Headline / Title *</label>
            <input v-model="form.title" type="text" class="glass-input" required placeholder="e.g., Upcoming Tech Symposium" />
          </div>

          <div class="form-group">
            <label>Post Banner Image <span v-if="!isEditing">*</span></label>
            <input type="file" @change="handleFileUpload" accept="image/*" class="glass-input" :required="!isEditing" />
          </div>

          <div class="form-row">
            <div class="form-group half">
              <label>Author Name *</label>
              <input v-model="form.authorName" type="text" class="glass-input" required placeholder="e.g., John Doe" />
            </div>
            <div class="form-group half">
              <label>Author ID *</label>
              <input v-model="form.authorId" type="text" class="glass-input" required placeholder="e.g., admin-01" />
            </div>
          </div>

          <div class="form-group">
            <label>Content *</label>
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

definePageMeta({ layout: 'admin', middleware: 'admin' });

const postsStore = usePostsStore();

onMounted(() => {
  postsStore.fetchPosts();
});

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  } catch {
    return dateStr;
  }
};

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  title: '',
  content: '',
  authorName: 'Admin', 
  authorId: 'admin-01', 
  imageFile: null
});

const resetForm = () => {
  Object.assign(form, { 
    title: '', 
    content: '',
    authorName: 'Admin',
    authorId: 'admin-01',
    imageFile: null 
  });
  isEditing.value = false;
  editingId.value = null;

  if (typeof document !== 'undefined') {
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

const openModal = (post = null) => {
  if (post) {
    isEditing.value = true;
    editingId.value = post.id || post._id;
    Object.assign(form, {
      title: post.title || '',
      content: post.content || '',
      authorName: post.authorName || 'Admin',
      authorId: post.authorId || 'admin-01',
      imageFile: null
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
    alert("Please select a banner image for the new post.");
    return;
  }

  try {
    if (isEditing.value) {
      const jsonPayload = {
        title: form.title,
        content: form.content,
        authorName: form.authorName,
        authorId: form.authorId
      };
      
      await postsStore.updatePost(editingId.value, jsonPayload);
    } else {
      const formData = new FormData();
      formData.append("title", form.title);
      formData.append("content", form.content);
      formData.append("authorName", form.authorName);
      formData.append("authorId", form.authorId);
      formData.append("createdAt", new Date().toISOString());
      
      if (form.imageFile) {
        formData.append("file", form.imageFile);
      }

      await postsStore.createPost(formData);
    }
    closeModal();
  } catch (err) {
    console.error(err);
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
/* Box Sizing Reset to ensure padding doesn't overflow widths */
*, *::before, *::after { box-sizing: border-box; }

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
.title-cell { font-weight: 500; }
.mobile-only { display: none; }
.text-xs { font-size: 0.75rem; }
.text-gray-400 { color: #9ca3af; }
.mt-1 { margin-top: 0.25rem; }

/* Desktop Wrappers */
.cell-content { display: flex; flex-direction: column; gap: 2px; }
.action-buttons { display: flex; gap: 8px; align-items: center; }

.action-btn { 
  background: transparent; border: none; cursor: pointer; padding: 6px; border-radius: 6px; transition: 0.2s; color: #3498db;
  &:hover { background: rgba(52, 152, 219, 0.1); }
  &.danger { color: #ff4757; &:hover { background: rgba(255, 71, 87, 0.1); } }
}

/* Modal Styles */
.modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(0, 0, 0, 0.6); backdrop-filter: blur(5px); display: flex; justify-content: center; align-items: center; z-index: 1000; }
.glass-modal { background: linear-gradient(145deg, rgba(30, 30, 30, 0.95) 0%, rgba(20, 20, 20, 0.98) 100%); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 12px; padding: 30px; width: 100%; max-width: 600px; box-shadow: 0 15px 30px rgba(0, 0, 0, 0.5); max-height: 90vh; overflow-y: auto; }
.glass-modal h3 { margin-top: 0; margin-bottom: 25px; font-size: 1.5rem; }
.form-row { display: flex; gap: 15px; }
.form-group { display: flex; flex-direction: column; gap: 8px; margin-bottom: 15px; width: 100%; &.half { flex: 1; } }
.form-group label { font-size: 0.85rem; color: #aaa; }
.glass-input { width: 100%; background: rgba(0, 0, 0, 0.3); border: 1px solid rgba(255, 255, 255, 0.1); color: #fff; padding: 12px; border-radius: 8px; outline: none; font-family: inherit; &:focus { border-color: #3498db; } }
.modal-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 25px; border-top: 1px solid rgba(255, 255, 255, 0.1); padding-top: 20px; }
.modal-actions button { padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; font-weight: 500; transition: 0.2s; }
.btn-cancel { background: transparent; color: #aaa; &:hover { color: #fff; background: rgba(255, 255, 255, 0.05); } }
.btn-save { background: #3498db; color: #fff; &:hover:not(:disabled) { background: #2980b9; } &:disabled { opacity: 0.6; cursor: not-allowed; } }

.empty-state, .loading-state { text-align: center; padding: 50px; color: #8a8a93; border: 1px dashed rgba(255, 255, 255, 0.1); border-radius: 12px; i { font-size: 3rem; margin-bottom: 10px; opacity: 0.5; } }
@keyframes spin { 100% { transform: rotate(360deg); } }

/* --- MOBILE RESPONSIVENESS --- */
@media (max-width: 768px) { 
  .desktop-only { display: none !important; } 
  .mobile-only { display: block; }
  
  .form-row { flex-direction: column; gap: 15px; }
  .glass-modal { width: 95%; padding: 20px; margin: 10px auto; }
  
  .page-header { flex-direction: column; align-items: stretch; gap: 15px; text-align: center; }
  .header-actions { justify-content: center; flex-wrap: wrap; }
  
  table, thead, tbody, th, td, tr { display: block; width: 100%; }
  thead tr { position: absolute; top: -9999px; left: -9999px; }
  
  tr { 
    margin-bottom: 15px; 
    border: 1px solid rgba(255, 255, 255, 0.1); 
    border-radius: 12px; 
    background: rgba(0, 0, 0, 0.15); 
    padding: 10px; 
  }
  
  td { 
    display: flex; 
    justify-content: space-between; 
    align-items: flex-start; /* Ensure top-alignment for multi-line text */
    text-align: right; 
    border-bottom: 1px solid rgba(255, 255, 255, 0.05); 
    padding: 12px 5px; 
    font-size: 0.9rem;
    gap: 15px; /* Critical: Adds space between the label and content */
  }
  td:last-child { border-bottom: none; }
  
  td::before { 
    content: attr(data-label); 
    font-weight: 600; 
    color: #8a8a93; 
    text-transform: uppercase; 
    font-size: 0.75rem; 
    text-align: left; 
    flex-shrink: 0; /* Keeps the label from squishing */
    margin-top: 2px;
  }
  
  .cell-content { 
    flex: 1; /* Take up all available space after the label */
    min-width: 0; /* Magic flexbox fix for overflowing text */
    align-items: flex-end; 
    word-wrap: break-word;
    overflow-wrap: break-word;
  }
  
  .headline-text {
    white-space: normal; /* Allow long titles to stack */
  }

  .action-buttons { 
    flex-wrap: wrap; 
    justify-content: flex-end; 
  }
}

@media (max-width: 480px) {
  .page-header .titles h2 { font-size: 1.5rem; }
  .glass-btn { padding: 8px 15px; font-size: 0.9rem; }
}
</style>