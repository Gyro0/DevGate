<template>
  <div class="objectives-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar :active-page="'objectives'" />
      
      <div class="content-area">
        <div class="page-header">
          <h1>My Objectives</h1>
          <button class="btn-primary" @click="showAddObjectiveModal = true">
            <span class="icon">+</span> Add Objective
          </button>
        </div>
        
        <div class="charts-section">
          <div class="chart-card">
            <h3>Completion Rate</h3>
            <ObjectiveCompletionRate :objectives="objectives" />
          </div>
          
          <div class="chart-card">
            <h3>Objective Timeline</h3>
            <ObjectiveTimeline :objectives="objectives" />
          </div>
        </div>
        
        <div class="objectives-board">
          <div class="kanban-columns">
            <ObjectiveColumn 
              title="Planned"
              :objectives="plannedObjectives"
              @edit="editObjective"
              @delete="confirmDeleteObjective"
              @update-progress="updateObjectiveProgress"
            />
            
            <ObjectiveColumn 
              title="In Progress"
              :objectives="inProgressObjectives"
              @edit="editObjective"
              @delete="confirmDeleteObjective"
              @update-progress="updateObjectiveProgress"
            />
            
            <ObjectiveColumn 
              title="Completed"
              :objectives="completedObjectives"
              @edit="editObjective"
              @delete="confirmDeleteObjective"
              @update-progress="updateObjectiveProgress"
            />
          </div>
        </div>
      </div>
    </div>
    
    <ObjectiveFormModal
      v-if="showAddObjectiveModal"
      :objective="selectedObjective"
      @save="saveObjective"
      @close="closeObjectiveModal"
    />
    
    <ConfirmDialog
      v-if="showDeleteConfirm"
      :message="`Delete objective '${objectiveToDelete?.title}'?`"
      @confirm="deleteObjective"
      @cancel="showDeleteConfirm = false"
    />
  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import ObjectiveColumn from '@/components/objectives/ObjectiveColumn.vue';
import ObjectiveCompletionRate from '@/components/objectives/ObjectiveCompletionRate.vue';
import ObjectiveTimeline from '@/components/objectives/ObjectiveTimeline.vue';
import ObjectiveFormModal from '@/components/objectives/ObjectiveFormModal.vue';
import ConfirmDialog from '@/components/common/ConfirmDialog.vue';
import useObjectives from '@/composables/useObjectives';
import useTimeline from '@/composables/useTimeline';

export default {
  name: 'ObjectivesView',
  components: {
    AppHeader,
    AppSidebar,
    ObjectiveColumn,
    ObjectiveCompletionRate,
    ObjectiveTimeline,
    ObjectiveFormModal,
    ConfirmDialog
  },
  setup() {
    const { 
      objectives, 
      plannedObjectives,
      inProgressObjectives, 
      completedObjectives,
      fetchUserObjectives, 
      addObjective, 
      updateObjective, 
      deleteObjective: removeObjective,
      updateProgress
    } = useObjectives();

    const { recordEvent } = useTimeline();

    const showAddObjectiveModal = ref(false);
    const showDeleteConfirm = ref(false);
    const selectedObjective = ref(null);
    const objectiveToDelete = ref(null);

    // Fetch objectives on component mount
    onMounted(async () => {
      await fetchUserObjectives();
    });

    // Open edit modal for an objective
    const editObjective = (objective) => {
      selectedObjective.value = { ...objective };
      showAddObjectiveModal.value = true;
    };

    // Initialize deletion process for an objective
    const confirmDeleteObjective = (objective) => {
      objectiveToDelete.value = objective;
      showDeleteConfirm.value = true;
    };

    // Delete the objective after confirmation
    const deleteObjective = async () => {
      try {
        await removeObjective(objectiveToDelete.value.id);
        await recordEvent('objective', 'deleted', objectiveToDelete.value.id, objectiveToDelete.value);
        showDeleteConfirm.value = false;
        objectiveToDelete.value = null;
      } catch (error) {
        console.error('Error deleting objective:', error);
      }
    };

    // Save new or updated objective
    const saveObjective = async (objectiveData) => {
      try {
        if (selectedObjective.value?.id) {
          // Update existing objective
          const updated = await updateObjective(selectedObjective.value.id, objectiveData);
          await recordEvent('objective', 'updated', updated.id, updated);
        } else {
          // Add new objective
          const created = await addObjective(objectiveData);
          await recordEvent('objective', 'added', created.id, created);
        }
        closeObjectiveModal();
      } catch (error) {
        console.error('Error saving objective:', error);
      }
    };

    // Update objective progress
    const updateObjectiveProgress = async (objectiveId, progress) => {
      try {
        const updatedObjective = await updateProgress(objectiveId, progress);
        
        // If objective is completed, record a 'completed' event
        // Check status from the returned updated objective or refetch/find
        if (updatedObjective?.status === 'completed' || progress >= 100) { 
          const objective = objectives.value.find(o => o.id === objectiveId) || updatedObjective;
          if (objective) {
             // Avoid duplicate 'completed' events if status was already 'completed'
             // This check might need refinement based on how updateProgress handles status changes
             if (objective.status !== 'completed' || progress >= 100) { 
                await recordEvent('objective', 'completed', objectiveId, objective);
             }
          }
        }
      } catch (error) {
        console.error('Error updating objective progress:', error);
      }
    };

    // Close objective modal and reset selection
    const closeObjectiveModal = () => {
      selectedObjective.value = null;
      showAddObjectiveModal.value = false;
    };

    // Return reactive state and methods
    return {
      objectives,
      plannedObjectives,
      inProgressObjectives,
      completedObjectives,
      showAddObjectiveModal,
      showDeleteConfirm,
      selectedObjective,
      objectiveToDelete,
      editObjective,
      confirmDeleteObjective,
      deleteObjective,
      saveObjective,
      updateObjectiveProgress,
      closeObjectiveModal
    };
  }
}
</script>

<style scoped>
.objectives-view {
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

.charts-section {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.chart-card {
  background: white;
  padding: 1.5rem;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.objectives-board {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  overflow-x: auto;
}

.kanban-columns {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  min-height: 400px;
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

@media (max-width: 768px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
  
  .kanban-columns {
    grid-template-columns: 1fr;
    gap: 1rem;
  }
}
</style>