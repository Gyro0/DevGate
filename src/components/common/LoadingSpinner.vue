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
<<<<<<< HEAD
  background-color: rgba(22, 27, 34, 0.85); /* Use dark background with some transparency */
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 999; /* Ensure it's above other content */
}

.spinner {
  border: 4px solid rgba(63, 208, 212, 0.15);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  border-left-color: var(--primary);
  border-top-color: var(--secondary);
  background: transparent;
  box-shadow: 0 0 16px var(--highlight);
  animation: spin 1s ease infinite;
}

@keyframes spin {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
=======
  background-color: rgba(255, 255, 255, 0.7); /* Semi-transparent background */
  z-index: 1050; /* Ensure it's above other content */
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
</style>