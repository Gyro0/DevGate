<template>
  <div class="account-settings">
    <h2>Account Settings</h2>
    
    <div class="settings-section">
      <h3>Email Address</h3>
      <p class="settings-value">{{ userProfile.email }}</p>
      <button @click="showChangeEmailModal = true" class="settings-button">
        Change Email
      </button>
    </div>
    
    <div class="settings-section">
      <h3>Password</h3>
      <p class="settings-value">••••••••</p>
      <button @click="showChangePasswordModal = true" class="settings-button">
        Change Password
      </button>
    </div>
    
    <div class="settings-section">
      <h3>Connected Accounts</h3>
      <ConnectedAccounts :accounts="userProfile.connectedAccounts" />
    </div>
    
    <div class="settings-section danger-zone">
      <h3>Danger Zone</h3>
      <button @click="showDeleteAccountModal = true" class="danger-button">
        Delete Account
      </button>
    </div>
    
    <ChangeEmailModal v-if="showChangeEmailModal" @close="showChangeEmailModal = false" />
    <ChangePasswordModal v-if="showChangePasswordModal" @close="showChangePasswordModal = false" />
    <DeleteAccountModal v-if="showDeleteAccountModal" @close="showDeleteAccountModal = false" />
  </div>
</template>

<script>
export default {
  name: 'AccountSettings',
  emits: ['change-email', 'change-password', 'delete-account'],
  setup() {
    return {};
  }
}
</script>

<style scoped>
.account-settings {
  padding: 1.5rem;
}

.settings-section {
  margin-bottom: 1.5rem;
}

.settings-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
}

.danger-button {
  background-color: #e53e3e;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  cursor: pointer;
}
</style>