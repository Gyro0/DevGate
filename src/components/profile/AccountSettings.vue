<template>
  <div class="account-settings card shadow-sm border-0 p-4">
    <h2 class="h5 fw-bold mb-4">Account Settings</h2>

    <!-- Email Section -->
    <div class="mb-4">
      <h3 class="h6 fw-bold">Email Address</h3>
      <p class="text-muted">{{ userProfile?.email || 'No email set' }}</p>
      <button @click="$emit('changeEmail')" class="btn btn-outline-primary btn-sm">
        Change Email
      </button>
    </div>

    <!-- Password Section -->
    <div class="mb-4">
      <h3 class="h6 fw-bold">Password</h3>
      <p class="text-muted">••••••••</p>
      <button @click="$emit('changePassword')" class="btn btn-outline-primary btn-sm">
        Change Password
      </button>
    </div>

    <!-- Connected Accounts -->
    <div class="mb-4">
      <h3 class="h6 fw-bold">Connected Accounts</h3>
      <ConnectedAccounts v-if="userProfile?.connectedAccounts" :accounts="userProfile.connectedAccounts" />
    </div>

    <!-- Danger Zone -->
    <div class="mb-4">
      <h3 class="h6 fw-bold text-danger">Danger Zone</h3>
      <button @click="$emit('deleteAccount')" class="btn btn-danger btn-sm">
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
    ConnectedAccounts,
  },
  props: {
    userProfile: {
      type: Object,
      required: true,
      default: () => ({
        email: '',
        connectedAccounts: {},
      }),
    },
  },
  emits: ['changeEmail', 'changePassword', 'deleteAccount'],
};
</script>

<style scoped>
.account-settings {
  background-color: #ffffff;
  border-radius: 8px;
}
</style>