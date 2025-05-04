<template>
  <div class="loading-spinner-overlay d-flex justify-content-center align-items-center">
    <div class="spinner-border text-primary" role="status">
      <span class="visually-hidden">Loading...</span>
    </div>
  </div>
</template>

<style scoped>
.loading-spinner-overlay {
  position: fixed; /* Covers the entire screen */
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(255, 255, 255, 0.7); /* Semi-transparent background */
  z-index: 1050; /* Ensure it's above other content */
}
</style>