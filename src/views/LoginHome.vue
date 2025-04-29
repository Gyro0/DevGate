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
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #f5f7fa;
}

.login-container {
  width: 100%;
  max-width: 420px;
  padding: 1.5rem;
}

.logo-container {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  width: 80px;
  height: auto;
  margin-bottom: 1rem;
}

.auth-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  padding: 2rem;
}

.auth-tabs {
  display: flex;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid #e1e4e8;
}

.auth-tabs button {
  flex: 1;
  background: none;
  border: none;
  padding: 0.75rem;
  font-size: 1rem;
  cursor: pointer;
  color: #6b7280;
}

.auth-tabs button.active {
  color: #4f46e5;
  border-bottom: 2px solid #4f46e5;
  font-weight: 600;
}

.auth-form {
  margin-top: 1.5rem;
}
</style>