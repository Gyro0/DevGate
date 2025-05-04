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
            <ObjectiveCompletionRate />
          </div>
          
          <div class="chart-card">
            <h3>Objective Timeline</h3>
            <ObjectiveTimeline />
          </div>
        </div>
        
        <div class="objectives-board">
          <div class="kanban-columns">
            <ObjectiveColumn 
              title="Planned"
              :objectives="plannedObjectives"
              @edit="editObjective"
              @delete="confirmDeleteObjective"
              @update-progress="handleUpdateProgress"
            />
            
            <ObjectiveColumn 
              title="In Progress"
              :objectives="inProgressObjectives"
              @edit="editObjective"
              @delete="confirmDeleteObjective"
              @update-progress="handleUpdateProgress"
            />
            
            <ObjectiveColumn 
              title="Completed"
              :objectives="completedObjectives"
              @edit="editObjective"
              @delete="confirmDeleteObjective"
              @update-progress="handleUpdateProgress"
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
import { ref, onMounted, watch } from 'vue';
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
      loading,
      error,
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
      console.log("ObjectivesView: Mounting, fetching objectives...");
      await fetchUserObjectives();
      console.log("ObjectivesView: Fetch complete. Total objectives:", objectives.value.length);
      console.log("ObjectivesView: Computed Planned:", plannedObjectives.value.length);
      console.log("ObjectivesView: Computed In Progress:", inProgressObjectives.value.length);
      console.log("ObjectivesView: Computed Completed:", completedObjectives.value.length);
    });

    // Watch the main objectives array for changes
    watch(objectives, (newObjectives, oldObjectives) => {
        if (newObjectives !== oldObjectives) {
            console.log("ObjectivesView: objectives ref updated, new count:", newObjectives.length);
            console.log("ObjectivesView: Watched Planned:", plannedObjectives.value.length);
            console.log("ObjectivesView: Watched In Progress:", inProgressObjectives.value.length);
            console.log("ObjectivesView: Watched Completed:", completedObjectives.value.length);
        }
    }, { deep: false });

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
          const updated = await updateObjective(selectedObjective.value.id, objectiveData);
          await recordEvent('objective', 'updated', updated.id, updated);
        } else {
          const created = await addObjective(objectiveData);
          await recordEvent('objective', 'added', created.id, created);
        }
        closeObjectiveModal();
      } catch (error) {
        console.error('Error saving objective:', error);
      }
    };

    // Handler for the update-progress event from ObjectiveColumn
    const handleUpdateProgress = async (objectiveId, progress) => {
      console.log(`ObjectivesView: handleUpdateProgress called for ${objectiveId} with ${progress}%`);
      try {
        const updatedObjective = await updateProgress(objectiveId, progress);

        if (updatedObjective?.status === 'completed') {
           console.log(`ObjectivesView: Objective ${objectiveId} completed, recording event.`);
           await recordEvent('objective', 'completed', objectiveId, { title: updatedObjective.title });
        } else {
             await recordEvent('objective', 'progress_updated', objectiveId, { title: updatedObjective?.title, progress: updatedObjective?.progress });
        }

      } catch (error) {
        console.error('ObjectivesView: Error in handleUpdateProgress:', error);
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
      loading,
      error,
      showAddObjectiveModal,
      showDeleteConfirm,
      selectedObjective,
      objectiveToDelete,
      editObjective,
      confirmDeleteObjective,
      deleteObjective,
      saveObjective,
      handleUpdateProgress,
      closeObjectiveModal
    };
  }
}
</script>

<style scoped>
.objectives-view {
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

.charts-section {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.5rem;
  margin-bottom: 2rem;
}

.chart-card {
  background: var(--card-bg);
  border-radius: 12px;
  box-shadow: 0 4px 12px rgba(0,0,0,0.12);
  border: 1px solid var(--border-color);
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.chart-card h3 {
  color: var(--text-color);
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0 0 1rem 0;
}

.objectives-board {
  background: white;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  padding: 1.5rem;
  overflow-x: auto;
}
.objectives-board{
  background-color: var(--bg-main);
}
.kanban-columns {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 1.5rem;
  padding: 1rem;
}

@media (max-width: 900px) {
  .charts-section {
    grid-template-columns: 1fr;
  }
}
</style>