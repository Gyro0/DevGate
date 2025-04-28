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
  }
  
  .stat-card {
    background: white;
    border-radius: 8px;
    padding: 1rem;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    flex: 1;
    margin: 0 0.5rem;
    text-align: center;
  }
  
  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
  }
  
  .stat-label {
    font-size: 0.875rem;
    color: #6b7280;
  }
  
  .stat-icon {
    font-size: 1.5rem;
    margin-top: 0.5rem;
  }
  </style>