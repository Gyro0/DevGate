<template>
  <button
    @click="handleSocialLogin"
    class="w-full inline-flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
  >
    <span class="sr-only">Se connecter avec {{ provider }}</span>
    <img
      v-if="provider === 'google'"
      style="height: 24px; width: 24px;"
      src="https://www.svgrepo.com/show/475656/google-color.svg"
      alt="Google"
    />
    <img
      v-else-if="provider === 'github'"
      style="height: 24px; width: 24px;"
      src="https://www.svgrepo.com/show/512317/github-142.svg"
      alt="GitHub"
    />
  </button>
</template>

<script setup>
const props = defineProps({
  provider: {
    type: String,
    required: true,
    validator: (value) => ['google', 'github'].includes(value)
  }
})

const emit = defineEmits(['success'])

const handleSocialLogin = () => {
  // TODO: Implémenter la logique de connexion sociale
  console.log(`Social login with ${props.provider}`)
  // Simuler une connexion sociale réussie pour le moment
  emit('success')
}
</script> 