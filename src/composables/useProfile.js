import { ref, computed } from 'vue';
import firebase, { db, auth } from '@/firebase/firebaseInit'; // Import v8 firebase namespace and initialized services
import useAuth from './useAuth'; // To get the current user

export default function useProfile() {
  const { user: authUser } = useAuth(); // Get the reactive auth user state

  const userProfile = ref({
    id: '',
    email: '',
    displayName: '',
    photoURL: null,
    title: '',
    bio: '',
    connectedAccounts: {}
  }); // Holds the profile data from Firestore
  const editedProfile = ref({}); // Add this
  const loading = ref(false);
  const error = ref(null);

  // Computed property to get the current user's UID safely
  const currentUserId = computed(() => authUser.value?.uid);

  /**
   * Fetches the user profile data from Firestore.
   */
  const fetchUserProfile = async () => {
    console.log('Starting fetchUserProfile');
    if (!currentUserId.value) {
      console.warn('No user ID available');
      error.value = 'User not authenticated.';
      userProfile.value = null; // Clear profile if user logs out
      return;
    }
    
    console.log('Fetching profile for user:', currentUserId.value);
    loading.value = true;
    error.value = null;
    try {
      const userRef = db.collection('users').doc(currentUserId.value);
      const docSnap = await userRef.get();

      if (docSnap.exists) {
        userProfile.value = { id: docSnap.id, ...docSnap.data() };
      } else {
        // Handle case where profile might not exist yet (e.g., right after signup)
        console.warn(`Profile document not found for user: ${currentUserId.value}`);
        // Optionally create a default profile structure here or rely on initial creation
        userProfile.value = {
          id: currentUserId.value,
          email: authUser.value?.email || '',
          displayName: authUser.value?.displayName || '',
          photoURL: authUser.value?.photoURL || null,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(), // Indicate creation time
          // Add other default fields
          title: '',
          bio: '',
          location: '',
          website: '',
          github: '',
          connectedAccounts: {},
        };
        // Optionally save this default structure back to Firestore
        // await userRef.set(userProfile.value, { merge: true });
      }
    } catch (err) {
      error.value = err.message;
      console.error('Error fetching user profile:', err);
      userProfile.value = null; // Clear profile on error
    } finally {
      loading.value = false;
    }
  };

  /**
   * Updates the user profile data in Firestore.
   * @param {Object} profileData - An object containing the fields to update.
   */
  const updateUserProfile = async (profileData) => {
    if (!currentUserId.value) {
      error.value = 'User not authenticated.';
      return;
    }
    if (!profileData || Object.keys(profileData).length === 0) {
      error.value = 'No profile data provided for update.';
      return;
    }

    loading.value = true;
    error.value = null;
    try {
      const userRef = db.collection('users').doc(currentUserId.value);
      const dataToUpdate = {
        ...profileData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(), // Add/update timestamp
      };

      await userRef.update(dataToUpdate);

      // Update local state optimistically or after confirmation
      userProfile.value = { ...userProfile.value, ...dataToUpdate, updatedAt: new Date() }; // Use local date for immediate feedback

      // If updating auth profile properties like displayName or photoURL
      if (profileData.displayName || profileData.photoURL) {
         await auth.currentUser?.updateProfile({
            displayName: profileData.displayName ?? auth.currentUser?.displayName,
            photoURL: profileData.photoURL ?? auth.currentUser?.photoURL,
         });
         // Note: authUser from useAuth might not update immediately,
         // but the local userProfile.value is updated.
      }

    } catch (err) {
      error.value = err.message;
      console.error('Error updating user profile:', err);
      // Optionally revert optimistic update here
      throw err; // Re-throw error so calling component knows it failed
    } finally {
      loading.value = false;
    }
  }

  const saveProfile = async () => {
    if (!editedProfile.value) return;
    
    try {
      await updateUserProfile(editedProfile.value);
      return true;
    } catch (err) {
      console.error('Error saving profile:', err);
      return false;
    }
  };

  /**
   * Formats a website URL for display, removing http(s)://
   * @param {string} url - The full website URL.
   * @returns {string} - Formatted URL for display.
   */
  const formatWebsiteUrl = (url) => {
    if (!url) return '';
    try {
      // Use URL constructor for robust parsing
      const parsedUrl = new URL(url);
      // Return hostname + path, removing trailing slash if present
      return (parsedUrl.hostname + parsedUrl.pathname).replace(/\/$/, '');
    } catch (e) {
      // Fallback for invalid URLs: remove common prefixes
      return url.replace(/^https?:\/\//, '').replace(/\/$/, '');
    }
  };


  // Return reactive state and methods
  return {
    userProfile,
    editedProfile,  // Add this
    loading,
    error,
    fetchUserProfile,
    updateUserProfile,
    saveProfile,    // Add this
    formatWebsiteUrl,
  };
}