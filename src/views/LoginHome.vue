<template>
  <div class="login-view d-flex align-items-center justify-content-center bg-light vh-100">
    <div class="card login-container shadow-sm p-4">
      <!-- Logo Section -->
      <div class="text-center mb-4">
        <img src="@/assets/logo.png" alt="DevGate Logo" class="logo mb-3" />
        <h1 class="h4 fw-bold text-primary">DevGate</h1>
        <p class="text-muted">Track your developer journey</p>
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
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6; /* Light gray background */
}

/* Login container */
.login-container {
  width: 100%;
  max-width: 420px;
  padding: 1.5rem;
  border-radius: 10px;
  background-color: #ffffff; /* White background for the card */
}

/* Logo container */
.text-center {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 1rem;
}

/* Tabs for Login/Register */
.nav-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #d1d5db; /* Light gray border */
}

.nav-link {
  flex: 1;
  background: none;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  color: #6b7280; /* Neutral gray */
  transition: color 0.3s, border-bottom 0.3s;
}

.nav-link.active {
  color: #1e3a8a; /* Darker blue for active tab */
  border-bottom: 2px solid #1e3a8a; /* Underline for active tab */
  font-weight: 600;
}

/* Form container */
.auth-form {
  margin-top: 1.5rem;
}
</style>