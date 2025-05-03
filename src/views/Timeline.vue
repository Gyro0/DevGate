<template>
  <div class="timeline-view">
    <!-- Header and sidebar remain the same -->
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
        
        <!-- Summary Chart Section -->
        <div class="timeline-chart-section">
          <div class="chart-card">
            <h3>Activity Overview</h3>
            <ActivityTimelineChart :events="events" />
          </div>
        </div>
        
        <div v-if="loading" class="loading-container">
          <LoadingSpinner />
        </div>
        
        <div v-else-if="filteredMonths.length === 0" class="empty-state">
          <p>No activity found. Start adding skills or projects to see your timeline!</p>
          <div class="action-buttons">
            <router-link to="/skills" class="action-btn">Add Skills</router-link>
            <router-link to="/projects" class="action-btn">Add Projects</router-link>
            <router-link to="/objectives" class="action-btn">Add Objectives</router-link>
          </div>
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
import { ref, computed, onMounted, watch } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import TimelineFilter from '@/components/timeline/TimelineFilter.vue';
import TimelineMonth from '@/components/timeline/TimelineMonth.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import ActivityTimelineChart from '@/components/visualizations/ActivityTimelineChart.vue';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'TimelineView',
  components: {
    AppHeader,
    AppSidebar,
    TimelineFilter,
    TimelineMonth,
    LoadingSpinner,
    ActivityTimelineChart
  },
  setup() {
    const { 
      events, 
      loading, 
      eventsByMonth, 
      fetchUserTimeline, 
      eventTypes, 
      backfillTimelineEvents,
      generateSampleTimelineData
    } = useTimeline();
    
    // Initialize with all filter types selected
    const activeFilters = ref(['skill', 'project', 'objective']);

    // Filter timeline months based on selected filters
    const filteredMonths = computed(() => {
      if (!eventsByMonth.value || eventsByMonth.value.length === 0) {
        console.log("No timeline months available");
        return [];
      }
      
      if (activeFilters.value.length === 0) {
        // If no filters are active, show all event types
        return eventsByMonth.value;
      }
      
      return eventsByMonth.value.map(month => {
        const filteredEvents = month.events.filter(event => 
          activeFilters.value.includes(event.type)
        );
        
        return {
          ...month,
          events: filteredEvents
        };
      }).filter(month => month.events.length > 0);
    });

    // Helper functions for timeline data (still useful to have but won't show UI buttons)
    const backfillEvents = async () => {
      try {
        console.log("Starting backfill process");
        const count = await backfillTimelineEvents();
        console.log(`Successfully imported ${count} events from existing data`);
      } catch (err) {
        console.error("Error during backfill:", err);
      }
    };
    
    const generateSampleData = async () => {
      try {
        await generateSampleTimelineData();
        console.log("Sample timeline data generated successfully");
      } catch (err) {
        console.error("Error generating sample data:", err);
      }
    };

    // Fetch timeline data and automatically backfill if needed
    onMounted(async () => {
      console.log("Timeline: Fetching timeline data");
      loading.value = true;
      
      try {
        // First, try to get existing timeline events
        await fetchUserTimeline(100);
        console.log(`Timeline: Fetched ${events.value.length} events`);
        
        // If no events found, automatically backfill from existing data
        if (events.value.length === 0) {
          console.log("No timeline events found, automatically importing from existing data...");
          await backfillEvents();
          // Fetch again after backfill
          await fetchUserTimeline(100);
          console.log(`Timeline: After backfill, fetched ${events.value.length} events`);
        }
      } catch (error) {
        console.error("Error initializing timeline:", error);
      } finally {
        loading.value = false;
      }
    });

    // Watch for filter changes
    watch(activeFilters, (newFilters) => {
      console.log("Timeline: Active filters updated:", newFilters);
    });

    return {
      events,
      loading,
      eventsByMonth,
      filteredMonths,
      activeFilters,
      eventTypes,
      backfillEvents,
      generateSampleData
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

.timeline-chart-section {
  margin-bottom: 2rem;
}

.chart-card {
  background: white;
  border-radius: 8px;
  padding: 1.5rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  height: 300px;
}

.chart-card h3 {
  font-size: 1.125rem;
  font-weight: 600;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #374151;
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

.action-buttons {
  display: flex;
  justify-content: center;
  gap: 1rem;
  margin-top: 1.5rem;
}

.action-btn {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background-color: #4f46e5;
  color: white;
  border-radius: 0.375rem;
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: background-color 0.2s;
}

.action-btn:hover {
  background-color: #4338ca;
}
</style>