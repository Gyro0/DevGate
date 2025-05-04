<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="deleteAccountModalLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <!-- Modal Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="deleteAccountModalLabel">Delete Account</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="closeModal"></button>
        </div>

        <!-- Modal Body -->
        <div class="modal-body">
          <p class="text-danger fw-bold">Are you sure you want to delete your account? This action cannot be undone.</p>
          <p>Please type <strong>DELETE</strong> to confirm.</p>
          <input
            type="text"
            v-model="confirmationText"
            class="form-control mb-3"
            placeholder="Type DELETE to confirm"
          />

          <!-- Error Message -->
          <div v-if="error" class="alert alert-danger" role="alert">
            {{ error }}
          </div>
        </div>

        <!-- Modal Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="closeModal">Cancel</button>
          <button
            type="button"
            class="btn btn-danger"
            @click="handleDeleteAccount"
            :disabled="loading"
          >
            <span v-if="loading" class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
            Delete Account
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import firebase, { auth } from '@/firebase/firebaseInit';

export default {
  name: 'DeleteAccountModal',
  emits: ['close', 'account-deleted', 'error'],
  setup(props, { emit }) {
    const confirmationText = ref('');
    const loading = ref(false);
    const error = ref('');

    const handleDeleteAccount = async () => {
      if (confirmationText.value !== 'DELETE') {
        error.value = 'Please type DELETE to confirm.';
        return;
      }

      loading.value = true;
      error.value = '';
      try {
        const user = auth.currentUser;
        if (!user) throw new Error('User not logged in');

        await user.delete();

        alert('Account deleted successfully.');
        emit('account-deleted');
        closeModal();
      } catch (err) {
        console.error('Error deleting account:', err);
        if (err.code === 'auth/requires-recent-login') {
          error.value = 'This operation requires recent authentication. Please log in again.';
        } else {
          error.value = 'Failed to delete account. Please try again.';
        }
        emit('error', error.value);
      } finally {
        loading.value = false;
      }
    };

    const closeModal = () => {
      confirmationText.value = '';
      error.value = '';
      emit('close');
    };

    return {
      confirmationText,
      loading,
      error,
      handleDeleteAccount,
      closeModal,
    };
  },
};
</script>

<style scoped>
/* No additional custom styles needed as Bootstrap is used */
</style>