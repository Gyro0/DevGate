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
                <i class="fas fa-th-large"></i>
              </button>
              <button 
                :class="{ active: viewMode === 'list' }"
                @click="viewMode = 'list'"
                title="List View"
              >
                <i class="fas fa-list"></i>
              </button>
            </div>
            <button class="btn-primary" @click="showAddProjectModal = true">
              <span class="icon">+</span> Add Project
            </button>
          </div>
        </div>
        
        <div class="filter-bar">
          <ProjectFilterBar
            :modelValue="filters"
            @update:modelValue="handleFilterUpdate"
            :all-project-techs="allProjectTechnologies"
          />
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
import { ref, computed, onMounted, reactive, watch } from 'vue';
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
    const filters = reactive({
      search: '',
      tech: [],
      dateRange: null,
    });
    const showAddProjectModal = ref(false);
    const showDeleteConfirm = ref(false);
    const selectedProject = ref(null);
    const projectToDelete = ref(null);

    // Combined loading state
    const isLoading = computed(() => loading.value || authLoading.value);

    // Load projects on component mount
    onMounted(async () => {
      console.log("Projects component mounted, fetching projects...");
      try {
        await fetchUserProjects();
        console.log("Projects loaded:", projects.value?.length || 0);
      } catch (err) {
        console.error("Error in Projects onMounted:", err);
      }
    });

    // --- Add the update handler ---
    const handleFilterUpdate = (newFilters) => {
      console.log(">>> Projects.vue: handleFilterUpdate received:", JSON.stringify(newFilters));

      // Update the existing reactive object's properties
      // This preserves the reactive proxy and ensures dependents update.
      filters.search = newFilters.search || '';
      // Replace the array content reactively
      filters.tech.splice(0, filters.tech.length, ...(newFilters.tech || []));
      // Update or clear the dateRange object
      filters.dateRange = newFilters.dateRange ? { ...newFilters.dateRange } : null;

      // Note: No need to manually trigger filteredProjects recalculation,
      // modifying the 'filters' object's properties will do it automatically.
    };
    // --- End update handler ---

    const filteredProjects = computed(() => {
      console.log(`--- Recalculating filteredProjects ---`);
      console.log(`Current Filters:`, JSON.stringify(filters));

      // Start with all projects if available, otherwise empty array
      const baseProjects = Array.isArray(projects.value) ? projects.value : [];
      if (baseProjects.length === 0) {
        console.log("No base projects to filter.");
        return [];
      }
      console.log(`Starting with ${baseProjects.length} projects.`);

      // Apply filters sequentially
      let result = baseProjects.filter(project => {
        // Ensure project is valid
        if (!project || !project.id) return false;

        // --- 1. Search Filter ---
        const searchFilter = filters.search?.trim().toLowerCase();
        if (searchFilter) {
          const titleMatch = project.title?.toLowerCase().includes(searchFilter);
          const descMatch = project.description?.toLowerCase().includes(searchFilter);
          if (!titleMatch && !descMatch) {
            return false; // Does not match search term
          }
        }

        // --- 2. Technology Filter ---
        const techFilter = filters.tech;
        if (Array.isArray(techFilter) && techFilter.length > 0) {
          const projectTechs = Array.isArray(project.techStack) ? project.techStack : [];
          // Check if projectTechs includes ALL techs from techFilter
          const techMatch = techFilter.every(filterTech => projectTechs.includes(filterTech));
          if (!techMatch) {
            return false; // Does not match all required techs
          }
        }

        // --- 3. Date Range Filter ---
        const dateFilter = filters.dateRange;
        if (dateFilter && (dateFilter.start || dateFilter.end)) {
          let projectTimestamp = null;
          // Convert project createdAt to timestamp (handle Date objects and Firestore Timestamps)
          if (project.createdAt instanceof Date) {
            projectTimestamp = project.createdAt.getTime();
          } else if (project.createdAt?.seconds) {
            projectTimestamp = project.createdAt.seconds * 1000;
          }

          if (projectTimestamp) {
            // Get start of the start day
            const startDate = dateFilter.start
              ? new Date(new Date(dateFilter.start).setHours(0, 0, 0, 0)).getTime()
              : null;
            // Get end of the end day
            const endDate = dateFilter.end
              ? new Date(new Date(dateFilter.end).setHours(23, 59, 59, 999)).getTime()
              : null;

            if (startDate && projectTimestamp < startDate) {
              return false; // Before start date
            }
            if (endDate && projectTimestamp > endDate) {
              return false; // After end date
            }
          } else {
             // Decide if projects without a date should be excluded when date filter is active
             // return false; // Uncomment to exclude projects without a date if a date filter is set
          }
        }

        // If we reach here, the project passes all active filters
        return true;
      });

      console.log(`Finished filtering. Result count: ${result.length}`);
      console.log(`--- End Recalculating ---`);
      return result;
    });

    const allProjectTechnologies = computed(() => {
      if (!projects.value || projects.value.length === 0) {
        return [];
      }
      const allTechs = projects.value.flatMap(p => p.techStack || []);
      return [...new Set(allTechs)].sort((a, b) => a.localeCompare(b));
    });

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
        let savedProject;
        if (selectedProject.value?.id) {
          savedProject = await updateProject(selectedProject.value.id, projectData, imageFile);
          await recordEvent('project', 'updated', savedProject.id, { title: savedProject.title });
        } else {
          savedProject = await addProject(projectData, imageFile);
          console.log("Project created:", savedProject);
          await recordEvent('project', 'added', savedProject.id, { title: savedProject.title });
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
        cancelDelete();
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
      loading: isLoading,
      error,
      viewMode,
      filters,
      filteredProjects,
      allProjectTechnologies,
      showAddProjectModal,
      showDeleteConfirm,
      selectedProject,
      projectToDelete,
      editProject,
      confirmDeleteProject,
      saveProject,
      deleteProject,
      cancelDelete,
      closeProjectModal,
      handleFilterUpdate
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
  padding: 1.5rem 2rem;
  overflow-y: auto;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.page-header h1 {
  color: var(--text-color);
  font-size: 1.8rem;
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
  background: var(--surface-ground);
  border-radius: 8px;
  border: 1px solid var(--border-color);
  padding: 0.25rem;
}

.view-toggle button {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-size: 1.1rem;
  padding: 0.4rem 0.7rem;
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.2s;
  line-height: 1;
}

.view-toggle button.active, .view-toggle button:hover {
  background: var(--primary);
  color: white;
  box-shadow: 0 0 8px var(--primary-glow);
}

.btn-primary {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px var(--primary-glow, rgba(79, 70, 229, 0.2));
  transition: all 0.3s ease;
}

.btn-primary:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--primary-glow, rgba(79, 70, 229, 0.3));
}

