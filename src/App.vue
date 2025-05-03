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
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}

nav {
  padding: 30px;
}

nav a {
  font-weight: bold;
  color: #2c3e50;
}

nav a.router-link-exact-active {
  color: #42b983;
}
</style>
