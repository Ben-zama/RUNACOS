<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Content Hub</h2>
        <p>Manage your faculty blog posts, news, and announcements.</p>
      </div>
      <div class="header-actions">
        <Button 
          label="Draft New Post" 
          icon="bi bi-pencil-square" 
          class="glass-action-btn primary-hover" 
          @click="openModal()" 
        />
        <Button
          icon="bi bi-arrow-clockwise"
          class="p-button-rounded glass-action-btn"
          @click="postsStore.fetchPosts"
          :disabled="postsStore.isLoading"
          :class="{ 'spin-icon': postsStore.isLoading }"
          aria-label="Refresh"
        />
      </div>
    </div>

    <div v-if="postsStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ postsStore.error }}
    </div>

    <div class="glass-card table-card">
      
      <DataTable
        :value="postsStore.posts"
        :loading="postsStore.isLoading"
        responsiveLayout="scroll"
        class="glass-datatable"
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} posts"
      >
        <template #loading>
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading posts...</p>
          </div>
        </template>

        <template #empty>
          <div class="empty-state">
            <i class="bi bi-journal-x"></i>
            <p>No posts found. Start drafting!</p>
          </div>
        </template>

        <Column field="title" header="Headline">
          <template #body="{ data }">
            <div class="cell-content highlight">
              <span class="headline-text">{{ data.title }}</span>
              <div class="mobile-only text-xs text-gray-400 mt-1">
                {{ formatDate(data.createdAt) }} • By {{ data.authorName }}
              </div>
            </div>
          </template>
        </Column>

        <Column field="authorName" header="Author" class="desktop-only"></Column>

        <Column field="createdAt" header="Date Posted" class="desktop-only">
          <template #body="{ data }">
            {{ formatDate(data.createdAt) }}
          </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 10rem">
          <template #body="{ data }">
            <div class="actions-cell">
              <a
                v-if="data.fileUrl"
                :href="data.fileUrl"
                target="_blank"
                class="p-button p-button-rounded p-button-text action-btn text-info"
                title="View Media"
              >
                <i class="bi bi-image"></i>
              </a>
              <Button
                icon="bi bi-pencil"
                class="p-button-rounded p-button-text action-btn"
                @click="openModal(data)"
                title="Edit Post"
              />
              <Button
                icon="bi bi-trash"
                class="p-button-rounded p-button-text action-btn danger"
                @click="handleDelete(data.id || data._id)"
                title="Delete Post"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="isModalOpen"
      :header="isEditing ? 'Edit Post' : 'Draft New Post'"
      :modal="true"
      :style="{ width: '100%', maxWidth: '600px' }"
      class="glass-dialog"
      :closable="false"
    >
      <form @submit.prevent="handleSubmit">
        <div class="form-group mt-3">
          <label>Headline / Title *</label>
          <InputText
            v-model="form.title"
            class="glass-input w-full"
            required
            placeholder="e.g., Upcoming Tech Symposium"
          />
        </div>

        <div class="form-group">
          <label>Post Banner Image <span v-if="!isEditing">*</span></label>
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            class="glass-input w-full file-input"
            :required="!isEditing"
          />
        </div>

        <div class="form-row">
          <div class="form-group half">
            <label>Author Name *</label>
            <InputText
              v-model="form.authorName"
              class="glass-input w-full"
              required
              placeholder="e.g., John Doe"
            />
          </div>
          <div class="form-group half">
            <label>Author ID *</label>
            <InputText
              v-model="form.authorId"
              class="glass-input w-full"
              required
              placeholder="e.g., admin-01"
            />
          </div>
        </div>

        <div class="form-group">
          <label>Content *</label>
          <Textarea
            v-model="form.content"
            class="glass-input w-full"
            rows="6"
            required
            placeholder="Write your post content here..."
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
            :label="postsStore.isLoading ? 'Saving...' : 'Save Post'"
            icon="bi bi-check"
            class="btn-save"
            :loading="postsStore.isLoading"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive } from "vue";
import { usePostsStore } from "~/stores/usePostsStore";

definePageMeta({ layout: "admin", middleware: "admin" });

const postsStore = usePostsStore();

onMounted(() => {
  postsStore.fetchPosts();
});

const formatDate = (dateStr) => {
  if (!dateStr) return "—";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  } catch {
    return dateStr;
  }
};

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  title: "",
  content: "",
  authorName: "Admin",
  authorId: "admin-01",
  imageFile: null,
});

