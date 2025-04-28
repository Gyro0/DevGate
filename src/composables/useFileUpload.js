// src/composables/useFileUpload.js
import { ref } from 'vue'
import { storage } from '@/firebase/firebaseInit'
import { ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import useAuth from './useAuth'

/**
 * File upload composable for managing files in Firebase Storage
 * @returns {Object} File upload methods
 */
export default function useFileUpload() {
  const { user } = useAuth()
  const uploading = ref(false)
  const progress = ref(0)
  const error = ref(null)
  
  // Upload a file to Firebase Storage
  const uploadFile = async (file, path = 'uploads') => {
    if (!user.value || !file) return null
    
    uploading.value = true
    progress.value = 0
    error.value = null
    
    try {
      const fileExt = file.name.split('.').pop()
      const fileName = `${user.value.uid}_${Date.now()}.${fileExt}`
      const filePath = `${path}/${fileName}`
      const fileRef = storageRef(storage, filePath)
      
      // Upload file
      const snapshot = await uploadBytes(fileRef, file)
      progress.value = 100
      
      // Get download URL
      const downloadURL = await getDownloadURL(snapshot.ref)
      
      return {
        url: downloadURL,
        path: filePath,
        name: fileName,
        type: file.type,
        size: file.size
      }
    } catch (e) {
      error.value = e.message
      console.error('Error uploading file:', e)
      throw e
    } finally {
      uploading.value = false
    }
  }
  
  // Delete a file from Firebase Storage
  const deleteFile = async (filePath) => {
    if (!filePath) return
    
    try {
      const fileRef = storageRef(storage, filePath)
      await deleteObject(fileRef)
      return true
    } catch (e) {
      error.value = e.message
      console.error('Error deleting file:', e)
      throw e
    }
  }
  
  // Get the public URL for a file path
  const getFileUrl = async (filePath) => {
    if (!filePath) return null
    
    try {
      const fileRef = storageRef(storage, filePath)
      return await getDownloadURL(fileRef)
    } catch (e) {
      error.value = e.message
      console.error('Error getting file URL:', e)
      return null
    }
  }
  
  return {
    uploading,
    progress,
    error,
    uploadFile,
    deleteFile,
    getFileUrl
  }
}