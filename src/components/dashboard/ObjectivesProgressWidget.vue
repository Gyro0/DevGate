<template>
  <div class="card objectives-widget shadow-sm">
    <!-- Header -->
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="h5 mb-0 text-primary">Objectives</h2>
      <router-link to="/objectives" class="btn btn-link p-0 text-decoration-none text-secondary">
        View All
      </router-link>
    </div>

    <!-- Content -->
    <div class="card-body">
      <!-- Loading State -->
      <div v-if="loading" class="text-center py-5">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
        <p class="mt-3 text-muted">Loading objectives...</p>
      </div>

      <!-- Objectives Content -->
      <div v-else>
        <div v-if="objectives.length > 0">
          <!-- Progress Overview -->
          <div class="mb-4">
            <div class="d-flex justify-content-between small text-muted mb-1">
              <span>{{ completionPercentage }}% Complete</span>
            </div>
            <div class="progress">
              <div
                class="progress-bar bg-primary"
                role="progressbar"
                :style="{ width: `${completionPercentage}%` }"
                :aria-valuenow="completionPercentage"
                aria-valuemin="0"
                aria-valuemax="100"
              ></div>
            </div>
          </div>

          <!-- Objectives Stats -->
          <div class="row text-center mb-4">
            <div class="col">
              <div class="h5 text-primary">{{ objectives.length }}</div>
              <div class="small text-muted">Total</div>
            </div>
            <div class="col">
              <div class="h5 text-success">{{ completedObjectives.length }}</div>
              <div class="small text-muted">Complete</div>
            </div>
            <div class="col">
              <div class="h5 text-info">{{ inProgressObjectives.length }}</div>
              <div class="small text-muted">In Progress</div>
            </div>
          </div>

          <!-- Current Goals -->
          <h3 class="h6 text-dark mb-3">Current Goals</h3>
          <ul class="list-group">
            <li
              v-for="objective in activeObjectives"
              :key="objective.id"
              class="list-group-item d-flex justify-content-between align-items-center"
            >
              <div>
                <div class="fw-bold">{{ objective.title }}</div>
                <div class="small text-muted">
                  <span v-if="objective.deadline">
                    <i class="fas fa-calendar-alt me-1"></i>
                    Due {{ formatDate(objective.deadline) }}
                  </span>
                </div>
              </div>
              <div class="d-flex align-items-center">
                <div class="progress me-2" style="width: 100px;">
                  <div
                    class="progress-bar bg-info"
                    role="progressbar"
                    :style="{ width: `${objective.progress}%` }"
                    :aria-valuenow="objective.progress"
                    aria-valuemin="0"
                    aria-valuemax="100"
                  ></div>
                </div>
                <span class="small text-muted">{{ objective.progress }}%</span>
              </div>
            </li>
          </ul>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="fas fa-bullseye fa-3x text-muted mb-3"></i>
          <h3 class="h6 text-dark">No objectives yet</h3>
          <p class="text-muted">Set clear objectives to guide your development journey.</p>
          <router-link to="/objectives" class="btn btn-primary">
            <i class="fas fa-plus me-2"></i> Add Objective
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import useObjectives from '@/composables/useObjectives';

export default {
  name: 'ObjectivesProgressWidget',
  setup() {
    const { objectives, loading } = useObjectives();

    // Computed properties
    const completedObjectives = computed(() => {
      return objectives.value.filter((o) => o.status === 'completed');
    });

    const inProgressObjectives = computed(() => {
      return objectives.value.filter((o) => o.status === 'in-progress');
    });

    const activeObjectives = computed(() => {
      // Sort in-progress first, then planned, limit to 4
      return [...inProgressObjectives.value, ...objectives.value.filter((o) => o.status === 'planned')]
        .sort((a, b) => {
          // Sort by deadline if available
          if (a.deadline && b.deadline) {
            const dateA = a.deadline?.seconds ? new Date(a.deadline.seconds * 1000) : new Date(a.deadline);
            const dateB = b.deadline?.seconds ? new Date(b.deadline.seconds * 1000) : new Date(b.deadline);
            return dateA - dateB;
          }
          return 0;
        })
        .slice(0, 4);
    });

    const completionPercentage = computed(() => {
      if (objectives.value.length === 0) return 0;
      return Math.round((completedObjectives.value.length / objectives.value.length) * 100);
    });

    // Format date for display
    const formatDate = (timestamp) => {
      if (!timestamp) return 'No deadline';

      const date = timestamp?.seconds ? new Date(timestamp.seconds * 1000) : new Date(timestamp);

      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    };

    return {
      objectives,
      loading,
      completedObjectives,
      inProgressObjectives,
      activeObjectives,
      completionPercentage,
      formatDate,
    };
  },
};
</script>

<style scoped>
/* No additional custom styles needed as Bootstrap is used */
</style>