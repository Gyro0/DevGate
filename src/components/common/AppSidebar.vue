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
  background: var(--surface);
  box-shadow: 1px 0 8px var(--highlight);
  border-right: 1.5px solid var(--highlight);
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
  background: var(--background);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 8px var(--highlight);
  border: 1.5px solid var(--highlight);
  cursor: pointer;
  z-index: 1;
  color: var(--primary);
  transition: box-shadow 0.2s, border-color 0.2s;
}
.sidebar-toggle:hover {
  border-color: var(--primary);
  box-shadow: 0 0 12px var(--primary);
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
  color: var(--text);
  text-decoration: none;
  transition: all 0.2s;
  margin: 0.25rem 0;
  border-radius: 0.75rem;
  font-weight: 500;
}

.nav-item i {
  font-size: 1.25rem;
  margin-right: 1rem;
  min-width: 20px;
  text-align: center;
  color: var(--highlight);
  transition: color 0.2s;
}

.collapsed .nav-item {
  padding: 0.75rem;
  justify-content: center;
}

.collapsed .nav-item i {
  margin-right: 0;
}

.nav-item:hover {
  color: var(--primary);
  background: rgba(30, 203, 225, 0.08);
  box-shadow: 0 0 8px var(--highlight);
}

.nav-item.active {
  color: var(--secondary);
  background: rgba(255, 153, 0, 0.12);
  font-weight: 700;
  box-shadow: 0 0 12px var(--secondary);
}

.sidebar-separator {
  height: 1px;
  background: var(--border);
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