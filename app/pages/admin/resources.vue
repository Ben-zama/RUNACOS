<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Academic Resources</h2>
        <p>Manage past questions, lecture notes, and study materials.</p>
      </div>
      <div class="header-actions">
        <Button 
          label="Upload Resource" 
          icon="bi bi-upload" 
          class="glass-action-btn primary-hover" 
          @click="openModal()" 
        />
        <Button
          icon="bi bi-arrow-clockwise"
          class="p-button-rounded glass-action-btn"
          @click="resourcesStore.fetchResources"
          :disabled="resourcesStore.isLoading"
          :class="{ 'spin-icon': resourcesStore.isLoading }"
          aria-label="Refresh"
        />
      </div>
    </div>

    <div v-if="resourcesStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ resourcesStore.error }}
    </div>

    <div class="glass-card table-card">
      <div class="table-filters">
        <span class="p-input-icon-left search-full-wrapper">
          <i class="bi bi-search" style="color: #8a8a93; margin-left: 10px;"></i>
          <InputText
            v-model="searchQuery"
            placeholder="Search by title or course code..."
            class="glass-input search-full pl-5"
          />
        </span>
      </div>

      <DataTable
        :value="filteredResources"
        :loading="resourcesStore.isLoading"
        responsiveLayout="scroll"
        class="glass-datatable"
        paginator
        :rows="10"
        :rowsPerPageOptions="[10, 20, 50]"
        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown CurrentPageReport"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} resources"
      >
        <template #loading>
          <div class="loading-state">
            <div class="spinner"></div>
            <p>Loading resources...</p>
          </div>
        </template>

        <template #empty>
          <div class="empty-state">
            <i class="bi bi-folder-x"></i>
            <p>No resources match your search.</p>
          </div>
        </template>

        <Column field="title" header="Title & Course Code">
          <template #body="{ data }">
            <div class="highlight">
              <div>{{ data.title }}</div>
              <div style="font-size: 0.75rem; color: #9ca3af; margin-top: 2px;">
                {{ data.courseCode }}
              </div>
            </div>
          </template>
        </Column>

        <Column field="resourceType" header="Type" class="desktop-only">
          <template #body="{ data }">
            <Tag :value="data.resourceType" severity="info" rounded class="custom-tag" />
          </template>
        </Column>

        <Column field="uploadedBy" header="Uploaded By" class="desktop-only">
          <template #body="{ data }">
            {{ data.uploadedBy || "Admin" }}
          </template>
        </Column>

        <Column header="Actions" :exportable="false" style="min-width: 8rem">
          <template #body="{ data }">
            <div class="actions-cell">
              <a 
                v-if="data.fileUrl" 
                :href="data.fileUrl" 
                target="_blank" 
                class="p-button p-button-rounded p-button-text action-btn text-success"
                title="Download"
              >
                <i class="bi bi-download"></i>
              </a>
              <Button
                icon="bi bi-pencil"
                class="p-button-rounded p-button-text action-btn"
                @click="openModal(data)"
                title="Edit"
              />
              <Button
                icon="bi bi-trash"
                class="p-button-rounded p-button-text action-btn danger"
                @click="handleDelete(data.id || data._id)"
                title="Delete"
              />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <Dialog
      v-model:visible="isModalOpen"
      :header="isEditing ? 'Edit Resource' : 'Upload Resource'"
      :modal="true"
      :style="{ width: '100%', maxWidth: '450px' }"
      class="glass-dialog"
      :closable="false"
    >
      <form @submit.prevent="handleSubmit">
        <div class="form-group mt-3">
          <label>Resource Title *</label>
          <InputText
            v-model="form.title"
            class="glass-input w-full"
            required
            placeholder="e.g., 2023 Midterm PQ"
          />
        </div>

        <div class="form-group">
          <label>Course Code *</label>
          <InputText
            v-model="form.courseCode"
            class="glass-input w-full"
            required
            placeholder="e.g., CSC 301"
          />
        </div>

        <div class="form-group">
          <label>Resource Type *</label>
          <select v-model="form.resourceType" class="glass-input w-full" required>
            <option value="Past Question">Past Question</option>
            <option value="Lecture Note">Lecture Note</option>
            <option value="Study Material">Study Material</option>
          </select>
        </div>

        <div class="form-group">
          <label>Attach File (PDF, DOCX) <span v-if="!isEditing">*</span></label>
          <input
            type="file"
            @change="handleFileUpload"
            class="glass-input w-full file-input"
            :required="!isEditing"
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
            :label="resourcesStore.isLoading ? 'Saving...' : 'Save Resource'"
            icon="bi bi-check"
            class="btn-save"
            :loading="resourcesStore.isLoading"
          />
        </div>
      </form>
    </Dialog>
  </div>
