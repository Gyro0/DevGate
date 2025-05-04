<template>
<<<<<<< HEAD
  <div class="timeline-view">
    <!-- Header and sidebar remain the same -->
=======
  <div class="timeline-view bg-light min-vh-100">
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-white p-0">
          <AppSidebar :active-page="'timeline'" />
        </div>
<<<<<<< HEAD
        
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
=======

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 py-4">
          <!-- Page Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h4 fw-bold">My Activity Timeline</h1>
          </div>

          <!-- Filter Bar -->
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
              <TimelineFilter v-model="activeFilters" />
            </div>
          </div>

          <!-- Loading State -->
          <div v-if="loading" class="d-flex justify-content-center py-5">
            <LoadingSpinner />
          </div>

          <!-- Empty State -->
          <div v-else-if="filteredMonths.length === 0" class="text-center py-5">
            <p class="text-muted">No activity found. Start adding skills or projects to see your timeline!</p>
          </div>

          <!-- Timeline Content -->
          <div v-else class="timeline-content">
            <div
              v-for="month in filteredMonths"
              :key="month.id"
              class="timeline-month mb-4"
            >
              <h2 class="month-title fw-bold text-primary">{{ month.name }}</h2>
              <TimelineMonth :month="month" />
            </div>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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
<<<<<<< HEAD
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
=======
  },
  setup() {
    const { events, loading, eventsByMonth, fetchUserTimeline } = useTimeline();
    const activeFilters = ref([]);
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8

    const filteredMonths = computed(() => {
<<<<<<< HEAD
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
=======
      if (!activeFilters.value.length) return eventsByMonth.value;

      return eventsByMonth.value
        .map((month) => {
          const filteredEvents = month.events.filter((event) =>
            activeFilters.value.includes(event.type)
          );
          return {
            ...month,
            events: filteredEvents,
          };
        })
        .filter((month) => month.events.length > 0);
    });

    onMounted(async () => {
      await fetchUserTimeline(100);
    });

    return {
      loading,
      filteredMonths,
      activeFilters,
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    };
  },
};
</script>

<style scoped>
.timeline-view {
<<<<<<< HEAD
  min-height: 100vh;
  background-color: var(--bg-main);
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

.page-header h1 {
  color: var(--text-color);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.filter-bar {
  margin-bottom: 1.5rem;
  background: var(--card-bg);
  padding: 1rem;
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
}

.timeline-chart-section {
  margin-bottom: 2rem;
}

.chart-card {
  background: var(--card-bg);
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
  height: 300px;
}

.chart-card h3 {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
  color: var(--text-color);
=======
  background-color: #f8f9fa;
}

.card {
  border-radius: 8px;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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
<<<<<<< HEAD
  color: var(--text-color);
  border-bottom: 1px solid var(--border-color);
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
  color: var(--text-secondary);
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
  padding: 0.75rem 1.5rem;
  background-color: var(--primary-color);
  color: white;
  border-radius: 8px;
  font-size: 1rem;
  font-weight: 500;
  text-decoration: none;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.12);
  transition: all 0.3s ease;
}

.action-btn:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.18);
=======
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.text-muted {
  color: #6c757d !important;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
</style>