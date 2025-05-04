<template>
  <div class="connected-accounts">
    <h3 class="h5 fw-bold mb-4">Connected Accounts</h3>

    <!-- GitHub Account -->
    <div class="d-flex align-items-center justify-content-between mb-3 p-3 border rounded">
      <div class="d-flex align-items-center">
        <i class="fab fa-github fa-2x text-dark me-3"></i>
        <span class="fw-bold">GitHub</span>
      </div>
      <div>
        <button
          v-if="connectedAccounts?.github"
          class="btn btn-outline-danger btn-sm"
          @click="disconnectAccount('github')"
        >
          Disconnect
        </button>
        <button
          v-else
          class="btn btn-outline-primary btn-sm"
          @click="connectAccount('github')"
        >
          Connect
        </button>
      </div>
    </div>

    <!-- Google Account -->
    <div class="d-flex align-items-center justify-content-between mb-3 p-3 border rounded">
      <div class="d-flex align-items-center">
        <i class="fab fa-google fa-2x text-danger me-3"></i>
        <span class="fw-bold">Google</span>
      </div>
      <div>
        <button
          v-if="connectedAccounts?.google"
          class="btn btn-outline-danger btn-sm"
          @click="disconnectAccount('google')"
        >
          Disconnect
        </button>
        <button
          v-else
          class="btn btn-outline-primary btn-sm"
          @click="connectAccount('google')"
        >
          Connect
        </button>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    connectedAccounts: {
      type: Object,
      default: () => ({}),
    },
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
      disconnectAccount,
    };
  },
};
</script>

<style scoped>
.connected-accounts {
  background-color: #ffffff;
}
</style>