</template>

<script setup>
import { onMounted, ref, reactive, computed } from "vue";
import { useResourcesStore } from "~/stores/useResourcesStore";

definePageMeta({ layout: "admin", middleware: "admin" });

const resourcesStore = useResourcesStore();
const searchQuery = ref("");

onMounted(() => {
  resourcesStore.fetchResources();
});

const filteredResources = computed(() => {
  if (!resourcesStore.resources) return [];

  return resourcesStore.resources.filter((res) => {
    const safeCode = res.courseCode || "";
    const safeTitle = res.title || "";
    const safeQuery = searchQuery.value || "";

    return (
      safeCode.toLowerCase().includes(safeQuery.toLowerCase()) ||
      safeTitle.toLowerCase().includes(safeQuery.toLowerCase())
    );
  });
});

const isModalOpen = ref(false);
const isEditing = ref(false);
const editingId = ref(null);

const form = reactive({
  title: "",
  courseCode: "",
  resourceType: "Past Question",
  attachedFile: null,
});

const resetForm = () => {
  Object.assign(form, {
    title: "",
    courseCode: "",
    resourceType: "Past Question",
    attachedFile: null,
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
  if (file) form.attachedFile = file;
};

const openModal = (resource = null) => {
  if (resource) {
    isEditing.value = true;
    editingId.value = resource.id || resource._id;
    Object.assign(form, {
      title: resource.title || "",
      courseCode: resource.courseCode || "",
      resourceType: resource.resourceType || "Past Question",
      attachedFile: null,
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
  if (!form.attachedFile && !isEditing.value) {
    alert("Please select a file to upload!");
    return;
  }

  try {
    const formData = new FormData();
    formData.append("title", form.title);
    formData.append("courseCode", form.courseCode);
    formData.append("resourceType", form.resourceType);
    formData.append("uploadedBy", "Admin");
    formData.append("fileUrl", ""); // Backend logic hook

    if (form.attachedFile) {
      formData.append("file", form.attachedFile);
    }

    if (isEditing.value) {
      await resourcesStore.updateResource(editingId.value, formData);
    } else {
      await resourcesStore.createResource(formData);
    }
    closeModal();
  } catch (err) {
    console.error(err);
    alert(`Failed to ${isEditing.value ? "update" : "upload"} resource. Check console.`);
  }
};

const handleDelete = async (id) => {
  if (!confirm("Are you sure you want to delete this resource?")) return;
  try {
    await resourcesStore.deleteResource(id);
  } catch {
    alert("Failed to delete resource.");
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
  
  .titles {
    h2 {
      font-size: 2rem;
      margin: 0 0 5px 0;
    }
    p {
      color: #8a8a93;
      margin: 0;
    }
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

.table-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;

  .search-full-wrapper {
    width: 100%;
    max-width: 400px;
    position: relative;
    
    i {
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
    }
  }

  .search-full {
    width: 100%;
    padding-left: 2.5rem !important; 
  }
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
  option {
    background: var(--background-color, #1a1a1a);
    color: var(--text-color, #fff);
  }
}
.file-input {
  padding: 8px 15px;
  font-size: 0.9rem;
}
.w-full { width: 100%; }
.mt-3 { margin-top: 1rem; }

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
  
}

.highlight { font-weight: 600; }

/* Custom Tag Overrides */
.custom-tag {
  background: color-mix(in srgb, var(--text-color) 10%, transparent);
  color: var(--text-color);
  border: 1px solid color-mix(in srgb, var(--text-color) 20%, transparent);
  padding: 4px 10px;
  font-size: 0.8rem;
  font-weight: 600;
}

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
    &.text-success {
      color: #2ed573;
      text-decoration: none;
      display: flex;
      align-items: center;
      justify-content: center;
      &:hover { background: rgba(46, 213, 115, 0.1) !important; }
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

/* Responsiveness */
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
  .table-filters {
    flex-direction: column;
    .search-full-wrapper {
      max-width: 100%;
    }
  }
  
  :deep(.p-paginator) {
    flex-wrap: wrap;
    justify-content: center;
  }
}

@media (max-width: 768px) {
  :deep(.desktop-only) {
    display: none;
  }
}
</style>