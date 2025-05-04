<template>
  <div class="timeline-month-content">
    <ul class="event-list list-unstyled">
      <li v-for="event in month.events" :key="event.id" class="event-item d-flex mb-4">
        <!-- Event Marker -->
        <div class="event-marker d-flex flex-column align-items-center me-3">
          <div class="marker-icon rounded-circle d-flex align-items-center justify-content-center" :class="eventTypeClass(event)">
            <i :class="eventTypeIcon(event)"></i>
          </div>
          <div v-if="!isLastEvent(event)" class="marker-line bg-secondary"></div>
        </div>

        <!-- Event Details -->
        <div class="event-details bg-white p-3 rounded shadow-sm">
          <div class="event-header d-flex justify-content-between align-items-center mb-2">
            <span class="event-description fw-semibold text-truncate">{{ formatEventDescription(event) }}</span>
            <span class="event-time text-muted small">{{ formatEventTime(event.timestamp) }}</span>
          </div>
          <div v-if="event.entityData?.description" class="event-body text-muted small">
            {{ truncate(event.entityData.description, 100) }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineProps } from 'vue';

export default {
  name: 'TimelineMonth',
  props: {
    month: {
      type: Object,
      required: true,
    },
  },
  setup(props) {
    // Format event time to relative time or date
    const formatEventTime = (timestamp) => {
      if (!timestamp) return '';
      const now = new Date();
      const eventTime = timestamp instanceof Date
        ? timestamp
        : new Date(timestamp.seconds ? timestamp.seconds * 1000 : timestamp);

      const diffMinutes = Math.floor((now - eventTime) / (1000 * 60));
      if (diffMinutes < 1) return 'Just now';
      if (diffMinutes < 60) return `${diffMinutes}m ago`;

      const diffHours = Math.floor(diffMinutes / 60);
      if (diffHours < 24) return `${diffHours}h ago`;

      const diffDays = Math.floor(diffHours / 24);
      if (diffDays < 7) return `${diffDays}d ago`;

      return eventTime.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    // Format event description
    const formatEventDescription = (event) => {
      if (!event) return '';
      return `${event.type} ${event.action}: ${event.entityData?.title || event.entityData?.name || event.entityId}`;
    };

    // Helper function for truncating text
    const truncate = (text, length) => {
      if (!text) return '';
      return text.length > length ? text.substring(0, length) + '...' : text;
    };

    // Helper for icon class
    const eventTypeIcon = (event) => {
      const icons = {
        skill: 'fas fa-star',
        project: 'fas fa-folder',
        objective: 'fas fa-bullseye',
      };
      return icons[event.type] || 'fas fa-question-circle';
    };

    // Helper for icon background class
    const eventTypeClass = (event) => {
      const classes = {
        skill: 'bg-warning text-dark',
        project: 'bg-primary text-white',
        objective: 'bg-success text-white',
      };
      return classes[event.type] || 'bg-secondary text-white';
    };

    // Check if the event is the last in the list
    const isLastEvent = (event) => {
      return props.month.events[props.month.events.length - 1] === event;
    };

    return {
      formatEventTime,
      formatEventDescription,
      truncate,
      eventTypeIcon,
      eventTypeClass,
      isLastEvent,
    };
  },
};
</script>

<style scoped>
.timeline-month-content {
  position: relative;
}

.event-item {
  position: relative;
<<<<<<< HEAD
  padding-bottom: 1.5rem;
}

.event-item:last-child {
  padding-bottom: 0;
}

.event-item:last-child .marker-line {
  display: none;
}

.event-marker {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 1rem;
  flex-shrink: 0;
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.marker-icon {
  width: 32px;
  height: 32px;
<<<<<<< HEAD
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background-color: var(--bg-darker);
  border: 1px solid var(--border-color);
}

.marker-icon i {
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
  font-size: 0.875rem;
  color: var(--primary-color);
}

<<<<<<< HEAD
.event-skill { background-color: var(--skill-bg); color: var(--skill-color); }
.event-project { background-color: var(--project-bg); color: var(--project-color); }
.event-objective { background-color: var(--objective-bg); color: var(--objective-color); }

.marker-line {
  width: 2px;
  background-color: var(--border-color);
=======
.marker-line {
  width: 2px;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
  flex-grow: 1;
  margin-top: 4px;
}

.event-details {
  flex: 1;
<<<<<<< HEAD
  background-color: var(--card-bg);
  padding: 0.75rem 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
}

.event-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 0.5rem;
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.event-description {
  font-size: 0.875rem;
<<<<<<< HEAD
  color: var(--text-color);
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.event-time {
  font-size: 0.75rem;
<<<<<<< HEAD
  color: var(--text-secondary);
  white-space: nowrap;
  margin-left: 1rem;
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.event-body {
  font-size: 0.875rem;
<<<<<<< HEAD
  color: var(--text-secondary);
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
  line-height: 1.5;
}
</style>