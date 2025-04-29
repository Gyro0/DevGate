import { ref } from 'vue';
import firebase, { storage } from '@/firebase/firebaseInit'; // Import firebase namespace and initialized storage
import useAuth from './useAuth';

export default function useFileUpload() {
  const { user } = useAuth();
  const uploading = ref(false);
  const progress = ref(0);
  const error = ref(null);

  /**
   * Uploads a file to Firebase Storage
   * @param {File} file - The file to upload
   * @param {string} path - Storage path (default: 'uploads')
   * @returns {Promise<Object>} - Object with download URL and path
   */
  const uploadFile = async (file, path = 'uploads') => {
    if (!user.value) throw new Error('User not authenticated');
    if (!file) throw new Error('No file provided');
    
    uploading.value = true;
    progress.value = 0;
    error.value = null;
    
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${user.value.uid}_${Date.now()}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
      // Create storage reference
      const fileRef = storage.ref(filePath);
      
      // Start upload task
      const uploadTask = fileRef.put(file);
      
      // Return a promise that resolves when the upload completes
      return new Promise((resolve, reject) => {
        uploadTask.on(
          'state_changed',
          (snapshot) => {
            // Update progress
            progress.value = Math.round(
              (snapshot.bytesTransferred / snapshot.totalBytes) * 100
            );
          },
          (err) => {
            // Handle error
            error.value = err.message;
            uploading.value = false;
            reject(err);
          },
          async () => {
            // Upload completed successfully
            try {
              const downloadURL = await fileRef.getDownloadURL();
              uploading.value = false;
              progress.value = 100;
              
              resolve({
                url: downloadURL,
                path: filePath,
                name: fileName,
                type: file.type,
                size: file.size
              });
            } catch (err) {
              error.value = err.message;
              uploading.value = false;
              reject(err);
            }
          }
        );
      });
    } catch (err) {
      error.value = err.message;
      uploading.value = false;
      throw err;
    }
  };

  /**
   * Deletes a file from Firebase Storage
   * @param {string} filePath - Path to the file in Storage
   */
  const deleteFile = async (filePath) => {
    if (!filePath) return;
    
    try {
      const fileRef = storage.ref(filePath);
      await fileRef.delete();
    } catch (err) {
      error.value = err.message;
      console.error('Error deleting file:', err);
    }
  };

  /**
   * Gets the download URL for a file
   * @param {string} filePath - Path to the file in Storage
   * @returns {Promise<string>} - Download URL
   */
  const getFileUrl = async (filePath) => {
    if (!filePath) return null;
    
    try {
      const fileRef = storage.ref(filePath);
      return await fileRef.getDownloadURL();
    } catch (err) {
      error.value = err.message;
      console.error('Error getting file URL:', err);
      return null;
    }
  };

  return {
    uploading,
    progress,
    error,
    uploadFile,
    deleteFile,
    getFileUrl
  };
}