<template>
    <div class="profile-stats">
      <div class="stat-card">
        <div class="stat-value">{{ stats.skillCount }}</div>
        <div class="stat-label">Skills</div>
        <div class="stat-icon skill-icon">
          <i class="fas fa-chart-line"></i>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value">{{ stats.projectCount }}</div>
        <div class="stat-label">Projects</div>
        <div class="stat-icon project-icon">
          <i class="fas fa-code"></i>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value">{{ stats.completedObjectives }}</div>
        <div class="stat-label">Completed Goals</div>
        <div class="stat-icon objective-icon">
          <i class="fas fa-bullseye"></i>
        </div>
      </div>
      
      <div class="stat-card">
        <div class="stat-value">{{ stats.daysActive }}</div>
        <div class="stat-label">Days Active</div>
        <div class="stat-icon activity-icon">
          <i class="fas fa-calendar-check"></i>
        </div>
      </div>
    </div>
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