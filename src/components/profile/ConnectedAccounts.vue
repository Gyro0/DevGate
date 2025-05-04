<template>
  <div class="connected-accounts">
    <h3>Connected Accounts</h3>
    <!-- Fix: Use connectedAccounts prop directly instead of userProfile.connectedAccounts -->
    <div class="account-item" :class="{ 'connected': connectedAccounts?.github }">
      <i class="fab fa-github"></i>
      <span>GitHub</span>
      <button v-if="connectedAccounts?.github" class="disconnect-btn" @click="disconnectAccount('github')">
        Disconnect
      </button>
      <button v-else class="connect-btn" @click="connectAccount('github')">
        Connect
      </button>
    </div>
    
    <div class="account-item" :class="{ 'connected': connectedAccounts?.google }">
      <i class="fab fa-google"></i>
      <span>Google</span>
      <button v-if="connectedAccounts?.google" class="disconnect-btn" @click="disconnectAccount('google')">
        Disconnect
      </button>
      <button v-else class="connect-btn" @click="connectAccount('google')">
        Connect
      </button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    connectedAccounts: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['connect', 'disconnect'],
  setup(props, { emit }) {
    // Methods to connect and disconnect accounts
    const connectAccount = (provider) => {
      emit('connect', provider);
    };
    
    const disconnectAccount = (provider) => {
      emit('disconnect', provider);
    };
    
    return {
      connectAccount,
      disconnectAccount
    };
  }
}
</script>

<style scoped>
.connected-accounts {
  background: var(--surface-card);
  border-radius: 1.1rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.25), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 1.5rem 1.2rem;
  color: var(--text);
  max-width: 420px;
  margin: 1.5rem auto 0 auto;
}
.connected-accounts h3 {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--primary);
  margin-bottom: 1.2rem;
  text-shadow: 0 0 8px var(--primary-glow);
}
.account-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 0.5rem;
  border-bottom: 1px solid var(--border-color, #23272e);
  font-size: 1.05rem;
  transition: background 0.18s;
}
.account-item:last-child {
  border-bottom: none;
}
.account-item.connected {
  background: var(--surface-2);
  box-shadow: 0 0 0 1.5px var(--primary-glow);
}
.account-item i.fab.fa-github {
  color: #6e40c9;
  font-size: 1.4rem;
  filter: drop-shadow(0 0 6px var(--primary-glow));
}
.account-item i.fab.fa-google {
  color: #ea4335;
  font-size: 1.4rem;
  filter: drop-shadow(0 0 6px var(--primary-glow));
}
.connect-btn, .disconnect-btn {
  margin-left: auto;
  padding: 0.45rem 1.1rem;
  border-radius: 0.5rem;
  font-weight: 700;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  box-shadow: 0 0 8px var(--primary-glow);
  transition: background 0.18s, color 0.18s, box-shadow 0.18s;
}
.connect-btn {
  background: var(--primary);
  color: #fff;
}
.connect-btn:hover {
  background: var(--primary-glow);
  color: #fff;
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
.disconnect-btn {
  background: #ff4d4f;
  color: #fff;
  box-shadow: 0 0 8px #ff4d4f88;
}
.disconnect-btn:hover {
  background: #d7263d;
  box-shadow: 0 0 16px 2px #ff4d4f;
}
</style>