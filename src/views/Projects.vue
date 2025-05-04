<template>
  <div class="projects-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar :active-page="'projects'" />
      
      <div class="content-area">
        <div class="page-header">
          <h1>My Projects</h1>
          <div class="header-actions">
            <div class="view-toggle">
              <button 
                :class="{ active: viewMode === 'gallery' }"
                @click="viewMode = 'gallery'"
                title="Gallery View"
              >
                <span class="material-icons">grid_view</span>
              </button>
              <button 
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
                title="List View"
              >
                <span class="material-icons">view_list</span>
              </button>
            </div>
            <button class="btn-primary" @click="showAddProjectModal = true">
              <span class="icon">+</span> Add Project
            </button>
          </div>
        </div>
        
        <div class="filter-bar">
          <ProjectFilterBar v-model="filters" />
        </div>
        
        <div v-if="loading" class="loading-container">
          <div class="spinner"></div>
          <p>Loading projects...</p>
        </div>
        
        <!-- Project lists with nullcheck for projects array -->
        <template v-else>
          <div v-if="filteredProjects && filteredProjects.length > 0">
            <!-- Gallery view -->
            <div v-if="viewMode === 'gallery'" class="projects-gallery">
              <ProjectCard 
                v-for="project in filteredProjects" 
                :key="project.id" 
                :project="project"
                @edit="editProject"
                @delete="confirmDeleteProject"
              />
            </div>
            
            <!-- List view -->
            <div v-else class="projects-list">
              <ProjectListItem 
                v-for="project in filteredProjects" 
                :key="project.id" 
                :project="project"
                @edit="editProject"
                @delete="confirmDeleteProject"
              />
            </div>
          </div>
          
          <!-- No projects state -->
          <div v-else class="empty-state">
            <div class="empty-icon">
              <i class="fas fa-folder-open"></i>
            </div>
            <h3>No Projects Found</h3>
            <p>Create your first project to get started!</p>
            <button @click="showAddProjectModal = true" class="action-btn">
              <i class="fas fa-plus"></i> Add Project
            </button>
          </div>
        </template>
      </div>
    </div>
    
    <!-- Project form modal for add/edit -->
    <ProjectFormModal
      v-if="showAddProjectModal"
      :project="selectedProject"
      @save="saveProject"
      @close="closeProjectModal"
    />
    
    <!-- Confirmation dialog -->
    <ConfirmDialog
      v-if="showDeleteConfirm"
      :message="`Delete project '${projectToDelete?.title}'?`"
      @confirm="deleteProject"
      @cancel="cancelDelete"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar.vue';
import ProjectCard from '@/components/projects/ProjectCard.vue';
import ProjectListItem from '@/components/projects/ProjectListItem.vue';
import ProjectFormModal from '@/components/projects/ProjectFormModal.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import useProjects from '@/composables/useProjects';
import useTimeline from '@/composables/useTimeline';
import useAuth from '@/composables/useAuth';