const resetForm = () => {
  Object.assign(form, {
    title: "",
    content: "",
    authorName: "Admin",
    authorId: "admin-01",
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

const openModal = (post = null) => {
  if (post) {
    isEditing.value = true;
    editingId.value = post.id || post._id;
    Object.assign(form, {
      title: post.title || "",
      content: post.content || "",
      authorName: post.authorName || "Admin",
      authorId: post.authorId || "admin-01",
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
    alert("Please select a banner image for the new post.");
    return;
  }

  try {
    if (isEditing.value) {
      const jsonPayload = {
        title: form.title,
        content: form.content,
        authorName: form.authorName,
        authorId: form.authorId,
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
    alert(
      `Failed to ${isEditing.value ? "update" : "create"} post. Check console for details.`
    );
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

.table-card {
  padding: 20px;
  border-radius: 12px;
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
  
  &::placeholder {
    color: #8a8a93;
  }
  &:focus {
    border-color: $accent-color;
  }
}

.file-input {
  padding: 8px 15px;
  font-size: 0.9rem;
}
.w-full { width: 100%; }
.mt-3 { margin-top: 1rem; }
.mt-1 { margin-top: 0.25rem; }

/* Modal Form Layout */
.form-row {
  display: flex;
  gap: 15px;
  .half { flex: 1; }
}

/* PrimeVue DataTable Overrides */
:deep(.glass-datatable) {
  .p-datatable-header, .p-datatable-footer {
    background: transparent;
    border: none;
  }
  .p-datatable-thead > tr > th {
    background: transparent;
    color: #8a8a93;
    border-bottom: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
    font-weight: 500;
    padding: 15px;
  }
  .p-datatable-tbody > tr {
    background: transparent;
    color: var(--text-color);
  }
  .p-datatable-tbody > tr > td {
    border-bottom: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
    padding: 15px;
    font-size: 0.95rem;
  }
  .p-datatable-tbody > tr:hover {
    background: color-mix(in srgb, var(--text-color) 5%, transparent);
  }
  .p-datatable-loading-overlay {
    background: color-mix(in srgb, var(--background-color) 50%, transparent);
    backdrop-filter: blur(2px);
  }

  /* Pagination Glassmorphism Styles */
  .p-paginator {
    background: transparent;
    border: none;
    padding: 15px 0 0 0;
    margin-top: 10px;

    .p-paginator-current {
      color: #8a8a93;
      font-size: 0.85rem;
    }

    .p-paginator-page,
    .p-paginator-next,
    .p-paginator-last,
    .p-paginator-first,
    .p-paginator-prev {
      background: transparent;
      color: #8a8a93;
      border-radius: 8px;
      border: 1px solid transparent;
      min-width: 2.5rem;
      height: 2.5rem;
      transition: 0.2s ease;
      
      &:hover {
        background: color-mix(in srgb, var(--text-color) 10%, transparent);
        color: var(--text-color);
      }
      
      &.p-highlight {
        background: rgba(52, 152, 219, 0.15);
        color: #3498db;
        border: 1px solid rgba(52, 152, 219, 0.3);
      }
    }

    .p-dropdown {
      background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
      border: 1px solid color-mix(in srgb, var(--text-color) 15%, transparent);
      border-radius: 8px;
      
      .p-dropdown-label { color: var(--text-color); }
      .p-dropdown-trigger { color: #8a8a93; }
      
      &:hover { border-color: color-mix(in srgb, var(--text-color) 30%, transparent); }
    }
  }
}

.highlight { font-weight: 600; }
.text-gray-400 { color: #9ca3af; }
.mobile-only { display: none; }

/* Actions */
.actions-cell {
  display: flex;
  gap: 8px;

  .action-btn {
    color: #3498db;
    &:hover { background: rgba(52, 152, 219, 0.1) !important; }
    
    &.danger {
      color: #ff4757;
      &:hover { background: rgba(255, 71, 87, 0.1) !important; }
    }
    &.text-info {
      color: #9b59b6;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover { background: rgba(155, 89, 182, 0.1) !important; }
    }
  }
}

.empty-state, .loading-state, .error-alert {
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

.spinner {
  display: inline-block;
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255, 255, 255, 0.1);
  border-left-color: $accent-color;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 15px;
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

@keyframes spin { 100% { transform: rotate(360deg); } }

/* --- MOBILE RESPONSIVENESS --- */
@media (max-width: 768px) {
  :deep(.desktop-only) { display: none !important; }
  .mobile-only { display: block; }

  .form-row {
    flex-direction: column;
    gap: 15px;
  }

  .page-header {
    flex-direction: column;
    align-items: stretch;
    gap: 15px;
    text-align: center;
  }
  .header-actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .headline-text {
    white-space: normal;
    word-break: break-word;
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