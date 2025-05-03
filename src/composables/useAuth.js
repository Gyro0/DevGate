// src/composables/useAuth.js
import { ref, computed, onUnmounted,onMounted } from 'vue';
import firebase, { auth, db } from '@/firebase/firebaseInit'; // Import firebase namespace and initialized services
import { useRouter } from 'vue-router';

/**
 * Authentication composable for managing user login, registration, and logout
 * @returns {Object} Authentication state and methods
 */
export default function useAuth() {
  const user = ref(null);
  const error = ref(null);
  const loading = ref(false);
  const router = useRouter();
  const authInitialized = ref(false);
 // Add an isAuthenticated computed property
 const isAuthenticated = computed(() => !!user.value);
  
 // Initialize auth state
 const initAuth = () => {
   return new Promise((resolve) => {
     // Unsubscribe function to clean up listener
     const unsubscribe = firebase.auth().onAuthStateChanged((authUser) => {
       loading.value = false;
       authInitialized.value = true; // Mark auth as initialized
       
       if (authUser) {
         console.log('Auth: User is signed in', authUser.uid);
         user.value = authUser;
       } else {
         console.log('Auth: No user signed in');
         user.value = null;
       }
       resolve(user.value);
     });
     
     // Return unsubscribe for component cleanup if needed
     return unsubscribe;
   });
 };
 
 // Call initAuth immediately when composable is used
 // This ensures auth initialization starts right away
 const authPromise = initAuth();
 
 // Helper method to wait for auth to be ready
 const waitForAuth = async () => {
   if (authInitialized.value) return user.value;
   return await authPromise;
 };
  
  // Login with email/password
  const login = async (email, password) => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await auth.signInWithEmailAndPassword(email, password);
      user.value = userCredential.user;
      return user.value;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Register with email/password
  const register = async (email, password, displayName) => {
    loading.value = true;
    error.value = null;
    try {
      const userCredential = await auth.createUserWithEmailAndPassword(email, password);
      await userCredential.user.updateProfile({ displayName }); // v8 updateProfile
      user.value = userCredential.user;
      await updateUserProfile(user.value, 'email'); // Pass 'email' or determine provider
      return user.value;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Login with Google
  const loginWithGoogle = async () => {
    loading.value = true;
    error.value = null;
    try {
      const provider = new firebase.auth.GoogleAuthProvider(); // v8 provider
      provider.setCustomParameters({ prompt: 'select_account' });
      const userCredential = await auth.signInWithPopup(provider); // v8 signInWithPopup
      user.value = userCredential.user;
      await updateUserProfile(user.value, 'google');
      return user.value;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Login with GitHub
  const loginWithGithub = async () => {
    loading.value = true;
    error.value = null;
    try {
      const provider = new firebase.auth.GithubAuthProvider(); // v8 provider
      // Note: redirect_uri is typically configured in Firebase console for v8
      const userCredential = await auth.signInWithPopup(provider); // v8 signInWithPopup
      user.value = userCredential.user;
      await updateUserProfile(user.value, 'github');
      return user.value;
    } catch (e) {
      error.value = e.message;
      throw e;
    } finally {
      loading.value = false;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await auth.signOut(); // v8 signOut
      user.value = null;
      router.push('/login');
    } catch (e) {
      error.value = e.message;
      throw e;
    }
  };

  // Helper function for profile updates (v8)
  const updateUserProfile = async (userData, provider) => {
    const userRef = db.collection('users').doc(userData.uid); // v8 collection/doc
    try {
      const userSnap = await userRef.get(); // v8 get()
      const profileData = {
        lastLogin: firebase.firestore.FieldValue.serverTimestamp(), // v8 serverTimestamp
        connectedAccounts: {
          [provider]: true
        }
      };
      if (userSnap.exists) {
        await userRef.set({ // v8 set with merge
          ...profileData,
          connectedAccounts: {
            ...(userSnap.data().connectedAccounts || {}),
            [provider]: true
          }
        }, { merge: true });
      } else {
        await userRef.set({ // v8 set
          displayName: userData.displayName || '',
          email: userData.email || '',
          photoURL: userData.photoURL || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(), // v8 serverTimestamp
          title: '',
          bio: '',
          location: '',
          website: '',
          ...profileData
        });
      }
    } catch (error) {
      console.error('Error updating user profile:', error)
      throw error
    }
  };

  // Auth state listener (v8)
  const unsubscribe = auth.onAuthStateChanged(_user => {
    user.value = _user;
    if (!_user && router.currentRoute.value.meta.requiresAuth) {
       router.push('/login');
    }
  });
  onUnmounted(unsubscribe); // Clean up listener

  return { user,initAuth,waitForAuth,authInitialized, error, loading, isAuthenticated, login, register, loginWithGoogle, loginWithGithub, logout };
}