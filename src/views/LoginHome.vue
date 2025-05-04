<template>
  <div class="login-view">
    <div class="login-container">
      <div class="logo-container">
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
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--background);
  padding: 1rem;
}

.login-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
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
}

.logo-container {
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
}

.auth-tabs button {
  flex: 1;
  background: none;
  border: none;
  border-bottom: 2.5px solid transparent;
  padding: 0.75rem 0.5rem;
  margin-bottom: -1px;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
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
}

.auth-form {
  /* No change needed here, handled by child components */
}
</style>