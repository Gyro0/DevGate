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
import { getAuth, updatePassword, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';

export default {
  name: 'ChangePasswordModal',
  emits: ['close', 'password-changed', 'error'],
  setup(props, { emit }) {
    const currentPassword = ref('');
    const newPassword = ref('');
    const confirmPassword = ref('');
    const loading = ref(false);
    const error = ref('');
    const auth = getAuth();

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
        if (!user || !user.email) {
          throw new Error("User not found or email missing.");
        }

        // Re-authenticate user
        const credential = EmailAuthProvider.credential(user.email, currentPassword.value);
        await reauthenticateWithCredential(user, credential);
        
        // Update password
        await updatePassword(user, newPassword.value);
        
        emit('password-changed');
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

    return {
      currentPassword,
      newPassword,
      confirmPassword,
      loading,
      error,
      passwordsMatch,
      handleChangePassword
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
  align-items: center;
  justify-content: center;
}

.modal-content {
  background: white;
  border-radius: 8px;
  padding: 20px;
  width: 400px;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-body {
  margin: 20px 0;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
}

.error {
  color: red;
  margin-top: 10px;
}
</style>