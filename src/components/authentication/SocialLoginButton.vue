<template>
  <button
    @click="handleSocialLogin"
<<<<<<< HEAD
    class="btn social-btn d-flex align-items-center justify-content-center w-100 mb-2"
    :class="provider"
    :disabled="loading"
  >
    <span v-if="loading" class="me-2">
      <span class="spinner-border spinner-border-sm"></span>
    </span>
    <span class="sr-only">Se connecter avec {{ provider }}</span>
=======
    class="btn btn-light w-100 d-flex align-items-center justify-content-center py-2 px-4 border rounded shadow-sm"
    :disabled="loading"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm text-primary me-2" role="status" aria-hidden="true"></span>
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
    <img
      v-if="!loading && provider === 'google'"
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="Google"
      class="me-2"
      style="height: 24px; width: 24px;"
    />
    <img
      v-if="!loading && provider === 'github'"
      src="https://www.svgrepo.com/show/512317/github-142.svg"
      alt="GitHub"
      class="me-2"
      style="height: 24px; width: 24px;"
    />
    <span v-if="!loading">Sign in with {{ provider }}</span>
  </button>
</template>

<script>
import { ref } from 'vue';
import useAuth from '@/composables/useAuth';

export default {
  name: 'SocialLoginButton',
  props: {
    provider: {
      type: String,
      required: true,
      validator: (value) => ['google', 'github'].includes(value),
    },
  },
  emits: ['success', 'error'],
  setup(props, { emit }) {
    const { loginWithGoogle, loginWithGithub } = useAuth();
    const loading = ref(false);

    const handleSocialLogin = async () => {
      loading.value = true;
      try {
        if (props.provider === 'google') {
          await loginWithGoogle();
        } else if (props.provider === 'github') {
          await loginWithGithub();
        }
        emit('success');
      } catch (err) {
        console.error(`${props.provider} login error:`, err);
        emit('error', err.message || 'Authentication failed');
      } finally {
        loading.value = false;
      }
    };

    return {
      loading,
      handleSocialLogin,
    };
  },
};
</script>

<style scoped>
button {
  transition: background-color 0.3s ease, box-shadow 0.3s ease;
}
<<<<<<< HEAD
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
=======
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
</style>