<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Academic Resources</h2>
        <p>Manage past questions, lecture notes, and study materials.</p>
      </div>
      <div class="header-actions">
        <button class="glass-btn primary-hover" @click="openModal()">
          <i class="bi bi-upload"></i> Upload Resource
        </button>
        <button
          class="glass-btn refresh-btn"
          @click="resourcesStore.fetchResources"
          :disabled="resourcesStore.isLoading"
        >
          <i
            class="bi bi-arrow-clockwise"
            :class="{ spin: resourcesStore.isLoading }"
          ></i>
        </button>
      </div>
    </div>

    <div v-if="resourcesStore.error" class="error-alert">
      <i class="bi bi-exclamation-triangle"></i> {{ resourcesStore.error }}
    </div>

    <div class="glass-card table-card">
      <div class="table-filters">
        <input
          v-model="searchQuery"
          type="search"
          placeholder="Search by title or course code..."
          class="glass-input search-full"
        />
      </div>

      <div
        v-if="resourcesStore.isLoading && resourcesStore.resources.length === 0"
        class="loading-state"
      >
        <div class="spinner"></div>
        <p>Loading resources...</p>
      </div>
      <div v-else-if="filteredResources.length === 0" class="empty-state">
        <i class="bi bi-folder-x"></i>
        <p>No resources match your search.</p>
      </div>

      <div v-else class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Title & Course Code</th>
              <th class="desktop-only">Type</th>
              <th class="desktop-only">Uploaded By</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in filteredResources" :key="res.id || res._id">
              <td data-label="Title & Course">
                <div class="highlight user-cell">
                  <div>
                    {{ res.title }}
                    <div style="font-size: 0.75rem; color: #9ca3af">
                      {{ res.courseCode }}
                    </div>
                  </div>
                </div>
              </td>
              <td data-label="Type" class="desktop-only">
                <span class="pill">{{ res.resourceType }}</span>
              </td>
              <td data-label="Uploaded By" class="desktop-only">
                {{ res.uploadedBy || "Admin" }}
              </td>
              <td data-label="Actions" class="actions-cell">
                <a
                  v-if="res.fileUrl"
                  :href="res.fileUrl"
                  target="_blank"
                  class="action-btn"
                  ><i class="bi bi-download"></i
                ></a>
                <button class="action-btn" @click="openModal(res)">
                  <i class="bi bi-pencil"></i>
                </button>
                <button
                  class="action-btn danger"
                  @click="handleDelete(res.id || res._id)"
                >
                  <i class="bi bi-trash"></i>
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <div v-if="isModalOpen" class="modal-overlay" @click.self="closeModal">
      <div class="modal">
        <h3>{{ isEditing ? "Edit Resource" : "Upload Resource" }}</h3>

        <form @submit.prevent="handleSubmit">
          <div class="form-group">
            <label>Resource Title *</label>
            <input
              v-model="form.title"
              type="text"
              class="glass-input"
              required
              placeholder="e.g., 2023 Midterm PQ"
            />
          </div>

          <div class="form-group">
            <label>Course Code *</label>
            <input
              v-model="form.courseCode"
              type="text"
              class="glass-input"
              required
              placeholder="e.g., CSC 301"
            />
          </div>

          <div class="form-group">
            <label>Resource Type *</label>
            <select v-model="form.resourceType" class="glass-input" required>
              <option value="Past Question">Past Question</option>
              <option value="Lecture Note">Lecture Note</option>
              <option value="Study Material">Study Material</option>
            </select>
          </div>

          <div class="form-group">
            <label
              >Attach File (PDF, DOCX) <span v-if="!isEditing">*</span></label
            >
            <input
              type="file"
              @change="handleFileUpload"
              class="glass-input"
              :required="!isEditing"
            />
          </div>

          <div class="modal-actions">
            <button type="button" class="btn-cancel" @click="closeModal">
              Cancel
            </button>
            <button
              type="submit"
              class="btn-save"
              :disabled="resourcesStore.isLoading"
            >
              {{ resourcesStore.isLoading ? "Uploading..." : "Save Resource" }}
            </button>
          </div>
        </form>
      </div>
    </div>
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

    // The spec requires an 'uploadedBy' field. Setting a default here:
    formData.append("uploadedBy", "Admin");

    // The spec also marks 'fileUrl' as required in the form data, providing a fallback empty string
    // if the backend logic relies on replacing it with a cloud URL after upload.
    formData.append("fileUrl", "");

    if (form.attachedFile) {
      // Changed from 'files' to 'file' to match backend ImagesResources Schema
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
    alert(
      `Failed to ${
        isEditing.value ? "update" : "upload"
      } resource. Check console.`
    );
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
    .spin {
      animation: spin 1s linear infinite;
    }
  }
}

/* Table & Filter Styles */
.table-card {
  padding: 20px;
  border-radius: 12px;
}
.table-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
}
.search-full {
  max-width: 400px;
}

.table-responsive {
  overflow-x: auto;
}
table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}
th {
  padding: 15px;
  font-weight: 500;
  font-size: 0.9rem;
}
td {
  padding: 15px;
  font-size: 0.95rem;
  vertical-align: middle;
}

.pill {
  background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
  border: 1px solid color-mix(in srgb, var(--text-color) 10%, transparent);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
  white-space: nowrap;
}

@media (max-width: 768px) {
  .desktop-only {
    display: none !important;
  }
  .modal {
    width: 95%;
    padding: 20px;
    margin: 10px auto;
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
  .table-filters {
    flex-direction: column;
    .search-full {
      max-width: 100%;
    }
  }

  /* Transform Table into Cards */
  table,
  thead,
  tbody,
  th,
  td,
  tr {
    display: block;
    width: 100%;
  }
  thead tr {
    position: absolute;
    top: -9999px;
    left: -9999px;
  }
  tr {
    margin-bottom: 15px;
    border-radius: 12px;
    background: color-mix(in srgb, var(--secondary-color) 15%, transparent);
    padding: 5px 10px;
  }
  td {
    display: flex;
    justify-content: space-between;
    align-items: center;
    text-align: right;
    padding: 12px 5px;
    font-size: 0.9rem;
  }
  td:last-child {
    border-bottom: none;
  }
  td::before {
    content: attr(data-label);
    font-weight: 600;
    color: #8a8a93;
    text-transform: uppercase;
    font-size: 0.75rem;
    text-align: left;
    padding-right: 15px;
  }

  .user-cell {
    justify-content: flex-end;
    text-align: right;
  }
  .actions-cell {
    justify-content: flex-end;
    gap: 15px;
  }
}

@media (max-width: 480px) {
  .page-header .titles h2 {
    font-size: 1.5rem;
  }
  .glass-btn {
    padding: 8px 15px;
    font-size: 0.9rem;
  }
}
</style>