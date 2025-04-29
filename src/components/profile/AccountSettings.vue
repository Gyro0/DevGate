<template>
  <div class="account-settings">
    <h2>Account Settings</h2>
    
    <div class="settings-section">
      <h3>Email Address</h3>
      <p class="settings-value">{{ userProfile?.email || 'No email set' }}</p>
      <button @click="$emit('changeEmail')" class="settings-button">
        Change Email
      </button>
    </div>
    
    <div class="settings-section">
      <h3>Password</h3>
      <p class="settings-value">••••••••</p>
      <button @click="$emit('changePassword')" class="settings-button">
        Change Password
      </button>
    </div>
    
    <div class="settings-section">
      <h3>Connected Accounts</h3>
      <!-- Only render if connectedAccounts exists -->
      <ConnectedAccounts v-if="userProfile?.connectedAccounts" 
                         :accounts="userProfile.connectedAccounts" />
    </div>
    
    <div class="settings-section danger-zone">
      <h3>Danger Zone</h3>
      <button @click="$emit('deleteAccount')" class="danger-button">
        Delete Account
      </button>
    </div>
  </div>
</template>

<script>
import ConnectedAccounts from './ConnectedAccounts.vue';

export default {
  name: 'AccountSettings',
  components: {
    ConnectedAccounts
  },
  props: {
    userProfile: {
      type: Object,
      required: true,
      default: () => ({
        email: '',
        connectedAccounts: {}
      })
    }
  },
  emits: ['changeEmail', 'changePassword', 'deleteAccount'],
  setup() {
    return {};
  }
}
</script>