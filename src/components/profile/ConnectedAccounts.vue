<template>
  <div class="connected-accounts-component">
    <div class="account-item" :class="{ 'connected': connectedAccounts?.github }">
      <div class="account-info">
        <i class="fab fa-github account-icon"></i>
        <span class="account-name">GitHub</span>
      </div>
      <button v-if="connectedAccounts?.github" class="btn btn-danger btn-sm" @click="disconnectAccount('github')">
        Disconnect
      </button>
      <button v-else class="btn btn-primary btn-sm" @click="connectAccount('github')">
        Connect
      </button>
    </div>

    <div class="account-item" :class="{ 'connected': connectedAccounts?.google }">
      <div class="account-info">
        <i class="fab fa-google account-icon"></i>
        <span class="account-name">Google</span>
      </div>
      <button v-if="connectedAccounts?.google" class="btn btn-danger btn-sm" @click="disconnectAccount('google')">
        Disconnect
      </button>
      <button v-else class="btn btn-primary btn-sm" @click="connectAccount('google')">
        Connect
      </button>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConnectedAccounts',
  props: {
    connectedAccounts: {
      type: Object,
      default: () => ({})
    }
  },
  emits: ['connect', 'disconnect'],
  setup(props, { emit }) {
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
.connected-accounts-component {
  /* No background or padding needed, handled by parent .settings-section */
}

.account-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.25rem 0;
  border-bottom: 1px solid #e5e7eb;
}

.account-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}

.account-item:first-child {
  padding-top: 0;
}

.account-info {
  display: flex;
  align-items: center;
  gap: 1rem;
  flex-grow: 1;
  margin-right: 1.5rem;
}

.account-icon {
  font-size: 1.5rem;
  color: #6b7280;
  width: 24px;
  text-align: center;
}

.account-name {
  font-weight: 500;
  color: #374151;
  font-size: 0.95rem;
}

.account-item.connected .account-icon {
  color: #10b981;
}

.account-item.connected .account-name {
  color: #1f2937;
}

.btn-sm {
  padding: 0.3rem 0.8rem;
  font-size: 0.8rem;
  min-width: 90px;
  text-align: center;
}

@media (max-width: 640px) {
  .account-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 0.75rem;
  }

  .account-info {
    margin-right: 0;
    margin-bottom: 0.5rem;
  }

  .btn {
    align-self: flex-start;
  }
}
</style>