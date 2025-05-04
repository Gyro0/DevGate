<template>
  <div class="timeline-month-content">
    <ul class="event-list">
      <li v-for="event in month.events" :key="event.id" class="event-item">
        <div class="event-marker">
          <div class="marker-icon" :class="eventTypeClass(event)">
            <i :class="eventTypeIcon(event)"></i>
          </div>
          <div class="marker-line"></div>
        </div>
        <div class="event-details">
          <div class="event-header">
            <span class="event-description">{{ formatEventDescription(event) }}</span>
            <span class="event-time">{{ formatEventTime(event.timestamp) }}</span>
          </div>
          <div v-if="event.entityData?.description" class="event-body">
            {{ truncate(event.entityData.description, 100) }}
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { defineProps } from 'vue'; // Keep import

export default {
  name: 'TimelineMonth',
  props: {
    month: {
      type: Object,
      required: true
    }
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

    // Format event description (assuming logic will be added later)
    const formatEventDescription = (event) => {
      if (!event) return '';
      // Placeholder for actual formatting logic
      return `${event.type} ${event.action}: ${event.entityData?.title || event.entityData?.name || event.entityId}`;
    };

    // Helper function for truncating text (if needed in template)
    const truncate = (text, length) => {
        if (!text) return '';
        return text.length > length ? text.substring(0, length) + '...' : text;
    };

    // Helper for icon class (assuming logic will be added later)
    const eventTypeIcon = (event) => {
        const icons = {
            skill: 'fas fa-star',
            project: 'fas fa-folder',
            objective: 'fas fa-bullseye',
        };
        return icons[event.type] || 'fas fa-question-circle';
    };

    // Helper for icon background class (assuming logic will be added later)
    const eventTypeClass = (event) => {
        const classes = {
            skill: 'bg-yellow-100 text-yellow-800', // Example Tailwind classes
            project: 'bg-blue-100 text-blue-800',
            objective: 'bg-green-100 text-green-800',
        };
        return classes[event.type] || 'bg-gray-100 text-gray-800';
    };


    // Return methods needed in template
    return {
      formatEventTime,
      formatEventDescription,
      truncate,
      eventTypeIcon,
      eventTypeClass
    };
  }
}
</script>

<style scoped>
.timeline-month-content {
  position: relative;
}

.event-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.event-item {
  display: flex;
  position: relative;
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
}

.marker-icon {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1;
  background-color: var(--bg-darker);
  border: 1px solid var(--border-color);
}

.marker-icon i {
  font-size: 0.875rem;
  color: var(--primary-color);
}

.event-skill { background-color: var(--skill-bg); color: var(--skill-color); }
.event-project { background-color: var(--project-bg); color: var(--project-color); }
.event-objective { background-color: var(--objective-bg); color: var(--objective-color); }

.marker-line {
  width: 2px;
  background-color: var(--border-color);
  flex-grow: 1;
  margin-top: 4px;
}

.event-details {
  flex: 1;
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
}

.event-description {
  font-weight: 500;
  font-size: 0.875rem;
  color: var(--text-color);
}

.event-time {
  font-size: 0.75rem;
  color: var(--text-secondary);
  white-space: nowrap;
  margin-left: 1rem;
}

.event-body {
  font-size: 0.875rem;
  color: var(--text-secondary);
  line-height: 1.5;
}
</style>