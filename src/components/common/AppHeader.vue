<template>
  <header class="app-header bg-white shadow-sm sticky-top">
    <div class="container-fluid d-flex align-items-center justify-content-between py-2">
      <!-- Logo Section -->
      <div class="d-flex align-items-center">
        <router-link to="/dashboard" class="d-flex align-items-center text-decoration-none text-dark">
          <img src="@/assets/logo.png" alt="DevGate" class="logo me-2" />
        </router-link>
      </div>

      <!-- Search Section -->
      <div class="d-none d-md-flex flex-grow-1 mx-3">
        <div class="input-group">
          <span class="input-group-text bg-light border-0">
            <i class="fas fa-search text-muted"></i>
          </span>
          <input
            type="text"
            class="form-control border-0 bg-light"
            placeholder="Search..."
            v-model="searchQuery"
            @keyup.enter="performSearch"
          />
        </div>
      </div>

      <!-- User Section -->
      <div class="dropdown">
        <button
          class="btn btn-light d-flex align-items-center"
          type="button"
          id="userMenuButton"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            :src="user?.photoURL || '/default-avatar.png'"
            alt="Profile"
            class="rounded-circle me-2"
            style="width: 32px; height: 32px; object-fit: cover;"
          />
          <span class="d-none d-md-inline">{{ user?.displayName || 'User' }}</span>
          <i class="fas fa-chevron-down ms-2"></i>
        </button>
        <ul class="dropdown-menu dropdown-menu-end" aria-labelledby="userMenuButton">
          <li class="dropdown-header text-muted">
            Signed in as <strong>{{ user?.displayName }}</strong>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <router-link to="/profile" class="dropdown-item">
              <i class="fas fa-user me-2"></i> Your Profile
            </router-link>
          </li>
          <li>
            <router-link to="/settings" class="dropdown-item">
              <i class="fas fa-cog me-2"></i> Settings
            </router-link>
          </li>
          <li><hr class="dropdown-divider" /></li>
          <li>
            <button @click="logout" class="dropdown-item">
              <i class="fas fa-sign-out-alt me-2"></i> Sign Out
            </button>
          </li>
        </ul>
      </div>
    </div>
  </header>
</template>

<script>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '@/composables/useAuth';

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const { user, logout: authLogout } = useAuth();

    const searchQuery = ref('');

    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: '/search',
          query: { q: searchQuery.value.trim() },
        });
        searchQuery.value = '';
      }
    };

    const logout = async () => {
      await authLogout();
    };

    return {
      user,
      searchQuery,
      performSearch,
      logout,
    };
  },
};
</script>

<style scoped>
.logo {
  height: 32px;
}

.input-group-text {
  border-radius: 20px 0 0 20px;
}

.form-control {
  border-radius: 0 20px 20px 0;
}

@media (max-width: 768px) {
  .logo-text {
    display: none;
  }
}
</style>