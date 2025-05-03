<template>
  <div class="login-form-wrapper">
    <div class="form-header">
      <h2>Créer un compte</h2>
    </div>
    <form class="login-form" @submit.prevent="handleSubmit">
      <div class="input-group">
        <div>
          <label for="name" class="sr-only">Nom complet</label>
          <input
            id="name"
            v-model="formData.name"
            name="name"
            type="text"
            required
            class="form-input first-input"
            placeholder="Nom complet"
          />
        </div>
        <div>
          <label for="email" class="sr-only">Email</label>
          <input
            id="email"
            v-model="formData.email"
            name="email"
            type="email"
            required
            class="form-input middle-input"
            placeholder="Adresse email"
          />
        </div>
        <div>
          <label for="password" class="sr-only">Mot de passe</label>
          <input
            id="password"
            v-model="formData.password"
            name="password"
            type="password"
            required
            class="form-input middle-input"
            placeholder="Mot de passe"
          />
        </div>
        <div>
          <label for="confirmPassword" class="sr-only">Confirmer le mot de passe</label>
          <input
            id="confirmPassword"
            v-model="formData.confirmPassword"
            name="confirmPassword"
            type="password"
            required
            class="form-input bottom-input"
            placeholder="Confirmer le mot de passe"
          />
        </div>
      </div>

      <div class="button-container">
        <button
          type="submit"
          class="submit-button"
          :disabled="loading"
        >
          <span v-if="loading" class="loading-text">
            <span class="spinner"></span>
            Création de compte...
          </span>
          <span v-else>S'inscrire</span>
        </button>
        
        <div v-if="error" class="error-message">
          {{ error }}
        </div>
      </div>

      <div class="divider-section">
        <div class="divider">
          <span>Ou continuer avec</span>
        </div>

        <div class="social-buttons">
          <SocialLoginButton provider="google" @success="handleSocialSuccess" />
          <SocialLoginButton provider="github" @success="handleSocialSuccess" />
        </div>
      </div>
    </form>
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
  width: 100%;
  max-width: 28rem;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.form-header {
  text-align: center;
}

.form-header h2 {
  font-size: 1.875rem;
  line-height: 2.25rem;
  font-weight: 800;
  color: #1f2937;
  margin-bottom: 1.5rem;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.input-group {
  border-radius: 0.375rem;
  box-shadow: 0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06);
}

.form-input {
  display: block;
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid #d1d5db;
  background-color: #fff;
  color: #1f2937;
  font-size: 0.875rem;
  line-height: 1.25rem;
}

.form-input:focus {
  outline: none;
  border-color: #6366f1;
  box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
  z-index: 10;
  position: relative;
}

.form-input::placeholder {
  color: #9ca3af;
}

.first-input {
  border-top-left-radius: 0.375rem;
  border-top-right-radius: 0.375rem;
  border-bottom: none;
}

.middle-input {
  border-bottom: none;
}

.bottom-input {
  border-bottom-left-radius: 0.375rem;
  border-bottom-right-radius: 0.375rem;
}

.button-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.submit-button {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  padding: 0.625rem 1rem;
  background-color: #4f46e5;
  color: white;
  font-size: 0.875rem;
  font-weight: 500;
  border: none;
  border-radius: 0.375rem;
  cursor: pointer;
  transition: background-color 150ms ease;
}

.submit-button:hover {
  background-color: #4338ca;
}

.submit-button:focus {
  outline: none;
  box-shadow: 0 0 0 3px rgba(79, 70, 229, 0.5);
}

.submit-button:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.error-message {
  margin-top: 0.75rem;
  color: #dc2626;
  font-size: 0.875rem;
  text-align: center;
}

.loading-text {
  display: flex;
  align-items: center;
}

.spinner {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  margin-right: 0.5rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: white;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.divider-section {
  margin-top: 1.5rem;
}

.divider {
  position: relative;
  text-align: center;
  margin-bottom: 1.5rem;
}

.divider::before {
  content: "";
  position: absolute;
  top: 50%;
  left: 0;
  right: 0;
  height: 1px;
  background-color: #d1d5db;
  z-index: 0;
}

.divider span {
  position: relative;
  display: inline-block;
  padding: 0 0.75rem;
  background-color: #fff;
  color: #6b7280;
  font-size: 0.875rem;
  z-index: 1;
}

.social-buttons {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 0.75rem;
  margin-top: 1.5rem;
}

@media (max-width: 640px) {
  .social-buttons {
    grid-template-columns: 1fr;
  }
}
</style>