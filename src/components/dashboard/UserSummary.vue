<template>
  <div class="user-summary">
    <div class="greeting-section">
      <div class="user-avatar">
        <img :src="user?.photoURL || '/default-avatar.png'" alt="Profile" />
      </div>
      <div class="greeting-text">
        <h1>👋 {{ getCurrentGreeting() }}, {{ user?.displayName || 'Developer' }}</h1>
        <p>Last activity: {{ lastActivity }}</p>
      </div>
    </div>
    
    <div class="summary-actions">
      <button class="action-button" @click="navigateTo('/skills')">
        <i class="fas fa-plus"></i> Add Skill
      </button>
      <button class="action-button" @click="navigateTo('/projects')">
        <i class="fas fa-plus"></i> Add Project
      </button>
      <button class="action-button" @click="navigateTo('/objectives')">
        <i class="fas fa-plus"></i> New Objective
      </button>
    </div>
    
    <div class="tips-section">
      <div class="tip" v-if="showTips">
        <i class="fas fa-lightbulb tip-icon"></i>
        <div class="tip-content">
          <p>{{ currentTip }}</p>
          <button @click="nextTip">Next tip <i class="fas fa-chevron-right"></i></button>
        </div>
        <button class="close-tip" @click="closeTip"><i class="fas fa-times"></i></button>
      </div>
    </div>
  </div>
</template>

<script>
import useAuth from '@/composables/useAuth';
import { ref } from 'vue';

export default {
  name: 'UserSummary',
  setup() {
    const { user } = useAuth();
    const lastActivity = ref(null); // Add this ref for "lastActivity"
    const showTips = ref(false); // Add this ref for "showTips"

    // Get current time for greeting
    const getCurrentGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };

    return {
      user,
      getCurrentGreeting,
      lastActivity,
      showTips
    };
  }
}
</script>

<style scoped>
.user-summary {
  background-color: #ffffff;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
}

.greeting-section {
  display: flex;
  align-items: center;
  margin-bottom: 1.5rem;
}

.user-avatar {
  margin-right: 1.5rem;
}

.user-avatar img {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  object-fit: cover;
}

.greeting-text h1 {
  font-size: 1.5rem;
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: 600;
}

.greeting-text p {
  margin: 0;
  color: #6b7280;
}

.summary-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-button {
  padding: 0.75rem 1rem;
  background-color: #f9fafb;
  border: 1px solid #e5e7eb;
  border-radius: 6px;
  color: #374151;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: all 0.2s;
}

.action-button i {
  margin-right: 0.5rem;
  color: #4f46e5;
}

.action-button:hover {
  background-color: #f3f4f6;
  border-color: #d1d5db;
}

.tips-section {
  margin-top: 1rem;
}

.tip {
  display: flex;
  align-items: center;
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  border-radius: 6px;
  padding: 1rem;
  position: relative;
}

.tip-icon {
  color: #0284c7;
  font-size: 1.25rem;
  margin-right: 1rem;
}

.tip-content {
  flex: 1;
}

.tip-content p {
  margin: 0;
  margin-bottom: 0.5rem;
  color: #0c4a6e;
}

.tip-content button {
  background: none;
  border: none;
  color: #0284c7;
  padding: 0;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.tip-content button i {
  margin-left: 0.25rem;
  font-size: 0.75rem;
}

.close-tip {
  background: none;
  border: none;
  color: #64748b;
  padding: 0.25rem;
  cursor: pointer;
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
}

@media (max-width: 768px) {
  .greeting-section {
    flex-direction: column;
    align-items: flex-start;
  }
  
  .user-avatar {
    margin-right: 0;
    margin-bottom: 1rem;
  }
  
  .summary-actions {
    flex-direction: column;
  }
  
  .action-button {
    width: 100%;
  }
}
</style>