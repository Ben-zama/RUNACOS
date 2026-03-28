<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Academic Resources</h2>
        <p>Manage past questions, lecture notes, and study materials.</p>
      </div>
      <button class="glass-btn primary-hover"><i class="bi bi-upload"></i> Upload Resource</button>
    </div>

    <div class="glass-card table-card">
      <div class="table-filters">
        <input type="search" placeholder="Search course code..." class="glass-input" />
        <select class="glass-input">
          <option value="">All Departments</option>
          <option>Computer Science</option>
          <option>Cyber Security</option>
          <option>Information Tech</option>
        </select>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>File Name / Course Code</th>
              <th class="desktop-only">Department</th>
              <th class="desktop-only">Type</th>
              <th class="desktop-only">Date Added</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="res in allResources" :key="res.id">
              <td class="highlight">{{ res.code }}</td>
              <td class="desktop-only">{{ res.dept }}</td>
              <td class="desktop-only"><span class="pill">{{ res.type }}</span></td>
              <td class="desktop-only">{{ res.date }}</td>
              <td class="actions-cell">
                <button class="action-btn"><i class="bi bi-pencil"></i></button>
                <button class="action-btn danger"><i class="bi bi-trash"></i></button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' });

const allResources = [
  { id: 1, code: "CSC 301 - Compiler Construction 2023 PQ", dept: "Computer Science", type: "Past Question", date: "Oct 12, 2025" },
  { id: 2, code: "CYS 205 - Network Security Slide 1", dept: "Cyber Security", type: "Lecture Note", date: "Nov 05, 2025" },
  { id: 3, code: "IFT 402 - Cloud Architecture", dept: "Information Tech", type: "Study Material", date: "Jan 14, 2026" },
  { id: 4, code: "CSC 101 - Intro to Computing", dept: "Computer Science", type: "Past Question", date: "Feb 22, 2026" },
];
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
    h2 { font-size: 2rem; margin: 0 0 5px 0; }
    p { color: #8a8a93; margin: 0; }
  }
}
.table-filters {
  display: flex;
  gap: 15px;
  margin-bottom: 20px;
  .glass-input {
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff;
    padding: 10px 15px;
    border-radius: 8px;
    outline: none;
    &::placeholder { color: #8a8a93; }
    &:focus { border-color: #3b82f6; }
  }
  select.glass-input {
    appearance: none;
    padding-right: 30px;
    cursor: pointer;
    option { color: #000; }
  }
}
.pill {
  background: rgba(255, 255, 255, 0.1);
  padding: 4px 10px;
  border-radius: 20px;
  font-size: 0.8rem;
}

@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .table-filters { flex-direction: column; }
}

@media (max-width: 768px) {
  .desktop-only {
    display: none;
  }
  
  .table-responsive table {
    width: 100%;
  }
}
</style>