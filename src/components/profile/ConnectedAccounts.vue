<template>
    <div class="connected-accounts">
      <h3>Connected Accounts</h3>
      <div class="account-item" :class="{ 'connected': userProfile.connectedAccounts?.github }">
        <i class="fab fa-github"></i>
        <span>GitHub</span>
        <button v-if="userProfile.connectedAccounts?.github" class="disconnect-btn" @click="disconnectAccount('github')">
          Disconnect
        </button>
        <button v-else class="connect-btn" @click="connectAccount('github')">
          Connect
        </button>
      </div>
      
      <div class="account-item" :class="{ 'connected': userProfile.connectedAccounts?.google }">
        <i class="fab fa-google"></i>
        <span>Google</span>
        <button v-if="userProfile.connectedAccounts?.google" class="disconnect-btn" @click="disconnectAccount('google')">
          Disconnect
        </button>
        <button v-else class="connect-btn" @click="connectAccount('google')">
          Connect
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const userProfile = ref({
    connectedAccounts: {
      github: false,
      google: false,
    },
  });
  
  const connectAccount = (provider) => {
    // Logic to connect the account
    console.log(`Connecting ${provider} account...`);
  };
  
  const disconnectAccount = (provider) => {
    // Logic to disconnect the account
    console.log(`Disconnecting ${provider} account...`);
  };
  </script>
  
  <style scoped>
  .connected-accounts {
    margin-top: 1rem;
  }
  
  .account-item {
    display: flex;
    align-items: center;
    margin-bottom: 1rem;
  }
  
  .account-item i {
    margin-right: 0.5rem;
  }
  
  .connect-btn, .disconnect-btn {
    margin-left: auto;
    padding: 0.5rem 1rem;
    border: none;
    border-radius: 4px;
    cursor: pointer;
  }
  
  .connect-btn {
    background-color: #4CAF50;
    color: white;
  }
  
  .disconnect-btn {
    background-color: #f44336;
    color: white;
  }
  </style>