<template>
  <div id="app">
    <router-view />
  </div>
</template>

<style>
#app {
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
}
</style>
