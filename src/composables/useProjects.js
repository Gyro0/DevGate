// src/composables/useProjects.js
import { ref } from 'vue'
import { db, storage } from '@/firebase/firebaseInit'
import { 
  collection, query, where, getDocs, 
  addDoc, updateDoc, deleteDoc, doc 
} from 'firebase/firestore'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import useAuth from './useAuth'

/**
 * Projects management composable for handling project operations
 * @returns {Object} Projects state and methods
 */
export default function useProjects() {
  const { user } = useAuth()
  const projects = ref([])
  const loading = ref(false)
  const error = ref(null)
  
  // Fetch user's projects
  const fetchUserProjects = async () => {
    if (!user.value) return
    
    loading.value = true
    error.value = null
    
    try {
      const projectsQuery = query(
        collection(db, 'projects'),
        where('userId', '==', user.value.uid)
      )
      
      const snapshot = await getDocs(projectsQuery)
      projects.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }))
    } catch (e) {
      error.value = e.message
      console.error('Error fetching projects:', e)
    } finally {
      loading.value = false
    }
  }
  
  // Upload project image to Firebase Storage
  const uploadProjectImage = async (file) => {
    if (!user.value || !file) return null
    
    const fileExt = file.name.split('.').pop()
    const fileName = `${user.value.uid}_${Date.now()}.${fileExt}`
    const imageRef = storageRef(storage, `projects/${fileName}`)
    
    try {
      const snapshot = await uploadBytes(imageRef, file)
      return await getDownloadURL(snapshot.ref)
    } catch (e) {
      console.error('Error uploading image:', e)
      throw e
    }
  }
  
  // Add a new project
  const addProject = async (projectData, imageFile) => {
    if (!user.value) return
    
    loading.value = true
    error.value = null
    
    try {
      let imageUrl = null
      if (imageFile) {
        imageUrl = await uploadProjectImage(imageFile)
      }
      
      const newProject = {
        ...projectData,
        userId: user.value.uid,
        imageUrl,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      
      const docRef = await addDoc(collection(db, 'projects'), newProject)
      const createdProject = { id: docRef.id, ...newProject }
      projects.value.push(createdProject)
      
      return createdProject
    } catch (e) {
      error.value = e.message
      console.error('Error adding project:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Update existing project
  const updateProject = async (id, projectData, imageFile) => {
    loading.value = true
    error.value = null
    
    try {
      const projectRef = doc(db, 'projects', id)
      const currentProject = projects.value.find(p => p.id === id)
      
      let imageUrl = currentProject.imageUrl
      
      // Handle image update if provided
      if (imageFile) {
        // Delete old image if exists
        if (imageUrl) {
          try {
            const oldImageRef = storageRef(storage, imageUrl)
            await deleteObject(oldImageRef)
          } catch (e) {
            console.warn('Error deleting old image:', e)
          }
        }
        
        // Upload new image
        imageUrl = await uploadProjectImage(imageFile)
      }
      
      const updatedProject = {
        ...projectData,
        imageUrl,
        updatedAt: new Date()
      }
      
      await updateDoc(projectRef, updatedProject)
      
      // Update local state
      const index = projects.value.findIndex(p => p.id === id)
      if (index !== -1) {
        projects.value[index] = { 
          id, 
          ...projects.value[index], 
          ...updatedProject 
        }
      }
      
      return { id, ...updatedProject }
    } catch (e) {
      error.value = e.message
      console.error('Error updating project:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  // Delete a project
  const deleteProject = async (id) => {
    loading.value = true
    error.value = null
    
    try {
      const project = projects.value.find(p => p.id === id)
      
      // Delete project image if exists
      if (project.imageUrl) {
        try {
          const imageRef = storageRef(storage, project.imageUrl)
          await deleteObject(imageRef)
        } catch (e) {
          console.warn('Error deleting project image:', e)
        }
      }
      
      // Delete project document
      await deleteDoc(doc(db, 'projects', id))
      
      // Update local state
      projects.value = projects.value.filter(project => project.id !== id)
    } catch (e) {
      error.value = e.message
      console.error('Error deleting project:', e)
      throw e
    } finally {
      loading.value = false
    }
  }
  
  return {
    projects,
    loading,
    error,
    fetchUserProjects,
    addProject,
    updateProject,
    deleteProject
  }
}