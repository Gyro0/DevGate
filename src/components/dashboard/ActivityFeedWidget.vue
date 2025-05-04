<template>
  <div class="activity-feed-widget">
    <div class="widget-header">
      <h2>Recent Activity</h2>
      <router-link to="/timeline" class="view-all">View All</router-link>
    </div>
    
    <div class="feed-content" v-if="!loading">
      <div v-if="events && events.length > 0" class="feed-list-container">
        <ul class="feed-list">
          <li v-for="event in recentEvents" :key="event.id" class="feed-item">
            <div class="event-icon" :class="eventTypeClass(event)">
              <i :class="eventTypeIcon(event)"></i>
            </div>
            <div class="event-details">
              <div class="event-description">
                {{ formatEventDescription(event) }}
              </div>
              <div class="event-time">
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
          return 'event-default';
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
  height: 100%; /* Ensure widget fills grid cell */
  display: flex;
  flex-direction: column;
  background: var(--surface-card); /* Use card background */
  border-radius: 12px; /* Consistent radius */
  border: 1px solid var(--border-color);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  padding: 1.5rem; /* Consistent padding */
  color: var(--text);
  overflow: hidden; /* Prevent content overflow */
}

.widget-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  flex-shrink: 0;
}

.widget-header h2 {
  margin: 0;
  font-size: 1.1rem; /* Consistent header size */
  font-weight: 600; /* Consistent weight */
  color: var(--text-primary); /* Use primary text color */
}

.view-all {
  font-size: 0.85rem; /* Consistent link size */
  color: var(--primary); /* Use primary color */
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s;
}

.view-all:hover {
  color: var(--primary-hover); /* Use hover variable */
  text-decoration: underline;
}

/* Renamed from activities-content for consistency */
.feed-content {
  flex: 1; /* Allow content to grow */
  overflow: hidden; /* Hide overflow, inner container will scroll */
  display: flex; /* Use flex for layout */
  flex-direction: column; /* Stack list/empty state */
}

/* Renamed from activity-list-container */
.feed-list-container {
  flex: 1; /* Allow list container to grow */
  overflow-y: auto; /* Enable scrolling for the list */
  margin: 0 -0.5rem; /* Negative margin to counteract item padding */
  padding: 0 0.5rem; /* Padding to contain items */
  /* Custom scrollbar styling (optional) */
  scrollbar-width: thin;
  scrollbar-color: var(--primary-light) var(--surface-ground);
}
/* Webkit scrollbar styling */
.feed-list-container::-webkit-scrollbar { width: 6px; }
.feed-list-container::-webkit-scrollbar-track { background: var(--surface-ground); border-radius: 3px; }
.feed-list-container::-webkit-scrollbar-thumb { background-color: var(--primary-light); border-radius: 3px; }

/* Renamed from activity-list */
.feed-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

/* Renamed from activity-item */
.feed-item {
  display: flex;
  align-items: flex-start; /* Align icon and text to top */
  padding: 0.85rem 0.5rem; /* Adjust padding */
  border-bottom: 1px solid var(--border-color);
  gap: 1rem; /* Space between icon and details */
}
.feed-item:last-child {
  border-bottom: none;
}

/* Renamed from activity-icon */
.event-icon {
  flex-shrink: 0;
  width: 32px; /* Consistent icon container size */
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.9rem; /* Icon size */
  margin-top: 0.1rem; /* Align icon slightly lower */
}
/* Use consistent status colors/variables */
.event-skill { background-color: var(--info-light, #cfe2ff); color: var(--info-dark, #0a58ca); }
.event-project { background-color: var(--primary-light, #e0cffc); color: var(--primary-dark, #6f42c1); }
.event-objective { background-color: var(--success-light, #d1e7dd); color: var(--success-dark, #146c43); }
.event-default { background-color: var(--secondary-light, #e2e3e5); color: var(--secondary-dark, #495057); } /* Fallback */

/* Renamed from activity-details */
.event-details {
  flex: 1; /* Take remaining space */
  min-width: 0; /* Prevent overflow issues */
}

/* Renamed from activity-description */
.event-description {
  font-size: 0.9rem; /* Consistent font size */
  color: var(--text-primary);
  line-height: 1.4;
  margin-bottom: 0.25rem;
  /* Removed text overflow for now, can be added back if needed */
  /* white-space: nowrap; */
  /* overflow: hidden; */
  /* text-overflow: ellipsis; */
}
/* Optional: Highlight parts of the description */
.event-description strong {
  font-weight: 600;
  color: var(--primary);
}

/* Renamed from activity-time */
.event-time {
  font-size: 0.8rem; /* Consistent smaller time */
  color: var(--text-secondary);
}

/* Loading/Empty States (Consistent style) */
.loading-state, .empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex: 1; /* Take remaining space */
  padding: 1.5rem;
  text-align: center;
  color: var(--text-secondary);
}

.spinner {
  width: 28px;
  height: 28px;
  border: 3px solid var(--primary-light);
  border-radius: 50%;
  border-top-color: var(--primary);
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.empty-icon {
  font-size: 2.5rem; /* Consistent icon size */
  margin-bottom: 1rem;
  color: var(--text-disabled); /* Consistent color */
}

.empty-state h3, .empty-state p {
  margin-bottom: 1rem;
}
.empty-state h3 {
  font-size: 1rem; /* Consistent empty state header */
  font-weight: 600;
  color: var(--text-primary);
}
.empty-state p {
  font-size: 0.9rem; /* Consistent empty state text */
  max-width: 300px; /* Limit width */
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>