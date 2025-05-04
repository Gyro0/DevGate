<template>
  <router-view/>
</template>

<script>
import useAuth from '@/composables/useAuth';

export default {
  setup() {
    // Initialize auth as soon as the app loads
    const { initAuth } = useAuth();
    
    // The actual initAuth() call happens when the composable is imported
    // so we don't need to call it again here
    
    return {};
  }
}
</script>

<style>
#app {
  font-family: 'Segoe UI', 'Avenir', Helvetica, Arial, sans-serif;
  color: var(--text);
  background: var(--background);
  min-height: 100vh;
  text-align: center;
  position: relative;
  z-index: 1;
}

/* Remove default nav styles, use Bootstrap's navbar instead */

/* Optional: add a subtle fade for router transitions */
.router-view {
  transition: opacity 0.3s;
}
</style>
