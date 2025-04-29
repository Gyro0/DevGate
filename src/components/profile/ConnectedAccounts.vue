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