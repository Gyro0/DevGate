<template>
  <div class="card shadow-sm p-4">
    <!-- Greeting Section -->
    <div class="d-flex align-items-center mb-4">
      <div class="me-3">
        <img
          :src="user?.photoURL || '/default-avatar.png'"
          alt="Profile"
          class="rounded-circle"
          style="width: 64px; height: 64px; object-fit: cover;"
        />
      </div>
      <div>
        <h1 class="h5 mb-1">👋 {{ getCurrentGreeting() }}, {{ user?.displayName || 'Developer' }}</h1>
        <p class="text-muted mb-0">Last activity: {{ lastActivity }}</p>
      </div>
    </div>

    <!-- Summary Actions -->
    <div class="d-flex gap-2 mb-4">
      <button class="btn btn-outline-primary d-flex align-items-center" @click="navigateTo('/skills')">
        <i class="fas fa-plus me-2"></i> Add Skill
      </button>
      <button class="btn btn-outline-primary d-flex align-items-center" @click="navigateTo('/projects')">
        <i class="fas fa-plus me-2"></i> Add Project
      </button>
      <button class="btn btn-outline-primary d-flex align-items-center" @click="navigateTo('/objectives')">
        <i class="fas fa-plus me-2"></i> New Objective
      </button>
    </div>

    <!-- Tips Section -->
    <div v-if="showTips" class="alert alert-info d-flex align-items-center">
      <i class="fas fa-lightbulb me-3"></i>
      <div class="flex-grow-1">
        <p class="mb-1">{{ currentTip }}</p>
        <button class="btn btn-link p-0 text-decoration-none" @click="nextTip">
          Next tip <i class="fas fa-chevron-right ms-1"></i>
        </button>
      </div>
      <button class="btn-close" @click="closeTip"></button>
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
    const lastActivity = ref('Just now'); // Example value for "lastActivity"
    const showTips = ref(true); // Example value for "showTips"
    const currentTip = ref('Remember to update your skills regularly.');

    // Get current time for greeting
    const getCurrentGreeting = () => {
      const hour = new Date().getHours();
      if (hour < 12) return 'Good morning';
      if (hour < 18) return 'Good afternoon';
      return 'Good evening';
    };

    const navigateTo = (path) => {
      // Example navigation logic
      console.log(`Navigating to ${path}`);
    };

    const nextTip = () => {
      currentTip.value = 'Keep track of your projects to showcase your progress.';
    };

    const closeTip = () => {
      showTips.value = false;
    };

    return {
      user,
      lastActivity,
      showTips,
      currentTip,
      getCurrentGreeting,
      navigateTo,
      nextTip,
      closeTip,
    };
  },
};
</script>

<style scoped>
/* No additional custom styles needed as Bootstrap is used */
</style>