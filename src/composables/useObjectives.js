// src/composables/useObjectives.js
import { ref, computed } from 'vue'
import { db } from '@/firebase/firebaseInit'
import { collection, query, where, getDocs, addDoc, updateDoc, deleteDoc, doc } from 'firebase/firestore'
import useAuth from './useAuth'

/**
 * Objectives management composable for handling technical goals
 * @returns {Object} Objectives state and methods
 */
export default function useObjectives() {
  const { user } = useAuth()
  const objectives = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Objective status options
  const objectiveStatuses = [
    { id: 'planned', label: 'Planned' },
    { id: 'in-progress', label: 'In Progress' },
    { id: 'completed', label: 'Completed' }
  ]
  
  // Get objectives for current user
  const fetchUserObjectives = async () => {
    if (!user.value) return
    
    loading.value = true
    error.value = null
    
    try {
      const objectivesQuery = query(
        collection(db, 'objectives'),
        where('userId', '==', user.value.uid)
      )
      
      const snapshot = await getDocs(objectivesQuery)
      objectives.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (e) {
      error.value = e.message
      console.error('Error fetching objectives:', e)
    } finally {
      loading.value = false
    }
  }
  
  // Add a new objective
  const addObjective = async (objectiveData) => {
    if (!user.value) return
    
    loading.value = true
    error.value = null
    
    try {
      const newObjective = {
        ...objectiveData,
        userId: user.value.uid,
        createdAt: new Date(),
        updatedAt: new Date(),
        progress: 0,
        status: 'planned'
      }
      
      const docRef = await addDoc(collection(db, 'objectives'), newObjective)
      const createdObjective = { id: docRef.id, ...newObjective }
      objectives.value.push(createdObjective)
      
      return createdObjective
    } catch (e) {
      error.value = e.message
      console.error('Error adding objective:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Update existing objective
  const updateObjective = async (id, objectiveData) => {
    loading.value = true
    error.value = null
    
    try {
      const objectiveRef = doc(db, 'objectives', id)
      const updatedObjective = {
        ...objectiveData,
        updatedAt: new Date()
      }
      
      await updateDoc(objectiveRef, updatedObjective)
      
      // Update local state
      const index = objectives.value.findIndex(o => o.id === id)
      if (index !== -1) {
        objectives.value[index] = { 
          id, 
          ...objectives.value[index], 
          ...updatedObjective 
        }
      }
      
      return { id, ...updatedObjective }
    } catch (e) {
      error.value = e.message
      console.error('Error updating objective:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Delete an objective
  const deleteObjective = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      await deleteDoc(doc(db, 'objectives', id))
      objectives.value = objectives.value.filter(objective => objective.id !== id)
    } catch (e) {
      error.value = e.message
      console.error('Error deleting objective:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Update objective progress
  const updateProgress = async (id, progress) => {
    loading.value = true
    error.value = null
    
    try {
      const objectiveRef = doc(db, 'objectives', id)
      
      // Determine status based on progress
      let status = 'in-progress'
      if (progress >= 100) {
        status = 'completed'
      } else if (progress <= 0) {
        status = 'planned'
      }
      
      await updateDoc(objectiveRef, { 
        progress, 
        status,
        updatedAt: new Date() 
      })
      
      // Update local state
      const index = objectives.value.findIndex(o => o.id === id)
      if (index !== -1) {
        objectives.value[index] = { 
          ...objectives.value[index], 
          progress,
          status,
          updatedAt: new Date()
        }
      }
    } catch (e) {
      error.value = e.message
      console.error('Error updating objective progress:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
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