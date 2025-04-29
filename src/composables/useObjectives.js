// src/composables/useObjectives.js
import { ref, computed } from 'vue';
import firebase, { db } from '@/firebase/firebaseInit'; // Import firebase namespace for Timestamp/FieldValue
import useAuth from './useAuth';

/**
 * Objectives management composable for handling technical goals
 * @returns {Object} Objectives state and methods
 */
export default function useObjectives() {
  const { user } = useAuth();
  const objectives = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Objective status options
  const objectiveStatuses = [
    { id: 'planned', label: 'Planned' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' }
  ];

  // Get objectives for current user
  const fetchUserObjectives = async () => {
    if (!user.value) return;
    loading.value = true;
    error.value = null;
    try {
      // Use v8 collection().where().get()
      const snapshot = await db.collection('objectives')
                               .where('userId', '==', user.value.uid)
                               .get();
      objectives.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
    } catch (e) {
      error.value = e.message
      console.error('Error fetching objectives:', e)
    } finally {
      loading.value = false
    }
  };

  // Add a new objective
  const addObjective = async (objectiveData) => {
    if (!user.value) return;
    loading.value = true;
    error.value = null;
    try {
      const newObjective = {
        ...objectiveData,
        userId: user.value.uid,
        // Use v8 FieldValue.serverTimestamp()
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
        progress: 0,
        status: 'planned'
      };
      // Use v8 collection().add()
      const docRef = await db.collection('objectives').add(newObjective);
      const createdObjective = { id: docRef.id, ...newObjective, createdAt: new Date(), updatedAt: new Date() }; // Approximate timestamp locally
      objectives.value.push(createdObjective);
      return createdObjective;
    } catch (e) {
      error.value = e.message
      console.error('Error adding objective:', e)
      throw e
    } finally {
      loading.value = false
    }
  };

  // Update existing objective
  const updateObjective = async (id, objectiveData) => {
    loading.value = true;
    error.value = null;
    try {
      // Use v8 collection().doc()
      const objectiveRef = db.collection('objectives').doc(id);
      const updatedObjective = {
        ...objectiveData,
        // Use v8 FieldValue.serverTimestamp()
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      // Use v8 docRef.update()
      await objectiveRef.update(updatedObjective);
      const index = objectives.value.findIndex(o => o.id === id);
      if (index !== -1) {
        // Approximate timestamp locally
        objectives.value[index] = { ...objectives.value[index], ...objectiveData, updatedAt: new Date() };
      }
      return { id, ...updatedObjective };
    } catch (e) {
      error.value = e.message
      console.error('Error updating objective:', e)
      throw e
    } finally {
      loading.value = false
    }
  };

  // Delete an objective
  const deleteObjective = async (id) => {
    loading.value = true;
    error.value = null;
    try {
      // Use v8 collection().doc().delete()
      await db.collection('objectives').doc(id).delete();
      objectives.value = objectives.value.filter(objective => objective.id !== id);
    } catch (e) {
      error.value = e.message
      console.error('Error deleting objective:', e)
      throw e
    } finally {
      loading.value = false
    }
  };

  // Update objective progress
  const updateProgress = async (id, progress) => {
    loading.value = true;
    error.value = null;
    try {
      // Use v8 collection().doc()
      const objectiveRef = db.collection('objectives').doc(id);
      // Determine status based on progress
      let status = 'in-progress'
      if (progress >= 100) {
        status = 'completed'
      } else if (progress <= 0) {
        status = 'planned'
      }

      // Use v8 docRef.update()
      await objectiveRef.update({
        progress,
        status,
        // Use v8 FieldValue.serverTimestamp()
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      });
      const index = objectives.value.findIndex(o => o.id === id);
      if (index !== -1) {
         // Approximate timestamp locally
        objectives.value[index] = { ...objectives.value[index], progress, status, updatedAt: new Date() };
      }
    } catch (e) {
      error.value = e.message
      console.error('Error updating objective progress:', e)
      throw e
    } finally {
      loading.value = false
    }
  };

  // Computed properties for objectives by status
  const plannedObjectives = computed(() => 
    objectives.value.filter(o => o.status === 'planned')
  )
  
  const inProgressObjectives = computed(() => 
    objectives.value.filter(o => o.status === 'in-progress')
  )
  
  const completedObjectives = computed(() => 
    objectives.value.filter(o => o.status === 'completed')
  )
  
  const completionRate = computed(() => {
    if (objectives.value.length === 0) return 0
    const completed = completedObjectives.value.length
    return (completed / objectives.value.length) * 100
  })
  
  return {
    objectives,
    loading,
    error,
    objectiveStatuses,
    plannedObjectives,
    inProgressObjectives,
    completedObjectives,
    completionRate,
    fetchUserObjectives,
    addObjective,
    updateObjective,
    deleteObjective,
    updateProgress
  }
}