<template>
  <div class="objectives-view bg-light min-vh-100">
    <AppHeader />
    <div class="container-fluid">
      <div class="row">
        <!-- Sidebar -->
        <div class="col-md-3 col-lg-2 bg-white p-0">
          <AppSidebar :active-page="'objectives'" />
        </div>

        <!-- Main Content -->
        <div class="col-md-9 col-lg-10 py-4">
          <!-- Page Header -->
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h1 class="h4 fw-bold">My Objectives</h1>
            <button class="btn btn-primary" @click="showAddObjectiveModal = true">
              <i class="fas fa-plus me-2"></i> Add Objective
            </button>
          </div>

          <!-- Charts Section -->
          <div class="row g-4 mb-4">
            <div class="col-md-6">
              <div class="card shadow-sm border-0">
                <div class="card-body">
                  <h5 class="card-title fw-bold">Completion Rate</h5>
                  <ObjectiveCompletionRate :objectives="objectives" />
                </div>
              </div>
            </div>
            <div class="col-md-6">
              <div class="card shadow-sm border-0">
                <div class="card-body">
                  <h5 class="card-title fw-bold">Objective Timeline</h5>
                  <ObjectiveTimeline :objectives="objectives" />
                </div>
              </div>
            </div>
          </div>

          <!-- Objectives Board -->
          <div class="card shadow-sm border-0">
            <div class="card-body">
              <div class="row g-4">
                <div class="col-md-4">
                  <ObjectiveColumn
                    title="Planned"
                    :objectives="plannedObjectives"
                    @edit="editObjective"
                    @delete="confirmDeleteObjective"
                    @update-progress="updateObjectiveProgress"
                  />
                </div>
                <div class="col-md-4">
                  <ObjectiveColumn
                    title="In Progress"
                    :objectives="inProgressObjectives"
                    @edit="editObjective"
                    @delete="confirmDeleteObjective"
                    @update-progress="updateObjectiveProgress"
                  />
                </div>
                <div class="col-md-4">
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
        </div>
      </div>
    </div>

    <!-- Modals -->
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
    ConfirmDialog,
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
      updateProgress,
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

    const editObjective = (objective) => {
      selectedObjective.value = { ...objective };
      showAddObjectiveModal.value = true;
    };

    const confirmDeleteObjective = (objective) => {
      objectiveToDelete.value = objective;
      showDeleteConfirm.value = true;
    };

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

    const updateObjectiveProgress = async (objectiveId, progress) => {
      try {
        const updatedObjective = await updateProgress(objectiveId, progress);
        if (updatedObjective?.status === 'completed' || progress >= 100) {
          const objective = objectives.value.find((o) => o.id === objectiveId) || updatedObjective;
          if (objective) {
            if (objective.status !== 'completed' || progress >= 100) {
              await recordEvent('objective', 'completed', objectiveId, objective);
            }
          }
        }
      } catch (error) {
        console.error('Error updating objective progress:', error);
      }
    };

    const closeObjectiveModal = () => {
      selectedObjective.value = null;
      showAddObjectiveModal.value = false;
    };

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
      closeObjectiveModal,
    };
  },
};
</script>

<style scoped>
.objectives-view {
  background-color: #f8f9fa;
}

.card {
  border-radius: 8px;
}

.card-title {
  font-size: 1.25rem;
  font-weight: bold;
}

.btn-primary {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}
</style>