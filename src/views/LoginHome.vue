<template>
  <div class="login-view">
    <div class="login-container">
      <div class="logo-container">
        <img src="@/assets/logo.png" alt="DevGate Logo" class="logo">
        <h1>DevGate</h1>
        <p>Track your developer journey</p>
      </div>
      
      <div class="auth-card">
        <div class="auth-tabs">
          <button 
            :class="{ 'active': activeTab === 'login' }" 
            @click="activeTab = 'login'"
          >
            Login
          </button>
          <button 
            :class="{ 'active': activeTab === 'signup' }" 
            @click="activeTab = 'signup'"
          >
            Register
          </button>
        </div>
        
        <div class="auth-form">
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
.login-view {
  min-height: 100vh; /* Use min-height for flexibility */
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f3f4f6; /* Slightly lighter gray */
  padding: 1rem; /* Add padding for smaller screens */
}

.login-container {
  width: 100%;
  max-width: 450px; /* Slightly wider */
}

.logo-container {
  text-align: center;
  margin-bottom: 2.5rem; /* Increased margin */
}

.logo-container h1 {
  font-size: 1.75rem; /* Larger heading */
  font-weight: 700;
  margin-top: 0.5rem;
  color: #1f2937; /* Darker text */
}

.logo-container p {
  color: #6b7280; /* Gray text */
  margin-top: 0.25rem;
}

.logo {
  width: 70px; /* Slightly smaller logo */
  height: auto;
  margin-bottom: 0.5rem; /* Reduced margin */
}

.auth-card {
  background: white;
  border-radius: 0.75rem; /* More rounded corners */
  box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05); /* Softer shadow */
  padding: 2rem 2.5rem; /* Adjust padding */
  overflow: hidden; /* Ensure content respects border radius */
}

.auth-tabs {
  display: flex;
  margin-bottom: 2rem; /* Increased spacing */
  border-bottom: 1px solid #e5e7eb; /* Lighter border */
}

.auth-tabs button {
  flex: 1;
  background: none;
  border: none;
  border-bottom: 2px solid transparent; /* Prepare for active border */
  padding: 0.75rem 0.5rem; /* Adjust padding */
  margin-bottom: -1px; /* Overlap border */
  font-size: 1rem;
  font-weight: 500; /* Medium weight */
  cursor: pointer;
  color: #6b7280;
  transition: color 0.2s ease-in-out, border-color 0.2s ease-in-out; /* Smooth transition */
  text-align: center;
}

.auth-tabs button:hover {
  color: #374151; /* Darker gray on hover */
}

.auth-tabs button.active {
  color: #4f46e5; /* Indigo color */
  border-bottom-color: #4f46e5; /* Indigo border */
  font-weight: 600; /* Bolder active tab */
}

.auth-form {
  /* No change needed here, handled by child components */
}
</style>