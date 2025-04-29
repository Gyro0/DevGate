// src/composables/useProjects.js
import { ref } from 'vue';
// Import firebase namespace for Timestamp/FieldValue if needed, and initialized services
import firebase, { db, storage } from '@/firebase/firebaseInit';
import useAuth from './useAuth';

export default function useProjects() {
  const { user } = useAuth();
  const projects = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const uploading = ref(false); // Add state for uploads if needed

  // --- Firestore Operations (Use v8 syntax like in useObjectives) ---
  const fetchUserProjects = async () => {
    if (!user.value) return;
    loading.value = true; error.value = null;
    try {
      const snapshot = await db.collection('projects')
                               .where('userId', '==', user.value.uid)
                               .get();
      projects.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) { /* ... */ } finally { loading.value = false; }
  };

  const addProject = async (projectData) => {
     if (!user.value) return;
     loading.value = true; error.value = null;
     try {
       const newProject = {
         ...projectData,
         userId: user.value.uid,
         createdAt: firebase.firestore.FieldValue.serverTimestamp(),
         updatedAt: firebase.firestore.FieldValue.serverTimestamp(),
       };
       const docRef = await db.collection('projects').add(newProject);
       // ... update local state ...
       return { id: docRef.id, ...newProject };
     } catch (e) { /* ... */ } finally { loading.value = false; }
  };

  const updateProject = async (id, projectData) => {
     loading.value = true; error.value = null;
     try {
       const projectRef = db.collection('projects').doc(id);
       const updatedProject = {
         ...projectData,
         updatedAt: firebase.firestore.FieldValue.serverTimestamp()
       };
       await projectRef.update(updatedProject);
       // ... update local state ...
       return { id, ...updatedProject };
     } catch (e) { /* ... */ } finally { loading.value = false; }
  };

   const deleteProject = async (id) => {
     loading.value = true; error.value = null;
     try {
       // Also delete associated storage files if necessary before deleting the doc
       const project = projects.value.find(p => p.id === id);
       if (project?.imageUrlPath) { // Assuming you store the path
         await deleteProjectImage(project.imageUrlPath);
       }
       await db.collection('projects').doc(id).delete();
       projects.value = projects.value.filter(p => p.id !== id);
     } catch (e) { /* ... */ } finally { loading.value = false; }
   };


  // --- Storage Operations (Use v8 syntax) ---
  const uploadProjectImage = async (file, projectId) => {
    if (!user.value || !file) return;
    uploading.value = true; error.value = null;
    try {
      const filePath = `projects/${user.value.uid}/${projectId}/${file.name}`;
      // Use v8 storage.ref()
      const fileRef = storage.ref(filePath);
      // Use v8 fileRef.put() - returns UploadTask
      const uploadTask = fileRef.put(file);

      // Optional: Monitor progress
      uploadTask.on('state_changed', snapshot => { /* update progress state */ });

      // Wait for upload to complete
      await uploadTask;

      // Use v8 getDownloadURL() on the ref from the task snapshot
      const downloadURL = await uploadTask.snapshot.ref.getDownloadURL();

      // Update Firestore document with URL and path
      await updateProject(projectId, { imageUrl: downloadURL, imageUrlPath: filePath });

      return { downloadURL, filePath };
    } catch (e) {
      error.value = e.message;
      console.error('Error uploading project image:', e);
      throw e;
    } finally {
      uploading.value = false;
    }
  };

  const deleteProjectImage = async (filePath) => {
    if (!filePath) return;
    try {
      // Use v8 storage.ref().delete()
      const fileRef = storage.ref(filePath);
      await fileRef.delete();
    } catch (e) {
      // Handle errors (e.g., file not found)
      console.error('Error deleting project image:', e);
      // Decide if this error should be surfaced to the user
    }
  };


  return {
    projects, loading, error, uploading,
    fetchUserProjects, addProject, updateProject, deleteProject,
    uploadProjectImage, deleteProjectImage
  };
}