.btn-primary .icon {
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1;
}

.filter-bar {
  margin-bottom: 2rem;
}

.projects-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 1.5rem;
}

.projects-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.empty-state {
  background: var(--surface-card);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
  border: 1px solid var(--border-color);
  padding: 2.5rem 1.5rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  margin-top: 2rem;
}

.empty-icon {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background-color: var(--surface-ground);
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 1rem;
  border: 1px solid var(--border-color);
}

.empty-icon i {
  font-size: 1.5rem;
  color: var(--primary);
}

.empty-state h3 {
  margin: 0 0 0.5rem 0;
  color: var(--text);
  font-weight: 600;
}

.empty-state p {
  color: var(--text-secondary);
  margin: 0 0 1rem 0;
  font-size: 0.95rem;
}

.empty-state .action-btn {
  background-color: var(--primary);
  color: white;
  border: none;
  padding: 0.75rem 1.5rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.95rem;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  box-shadow: 0 2px 8px var(--primary-glow, rgba(79, 70, 229, 0.2));
  transition: all 0.3s ease;
}

.empty-state .action-btn:hover {
  background-color: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: 0 4px 16px var(--primary-glow, rgba(79, 70, 229, 0.3));
}

.loading-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 300px;
  color: var(--text-secondary);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--surface-ground);
  border-top: 4px solid var(--primary);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

@media (max-width: 768px) {
  .content-area {
    padding: 1rem;
  }
  .page-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 1rem;
  }
  .header-actions {
    width: 100%;
    justify-content: space-between;
  }
  .projects-gallery {
    grid-template-columns: 1fr;
  }
}
</style>