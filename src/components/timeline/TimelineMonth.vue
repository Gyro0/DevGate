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
  padding-bottom: 1.5rem; /* Space between items */
}

.event-item:last-child {
  padding-bottom: 0;
}

.event-item:last-child .marker-line {
  display: none; /* Hide line for the last item */
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
  z-index: 1; /* Ensure icon is above the line */
}

.marker-icon i {
  font-size: 0.875rem;
}

.event-skill { background-color: #dbeafe; color: #3b82f6; }
.event-project { background-color: #fef3c7; color: #d97706; }
.event-objective { background-color: #dcfce7; color: #10b981; }

.marker-line {
  width: 2px;
  background-color: #e5e7eb;
  flex-grow: 1;
  margin-top: 4px; /* Start line below the icon */
}

.event-details {
  flex: 1;
  background-color: white;
  padding: 0.75rem 1rem;
  border-radius: 6px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
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
  color: #111827;
}

.event-time {
  font-size: 0.75rem;
  color: #6b7280;
  white-space: nowrap;
  margin-left: 1rem;
}

.event-body {
  font-size: 0.875rem;
  color: #4b5563;
  line-height: 1.5;
}
</style>