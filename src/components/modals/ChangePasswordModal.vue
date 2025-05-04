<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="changePasswordModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="changePasswordModalLabel">Change Password</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="handleChangePassword">
            <!-- Current Password -->
            <div class="mb-3">
              <label for="currentPassword" class="form-label">Current Password</label>
              <input
                type="password"
                id="currentPassword"
                v-model="currentPassword"
                class="form-control"
                required
                placeholder="Enter your current password"
              />
            </div>

            <!-- New Password -->
            <div class="mb-3">
              <label for="newPassword" class="form-label">New Password</label>
              <input
                type="password"
                id="newPassword"
                v-model="newPassword"
                class="form-control"
                required
                placeholder="Enter your new password"
              />
            </div>

            <!-- Confirm New Password -->
            <div class="mb-3">
              <label for="confirmPassword" class="form-label">Confirm New Password</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                class="form-control"
                required
                placeholder="Confirm your new password"
              />
            </div>

            <!-- Error Message -->
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <!-- Actions -->
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-secondary me-2" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Change Password
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue';
import firebase, { auth } from '@/firebase/firebaseInit';

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
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword.value);
        await user.reauthenticateWithCredential(credential);
        await user.updatePassword(newPassword.value);

        alert('Password updated successfully!');
        emit('password-changed');
        closeModal();
      } catch (err) {
        console.error('Error changing password:', err);
        if (err.code === 'auth/wrong-password') {
          error.value = 'Incorrect current password.';
        } else if (err.code === 'auth/weak-password') {
          error.value = 'Password should be at least 6 characters.';
        } else {
          error.value = 'Failed to change password. Please try again.';
        }
        emit('error', error.value);
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      currentPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
      error.value = '';
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
      closeModal,
    };
  },
};
</script>

<style scoped>
<<<<<<< HEAD
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
=======
/* No additional custom styles needed as Bootstrap is used */
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
</style>