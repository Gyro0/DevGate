<template>
<<<<<<< HEAD
  <div class="login-view">
    <div class="login-container">
      <div class="logo-container">
        <h1>DevGate</h1>
        <p>Track your developer journey</p>
=======
  <div class="login-view d-flex align-items-center justify-content-center bg-light vh-100">
    <div class="card login-container shadow-sm p-4">
      <!-- Logo Section -->
      <div class="text-center mb-4">
        <img src="@/assets/logo.png" alt="DevGate Logo" class="logo mb-3" />
        <h1 class="h4 fw-bold text-primary">DevGate</h1>
        <p class="text-muted">Track your developer journey</p>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
      </div>

      <!-- Tabs for Login/Register -->
      <div>
        <div class="nav nav-tabs mb-3">
          <button
            class="nav-link w-50 text-center"
            :class="{ active: activeTab === 'login' }"
            @click="activeTab = 'login'"
          >
            Login
          </button>
          <button
            class="nav-link w-50 text-center"
            :class="{ active: activeTab === 'signup' }"
            @click="activeTab = 'signup'"
          >
            Register
          </button>
        </div>

        <!-- Login/Register Form -->
        <div>
          <Login v-if="activeTab === 'login'" @login-success="onLoginSuccess" />
          <Signin v-else @signup-success="onSignupSuccess" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import Login from '@/components/authentication/Login.vue';
import Signin from '@/components/authentication/Signin.vue';

const activeTab = ref('login');
const router = useRouter();

const onLoginSuccess = () => {
  router.push('/dashboard');
};

const onSignupSuccess = () => {
  router.push('/dashboard');
};
</script>

<style scoped>
/* General layout */
.login-view {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
<<<<<<< HEAD
  background: var(--background);
  padding: 1rem;
=======
  background-color: #f3f4f6; /* Light gray background */
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

/* Login container */
.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
<<<<<<< HEAD
  max-width: 520px;
  margin: 0 auto;
  background-color: var(--bg-main);
  padding: 2rem;
  box-sizing: border-box;
}

.login-content {
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  background-color: var(--card-bg);
  border-radius: 16px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
=======
  max-width: 420px;
  padding: 1.5rem;
  border-radius: 10px;
  background-color: #ffffff; /* White background for the card */
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

/* Logo container */
.text-center {
  text-align: center;
  margin-bottom: 2.5rem;
}

.logo-container h1 {
  font-size: 1.75rem;
  font-weight: 700;
  margin-top: 0.5rem;
  color: var(--primary);
  letter-spacing: 1px;
  text-shadow: 0 0 8px var(--highlight);
}

.logo-container p {
  color: var(--highlight);
  margin-top: 0.25rem;
  font-size: 1.1rem;
}

.logo {
  width: 70px;
  height: auto;
  margin-bottom: 0.5rem;
  filter: drop-shadow(0 0 8px var(--highlight));
}

<<<<<<< HEAD
.auth-card {
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: 0 4px 32px 0 rgba(30, 203, 225, 0.08), 0 0 0 2px var(--highlight);
  border: 1.5px solid var(--border);
  padding: 2rem 2.5rem;
  overflow: hidden;
}

.auth-tabs {
  display: flex;
  margin-bottom: 2rem;
  border-bottom: 1.5px solid var(--highlight);
=======
/* Tabs for Login/Register */
.nav-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #d1d5db; /* Light gray border */
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.nav-link {
  flex: 1;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  padding: 0.75rem 0.5rem;
  margin-bottom: -1px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
<<<<<<< HEAD
  color: var(--text);
  transition: color 0.2s, border-color 0.2s;
  text-align: center;
  border-radius: 0.5rem 0.5rem 0 0;
}

.auth-tabs button:hover {
  color: var(--primary);
  background: rgba(30, 203, 225, 0.04);
}

.auth-tabs button.active {
  color: var(--secondary);
  border-bottom-color: var(--secondary);
  font-weight: 700;
  background: rgba(255, 153, 0, 0.08);
  box-shadow: 0 2px 8px 0 var(--highlight);
=======
  color: #6b7280; /* Neutral gray */
  transition: color 0.3s, border-bottom 0.3s;
}

.nav-link.active {
  color: #1e3a8a; /* Darker blue for active tab */
  border-bottom: 2px solid #1e3a8a; /* Underline for active tab */
  font-weight: 600;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

/* Form container */
.auth-form {
  /* No change needed here, handled by child components */
}
</style>