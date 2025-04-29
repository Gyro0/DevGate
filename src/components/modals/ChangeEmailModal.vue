<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Change Email Address</h3>
        <button @click="closeModal" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <div class="modal-body">
        <form @submit.prevent="handleChangeEmail">
          <div class="form-group">
            <label for="newEmail">New Email Address</label>
            <input
              type="email"
              id="newEmail"
              v-model="newEmail"
              required
              placeholder="Enter your new email"
            />
          </div>
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input
              type="password"
              id="currentPassword"
              v-model="currentPassword"
              required
              placeholder="Enter your current password"
            />
          </div>
          <div class="form-actions">
            <button type="submit" class="btn-primary" :disabled="loading">Save Changes</button>
            <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
          </div>
          <div v-if="error" class="error-message">{{ error }}</div>
        </form>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import firebase, { auth } from '@/firebase/firebaseInit'; // Import firebase namespace

export default {
  name: 'ChangeEmailModal',
  emits: ['close', 'email-changed', 'error'],
  setup(props, { emit }) {
    const newEmail = ref('');
    const currentPassword = ref('');
    const loading = ref(false);
    const error = ref('');

    const handleChangeEmail = async () => {
      if (!newEmail.value || !currentPassword.value) {
        error.value = 'Please fill in all fields.';
        return;
      }
      
      loading.value = true;
      error.value = '';
      try {
        const user = auth.currentUser;
        // Use v8 firebase.auth.EmailAuthProvider
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword.value);
        // Use v8 user.reauthenticateWithCredential
        await user.reauthenticateWithCredential(credential);
        // Use v8 user.updateEmail
        await user.updateEmail(newEmail.value);

        alert('Email updated successfully!');
        emit('close');
      } catch (err) {
        console.error("Error changing email:", err);
        if (err.code === 'auth/wrong-password') {
          error.value = 'Incorrect password.';
        } else if (err.code === 'auth/email-already-in-use') {
          error.value = 'This email address is already in use.';
        } else if (err.code === 'auth/invalid-email') {
          error.value = 'The new email address is invalid.';
        } else {
          error.value = 'Failed to change email. Please try again.';
        }
        emit('error', error.value); // Emit error details
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      // Reset form fields
      newEmail.value = '';
      currentPassword.value = '';
      error.value = '';
      // Emit close event
      emit('close');
    };

    return {
      newEmail,
      currentPassword,
      loading,
      error,
      handleChangeEmail,
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

.form-group {
  margin-bottom: 15px;
}

.form-actions {
  display: flex;
  justify-content: space-between;
}

.error-message {
  color: red;
  margin-top: 10px;
}
</style>