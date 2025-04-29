<template>
  <div class="modal-backdrop">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Delete Account</h3>
        <button @click="closeModal" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <p>Are you sure you want to delete your account? This action cannot be undone.</p>
        <p>Please type <strong>DELETE</strong> to confirm.</p>
        <input type="text" v-model="confirmationText" placeholder="Type DELETE to confirm" />
        <p v-if="error" class="error">{{ error }}</p>
      </div>
      <div class="modal-footer">
        <button @click="handleDeleteAccount" class="danger-button" :disabled="loading">
          <span v-if="loading" class="loader"></span>
          <span v-else>Delete Account</span>
        </button>
        <button @click="closeModal" class="cancel-button">Cancel</button>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import firebase, { auth } from '@/firebase/firebaseInit'; // Import firebase namespace

export default {
  name: 'DeleteAccountModal',
  emits: ['close', 'account-deleted', 'error'],
  setup(props, { emit }) {
    const currentPassword = ref('');
    const confirmationText = ref('');
    const loading = ref(false);
    const error = ref('');

    const handleDeleteAccount = async () => {
      if (confirmationText.value !== 'DELETE') {
        error.value = 'Please type DELETE to confirm.';
        return;
      }
      if (!currentPassword.value) {
        error.value = 'Please enter your current password.';
        return;
      }
      
      loading.value = true;
      error.value = '';
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');

        // Use v8 firebase.auth.EmailAuthProvider
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword.value);
        // Use v8 user.reauthenticateWithCredential
        await user.reauthenticateWithCredential(credential);

        // Use v8 user.delete()
        await user.delete();

        alert('Account deleted successfully.');
        // Redirect or handle logout state
        emit('close');
        // Optionally call logout from useAuth here
      } catch (err) {
        console.error("Error deleting account:", err);
        if (err.code === 'auth/wrong-password') {
          error.value = 'Incorrect password.';
        } else if (err.code === 'auth/requires-recent-login') {
           error.value = 'This operation is sensitive and requires recent authentication. Please log in again before retrying this request.';
        } else {
          error.value = 'Failed to delete account. Please try again.';
        }
        emit('error', error.value); // Emit error details
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      // Reset form fields
      currentPassword.value = '';
      confirmationText.value = '';
      error.value = '';
      // Emit close event
      emit('close');
    };

    return {
      currentPassword,
      confirmationText,
      loading,
      error,
      handleDeleteAccount,
      closeModal // Add this
    };
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-close {
  background: none;
  border: none;
  cursor: pointer;
}

.modal-body {
  margin: 20px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
}

.danger-button {
  background-color: #e74c3c;
  color: white;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.cancel-button {
  background-color: #ccc;
  border: none;
  padding: 10px 15px;
  border-radius: 5px;
  cursor: pointer;
}

.error {
  color: #e74c3c;
  margin-top: 10px;
}

.loader {
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top: 2px solid white;
  width: 15px;
  height: 15px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}
</style>