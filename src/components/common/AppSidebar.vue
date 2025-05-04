<template>
  <aside :class="['app-sidebar bg-white shadow-sm', { collapsed: isCollapsed }]">
    <!-- Logo Section -->
    <div class="sidebar-logo d-flex align-items-center justify-content-center py-3">
      <img src="@/assets/logo.png" alt="DevGate Logo" class="logo" />
    </div>

    <!-- Sidebar Toggle -->
    <div class="sidebar-toggle d-flex align-items-center justify-content-center" @click="toggleSidebar">
      <i :class="isCollapsed ? 'fas fa-chevron-right' : 'fas fa-chevron-left'"></i>
    </div>

    <!-- Sidebar Content -->
    <div class="sidebar-content">
      <!-- Navigation Links -->
      <nav class="nav flex-column">
        <router-link
          to="/dashboard"
          class="nav-link d-flex align-items-center"
          :class="{ active: activePage === 'dashboard' }"
        >
          <i class="fas fa-th-large me-2"></i>
          <span v-if="!isCollapsed">Dashboard</span>
        </router-link>

        <router-link
          to="/skills"
          class="nav-link d-flex align-items-center"
          :class="{ active: activePage === 'skills' }"
        >
          <i class="fas fa-chart-line me-2"></i>
          <span v-if="!isCollapsed">Skills</span>
        </router-link>

        <router-link
          to="/projects"
          class="nav-link d-flex align-items-center"
          :class="{ active: activePage === 'projects' }"
        >
          <i class="fas fa-code me-2"></i>
          <span v-if="!isCollapsed">Projects</span>
        </router-link>

        <router-link
          to="/timeline"
          class="nav-link d-flex align-items-center"
          :class="{ active: activePage === 'timeline' }"
        >
          <i class="fas fa-clock me-2"></i>
          <span v-if="!isCollapsed">Timeline</span>
        </router-link>

        <router-link
          to="/objectives"
          class="nav-link d-flex align-items-center"
          :class="{ active: activePage === 'objectives' }"
        >
          <i class="fas fa-bullseye me-2"></i>
          <span v-if="!isCollapsed">Objectives</span>
        </router-link>
      </nav>

      <!-- Separator -->
      <hr class="my-3" />

      <!-- Profile and Settings -->
      <nav class="nav flex-column">
        <router-link
          to="/profile"
          class="nav-link d-flex align-items-center"
          :class="{ active: activePage === 'profile' }"
        >
          <i class="fas fa-user me-2"></i>
          <span v-if="!isCollapsed">Profile</span>
        </router-link>

        <router-link
          to="/settings"
          class="nav-link d-flex align-items-center"
          :class="{ active: activePage === 'settings' }"
        >
          <i class="fas fa-cog me-2"></i>
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
      default: 'dashboard',
    },
  },
  setup() {
    const isCollapsed = ref(false);

    const toggleSidebar = () => {
      isCollapsed.value = !isCollapsed.value;
      localStorage.setItem('sidebarCollapsed', isCollapsed.value);
    };

    if (localStorage.getItem('sidebarCollapsed') === 'true') {
      isCollapsed.value = true;
    }

    return {
      isCollapsed,
      toggleSidebar,
    };
  },
};
</script>

<style scoped>
/* Sidebar Styling */
.app-sidebar {
  width: 240px;
<<<<<<< HEAD
  background: var(--surface);
  box-shadow: 1px 0 8px var(--highlight);
  border-right: 1.5px solid var(--highlight);
  transition: width 0.3s;
  position: relative;
  min-height: calc(100vh - 64px);
=======
  transition: width 0.3s ease;
  min-height: 100vh;
  overflow: hidden;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.app-sidebar.collapsed {
  width: 64px;
}

.sidebar-logo {
  border-bottom: 1px solid #e9ecef;
}

.logo {
  height: 40px;
}

.sidebar-toggle {
<<<<<<< HEAD
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
=======
  height: 48px;
  cursor: pointer;
  background-color: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

.nav-link {
  padding: 0.75rem 1rem;
  color: #6c757d;
  transition: background-color 0.2s, color 0.2s;
}

<<<<<<< HEAD
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
=======
.nav-link.active {
  background-color: #e9ecef;
  color: #0d6efd;
  font-weight: 500;
}

.nav-link:hover {
  background-color: #f8f9fa;
  color: #0d6efd;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
}

hr {
  border-color: #e9ecef;
}

/* Responsive Sidebar */
@media (max-width: 768px) {
  .app-sidebar {
    position: absolute;
    z-index: 1050;
    width: 64px;
  }
<<<<<<< HEAD
  .app-sidebar:not(.collapsed) {
    width: 240px;
    position: absolute;
    z-index: 50;
    height: 100vh;
  }
  .sidebar-toggle {
    display: none;
=======

  .app-sidebar:not(.collapsed) {
    width: 240px;
>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
  }
}
</style>