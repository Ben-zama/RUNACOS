<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Alumni Database</h2>
        <p>Manage registered alumni profiles and graduation records.</p>
      </div>
      <button class="glass-btn primary-hover"><i class="bi bi-person-plus"></i> Add Alumni</button>
    </div>

    <div class="glass-card table-card">
      <div class="table-filters">
        <input type="search" placeholder="Search by name..." class="glass-input search-input" />
        <select class="glass-input">
          <option value="">Graduation Year</option>
          <option>2025</option>
          <option>2024</option>
          <option>2023</option>
        </select>
      </div>

      <div class="table-responsive">
        <table>
          <thead>
            <tr>
              <th>Alumni Name</th>
              <th>Department</th>
              <th>Class Of</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="alumni in alumniList" :key="alumni.id">
              <td class="highlight user-cell">
                <img :src="alumni.image" class="avatar-sm" />
                {{ alumni.name }}
              </td>
              <td>{{ alumni.dept }}</td>
              <td>{{ alumni.year }}</td>
              <td><span class="pill verified"><i class="bi bi-check-circle-fill"></i> Verified</span></td>
              <td class="actions-cell">
                <button class="action-btn"><i class="bi bi-eye"></i></button>
                <button class="action-btn"><i class="bi bi-pencil"></i></button>
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

const alumniList = [
  { id: 1, name: "David Olatunji", dept: "Computer Science", year: "2023", image: "https://placehold.co/100x100/151515/8a8a93?text=D" },
  { id: 2, name: "Aisha Bello", dept: "Cyber Security", year: "2024", image: "https://placehold.co/100x100/151515/8a8a93?text=A" },
  { id: 3, name: "Samuel Eze", dept: "Information Tech", year: "2021", image: "https://placehold.co/100x100/151515/8a8a93?text=S" },
  { id: 4, name: "Grace Okafor", dept: "Computer Science", year: "2025", image: "https://placehold.co/100x100/151515/8a8a93?text=G" }
];
</script>

<style lang="scss" scoped>
.page-container { display: flex; flex-direction: column; gap: 30px; }
.page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  .titles h2 { font-size: 2rem; margin: 0 0 5px 0; }
  .titles p { color: #8a8a93; margin: 0; }
}
.table-filters {
  display: flex; gap: 15px; margin-bottom: 20px;
  .glass-input {
    background: rgba(255, 255, 255, 0.03); border: 1px solid rgba(255, 255, 255, 0.1);
    color: #fff; padding: 10px 15px; border-radius: 8px; outline: none;
    &:focus { border-color: #3b82f6; }
  }
  .search-input { flex: 1; max-width: 400px; }
  select.glass-input { appearance: none; padding-right: 30px; cursor: pointer; option { color: #000; } }
}
.user-cell { display: flex; align-items: center; gap: 12px; }
.avatar-sm { width: 30px; height: 30px; border-radius: 50%; object-fit: cover; border: 1px solid rgba(255,255,255,0.2); }
.pill.verified {
  background: rgba(46, 213, 115, 0.1); color: #2ed573; padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; display: inline-flex; align-items: center; gap: 5px;
}
@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 15px; }
  .table-filters { flex-direction: column; .search-input { max-width: 100%; } }
}
</style>