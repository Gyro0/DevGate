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
/* No additional custom styles needed as Bootstrap is used */
</style>