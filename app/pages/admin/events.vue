<template>
  <div class="page-container">
    <div class="page-header">
      <div class="titles">
        <h2>Events Manager</h2>
        <p>Schedule and manage upcoming faculty events.</p>
      </div>
      <button class="glass-btn primary-hover"><i class="bi bi-calendar-plus"></i> Create Event</button>
    </div>

    <div class="events-grid">
      <div class="glass-card event-card" v-for="event in events" :key="event.id">
        <div class="date-box">
          <span class="month">{{ event.month }}</span>
          <span class="day">{{ event.day }}</span>
        </div>
        <div class="event-details">
          <h3>{{ event.title }}</h3>
          <p><i class="bi bi-geo-alt"></i> {{ event.location }}</p>
          <p><i class="bi bi-clock"></i> {{ event.time }}</p>
        </div>
        <div class="event-actions">
          <button class="action-btn"><i class="bi bi-pencil"></i></button>
          <button class="action-btn danger"><i class="bi bi-trash"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
definePageMeta({ layout: 'admin' });

const events = [
  { id: 1, title: "Global Tech Summit 2026", month: "MAR", day: "25", location: "Main Auditorium", time: "09:00 AM - 04:00 PM" },
  { id: 2, title: "UI/UX Design Masterclass", month: "APR", day: "10", location: "Virtual Event (Zoom)", time: "11:00 AM - 02:00 PM" },
  { id: 3, title: "Startup Founders Mixer", month: "MAY", day: "05", location: "Innovation Hub, Lagos", time: "05:00 PM - 08:00 PM" }
];
</script>

<style lang="scss" scoped>
.page-container { display: flex; flex-direction: column; gap: 30px; }
.page-header {
  display: flex; justify-content: space-between; align-items: flex-end;
  .titles h2 { font-size: 2rem; margin: 0 0 5px 0; }
  .titles p { color: #8a8a93; margin: 0; }
}
.events-grid {
  display: grid; grid-template-columns: repeat(auto-fill, minmax(350px, 1fr)); gap: 25px;
}
.event-card {
  display: flex; align-items: center; gap: 20px; padding: 20px;
  .date-box {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    background: rgba(255, 255, 255, 0.05); border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 12px; width: 70px; height: 70px;
    .month { color: #3b82f6; font-weight: 700; font-size: 0.85rem; }
    .day { font-size: 1.5rem; font-weight: 800; color: #fff; line-height: 1; }
  }
  .event-details {
    flex: 1;
    h3 { margin: 0 0 8px 0; font-size: 1.1rem; color: #fff; }
    p { margin: 0 0 4px 0; font-size: 0.85rem; color: #8a8a93; display: flex; align-items: center; gap: 6px; }
  }
  .event-actions {
    display: flex; flex-direction: column; gap: 10px;
    .action-btn { background: none; border: none; color: #8a8a93; cursor: pointer; transition: 0.3s; }
    .action-btn:hover { color: #3b82f6; }
    .action-btn.danger:hover { color: #ff4757; }
  }
}
@media (max-width: 600px) {
  .page-header { flex-direction: column; align-items: flex-start; gap: 15px; }
}
</style>