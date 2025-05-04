<template>
<<<<<<< HEAD
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow-lg login-form-wrapper w-100" style="max-width: 28rem;">
      <div class="form-header mb-4">
        <h2>Connexion à votre compte</h2>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="email" class="form-label visually-hidden">Email</label>
          <input
            id="email"
            v-model="email"
            name="email"
            type="email"
            required
            class="form-control mb-2"
            placeholder="Adresse email"
            autocomplete="username"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label visually-hidden">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            name="password"
            type="password"
            required
            class="form-control"
            placeholder="Mot de passe"
            autocomplete="current-password"
          />
        </div>
        <div class="d-grid gap-2 mb-3">
          <button
            type="submit"
            class="btn btn-primary btn-lg submit-button"
            :disabled="loading"
          >
            <span v-if="loading" class="loading-text">
              <span class="spinner-border spinner-border-sm me-2"></span>
              Chargement...
            </span>
            <span v-else>Se connecter</span>
          </button>
        </div>
        <div v-if="error" class="alert alert-warning py-2">
          {{ error }}
        </div>
        <div class="divider-section my-4">
          <div class="divider text-center mb-3">
            <span>Ou continuer avec</span>
          </div>
          <div class="d-flex justify-content-center gap-2 social-buttons">
            <SocialLoginButton provider="google" @success="handleSocialSuccess" />
            <SocialLoginButton provider="github" @success="handleSocialSuccess" />
          </div>
        </div>
      </form>
=======
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
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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
<<<<<<< HEAD
    const { login, error: authError, loading } = useAuth()
    const email = ref('')
    const password = ref('')
    const error = ref('')

    const handleSubmit = async () => {
      error.value = ''
      try {
        await login(email.value, password.value)
        emit('login-success')
      } catch (err) {
        error.value = err.message || 'Failed to login. Please check your credentials.'
        console.error('Login error:', err)
=======
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
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
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
<<<<<<< HEAD
</script>

<style scoped>
.login-form-wrapper {
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: 0 4px 32px 0 rgba(30, 203, 225, 0.08), 0 0 0 2px var(--highlight);
  border: 1.5px solid var(--border);
}
.form-header h2 {
  color: var(--primary);
  font-weight: 800;
  letter-spacing: 1px;
}
.form-control {
  background: var(--background);
  color: var(--text);
  border: 1px solid var(--highlight);
}
.form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--highlight);
  background: var(--surface);
  color: var(--text);
}
.submit-button {
  box-shadow: 0 0 8px var(--highlight);
  font-weight: 600;
  letter-spacing: 0.5px;
}
.divider span {
  color: var(--highlight);
  font-size: 0.95rem;
  background: var(--surface);
  padding: 0 1rem;
  border-radius: 1rem;
  border: 1px solid var(--border);
}
.social-buttons {
  gap: 1rem;
}
.alert-warning {
  background: linear-gradient(90deg, var(--secondary) 60%, var(--primary) 100%);
  color: var(--background);
  border: none;
  box-shadow: 0 0 8px var(--highlight);
}
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
</style>