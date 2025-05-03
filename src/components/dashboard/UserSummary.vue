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
  padding: 0.6rem 1.2rem;
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: background-color 0.2s;
}

.action-button i {
  margin-right: 0.5rem;
}

.action-button:hover {
  background-color: #4338ca;
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