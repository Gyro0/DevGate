<template>
  <div class="activity-feed-widget">
    <div class="widget-header">
      <h2>Recent Activity</h2>
      <router-link to="/timeline" class="view-all">View All</router-link>
    </div>
    
    <div class="activities-content" v-if="!loading">
      <div v-if="events && events.length > 0" class="activity-list-container">
        <ul class="activity-list">
          <li v-for="event in recentEvents" :key="event.id" class="activity-item">
            <div class="activity-icon" :class="eventTypeClass(event)">
              <i :class="eventTypeIcon(event)"></i>
            </div>
            <div class="activity-details">
              <div class="activity-description">
                {{ formatEventDescription(event) }}
              </div>
              <div class="activity-time">
                {{ formatEventTime(event.timestamp) }}
              </div>
            </div>
          </li>
        </ul>
      </div>
      
      <div v-else class="empty-state">
        <div class="empty-icon">
          <i class="fas fa-clock"></i>
        </div>
        <h3>No activity yet</h3>
        <p>Your recent activities will appear here as you use the platform.</p>
      </div>
    </div>
    
    <div v-else class="loading-state">
      <div class="spinner"></div>
      <span>Loading activities...</span>
    </div>
  </div>
</template>

<script>
import { computed, onMounted } from 'vue';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'ActivityFeedWidget',
  setup() {
    const { events, loading, fetchUserTimeline } = useTimeline();

    // Ensure we have timeline data
    onMounted(async () => {
      if (!events.value || events.value.length === 0) {
        await fetchUserTimeline(10); // Fetch 10 most recent events
      }
    });

    // Get only recent events, with nullchecking
    const recentEvents = computed(() => {
      // Ensure events.value is an array before slicing
      return Array.isArray(events.value) ? events.value.slice(0, 6) : [];
    });

    // Format event time to relative time
    const formatEventTime = (timestamp) => {
      if (!timestamp) return '';
      
      const now = new Date();
      // Handle both Firebase Timestamp and standard Date objects
      const eventTime = timestamp instanceof Date 
        ? timestamp 
        : new Date(timestamp?.seconds ? timestamp.seconds * 1000 : timestamp);
      
      // Check if eventTime is a valid date
      if (isNaN(eventTime.getTime())) {
        return 'Invalid date';
      }

      // Get time difference in minutes
      const diffMinutes = Math.floor((now - eventTime) / (1000 * 60));
      
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;
      
      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;
      
      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;
      
      // For older dates, return the actual date
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

    // Get CSS class for event type
    const eventTypeClass = (event) => {
      switch (event?.type) {
        case 'skill':
          return 'event-skill';
        case 'project':
          return 'event-project';
        case 'objective':
          return 'event-objective';
        default:
          return '';
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
      eventTypeClass,
      eventTypeIcon
    };
  }
}
</script>

<style scoped>
.activity-feed-widget {
  height: 100%;
  display: flex;
  flex-direction: column;
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.widget-header h2 {
  margin: 0;
  font-size: 1.25rem;
  font-weight: 600;
}

.view-all {
  color: #4f46e5;
  text-decoration: none;
  font-size: 0.875rem;
}

.view-all:hover {
  text-decoration: underline;
}

.activities-content {
  flex: 1;
  overflow: hidden; /* Prevent content overflow */
}

.activity-list-container {
  height: 100%;
  overflow-y: auto; /* Allow scrolling if content exceeds height */
}

.activity-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.activity-item {
  display: flex;
  padding: 0.75rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.activity-item:last-child {
  border-bottom: none;
}

.activity-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-right: 1rem;
  flex-shrink: 0;
}

.activity-icon i {
  font-size: 0.875rem;
}

.event-skill {
  background-color: #dbeafe;
  color: #3b82f6;
}

.event-project {
  background-color: #fef3c7;
  color: #d97706;
}

.event-objective {
  background-color: #dcfce7;
  color: #10b981;
}

.activity-details {
  flex: 1;
  min-width: 0; /* Prevent text overflow issues */
}

.activity-description {
  font-size: 0.875rem;
  margin-bottom: 0.25rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.activity-time {
  font-size: 0.75rem;
  color: #6b7280;
}

.empty-state {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: 2rem 1rem;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 1rem;
  color: #d1d5db;
}

.empty-state h3 {
  margin: 0;
  margin-bottom: 0.5rem;
  font-size: 1.125rem;
  font-weight: 600;
}

.empty-state p {
  margin: 0;
  color: #6b7280;
  max-width: 24rem;
}

.loading-state {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  color: #6b7280;
  font-size: 0.875rem;
}

.spinner {
  border: 3px solid rgba(0, 0, 0, 0.1);
  border-top: 3px solid #4f46e5;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  animation: spin 1s linear infinite;
  margin-bottom: 0.5rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>