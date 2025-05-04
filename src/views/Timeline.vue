<template>
  <div class="timeline-view bg-light min-vh-100">
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-white p-0">
          <AppSidebar :active-page="'timeline'" />
        </div>

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
import TimelineMonth from '@/components/timeline/TimelineMonth.vue';
import LoadingSpinner from '@/components/common/LoadingSpinner.vue';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'TimelineView',
  components: {
    AppHeader,
    AppSidebar,
    TimelineFilter,
    TimelineMonth,
    LoadingSpinner,
  },
  setup() {
    const { events, loading, eventsByMonth, fetchUserTimeline } = useTimeline();
    const activeFilters = ref([]);

    const filteredMonths = computed(() => {
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
    };
  },
};
</script>

<style scoped>
.timeline-view {
  background-color: #f8f9fa;
}

.card {
  border-radius: 8px;
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
  border-bottom: 2px solid #e5e7eb;
  padding-bottom: 0.5rem;
}

.text-muted {
  color: #6c757d !important;
}
</style>