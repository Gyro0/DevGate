<template>
  <div class="modal-backdrop" @click.self="closeModal">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Change Password</h3>
        <button @click="closeModal" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      <form @submit.prevent="handleChangePassword">
        <div class="modal-body">
          <div class="form-group">
            <label for="currentPassword">Current Password</label>
            <input v-model="currentPassword" id="currentPassword" type="password" required />
          </div>
          <div class="form-group">
            <label for="newPassword">New Password</label>
            <input v-model="newPassword" id="newPassword" type="password" required />
          </div>
          <div class="form-group">
            <label for="confirmPassword">Confirm New Password</label>
            <input v-model="confirmPassword" id="confirmPassword" type="password" required />
          </div>
          <div v-if="error" class="error">{{ error }}</div>
        </div>
        <div class="modal-footer">
          <button :disabled="loading" type="submit" class="btn-primary">Change Password</button>
          <button type="button" @click="closeModal" class="btn-secondary">Cancel</button>
        </div>
      </form>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import firebase, { auth } from '@/firebase/firebaseInit'; // Import firebase namespace

export default {
  name: 'ChangePasswordModal',
  emits: ['close', 'password-changed', 'error'],
  setup(props, { emit }) {
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const loading = ref(false);
    const error = ref('');

    const passwordsMatch = computed(() => {
      return newPassword.value === confirmPassword.value;
    });

    const handleChangePassword = async () => {
      if (!currentPassword.value || !newPassword.value || !confirmPassword.value) {
        error.value = 'Please fill in all fields.';
        return;
      }
      if (!passwordsMatch.value) {
        error.value = 'New passwords do not match.';
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
        // Use v8 user.updatePassword
        await user.updatePassword(newPassword.value);

        alert('Password updated successfully!');
        emit('close');
      } catch (err) {
        console.error("Error changing password:", err);
        if (err.code === 'auth/wrong-password') {
          error.value = 'Incorrect current password.';
        } else if (err.code === 'auth/weak-password') {
          error.value = 'Password should be at least 6 characters.';
        } else {
          error.value = 'Failed to change password. Please try again.';
        }
        emit('error', error.value); // Emit error details
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      // Reset form fields
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      error.value = '';
      // Emit close event
      emit('close');
    };

    return {
      currentPassword,
      newPassword,
      confirmPassword,
      loading,
      error,
      passwordsMatch,
      handleChangePassword,
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
  background-color: rgba(22, 27, 34, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}
.modal-content {
  background: var(--surface);
  border-radius: 1rem;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 32px 0 rgba(30, 203, 225, 0.08), 0 0 0 2px var(--highlight);
  border: 1.5px solid var(--highlight);
  padding: 2rem 1.5rem;
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}
.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 1px;
}
.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--highlight);
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover {
  color: var(--secondary);
}
.modal-body {
  padding: 1.5rem 0;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border);
  background: var(--background);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}
input, .form-control {
  background: var(--background);
  color: var(--text);
  border: 1.5px solid var(--highlight);
  border-radius: 8px;
  padding: 0.6rem 1rem;
  font-size: 1rem;
  margin-bottom: 1rem;
  width: 100%;
  box-shadow: 0 0 8px var(--highlight);
  transition: border-color 0.2s, box-shadow 0.2s;
}
input:focus, .form-control:focus {
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--highlight);
  outline: none;
}
.btn-secondary, .btn-primary {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid var(--highlight);
  background: var(--surface);
  color: var(--text);
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 8px var(--highlight);
}
.btn-secondary:hover, .btn-primary:hover {
  background: var(--highlight);
  color: var(--background);
  border-color: var(--primary);
}
.error {
  color: red;
  margin-top: 10px;
}
</style>