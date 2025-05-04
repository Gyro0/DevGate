<template>
  <div class="row g-4">
    <div class="col-md-3" v-for="(value, label, index) in stats" :key="index">
      <div class="card text-center shadow-sm border-0">
        <div class="card-body">
          <h5 class="card-title text-primary">{{ value }}</h5>
          <p class="card-text text-muted">{{ label }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  stats: {
    type: Object,
    required: true,
  },
});
</script>

<style scoped>
.card {
  border-radius: 8px;
}
.card-title {
  font-size: 1.5rem;
  font-weight: bold;
}
.card-text {
  font-size: 0.9rem;
  color: #6c757d;
}
</style>