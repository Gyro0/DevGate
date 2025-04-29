<template>
  <button
    @click="handleSocialLogin"
    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
    :disabled="loading"
  >
    <span v-if="loading" class="mr-2">
      <svg class="animate-spin h-5 w-5 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
    </span>
    <span class="sr-only">Se connecter avec {{ provider }}</span>
    <img
      v-if="provider === 'google' && !loading"
      style="height: 24px; width: 24px;"
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="Google"
    />
    <img
      v-else-if="provider === 'github' && !loading"
      style="height: 24px; width: 24px;"
      src="https://www.svgrepo.com/show/512317/github-142.svg"
      alt="GitHub"
    />
  </button>
</template>

<script>
import { ref } from 'vue'
import useAuth from '@/composables/useAuth'

export default {
  name: 'SocialLoginButton',
  props: {
    provider: {
      type: String,
      required: true,
      validator: (value) => ['google', 'github'].includes(value)
    }
  },
  emits: ['success', 'error'],
  setup(props, { emit }) {
    const { loginWithGoogle, loginWithGithub, error: authError } = useAuth()
    const loading = ref(false)
    const error = ref('')

    const handleSocialLogin = async () => {
      loading.value = true
      error.value = ''
      
      try {
        if (props.provider === 'google') {
          await loginWithGoogle()
        } else if (props.provider === 'github') {
          await loginWithGithub()
        }
        
        emit('success')
      } catch (err) {
        console.error(`${props.provider} login error:`, err)
        error.value = err.message || 'Authentication failed'
        emit('error', error.value)
      } finally {
        loading.value = false
      }
    }

    return {
      loading,
      handleSocialLogin
    }
  }
}
</script>