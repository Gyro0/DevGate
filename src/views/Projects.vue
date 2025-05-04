<template>
  <div class="projects-view bg-light min-vh-100">
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-white p-0">
          <AppSidebar :active-page="'projects'" />
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 py-4">
          <!-- Page Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h4 fw-bold">My Projects</h1>
            <div class="d-flex align-items-center gap-3">
              <!-- View Toggle -->
              <div class="btn-group" role="group">
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  :class="{ active: viewMode === 'gallery' }"
                  @click="viewMode = 'gallery'"
                  title="Gallery View"
                >
                  <i class="fas fa-th"></i>
                </button>
                <button
                  type="button"
                  class="btn btn-outline-primary"
                  :class="{ active: viewMode === 'list' }"
                  @click="viewMode = 'list'"
                  title="List View"
                >
                  <i class="fas fa-list"></i>
                </button>
              </div>

              <!-- Add Project Button -->
              <button class="btn btn-primary" @click="showAddProjectModal = true">
                <i class="fas fa-plus me-2"></i> Add Project
              </button>
            </div>
          </div>

          <!-- Filter Bar -->
          <div class="card shadow-sm border-0 mb-4">
            <div class="card-body">
              <ProjectFilterBar v-model="filters" />
            </div>
          </div>

          <!-- Projects Display -->
          <div v-if="viewMode === 'gallery'">
            <ProjectGallery
              :projects="filteredProjects"
              @edit="editProject"
              @delete="confirmDeleteProject"
            />
          </div>
          <div v-else>
            <ProjectList
              :projects="filteredProjects"
              @edit="editProject"
              @delete="confirmDeleteProject"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- Modals -->
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
    ConfirmDialog,
  },
  setup() {
    const { projects, fetchUserProjects, addProject, updateProject, deleteProject: removeProject } = useProjects();
    const { recordEvent } = useTimeline();

    const viewMode = ref('gallery');
    const filters = ref({ tech: [], dateRange: null, search: '' });
    const showAddProjectModal = ref(false);
    const showDeleteConfirm = ref(false);
    const selectedProject = ref(null);
    const projectToDelete = ref(null);

    const filteredProjects = computed(() => {
      return projects.value.filter((project) => {
        if (filters.value.tech.length > 0) {
          const projectTech = project.techStack || [];
          const hasTech = filters.value.tech.some((tech) => projectTech.includes(tech));
          if (!hasTech) return false;
        }
        if (filters.value.dateRange && project.createdAt?.seconds) {
          const { start, end } = filters.value.dateRange;
          const projectDate = new Date(project.createdAt.seconds * 1000);
          if ((start && projectDate < new Date(start)) || (end && projectDate > new Date(end))) {
            return false;
          }
        }
        if (filters.value.search && !project.title.toLowerCase().includes(filters.value.search.toLowerCase())) {
          return false;
        }
        return true;
      });
    });

    onMounted(async () => {
      await fetchUserProjects();
    });

    const editProject = (project) => {
      selectedProject.value = { ...project };
      showAddProjectModal.value = true;
    };

    const confirmDeleteProject = (project) => {
      projectToDelete.value = project;
      showDeleteConfirm.value = true;
    };

    const deleteProject = async () => {
      if (!projectToDelete.value?.id) return;
      try {
        await removeProject(projectToDelete.value.id);
        await recordEvent('project', 'deleted', projectToDelete.value.id, { title: projectToDelete.value.title });
        showDeleteConfirm.value = false;
        projectToDelete.value = null;
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    };

    const saveProject = async (projectData, imageFile) => {
      try {
        let savedProject;
        if (selectedProject.value?.id) {
          savedProject = await updateProject(selectedProject.value.id, projectData, imageFile);
          await recordEvent('project', 'updated', savedProject.id, { title: savedProject.title });
        } else {
          savedProject = await addProject(projectData, imageFile);
          await recordEvent('project', 'added', savedProject.id, { title: savedProject.title });
        }
        closeProjectModal();
      } catch (error) {
        console.error('Error saving project:', error);
      }
    };

    const closeProjectModal = () => {
      selectedProject.value = null;
      showAddProjectModal.value = false;
    };

    return {
      projects,
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
    };
  },
};
</script>

<style scoped>
.projects-view {
  background-color: #f8f9fa;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.card {
  border-radius: 8px;
}
</style>