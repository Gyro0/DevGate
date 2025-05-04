<template>
  <div class="user-summary">
    <div class="greeting-section">
      <div class="user-avatar">
        <img :src="user?.photoURL || '/default-avatar.png'" alt="Profile" />
      </div>
      <div class="greeting-text">
        <h1>👋 {{ getCurrentGreeting() }}, {{ user?.displayName || 'Developer' }}</h1>
        <p>Last activity: {{ formattedLastActivity }}</p>
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
  </div>
</template>

<script>
import useAuth from '@/composables/useAuth';
import useTimeline from '@/composables/useTimeline';
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';

export default {
  name: 'UserSummary',
  setup() {
    const { user } = useAuth();
    const { events, fetchUserTimeline } = useTimeline();
    const router = useRouter();
    const lastActivity = ref(null);
    
    // Format the last activity timestamp for display
    const formattedLastActivity = computed(() => {
      if (!lastActivity.value) return "No recent activity";
      
      // Handle Firebase Timestamp or JavaScript Date
      const date = lastActivity.value.seconds 
        ? new Date(lastActivity.value.seconds * 1000) 
        : new Date(lastActivity.value);
        
      // Check if the date is valid
      if (isNaN(date.getTime())) return "No recent activity";
      
      // Format the date
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    });
    
    // Get current time for greeting
    const getCurrentGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };
    
    // Navigation function
    const navigateTo = (path) => {
      router.push(path);
    };

    // Fetch last activity on component mount
    onMounted(async () => {
      await fetchUserTimeline(1); // Fetch just the most recent event
      
      if (events.value && events.value.length > 0) {
        lastActivity.value = events.value[0].timestamp;
      }
    });

    return {
      user,
      getCurrentGreeting,
      formattedLastActivity,
      navigateTo
    };
  }
}
</script>

<style scoped>
.user-summary {
  background: var(--surface);
  border-radius: 1.5rem;
  box-shadow: 0 4px 24px 0 rgba(30, 203, 225, 0.10), 0 0 0 2px var(--highlight);
  border: 1.5px solid var(--highlight);
  padding: 2rem 1.5rem;
  color: var(--text);
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
  border: 2px solid var(--highlight);
  box-shadow: 0 0 8px var(--highlight);
  background: var(--background);
}

.greeting-text h1 {
  font-size: 1.5rem;
  margin: 0;
  margin-bottom: 0.5rem;
  font-weight: 800;
  color: var(--primary);
  letter-spacing: 1px;
  text-shadow: 0 0 8px var(--highlight);
}

.greeting-text p {
  margin: 0;
  color: var(--highlight);
}

.summary-actions {
  display: flex;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.action-button {
  padding: 0.6rem 1.2rem;
  background: var(--highlight);
  color: var(--background);
  border: 1.5px solid var(--primary);
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 8px var(--highlight);
}

.action-button i {
  margin-right: 0.5rem;
}

.action-button:hover {
  background: var(--primary);
  color: var(--background);
  border-color: var(--highlight);
  box-shadow: 0 0 12px var(--primary);
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