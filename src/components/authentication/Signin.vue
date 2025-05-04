<template>
  <div class="container signin-container card shadow-sm p-4">
    <h2 class="text-center mb-4">Créer un compte</h2>
    <form @submit.prevent="handleSubmit">
      <div class="mb-3">
        <label for="name" class="form-label">Nom complet</label>
        <input
          id="name"
          v-model="formData.name"
          type="text"
          class="form-control"
          placeholder="Entrez votre nom complet"
          required
        />
      </div>
      <div class="mb-3">
        <label for="email" class="form-label">Adresse email</label>
        <input
          id="email"
          v-model="formData.email"
          type="email"
          class="form-control"
          placeholder="Entrez votre email"
          required
        />
      </div>
      <div class="mb-3">
        <label for="password" class="form-label">Mot de passe</label>
        <input
          id="password"
          v-model="formData.password"
          type="password"
          class="form-control"
          placeholder="Entrez votre mot de passe"
          required
        />
      </div>
      <div class="mb-3">
        <label for="confirmPassword" class="form-label">Confirmer le mot de passe</label>
        <input
          id="confirmPassword"
          v-model="formData.confirmPassword"
          type="password"
          class="form-control"
          placeholder="Confirmez votre mot de passe"
          required
        />
      </div>
      <button
        type="submit"
        class="btn btn-primary w-100"
        :disabled="loading"
      >
        <span v-if="loading">Création de compte...</span>
        <span v-else>S'inscrire</span>
      </button>
      <div v-if="error" class="text-danger text-center mt-3">
        {{ error }}
      </div>
    </form>
    <div class="mt-4 text-center">
      <p class="text-muted">Ou inscrivez-vous avec</p>
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
  name: 'Signin',
  components: {
    SocialLoginButton,
  },
  emits: ['signup-success'],
  setup(props, { emit }) {
    const { register } = useAuth();
    const formData = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    });
    const loading = ref(false);
    const error = ref('');

    const handleSubmit = async () => {
      error.value = '';
      if (formData.value.password !== formData.value.confirmPassword) {
        error.value = 'Les mots de passe ne correspondent pas';
        return;
      }
      loading.value = true;
      try {
        await register(formData.value.email, formData.value.password, formData.value.name);
        emit('signup-success');
      } catch (err) {
        error.value = err.message || 'L\'inscription a échoué';
      } finally {
        loading.value = false;
      }
    };

    const handleSocialSuccess = () => {
      emit('signup-success');
    };

    return {
      formData,
      loading,
      error,
      handleSubmit,
      handleSocialSuccess,
    };
  },
};
</script>

<style scoped>
.signin-container {
  max-width: 400px;
  margin: 0 auto;
}
</style>

<style>
.signin-container,
.login-container {
  max-width: 400px;
  margin: 0 auto;
  padding: 2rem;
  background: #ffffff; /* White background */
  border-radius: 10px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

button {
  background-color: #1e3a8a; /* Darker blue */
  color: #ffffff; /* White text */
  transition: background-color 0.3s ease;
}

button:hover {
  background-color: #3b82f6; /* Light blue hover */
}

.text-muted {
  color: #6b7280; /* Neutral gray */
}

.text-primary {
  color: #1e3a8a; /* Darker blue */
}
</style>