<template>
  <div class="row g-4">
    <div class="col-md-3" v-for="(value, label, index) in stats" :key="index">
      <div class="card text-center shadow-sm border-0">
        <div class="card-body">
          <h5 class="card-title text-primary">{{ value }}</h5>
          <p class="card-text text-muted">{{ label }}</p>
        </div>
      </div>
    </div>
<<<<<<< HEAD
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const props = defineProps({
    stats: {
      type: Object,
      required: true
    }
  });
  </script>
  
  <style scoped>
  .profile-stats {
    display: flex;
    justify-content: space-between;
    margin-top: 1.5rem;
    gap: 1.2rem;
  }
  
  .stat-card {
    background: var(--surface-card);
    border-radius: 1rem;
    padding: 1.2rem 1rem;
    box-shadow: 0 2px 16px 0 rgba(0,0,0,0.25), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
    border: 1.5px solid var(--border-color, #23272e);
    flex: 1;
    margin: 0;
    text-align: center;
    color: var(--text);
    transition: box-shadow 0.18s, border-color 0.18s;
  }
  .stat-card:hover {
    box-shadow: 0 0 24px 2px var(--primary-glow), 0 0 0 2.5px var(--primary-glow);
    border-color: var(--primary-glow);
  }
  
  .stat-value {
    font-size: 2rem;
    font-weight: 800;
    color: var(--primary);
    text-shadow: 0 0 8px var(--primary-glow);
  }
  
  .stat-label {
    font-size: 1rem;
    color: var(--text-secondary);
    margin-top: 0.2rem;
    font-weight: 600;
    letter-spacing: 0.5px;
  }
  
  .stat-icon {
    font-size: 1.6rem;
    margin-top: 0.7rem;
    color: var(--circuit-accent, var(--secondary));
    filter: drop-shadow(0 0 6px var(--primary-glow));
  }
  
  .skill-icon i { color: var(--primary); }
  .project-icon i { color: var(--secondary); }
  .objective-icon i { color: var(--highlight); }
  .activity-icon i { color: var(--circuit-accent); }
  
  @media (max-width: 700px) {
    .profile-stats {
      flex-direction: column;
      gap: 1rem;
    }
    .stat-card {
      margin: 0;
    }
  }
  </style>
=======
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.card {
  border-radius: 8px;
}
.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.card-text {
  font-size: 0.9rem;
  color: #6c757d;
}
</style>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
