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
            >
              S'inscrire
            </button>
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
  
  <script setup>
  import { ref } from 'vue'
  import SocialLoginButton from './SocialLoginButton.vue'
  
  const emit = defineEmits(['signup-success'])
  
  const formData = ref({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  })
  
  const handleSubmit = async () => {
    if (formData.value.password !== formData.value.confirmPassword) {
      alert('Les mots de passe ne correspondent pas')
      return
    }
    // TODO: Implémenter la logique d'inscription
    console.log('Signin attempt with:', formData.value)
    // Simuler une inscription réussie pour le moment
    emit('signup-success')
  }
  
  const handleSocialSuccess = () => {
    emit('signup-success')
  }
  </script>