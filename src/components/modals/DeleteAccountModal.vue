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
.btn-secondary, .btn-danger {
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
.btn-secondary:hover, .btn-danger:hover {
  background: var(--highlight);
  color: var(--background);
  border-color: var(--primary);
}
.btn-danger {
  background: linear-gradient(90deg, var(--secondary) 60%, var(--primary) 100%);
  color: var(--background);
  border: none;
  box-shadow: 0 0 8px var(--secondary);
}
.btn-danger:hover {
  background: var(--primary);
  color: var(--background);
  box-shadow: 0 0 12px var(--primary);
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
=======
/* No additional custom styles needed as Bootstrap is used */
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
</style>