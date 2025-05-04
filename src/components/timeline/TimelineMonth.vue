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
}

.marker-icon {
  width: 32px;
  height: 32px;
  font-size: 0.875rem;
}

.marker-line {
  width: 2px;
  flex-grow: 1;
  margin-top: 4px;
}

.event-details {
  flex: 1;
}

.event-description {
  font-size: 0.875rem;
}

.event-time {
  font-size: 0.75rem;
}

.event-body {
  font-size: 0.875rem;
  line-height: 1.5;
}
</style>