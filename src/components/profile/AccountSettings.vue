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

<style scoped>
.account-settings {
  background: var(--surface-card);
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.35), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 2rem 1.5rem;
  color: var(--text);
  max-width: 480px;
  margin: 2rem auto;
}

.account-settings h2 {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  margin-bottom: 2rem;
  text-shadow: 0 0 8px var(--primary-glow);
}

.settings-section {
  margin-bottom: 2rem;
  padding-bottom: 1.2rem;
  border-bottom: 1px solid var(--border-color, #23272e);
}
.settings-section:last-child {
  border-bottom: none;
  margin-bottom: 0;
  padding-bottom: 0;
}
.settings-section h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--secondary);
  margin-bottom: 0.5rem;
}
.settings-value {
  color: var(--text-secondary);
  font-size: 1.05rem;
  margin-bottom: 0.7rem;
}
.settings-button {
  background: var(--primary);
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 0 8px var(--primary-glow);
  cursor: pointer;
  transition: background 0.18s, box-shadow 0.18s;
  margin-top: 0.5rem;
}
.settings-button:hover {
  background: var(--primary-glow);
  color: #fff;
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
.danger-zone h3 {
  color: #ff4d4f;
  text-shadow: 0 0 8px #ff4d4f44;
}
.danger-button {
  background: #ff4d4f;
  color: #fff;
  border: none;
  border-radius: 0.5rem;
  padding: 0.5rem 1.2rem;
  font-weight: 700;
  font-size: 1rem;
  box-shadow: 0 0 8px #ff4d4f88;
  cursor: pointer;
  margin-top: 0.7rem;
  transition: background 0.18s, box-shadow 0.18s;
}
.danger-button:hover {
  background: #d7263d;
  box-shadow: 0 0 16px 2px #ff4d4f;
}
</style>