<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-section">
        <router-link to="/dashboard" class="logo-link">
          <img src="@/assets/logo.png" alt="DevGate" class="logo" />
          <span class="logo-text">DevGate</span>
        </router-link>
      </div>
      
      
      
      <div class="user-section">
        
        <div class="user-menu" @click="showUserMenu = !showUserMenu">
          <img 
            :src="user?.photoURL || '/default-avatar.png'" 
            alt="Profile" 
            class="user-avatar"
          />
          <span class="user-name">{{ user?.displayName || 'User' }}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        
        <!-- User Menu Dropdown -->
        <div v-if="showUserMenu" class="user-dropdown">
          <div class="dropdown-header">
            <span>Signed in as</span>
            <strong>{{ user?.displayName }}</strong>
          </div>
          <div class="dropdown-divider"></div>
          <router-link to="/profile" class="dropdown-item">
            <i class="fas fa-user"></i> Your Profile
          </router-link>
          <router-link to="/settings" class="dropdown-item">
            <i class="fas fa-cog"></i> Settings
          </router-link>
          <div class="dropdown-divider"></div>
          <button @click="logout" class="dropdown-item">
            <i class="fas fa-sign-out-alt"></i> Sign Out
          </button>
        </div>
        
      </div>
    </div>
  </header>
</template>

<script>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import useAuth from '@/composables/useAuth';

export default {
  name: 'AppHeader',
  setup() {
    const router = useRouter();
    const { user, logout: authLogout } = useAuth();

    // UI state
    const showUserMenu = ref(false);
    const searchQuery = ref('');

    // Close dropdowns when clicking outside
    const handleClickOutside = (event) => {
      const userMenu = document.querySelector('.user-menu');
      const userDropdown = document.querySelector('.user-dropdown');
      
      if (userMenu && !userMenu.contains(event.target) && 
          userDropdown && !userDropdown.contains(event.target)) {
        showUserMenu.value = false;
      }
    };

    onMounted(() => {
      document.addEventListener('click', handleClickOutside);
    });

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside);
    });

    // Search functionality
    const performSearch = () => {
      if (searchQuery.value.trim()) {
        router.push({
          path: '/search',
          query: { q: searchQuery.value.trim() }
        });
        searchQuery.value = '';
      }
    };

    // Logout function
    const logout = async () => {
      await authLogout();
      // router.push('/login'); // useAuth already handles redirect
    };

    // Return reactive state and methods
    return {
      user,
      showUserMenu,
      searchQuery,
      performSearch,
      logout
    };
  }
}
</script>

<style scoped>
.app-header {
  height: 64px;
  background-color: #ffffff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  padding: 0 1.5rem;
}

.logo-section {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
  color: #333;
}

.logo {
  height: 32px;
  margin-right: 0.5rem;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 600;
}

.search-section {
  flex: 1;
  display: flex;
  justify-content: center;
  margin: 0 2rem;
}

.search-box {
  position: relative;
  width: 100%;
  max-width: 500px;
}

.search-icon {
  position: absolute;
  left: 12px;
  top: 50%;
  transform: translateY(-50%);
  color: #6b7280;
}

.search-box input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1px solid #e5e7eb;
  border-radius: 20px;
  font-size: 0.875rem;
  background-color: #f3f4f6;
  transition: all 0.2s;
}

.search-box input:focus {
  outline: none;
  background-color: white;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.1);
}

.user-section {
  display: flex;
  align-items: center;
  position: relative;
}

.user-menu {
  display: flex;
  align-items: center;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  transition: background-color 0.2s;
}

.user-menu:hover {
  background-color: #f3f4f6;
}

.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 0.5rem;
}

.user-name {
  margin-right: 0.5rem;
  font-weight: 500;
}

/* Dropdown styles */
.user-dropdown {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background-color: white;
  border-radius: 0.5rem;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08);
  width: 250px;
  z-index: 101;
}

.dropdown-header {
  padding: 0.75rem 1rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.dropdown-header span {
  color: #6b7280;
  font-size: 0.875rem;
}

.dropdown-header strong {
  color: #111827;
  display: block;
  font-size: 0.875rem;
}

.dropdown-divider {
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.25rem 0;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1rem;
  color: #374151;
  text-decoration: none;
  transition: background-color 0.2s;
  font-size: 0.875rem;
}

.dropdown-item i {
  margin-right: 0.75rem;
  width: 20px;
  text-align: center;
  color: #6b7280;
}

.dropdown-item:hover {
  background-color: #f3f4f6;
}

button.dropdown-item {
  width: 100%;
  text-align: left;
  background: none;
  border: none;
  cursor: pointer;
  font-family: inherit;
}

@media (max-width: 768px) {
  .user-name,
  .logo-text {
    display: none;
  }
  
  .search-section {
    margin: 0 1rem;
  }
}
</style>