export default {
  name: 'ProjectsView',
  components: {
    AppHeader,
    AppSidebar,
    ProjectFilterBar,
    ProjectCard,
    ProjectListItem,
    ProjectFormModal,
    ConfirmDialog
  },
  setup() {
    const { 
      projects, 
      loading,
      error,
      fetchUserProjects, 
      addProject, 
      updateProject, 
      deleteProject: removeProject  
    } = useProjects();
    
    const { recordEvent } = useTimeline();
    const { isAuthenticated, loading: authLoading } = useAuth();
    
    // UI state management
    const viewMode = ref('gallery');
    const filters = ref({ status: 'all', search: '' });
    const showAddProjectModal = ref(false);
    const showDeleteConfirm = ref(false);
    const selectedProject = ref(null);
    const projectToDelete = ref(null);
    
    // Combined loading state
    const isLoading = computed(() => loading.value || authLoading.value);
    
    // Load projects on component mount with better error handling
    onMounted(async () => {
      console.log("Projects component mounted, fetching projects...");
      try {
        await fetchUserProjects();
        console.log("Projects loaded:", projects.value?.length || 0);
      } catch (error) {
        console.error("Error in Projects onMounted:", error);
      }
    });
    
    // Filter projects based on selected filters
    const filteredProjects = computed(() => {
      if (!projects.value) return [];
      
      return projects.value.filter(project => {
        // Filter by status
        if (filters.value.status !== 'all' && project.status !== filters.value.status) {
          return false;
        }
        
        // Filter by search term
        if (filters.value.search && 
            !project.title.toLowerCase().includes(filters.value.search.toLowerCase()) &&
            !project.description?.toLowerCase().includes(filters.value.search.toLowerCase())) {
          return false;
        }
        
        return true;
      });
    });
    
    // Project actions
    const editProject = (project) => {
      selectedProject.value = { ...project };
      showAddProjectModal.value = true;
    };
    
    const confirmDeleteProject = (project) => {
      projectToDelete.value = project;
      showDeleteConfirm.value = true;
    };
    
    const cancelDelete = () => {
      projectToDelete.value = null;
      showDeleteConfirm.value = false;
    };
    
    const saveProject = async (projectData, imageFile) => {
      console.log("Saving project:", projectData);
      try {
        if (selectedProject.value?.id) {
          // Update existing project
          const updatedProject = await updateProject(selectedProject.value.id, projectData, imageFile);
          await recordEvent('project', 'updated', updatedProject.id, { title: updatedProject.title });
        } else {
          // Add new project
          const newProject = await addProject(projectData, imageFile);
          console.log("Project created:", newProject);
          await recordEvent('project', 'added', newProject.id, { title: newProject.title });
        }
        closeProjectModal();
      } catch (err) {
        console.error("Error saving project:", err);
        alert(`Failed to save project: ${err.message}`);
      }
    };
    
    const deleteProject = async () => {
      if (!projectToDelete.value?.id) return;
      
      try {
        await removeProject(projectToDelete.value.id);
        await recordEvent('project', 'deleted', projectToDelete.value.id, { title: projectToDelete.value.title });
        showDeleteConfirm.value = false;
        projectToDelete.value = null;
      } catch (err) {
        console.error("Error deleting project:", err);
        alert(`Failed to delete project: ${err.message}`);
      }
    };
    
    const closeProjectModal = () => {
      showAddProjectModal.value = false;
      selectedProject.value = null;
    };
    
    return {
      projects,
      loading: isLoading, // Use the combined loading state
      error,
      viewMode,
      filters,
      filteredProjects,
      showAddProjectModal,
      showDeleteConfirm,
      selectedProject,
      projectToDelete,
      editProject,
      confirmDeleteProject,
      saveProject,
      deleteProject,
      cancelDelete,
      closeProjectModal
    };
  }
}
</script>

<style scoped>
.projects-view {
  min-height: 100vh;
  background-color: var(--bg-main);
}

.main-layout {
  display: flex;
  min-height: calc(100vh - 64px);
}

.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.page-header h1 {
  color: var(--text-color);
  font-size: 2rem;
  font-weight: 700;
  margin: 0;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  gap: 0.5rem;
  background: var(--bg-darker);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  padding: 0.25rem 0.5rem;
}

.view-toggle button {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.3rem;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
}

.view-toggle button.active, .view-toggle button:hover {
  background: var(--primary-color);
  color: white;
}

.btn-primary {
  background-color: var(--primary-color);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.12);
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.18);
}

.icon {
  font-size: 1.2rem;
  font-weight: bold;
}

.filter-bar {
  margin-bottom: 1.5rem;
}

.projects-gallery, .projects-list {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
  gap: 1.5rem;
}

.empty-state {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
  padding: 2.5rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: var(--bg-darker);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
}

.empty-icon i {
  font-size: 1.5rem;
  color: var(--primary-color);
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text-color);
  font-weight: 600;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0;
  font-size: 0.95rem;
}

.empty-state .action-btn {
  background: var(--primary-color);
  color: white;
  border: none;
  border-radius: 8px;
  padding: 0.75rem 1.5rem;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px rgba(79, 70, 229, 0.12);
  transition: all 0.3s ease;
}

.empty-state .action-btn:hover {
  background: var(--primary-color-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px rgba(79, 70, 229, 0.18);
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 200px;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--border-color);
  border-top: 4px solid var(--primary-color);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 900px) {
  .projects-gallery, .projects-list {
    grid-template-columns: 1fr;
  }
}
</style>