<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Content Hub</h2>
        <p>Manage your faculty blog posts, news, and announcements.</p>
      </div>
      <button class="glass-btn primary-hover"><i class="bi bi-pencil-square"></i> Draft New Post</button>
    </div>

    <div class="glass-card table-card">
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
            <tr v-for="post in posts" :key="post.id">
              <td class="title-cell highlight">{{ post.title }}</td>
              <td>{{ post.category }}</td>
              <td>
                <span class="status-badge" :class="post.status.toLowerCase()">{{ post.status }}</span>
              </td>
              <td>{{ post.date }}</td>
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

const posts = [
  { id: 1, title: "New JavaScript Framework Promises 10x Faster Renders", category: "Technology", status: "Published", date: "Mar 18, 2026" },
  { id: 2, title: "The Evolution of Glassmorphism in Modern UI", category: "Design", status: "Draft", date: "—" },
  { id: 3, title: "Local EdTech Startup Secures $5M", category: "Business", status: "Scheduled", date: "Mar 25, 2026" },
  { id: 4, title: "RUNACOS Annual Tech Summit 2026 Announced", category: "Announcements", status: "Published", date: "Feb 10, 2026" }
];
</script>

<style lang="scss" scoped>
.page-container { display: flex; flex-direction: column; gap: 30px; }
.page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  .titles h2 { font-size: 2rem; margin: 0 0 5px 0; }
  .titles p { color: #8a8a93; margin: 0; }
}
.title-cell { max-width: 350px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.status-badge {
  padding: 4px 12px; border-radius: 20px; font-size: 0.8rem; font-weight: 600;
  &.published { background: rgba(46, 213, 115, 0.1); color: #2ed573; border: 1px solid rgba(46, 213, 115, 0.2); }
  &.draft { background: rgba(255, 255, 255, 0.05); color: #ccc; border: 1px solid rgba(255, 255, 255, 0.1); }
  &.scheduled { background: rgba(255, 165, 2, 0.1); color: #ffa502; border: 1px solid rgba(255, 165, 2, 0.2); }
}
@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 15px; }
}
</style>