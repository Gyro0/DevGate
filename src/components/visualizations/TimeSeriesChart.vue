<template>
  <div class="time-series-chart card shadow-sm border-0">
    <!-- Card Header -->
    <div class="card-header bg-light">
      <h5 class="card-title mb-0">Time Series Chart</h5>
    </div>

    <!-- Card Body -->
    <div class="card-body d-flex justify-content-center align-items-center">
      <div v-if="loading" class="text-center">
        <div class="spinner-border text-primary" role="status">
          <span class="visually-hidden">Loading...</span>
        </div>
      </div>
      <div v-else>
        <canvas ref="chartCanvas"></canvas>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'TimeSeriesChart',
  props: {
    loading: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<style scoped>
.time-series-chart {
  border-radius: 8px;
  overflow: hidden;
}

.card-body {
  height: 300px;
}
</style>