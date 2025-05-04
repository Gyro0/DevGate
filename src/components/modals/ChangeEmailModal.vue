<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="changeEmailModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="changeEmailModalLabel">Change Email Address</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <form @submit.prevent="handleChangeEmail">
            <!-- New Email -->
            <div class="mb-3">
              <label for="newEmail" class="form-label">New Email Address</label>
              <input
                type="email"
                id="newEmail"
                v-model="newEmail"
                class="form-control"
                required
                placeholder="Enter your new email"
              />
            </div>

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

            <!-- Error Message -->
            <div v-if="error" class="alert alert-danger" role="alert">
              {{ error }}
            </div>

            <!-- Actions -->
            <div class="d-flex justify-content-end">
              <button type="button" class="btn btn-secondary me-2" @click="closeModal">Cancel</button>
              <button type="submit" class="btn btn-primary" :disabled="loading">
                <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import firebase, { auth } from '@/firebase/firebaseInit';

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
        const credential = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword.value);
        await user.reauthenticateWithCredential(credential);
        await user.updateEmail(newEmail.value);

        alert('Email updated successfully!');
        emit('email-changed');
        closeModal();
      } catch (err) {
        console.error('Error changing email:', err);
        if (err.code === 'auth/wrong-password') {
          error.value = 'Incorrect password.';
        } else if (err.code === 'auth/email-already-in-use') {
          error.value = 'This email address is already in use.';
        } else if (err.code === 'auth/invalid-email') {
          error.value = 'The new email address is invalid.';
        } else {
          error.value = 'Failed to change email. Please try again.';
        }
        emit('error', error.value);
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      newEmail.value = '';
      currentPassword.value = '';
      error.value = '';
      emit('close');
    };

    return {
      newEmail,
      currentPassword,
      loading,
      error,
      handleChangeEmail,
      closeModal,
    };
  },
};
</script>

<style scoped>
/* No additional custom styles needed as Bootstrap is used */
</style>