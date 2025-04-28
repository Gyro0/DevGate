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
        
        <ProjectGallery
          v-if="viewMode === 'gallery'"
          :projects="filteredProjects"
          @edit="editProject"
          @delete="confirmDeleteProject"
        />
        
        <ProjectList
          v-else
          :projects="filteredProjects"
          @edit="editProject"
          @delete="confirmDeleteProject"
        />
      </div>
    </div>
    
    <ProjectFormModal
      v-if="showAddProjectModal"
      :project="selectedProject"
      @save="saveProject"
      @close="closeProjectModal"
    />
    
    <ConfirmDialog
      v-if="showDeleteConfirm"
      :message="`Delete project '${projectToDelete?.title}'?`"
      @confirm="deleteProject"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import ProjectGallery from '@/components/projects/ProjectGallery.vue';
import ProjectList from '@/components/projects/ProjectList.vue';
import ProjectFilterBar from '@/components/projects/ProjectFilterBar.vue';
import ProjectFormModal from '@/components/projects/ProjectFormModal.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import useProjects from '@/composables/useProjects';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'ProjectsView',
  components: {
    AppHeader,
    AppSidebar,
    ProjectGallery,
    ProjectList,
    ProjectFilterBar,
    ProjectFormModal,
    ConfirmDialog
  },
  setup() {
    const { 
      projects, 
      loading: projectsLoading, 
      error: projectsError, 
      fetchUserProjects, 
      addProject, 
      updateProject, 
      deleteProject: removeProject 
    } = useProjects();
    const { recordEvent } = useTimeline();

    const viewMode = ref('gallery');
    const filters = ref({ tech: [], dateRange: null, search: '' });
    const showAddProjectModal = ref(false);
    const showDeleteConfirm = ref(false);
    const selectedProject = ref(null);
    const projectToDelete = ref(null);

    // Filter projects based on user filters
    const filteredProjects = computed(() => {
      return projects.value.filter(project => {
        // Filter by tech stack
        if (filters.value.tech.length > 0) {
          const projectTech = project.techStack || []; // Ensure techStack exists
          const hasTech = filters.value.tech.some(tech => 
            projectTech.includes(tech)
          );
          if (!hasTech) return false;
        }
        
        // Filter by date range (assuming createdAt is a Timestamp)
        if (filters.value.dateRange && project.createdAt?.seconds) {
          const { start, end } = filters.value.dateRange;
          const projectDate = new Date(project.createdAt.seconds * 1000);
          
          if ((start && projectDate < new Date(start)) || (end && projectDate > new Date(end))) {
            return false;
          }
        }
        
        // Filter by search term
        if (filters.value.search && !project.title.toLowerCase().includes(filters.value.search.toLowerCase())) {
          return false;
        }
        
        return true;
      });
    });

    // Fetch projects on component mount
    onMounted(async () => {
      await fetchUserProjects();
    });

    // Open edit modal for a project
    const editProject = (project) => {
      selectedProject.value = { ...project };
      showAddProjectModal.value = true;
    };

    // Initialize deletion process for a project
    const confirmDeleteProject = (project) => {
      projectToDelete.value = project;
      showDeleteConfirm.value = true;
    };

    // Delete the project after confirmation
    const deleteProject = async () => {
      if (!projectToDelete.value?.id) return;
      try {
        await removeProject(projectToDelete.value.id);
        await recordEvent('project', 'deleted', projectToDelete.value.id, { title: projectToDelete.value.title }); // Record minimal data
        showDeleteConfirm.value = false;
        projectToDelete.value = null;
      } catch (error) {
        console.error('Error deleting project:', error);
        // Handle error display
      }
    };

    // Save new or updated project
    const saveProject = async (projectData, imageFile) => {
      try {
        let savedProject;
        if (selectedProject.value?.id) {
          // Update existing project
          savedProject = await updateProject(selectedProject.value.id, projectData, imageFile);
          await recordEvent('project', 'updated', savedProject.id, { title: savedProject.title });
        } else {
          // Add new project
          savedProject = await addProject(projectData, imageFile);
          await recordEvent('project', 'added', savedProject.id, { title: savedProject.title });
        }
        closeProjectModal();
      } catch (error) {
        console.error('Error saving project:', error);
        // Handle error display
      }
    };

    // Close project modal and reset selection
    const closeProjectModal = () => {
      selectedProject.value = null;
      showAddProjectModal.value = false;
    };

    // Return reactive state and methods
    return {
      projects, // Raw projects if needed
      filteredProjects,
      viewMode,
      filters,
      showAddProjectModal,
      showDeleteConfirm,
      selectedProject,
      projectToDelete,
      editProject,
      confirmDeleteProject,
      deleteProject,
      saveProject,
      closeProjectModal,
      projectsLoading, // Expose loading/error if needed
      projectsError
    };
  }
}
</script>

<style scoped>
.projects-view {
  min-height: 100vh;
  background-color: #f8f9fa;
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

.header-actions {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.view-toggle {
  display: flex;
  border: 1px solid #e1e4e8;
  border-radius: 6px;
  overflow: hidden;
}

.view-toggle button {
  background: white;
  border: none;
  padding: 0.5rem 0.75rem;
  cursor: pointer;
  display: flex;
  align-items: center;
}

.view-toggle button.active {
  background-color: #4f46e5;
  color: white;
}

.filter-bar {
  margin-bottom: 1.5rem;
  background: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.btn-primary {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 0.6rem 1.2rem;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
}

.btn-primary:hover {
  background-color: #4338ca;
}

.icon {
  font-size: 1.2rem;
  font-weight: bold;
}

/* For material icons */
.material-icons {
  font-size: 18px;
}
</style>