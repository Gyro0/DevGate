<template>
  <div id="app">
    <router-view />
  </div>
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
<<<<<<< HEAD
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
=======
  font-family: 'Roboto', Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  background-color: #f8f9fa; /* Light background for the app */
  color: #343a40; /* Darker text for better readability */
  min-height: 100vh; /* Ensure the app takes the full viewport height */
}

nav {
  padding: 1rem;
  background-color: #ffffff; /* White background for the navbar */
  border-bottom: 1px solid #dee2e6; /* Subtle border for separation */
}

nav a {
  font-weight: 500;
  color: #007bff; /* Bootstrap primary color for links */
  text-decoration: none;
  margin-right: 1rem;
}

nav a:hover {
  color: #0056b3; /* Darker shade on hover */
}

nav a.router-link-exact-active {
  color: #28a745; /* Bootstrap success color for active links */
  font-weight: bold;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}
</style>
