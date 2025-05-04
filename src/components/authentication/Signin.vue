<template>
  <div class="container d-flex justify-content-center align-items-center min-vh-100">
    <div class="card p-4 shadow-lg login-form-wrapper w-100" style="max-width: 28rem;">
      <div class="form-header mb-4">
        <h2>Créer un compte</h2>
      </div>
      <form @submit.prevent="handleSubmit">
        <div class="mb-3">
          <label for="name" class="form-label visually-hidden">Nom complet</label>
          <input
            id="name"
            v-model="formData.name"
            name="name"
            type="text"
            required
            class="form-control mb-2"
            placeholder="Nom complet"
          />
        </div>
        <div class="mb-3">
          <label for="email" class="form-label visually-hidden">Email</label>
          <input
            id="email"
            v-model="formData.email"
            name="email"
            type="email"
            required
            class="form-control mb-2"
            placeholder="Adresse email"
          />
        </div>
        <div class="mb-3">
          <label for="password" class="form-label visually-hidden">Mot de passe</label>
          <input
            id="password"
            v-model="formData.password"
            name="password"
            type="password"
            required
            class="form-control mb-2"
            placeholder="Mot de passe"
          />
        </div>
        <div class="mb-3">
          <label for="confirmPassword" class="form-label visually-hidden">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            name="confirmPassword"
            type="password"
            required
            class="form-control"
            placeholder="Confirmer le mot de passe"
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
              Création de compte...
            </span>
            <span v-else>S'inscrire</span>
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
import { ref } from 'vue';
import SocialLoginButton from './SocialLoginButton.vue';
import useAuth from '@/composables/useAuth';

export default {
  name: 'Signin',
  components: {
    SocialLoginButton
  },
  emits: ['signup-success'],
  setup(props, { emit }) {
    const { register, loading: authLoading, error: authError } = useAuth();
    
    const formData = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    const loading = ref(false)
    const error = ref('')
    
    const handleSubmit = async () => {
      error.value = ''
      
      if (formData.value.password !== formData.value.confirmPassword) {
        error.value = 'Les mots de passe ne correspondent pas'
        return
      }
      
      if (formData.value.password.length < 6) {
        error.value = 'Le mot de passe doit contenir au moins 6 caractères'
        return
      }
      
      loading.value = true
      
      try {
        await register(
          formData.value.email,
          formData.value.password,
          formData.value.name 
        )
        emit('signup-success')
      } catch (err) {
        console.error('Signup error:', err)
        switch(err.code) {
          case 'auth/email-already-in-use':
            error.value = 'Cette adresse email est déjà utilisée'
            break
          case 'auth/invalid-email':
            error.value = 'Adresse email invalide'
            break
          case 'auth/weak-password':
            error.value = 'Le mot de passe est trop faible'
            break
          default:
            error.value = 'Une erreur s\'est produite lors de l\'inscription'
        }
      } finally {
        loading.value = false
      }
    }
    
    const handleSocialSuccess = () => {
      emit('signup-success')
    }
    
    return {
      formData,
      loading,
      error,
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