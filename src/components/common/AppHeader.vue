<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo-section">
        <router-link to="/dashboard" class="logo-link">
          <span class="logo-text">DevGate</span>
        </router-link>
      </div>
      
      <div class="search-section">
        <div class="search-box">
          <i class="fas fa-search search-icon"></i>
          <input 
            type="text" 
            placeholder="Search..." 
            v-model="searchQuery"
            @keyup.enter="performSearch"
          />
        </div>
      </div>
      
      <div class="user-section">
        
        <div class="user-menu" @click="showUserMenu = !showUserMenu">
          <img 
            :src="user?.photoURL || '/default.jpg'" 
            alt="Profile" 
            class="user-avatar"
          />
          <span class="user-name">{{ user?.displayName || 'User' }}</span>
          <i class="fas fa-chevron-down"></i>
        </div>
        
        <!-- User Menu Dropdown -->
        <div v-if="showUserMenu" class="user-dropdown">
          <div class="dropdown-header">
            <span>Signed in as : </span>
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
  background: var(--surface);
  box-shadow: 0 2px 12px 0 rgba(30, 203, 225, 0.08), 0 0 0 2px var(--highlight);
  border-bottom: 1.5px solid var(--highlight);
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
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 1px;
}

.logo-text {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--primary);
  text-shadow: 0 0 8px var(--highlight);
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
  color: var(--highlight);
}

.search-box input {
  width: 100%;
  padding: 0.5rem 1rem 0.5rem 2.5rem;
  border: 1.5px solid var(--highlight);
  border-radius: 20px;
  font-size: 0.95rem;
  background: var(--background);
  color: var(--text);
  transition: all 0.2s;
  box-shadow: 0 0 8px var(--highlight);
}

.search-box input:focus {
  outline: none;
  background: var(--surface);
  border-color: var(--primary);
  box-shadow: 0 0 0 2px var(--highlight);
  color: var(--text);
}

.user-section {
  display: flex;
  align-items: center;
  position: relative;
}

.user-menu {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  cursor: pointer;
  background: var(--background);
  border-radius: 2rem;
  padding: 0.25rem 1.2rem 0.25rem 0.7rem;
  box-shadow: 0 0 8px var(--highlight);
  border: 1.5px solid var(--highlight);
  color: var(--text);
  transition: box-shadow 0.2s, border-color 0.2s;
  min-width: 140px;
  max-width: 220px;
  overflow: hidden;
}
.user-menu:hover {
  border-color: var(--primary);
  box-shadow: 0 0 12px var(--primary);
}
.user-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid var(--highlight);
  box-shadow: 0 0 8px var(--highlight);
  margin: 0;
  background: var(--surface);
  object-fit: cover;
  flex-shrink: 0;
}
.user-name {
  font-weight: 600;
  color: var(--primary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  max-width: 120px;
  display: inline-block;
}
.user-dropdown {
  position: absolute;
  right: 0;
  top: 110%;
  background: var(--surface);
  border: 1.5px solid var(--highlight);
  border-radius: 1rem;
  box-shadow: 0 4px 32px 0 rgba(30, 203, 225, 0.08), 0 0 0 2px var(--highlight);
  min-width: 200px;
  z-index: 200;
  padding: 1rem 0.5rem;
}
.dropdown-header {
  padding: 0.5rem 1rem;
  color: var(--text);
  margin-bottom: 0.5rem;
}
.dropdown-divider {
  height: 1px;
  background: var(--border);
  margin: 0.5rem 0;
}
.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  color: var(--text);
  text-decoration: none;
  border-radius: 0.5rem;
  transition: background 0.2s, color 0.2s;
  cursor: pointer;
}
.dropdown-item:hover {
  background: var(--highlight);
  color: var(--background);
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