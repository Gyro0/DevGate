<template>
  <button
    @click="handleSocialLogin"
    class="btn btn-light w-100 d-flex align-items-center justify-content-center py-2 px-4 border rounded shadow-sm"
    :disabled="loading"
  >
    <span v-if="loading" class="spinner-border spinner-border-sm text-primary me-2" role="status" aria-hidden="true"></span>
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
</style>