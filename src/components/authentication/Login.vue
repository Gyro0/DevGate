<template>
  <!-- Keep the template exactly the same -->
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Connexion à votre compte
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="email" class="sr-only">Email</label>
            <input
              id="email"
              v-model="email"
              name="email"
              type="email"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Adresse email"
            />
          </div>
          <div>
            <label for="password" class="sr-only">Mot de passe</label>
            <input
              id="password"
              v-model="password"
              name="password"
              type="password"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Mot de passe"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="loading"
          >
            <span v-if="loading">Chargement...</span>
            <span v-else>Se connecter</span>
          </button>
          
          <div v-if="error" class="mt-2 text-red-600 text-sm text-center">
            {{ error }}
          </div>
        </div>

        <div class="mt-6">
          <div class="relative">
            <div class="absolute inset-0 flex items-center">
              <div class="w-full border-t border-gray-300" />
            </div>
            <div class="relative flex justify-center text-sm">
              <span class="px-2 bg-gray-50 text-gray-500">Ou continuer avec</span>
            </div>
          </div>

          <div class="mt-6 grid grid-cols-2 gap-3">
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
    // Get auth functions from composable
    const { login, error: authError, loading } = useAuth()

    const email = ref('')
    const password = ref('')
    const error = ref('')

    const handleSubmit = async () => {
      error.value = '' // Clear previous errors
      
      try {
        // Call the login method from useAuth composable
        await login(email.value, password.value)
        
        // If successful, emit success event
        emit('login-success')
      } catch (err) {
        // Set error message for display
        error.value = err.message || 'Failed to login. Please check your credentials.'
        console.error('Login error:', err)
      }
    }

    const handleSocialSuccess = () => {
      emit('login-success')
    }

    // Return all reactive data and methods needed in the template
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