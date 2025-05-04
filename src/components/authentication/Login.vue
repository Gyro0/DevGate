<template>
  <div class="container login-container card shadow-sm p-4">
    <h2 class="text-center mb-4">Login to Your Account</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="email" class="form-label">Email Address</label>
        <input
          id="email"
          v-model="email"
          type="email"
          class="form-control"
          placeholder="Enter your email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Password</label>
        <input
          id="password"
          v-model="password"
          type="password"
          class="form-control"
          placeholder="Enter your password"
          required
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="loading"
      >
        <span v-if="loading">Logging in...</span>
        <span v-else>Login</span>
      </button>
      <div v-if="error" class="text-danger text-center mt-3">
        {{ error }}
      </div>
    </form>
    <div class="mt-4 text-center">
      <p class="text-muted">Or login with</p>
      <div class="d-flex justify-content-center gap-2">
        <SocialLoginButton provider="google" @success="handleSocialSuccess" />
        <SocialLoginButton provider="github" @success="handleSocialSuccess" />
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import SocialLoginButton from './SocialLoginButton.vue';
import useAuth from '@/composables/useAuth';

export default {
  name: 'Login',
  components: {
    SocialLoginButton,
  },
  emits: ['login-success'],
  setup(props, { emit }) {
    const { login } = useAuth();
    const email = ref('');
    const password = ref('');
    const loading = ref(false);
    const error = ref('');

    const handleSubmit = async () => {
      error.value = '';
      loading.value = true;
      try {
        await login(email.value, password.value);
        emit('login-success');
      } catch (err) {
        error.value = err.message || 'Login failed';
      } finally {
        loading.value = false;
      }
    };

    const handleSocialSuccess = () => {
      emit('login-success');
    };

    return {
      email,
      password,
      loading,
      error,
      handleSubmit,
      handleSocialSuccess,
    };
  },
};
</script>

<style scoped>
.login-container {
  max-width: 400px;
  margin: 0 auto;
}
</style>