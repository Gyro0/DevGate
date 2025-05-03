// src/composables/useProjects.js
import { ref } from 'vue';
import firebase, { db, storage } from '@/firebase/firebaseInit';
import useAuth from './useAuth';

export default function useProjects() {
  const { user, waitForAuth } = useAuth();
  const projects = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const uploading = ref(false);

  // Fetch user projects with auth waiting
  const fetchUserProjects = async () => {
    loading.value = true;
    error.value = null;

    try {
      console.log("Projects: Waiting for authentication...");
      // Wait for auth to be ready before proceeding
      const authUser = await waitForAuth();
      
      if (!authUser) {
        console.warn("Projects: No user logged in after auth check");
        loading.value = false;
        return [];
      }
      
      console.log("Projects: Fetching for user:", authUser.uid);
      const snapshot = await db.collection('projects')
        .where('userId', '==', authUser.uid)
        .orderBy('createdAt', 'desc')  // Sort by most recent first
        .get();

      // Process the data and update projects.value
      const fetchedProjects = snapshot.docs.map(doc => {
        const data = doc.data();
        // Convert timestamps to JS Date for easier handling
        const createdAt = data.createdAt ? 
          (data.createdAt.toDate ? data.createdAt.toDate() : new Date(data.createdAt)) : 
          new Date();
        const updatedAt = data.updatedAt ? 
          (data.updatedAt.toDate ? data.updatedAt.toDate() : new Date(data.updatedAt)) : 
          createdAt;
          
        return {
          id: doc.id, 
          ...data,
          createdAt,
          updatedAt
        };
      });
      
      projects.value = fetchedProjects;
      console.log("Projects: Fetched", projects.value.length, "projects");
      return projects.value;
    } catch (err) {
      console.error("Projects: Error fetching:", err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Add project with better error handling 
  const addProject = async (projectData, imageFile) => {
    if (!user.value) {
      console.error("No user logged in");
      throw new Error('Authentication required');
    }
    
    loading.value = true;
    error.value = null;
    uploading.value = false;
    
    try {
      console.log("Starting project creation...");
      
      // Upload project image if provided
      let imageUrl = null;
      if (imageFile) {
        uploading.value = true;
        console.log("Uploading project image...");
        
        // Use the useFileUpload composable for image upload
        const uploadResult = await uploadProjectImage(imageFile, Date.now().toString());
        imageUrl = uploadResult.url;
        console.log("Image uploaded successfully:", imageUrl);
      }
      
      // Prepare project data
      const newProject = {
        userId: user.value.uid,
        title: projectData.title,
        description: projectData.description || '',
        projectUrl: projectData.projectUrl || '',
        status: projectData.status || 'active',
        techStack: projectData.techStack || [],
        imageUrl: imageUrl,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };
      
      console.log("Adding project to Firestore:", newProject);
      
      // Add to Firestore
      const docRef = await db.collection('projects').add(newProject);
      
      // Create local copy of the project with ID for immediate display
      const createdProject = {
        id: docRef.id,
        ...newProject,
        createdAt: new Date(), // Use a JavaScript Date for local display
        updatedAt: new Date()
      };
      
      console.log("Project created successfully:", createdProject);
      
      // Update local state
      projects.value = [createdProject, ...(projects.value || [])];
      
      return createdProject;
    } catch (err) {
      console.error("Error creating project:", err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
      uploading.value = false;
    }
  };

  const updateProject = async (id, projectData) => {
    loading.value = true;
    error.value = null;
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
    loading.value = true;
    error.value = null;
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

  const uploadProjectImage = async (file, projectId) => {
    if (!user.value || !file) return;
    uploading.value = true;
    error.value = null;
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
    projects,
    loading,
    error,
    uploading,
    fetchUserProjects,
    addProject,
    updateProject,
    deleteProject,
    uploadProjectImage,
    deleteProjectImage
  };
}