<template>
  <button
    @click="handleSocialLogin"
    class="btn social-btn d-flex align-items-center justify-content-center w-100 mb-2"
    :class="provider"
    :disabled="loading"
  >
    <span v-if="loading" class="me-2">
      <span class="spinner-border spinner-border-sm"></span>
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

<style scoped>
.social-btn {
  background: var(--surface);
  color: var(--text);
  border: 1.5px solid var(--highlight);
  box-shadow: 0 0 8px var(--highlight);
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
  font-weight: 600;
  font-size: 1rem;
  padding: 0.5rem 1rem;
  border-radius: 0.75rem;
}
.social-btn.google:hover {
  border-color: #1ecbe1;
  box-shadow: 0 0 12px #1ecbe1;
  background: rgba(30, 203, 225, 0.08);
}
.social-btn.github:hover {
  border-color: #ff9900;
  box-shadow: 0 0 12px #ff9900;
  background: rgba(255, 153, 0, 0.08);
}
.social-btn:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>