<template>
  <div class="timeline-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar :active-page="'timeline'" />
      
      <div class="content-area">
        <div class="page-header">
          <h1>My Activity Timeline</h1>
        </div>
        
        <div class="filter-bar">
          <TimelineFilter v-model="activeFilters" />
        </div>
        
        <div v-if="loading" class="loading-container">
          <LoadingSpinner />
        </div>
        
        <div v-else-if="filteredMonths.length === 0" class="empty-state">
          <p>No activity found. Start adding skills or projects to see your timeline!</p>
        </div>
        
        <div v-else class="timeline-content">
          <div 
            v-for="month in filteredMonths"
            :key="month.id"
            class="timeline-month"
          >
            <h2 class="month-title">{{ month.name }}</h2>
            <TimelineMonth :month="month" />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import TimelineFilter from '@/components/timeline/TimelineFilter.vue';
import TimelineMonth from '@/components/timeline/TimelineMonth.vue'; // Corrected component name casing
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'TimelineView',
  components: {
    AppHeader,
    AppSidebar,
    TimelineFilter,
    TimelineMonth, // Corrected component name casing
    LoadingSpinner
  },
  setup() {
    const { events, loading, eventsByMonth, fetchUserTimeline, eventTypes } = useTimeline(); // Added eventTypes if needed by filter
    const activeFilters = ref([]); // This will be v-model for TimelineFilter

    // Filter timeline months based on selected filters
    const filteredMonths = computed(() => {
      if (!activeFilters.value.length) return eventsByMonth.value;
      
      return eventsByMonth.value.map(month => {
        const filteredEvents = month.events.filter(event => 
          activeFilters.value.includes(event.type)
        );
        
        // Return a new object for the month with filtered events
        return {
          ...month,
          events: filteredEvents
        };
      }).filter(month => month.events.length > 0); // Filter out months with no matching events
    });

    // Fetch timeline data on component mount
    onMounted(async () => {
      await fetchUserTimeline(100); // Get up to 100 timeline events
    });

    // Return reactive state and methods
    return {
      events, // Raw events if needed
      loading,
      eventsByMonth, // Original grouped events if needed
      filteredMonths, // Use this in the template's v-for
      activeFilters,
      eventTypes // Pass to TimelineFilter if it doesn't use the composable itself
    };
  }
}
</script>

<style scoped>
.timeline-view {
  min-height: 100vh;
  background-color: #f8f9fa;
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 64px);
}

.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.page-header {
  margin-bottom: 1.5rem;
}

.filter-bar {
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.timeline-content {
  padding-bottom: 2rem;
}

.timeline-month {
  margin-bottom: 2rem;
}

.month-title {
  margin-bottom: 1rem;
  font-size: 1.25rem;
  color: #4b5563;
  border-bottom: 1px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.loading-container {
  display: flex;
  justify-content: center;
  padding: 3rem 0;
}

.empty-state {
  text-align: center;
  padding: 3rem 0;
  color: #6b7280;
}
</style>