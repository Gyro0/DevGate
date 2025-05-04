<template>
  <div class="card activity-feed-widget shadow-sm">
    <!-- Header -->
    <div class="card-header d-flex justify-content-between align-items-center">
      <h2 class="h5 mb-0 text-primary">Recent Activity</h2>
      <router-link to="/timeline" class="btn btn-link p-0 text-decoration-none text-secondary">
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
        <p class="mt-3 text-muted">Loading activities...</p>
      </div>

      <!-- Activities Content -->
      <div v-else>
        <!-- Activity List -->
        <div v-if="events.length > 0" class="activity-list-container">
          <ul class="list-group">
            <li
              v-for="event in recentEvents"
              :key="event.id"
              class="list-group-item d-flex align-items-center"
            >
              <div class="activity-icon me-3 d-flex justify-content-center align-items-center rounded-circle bg-light">
                <i :class="eventTypeIcon(event)" class="text-primary"></i>
              </div>
              <div class="activity-details flex-grow-1">
                <div class="fw-bold text-dark">
                  {{ formatEventDescription(event) }}
                </div>
                <div class="small text-muted">
                  {{ formatEventTime(event.timestamp) }}
                </div>
              </div>
            </li>
          </ul>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-5">
          <i class="fas fa-clock fa-3x text-muted mb-3"></i>
          <h3 class="h6 text-dark">No activity yet</h3>
          <p class="text-muted">Your recent activities will appear here as you use the platform.</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'ActivityFeedWidget',
  setup() {
    const { events, loading } = useTimeline();

    // Get only recent events
    const recentEvents = computed(() => {
      return Array.isArray(events.value) ? events.value.slice(0, 6) : [];
    });

    // Format event time to relative time
    const formatEventTime = (timestamp) => {
      if (!timestamp) return '';
      const now = new Date();
      const eventTime = timestamp instanceof Date
        ? timestamp
        : new Date(timestamp?.seconds ? timestamp.seconds * 1000 : timestamp);
      if (isNaN(eventTime.getTime())) return 'Invalid date';
      const diffMinutes = Math.floor((now - eventTime) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      return eventTime.toLocaleDateString();
    };

    // Format event description
    const formatEventDescription = (event) => {
      if (!event) return '';
      const { type, action, entityData } = event;
      const name = entityData?.name || entityData?.title || 'item';
      switch (action) {
        case 'added':
          return `Added new ${type}: ${name}`;
        case 'updated':
          return `Updated ${type}: ${name}`;
        case 'completed':
          return `Completed ${type}: ${name}`;
        case 'deleted':
          return `Deleted ${type}: ${name}`;
        default:
          return `${action || 'Performed action on'} ${type}: ${name}`;
      }
    };

    // Get icon for event type
    const eventTypeIcon = (event) => {
      switch (event?.type) {
        case 'skill':
          return 'fas fa-chart-line';
        case 'project':
          return 'fas fa-code';
        case 'objective':
          return 'fas fa-bullseye';
        default:
          return 'fas fa-circle';
      }
    };

    return {
      events,
      loading,
      recentEvents,
      formatEventTime,
      formatEventDescription,
      eventTypeIcon,
    };
  },
};
</script>

<style scoped>
.activity-icon {
  width: 40px;
  height: 40px;
  font-size: 1.25rem;
}
</style>