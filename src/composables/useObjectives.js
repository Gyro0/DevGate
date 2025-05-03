import { ref, computed } from 'vue'; // Ensure computed is imported
import firebase, { db } from '@/firebase/firebaseInit';
import useAuth from './useAuth';

export default function useObjectives() {
  const { user, waitForAuth } = useAuth();
  const objectives = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Status options for objectives
  const objectiveStatuses = [
    { value: 'planned', label: 'Planned' },
    { value: 'in-progress', label: 'In Progress' },
    { value: 'completed', label: 'Completed' },
    { value: 'cancelled', label: 'Cancelled' }
  ];

  // Priority levels
  const priorityLevels = [
    { value: 'low', label: 'Low' },
    { value: 'medium', label: 'Medium' },
    { value: 'high', label: 'High' }
  ];

  // Fetch user objectives with auth waiting
  const fetchUserObjectives = async () => {
    loading.value = true;
    error.value = null;
    console.log("useObjectives: Starting fetch...");

    try {
      console.log("useObjectives: Waiting for authentication...");
      const authUser = await waitForAuth();

      if (!authUser) {
        console.warn("useObjectives: No user logged in after auth check");
        loading.value = false;
        objectives.value = []; // Clear objectives if not logged in
        return [];
      }

      console.log("useObjectives: Fetching for user:", authUser.uid);
      const snapshot = await db.collection('objectives')
        .where('userId', '==', authUser.uid)
        .get();

      const fetchedObjectives = snapshot.docs.map(doc => {
        const data = doc.data();
        // Log the status of each fetched objective
        console.log(`useObjectives: Fetched objective ${doc.id}, status: '${data.status}'`); // Log status clearly
        return {
          id: doc.id,
          ...data,
          // Ensure timestamps are JS Dates
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt || Date.now()),
          dueDate: data.dueDate?.toDate?.() || (data.dueDate ? new Date(data.dueDate) : null),
          completedAt: data.completedAt?.toDate?.() || (data.completedAt ? new Date(data.completedAt) : null)
        };
      });

      objectives.value = fetchedObjectives; // Update the ref
      console.log("useObjectives: Fetch complete. Total objectives:", objectives.value.length);
      return objectives.value;
    } catch (err) {
      console.error("useObjectives: Error fetching:", err);
      error.value = err.message;
      objectives.value = []; // Clear on error
      return [];
    } finally {
      loading.value = false;
      console.log("useObjectives: Fetch finished.");
    }
  };

  // Computed properties for filtering
  const plannedObjectives = computed(() => {
    // Ensure objectives.value is accessed
    const filtered = objectives.value.filter(o => o.status === 'planned');
    console.log("useObjectives: Computed planned:", filtered.length);
    return filtered;
  });

  const inProgressObjectives = computed(() => {
    // Ensure objectives.value is accessed
    const filtered = objectives.value.filter(o => o.status === 'in-progress');
    console.log("useObjectives: Computed in-progress:", filtered.length);
    return filtered;
  });

  const completedObjectives = computed(() => {
    // Ensure objectives.value is accessed
    const filtered = objectives.value.filter(o => o.status === 'completed');
    console.log("useObjectives: Computed completed:", filtered.length);
    return filtered;
  });

  // Add a new objective
  const addObjective = async (objectiveData) => {
     loading.value = true;
    try {
      const currentUser = await waitForAuth();
      if (!currentUser) throw new Error('User not authenticated');

      const now = firebase.firestore.FieldValue.serverTimestamp();
      const newObjective = {
        ...objectiveData,
        userId: currentUser.uid,
        status: objectiveData.status || 'planned', // Ensure default status
        createdAt: now,
        updatedAt: now,
        dueDate: objectiveData.dueDate ? firebase.firestore.Timestamp.fromDate(new Date(objectiveData.dueDate)) : null,
        startDate: objectiveData.startDate ? firebase.firestore.Timestamp.fromDate(new Date(objectiveData.startDate)) : null,
        completedAt: null,
        progress: 0 // Initialize progress
      };

      const docRef = await db.collection('objectives').add(newObjective);
      console.log("useObjectives: Added objective", docRef.id);
      // Instead of full refetch, add locally for better UX
      const addedObjective = {
          id: docRef.id,
          ...objectiveData, // Use the data passed in
          userId: currentUser.uid,
          createdAt: new Date(), // Approximate local time
          updatedAt: new Date(),
          dueDate: objectiveData.dueDate ? new Date(objectiveData.dueDate) : null,
          startDate: objectiveData.startDate ? new Date(objectiveData.startDate) : null,
          completedAt: null,
          progress: 0
      };
      objectives.value.unshift(addedObjective); // Add to beginning of array
      objectives.value = [...objectives.value]; // Trigger reactivity
      console.log("useObjectives: Added objective locally.");
      return addedObjective;
    } catch (err) {
      console.error("useObjectives: Error adding:", err);
      error.value = 'Failed to add objective.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update an existing objective
  const updateObjective = async (objectiveId, objectiveData) => {
    loading.value = true;
    try {
      const currentUser = await waitForAuth();
      if (!currentUser) throw new Error('User not authenticated');

      const objectiveRef = db.collection('objectives').doc(objectiveId);
      const updateData = {
        ...objectiveData,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Convert dates back to Timestamps for Firestore
      if (objectiveData.dueDate) {
        updateData.dueDate = firebase.firestore.Timestamp.fromDate(new Date(objectiveData.dueDate));
      } else {
         updateData.dueDate = null;
      }
       if (objectiveData.startDate) {
        updateData.startDate = firebase.firestore.Timestamp.fromDate(new Date(objectiveData.startDate));
      } else {
         updateData.startDate = null;
      }

      // Handle completion status change
      const existingObjective = objectives.value.find(o => o.id === objectiveId);
      if (existingObjective?.status !== 'completed' && objectiveData.status === 'completed') {
        updateData.completedAt = firebase.firestore.FieldValue.serverTimestamp();
        updateData.progress = 100;
      } else if (existingObjective?.status === 'completed' && objectiveData.status !== 'completed') {
        updateData.completedAt = null;
      }

      await objectiveRef.update(updateData);
      console.log("useObjectives: Updated objective", objectiveId);

      // Update locally
      const index = objectives.value.findIndex(o => o.id === objectiveId);
      if (index !== -1) {
          const updatedLocalObjective = {
              ...objectives.value[index],
              ...objectiveData, // Apply changes from form
              updatedAt: new Date(), // Approximate local time
              // Convert dates back to JS Date for local state
              dueDate: objectiveData.dueDate ? new Date(objectiveData.dueDate) : null,
              startDate: objectiveData.startDate ? new Date(objectiveData.startDate) : null,
              completedAt: objectiveData.status === 'completed' ? (existingObjective?.completedAt || new Date()) : null,
              progress: updateData.progress !== undefined ? updateData.progress : objectives.value[index].progress
          };
          objectives.value[index] = updatedLocalObjective;
          objectives.value = [...objectives.value]; // Trigger reactivity
          console.log("useObjectives: Updated objective locally.");
          return updatedLocalObjective;
      } else {
          // Fallback refetch if not found locally (shouldn't happen often)
          await fetchUserObjectives();
          return objectives.value.find(o => o.id === objectiveId);
      }
    } catch (err) {
      console.error("useObjectives: Error updating:", err);
      error.value = 'Failed to update objective.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

   // Update progress specifically
  const updateProgress = async (objectiveId, progressValue) => {
    // No loading indicator for quick updates
    // loading.value = true;
    try {
      const currentUser = await waitForAuth();
      if (!currentUser) throw new Error('User not authenticated');

      const objectiveRef = db.collection('objectives').doc(objectiveId);
      const progress = parseInt(progressValue);
      const updateData = {
        progress: progress,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Automatically update status based on progress
      const existingObjective = objectives.value.find(o => o.id === objectiveId);
      let statusChanged = false;
      if (existingObjective) {
          if (progress >= 100 && existingObjective.status !== 'completed') {
              updateData.status = 'completed';
              updateData.completedAt = firebase.firestore.FieldValue.serverTimestamp();
              statusChanged = true;
          } else if (progress > 0 && progress < 100 && existingObjective.status !== 'in-progress') {
              updateData.status = 'in-progress';
              updateData.completedAt = null; // Ensure completedAt is null if moved out of completed
              statusChanged = true;
          } else if (progress === 0 && existingObjective.status === 'in-progress') {
              // Optional: Move back to planned if progress is 0 from in-progress
              // updateData.status = 'planned';
              // statusChanged = true;
              updateData.completedAt = null;
          }
      }

      await objectiveRef.update(updateData);
      console.log(`useObjectives: Updated progress for ${objectiveId} to ${progress}%`);

      // Update local state directly
      const index = objectives.value.findIndex(o => o.id === objectiveId);
      if (index !== -1) {
        const updatedLocalObjective = {
          ...objectives.value[index],
          progress: progress,
          status: updateData.status || objectives.value[index].status, // Update status if changed
          updatedAt: new Date(), // Approximate update time locally
          completedAt: updateData.status === 'completed' ? new Date() : null // Approximate completion time
        };
        objectives.value[index] = updatedLocalObjective;
        // IMPORTANT: Trigger reactivity for computed properties
        objectives.value = [...objectives.value];
        console.log("useObjectives: Local state updated for progress change.");
        return updatedLocalObjective; // Return the updated object
      }
      // No need to refetch if local update works

    } catch (err) {
      console.error(`useObjectives: Error updating progress for ${objectiveId}:`, err);
      error.value = 'Failed to update progress.';
      throw err; // Re-throw error to be caught in component
    } finally {
      // loading.value = false;
    }
  };

  // Delete an objective
  const deleteObjective = async (objectiveId) => {
    loading.value = true;
    try {
      const currentUser = await waitForAuth();
      if (!currentUser) throw new Error('User not authenticated');

      await db.collection('objectives').doc(objectiveId).delete();
      console.log("useObjectives: Deleted objective", objectiveId);
      // Update locally
      objectives.value = objectives.value.filter(o => o.id !== objectiveId);
      console.log("useObjectives: Deleted objective locally.");
    } catch (err) {
      console.error("useObjectives: Error deleting:", err);
      error.value = 'Failed to delete objective.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    objectives,
    objectiveStatuses,
    priorityLevels,
    loading,
    error,
    fetchUserObjectives,
    addObjective,
    updateObjective,
    deleteObjective, // Export the delete function
    updateProgress, // Export the progress update function
    // Computed properties
    plannedObjectives,
    inProgressObjectives,
    completedObjectives
  };
}