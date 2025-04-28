// src/composables/useAuth.js
import { ref, computed } from 'vue'
import { auth } from '@/firebase/firebaseInit'
import { useRouter } from 'vue-router'
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword,
  signInWithPopup,
  GoogleAuthProvider,
  signOut 
} from 'firebase/auth'

/**
 * Authentication composable for managing user login, registration, and logout
 * @returns {Object} Authentication state and methods
 */
export default function useAuth() {
  const user = ref(null)
  const error = ref(null)
  const loading = ref(false)
  const router = useRouter()
  
  // Check if user is authenticated
  const isAuthenticated = computed(() => !!user.value)
  
  // Login with email/password
  const login = async (email, password) => {
    loading.value = true
    error.value = null
    
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      return user.value
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Register with email/password
  const register = async (email, password, displayName) => {
    loading.value = true
    error.value = null
    
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password)
      user.value = userCredential.user
      // Update profile with display name
      await updateProfile(user.value, { displayName })
      return user.value
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Login with Google
  const loginWithGoogle = async () => {
    loading.value = true
    error.value = null
    
    try {
      const provider = new GoogleAuthProvider()
      const userCredential = await signInWithPopup(auth, provider)
      user.value = userCredential.user
      return user.value
    } catch (e) {
      error.value = e.message
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Logout
  const logout = async () => {
    try {
      await signOut(auth)
      user.value = null
      router.push('/login')
    } catch (e) {
      error.value = e.message
      throw e
    }
  }
  
  return {
    user,
    error,
    loading,
    isAuthenticated,
    login,
    register,
    loginWithGoogle,
    logout
  }
}