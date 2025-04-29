<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Créer un compte
        </h2>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleSubmit">
        <div class="rounded-md shadow-sm -space-y-px">
          <div>
            <label for="name" class="sr-only">Nom complet</label>
            <input
              id="name"
              v-model="formData.name"
              name="name"
              type="text"
              required
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
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
              class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 focus:z-10 sm:text-sm"
              placeholder="Confirmer le mot de passe"
            />
          </div>
        </div>

        <div>
          <button
            type="submit"
            class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            :disabled="loading"
          >
            <span v-if="loading">Création de compte...</span>
            <span v-else>S'inscrire</span>
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
import { ref } from 'vue';
import SocialLoginButton from './SocialLoginButton.vue';
import useAuth from '@/composables/useAuth'; // Rely on this

export default {
  name: 'Signin',
  components: {
    SocialLoginButton
  },
  emits: ['signup-success'],
  setup(props, { emit }) {
    const { register, loading: authLoading, error: authError } = useAuth(); // Use the v8-compatible register
    
    const formData = ref({
      name: '',
      email: '',
      password: '',
      confirmPassword: ''
    })
    
    const loading = ref(false)
    const error = ref('')
    
    const handleSubmit = async () => {
      // Clear any previous errors
      error.value = ''
      
      // Validate passwords match
      if (formData.value.password !== formData.value.confirmPassword) {
        error.value = 'Les mots de passe ne correspondent pas'
        return
      }
      
      // Validate password length
      if (formData.value.password.length < 6) {
        error.value = 'Le mot de passe doit contenir au moins 6 caractères'
        return
      }
      
      loading.value = true
      
      try {
        // Create user in Firebase Auth
        const userCredential = await register(
          formData.value.email,
          formData.value.password,
          formData.value.name 
        )
        
        // Emit success event
        emit('signup-success')
      } catch (err) {
        console.error('Signup error:', err)
        // Handle specific Firebase errors
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
    
    // Return all reactive data and methods needed in the template
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