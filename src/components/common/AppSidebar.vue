<template>
  <aside class="app-sidebar" :class="{ 'collapsed': isCollapsed }">
    <div class="sidebar-toggle" @click="toggleSidebar">
      <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
    </div>
    
    <div class="sidebar-content">
      <nav class="sidebar-navigation">
        <router-link to="/dashboard" class="nav-item" :class="{ 'active': activePage === 'dashboard' }">
          <i class="fas fa-th-large"></i>
          <span v-if="!isCollapsed">Dashboard</span>
        </router-link>
        
        <router-link to="/skills" class="nav-item" :class="{ 'active': activePage === 'skills' }">
          <i class="fas fa-chart-line"></i>
          <span v-if="!isCollapsed">Skills</span>
        </router-link>
        
        <router-link to="/projects" class="nav-item" :class="{ 'active': activePage === 'projects' }">
          <i class="fas fa-code"></i>
          <span v-if="!isCollapsed">Projects</span>
        </router-link>
        
        <router-link to="/timeline" class="nav-item" :class="{ 'active': activePage === 'timeline' }">
          <i class="fas fa-clock"></i>
          <span v-if="!isCollapsed">Timeline</span>
        </router-link>
        
        <router-link to="/objectives" class="nav-item" :class="{ 'active': activePage === 'objectives' }">
          <i class="fas fa-bullseye"></i>
          <span v-if="!isCollapsed">Objectives</span>
        </router-link>
      </nav>
      
      <div class="sidebar-separator"></div>
      
      <nav class="sidebar-navigation">
        <router-link to="/profile" class="nav-item" :class="{ 'active': activePage === 'profile' }">
          <i class="fas fa-user"></i>
          <span v-if="!isCollapsed">Profile</span>
        </router-link>
        
        <router-link to="/settings" class="nav-item" :class="{ 'active': activePage === 'settings' }">
          <i class="fas fa-cog"></i>
          <span v-if="!isCollapsed">Settings</span>
        </router-link>
      </nav>
    </div>
  </aside>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'AppSidebar',
  props: {
    activePage: {
      type: String,
      default: 'dashboard'
    }
  },
  setup() {
    const isCollapsed = ref(false);

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value;
      
      // Save preference to localStorage
      localStorage.setItem('sidebarCollapsed', isCollapsed.value);
    };

    // Check localStorage for saved preference
    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      isCollapsed.value = true;
    }

    return {
      isCollapsed,
      toggleSidebar
    };
  }
}
</script>

<style scoped>
.app-sidebar {
  width: 240px;
  background-color: #ffffff;
  box-shadow: 1px 0 3px rgba(0, 0, 0, 0.05);
  transition: width 0.3s;
  position: relative;
  min-height: calc(100vh - 64px);
}

.app-sidebar.collapsed {
  width: 64px;
}

.sidebar-toggle {
  position: absolute;
  top: 16px;
  right: -12px;
  width: 24px;
  height: 24px;
  background-color: #ffffff;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  z-index: 1;
}

.sidebar-content {
  display: flex;
  flex-direction: column;
  padding: 1rem 0;
  height: 100%;
}

.sidebar-navigation {
  display: flex;
  flex-direction: column;
  padding: 0.5rem 0;
}

.nav-item {
  display: flex;
  align-items: center;
  padding: 0.75rem 1.5rem;
  color: #4b5563;
  text-decoration: none;
  transition: all 0.2s;
  margin: 0.25rem 0;
}

.nav-item i {
  font-size: 1.25rem;
  margin-right: 1rem;
  min-width: 20px;
  text-align: center;
}

.collapsed .nav-item {
  padding: 0.75rem;
  justify-content: center;
}

.collapsed .nav-item i {
  margin-right: 0;
}

.nav-item:hover {
  color: #111827;
  background-color: #f3f4f6;
}

.nav-item.active {
  color: #4f46e5;
  background-color: #eff6ff;
  font-weight: 500;
}

.sidebar-separator {
  height: 1px;
  background-color: #e5e7eb;
  margin: 0.5rem 1rem;
}

@media (max-width: 768px) {
  .app-sidebar {
    width: 64px;
  }
  
  .app-sidebar:not(.collapsed) {
    width: 240px;
    position: absolute;
    z-index: 50;
    height: 100vh;
  }
  
  .sidebar-toggle {
    display: none;
  }
}
</style>