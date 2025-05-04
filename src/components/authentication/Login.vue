<template>
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
    </div>
  </div>
</template>

<script>
import useAuth from '@/composables/useAuth'
import { ref } from 'vue'
import SocialLoginButton from './SocialLoginButton.vue'

export default {
  name: 'Login',
  components: {
    SocialLoginButton
  },
  emits: ['login-success'],
  setup(props, { emit }) {
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
      }
    }

    const handleSocialSuccess = () => {
      emit('login-success')
    }

    return {
      email,
      password,
      error,
      loading,
      handleSubmit,
      handleSocialSuccess
    }
  }
}
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
</style>