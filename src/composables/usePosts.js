import { ref } from 'vue';
import firebase, { db, storage } from '@/firebase/firebaseInit';
import useAuth from './useAuth';
import useFileUpload from './useFileUpload';

export default function usePosts() {
  const { user, waitForAuth } = useAuth();
  const { uploadFile, deleteFile } = useFileUpload(); // Assuming useFileUpload exists

  const posts = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch posts (basic version)
  const fetchPosts = async (limit = 20) => {
    loading.value = true;
    error.value = null;
    console.log("usePosts: Fetching posts...");

    try {
      const authUser = await waitForAuth();
      if (!authUser) {
        console.warn("usePosts: No user for fetching posts.");
        posts.value = [];
        return;
      }

      // Fetch posts ordered by creation time
      const snapshot = await db.collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      // Fetch linked entity details concurrently
      const postPromises = snapshot.docs.map(async (doc) => {
        const postData = { id: doc.id, ...doc.data() };
        let linkedEntityData = null;

        // If linked entity exists, fetch its basic info
        if (postData.linkedEntityType && postData.linkedEntityId) {
          try {
            const entityCollection = `${postData.linkedEntityType}s`; // e.g., 'skills', 'projects'
            const entityDoc = await db.collection(entityCollection).doc(postData.linkedEntityId).get();
            if (entityDoc.exists) {
              linkedEntityData = {
                name: entityDoc.data().name, // For skills
                title: entityDoc.data().title // For projects/objectives
              };
            } else {
               console.warn(`Linked entity ${postData.linkedEntityId} not found in ${entityCollection}`);
            }
          } catch (entityErr) {
            console.error(`Error fetching linked entity ${postData.linkedEntityId}:`, entityErr);
          }
        }
        return { ...postData, linkedEntity: linkedEntityData };
      });

      posts.value = await Promise.all(postPromises);
      console.log(`usePosts: Fetched ${posts.value.length} posts.`);

    } catch (err) {
      console.error("usePosts: Error fetching posts:", err);
      error.value = err.message;
      posts.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Add a new post
  const addPost = async (postDetails, imageFile = null) => {
    loading.value = true; // Indicate loading for add operation
    error.value = null;
    console.log("usePosts: Adding post...", postDetails);

    try {
      const authUser = await waitForAuth();
      if (!authUser) throw new Error("User not authenticated");

      let imageUrl = null;
      let imagePath = null;

      // 1. Upload image if provided
      if (imageFile) {
        const uploadPath = `posts/${authUser.uid}/${Date.now()}_${imageFile.name}`;
        console.log("usePosts: Uploading image to", uploadPath);
        const result = await uploadFile(imageFile, uploadPath);
        imageUrl = result.downloadURL;
        imagePath = result.filePath; // Store path for potential deletion
        console.log("usePosts: Image uploaded", imageUrl);
      }

      // 2. Prepare post data for Firestore
      const postData = {
        title: postDetails.title || '', // Add title field
        description: postDetails.description, // Use description instead of content
        authorId: authUser.uid,
        authorName: authUser.displayName || 'Anonymous',
        authorPhotoURL: authUser.photoURL || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        imageUrl: imageUrl,
        imagePath: imagePath, // Store path
        linkedEntityType: postDetails.linkedEntityType || null,
        linkedEntityId: postDetails.linkedEntityId || null,
        // Initialize counts
        upvotesCount: 0,
        downvotesCount: 0,
        commentsCount: 0,
      };

      // 3. Add post document to Firestore
      const docRef = await db.collection('posts').add(postData);
      console.log("usePosts: Post added with ID:", docRef.id);

      // 4. Optimistic update (or refetch) - Add locally immediately
      // Fetch the added doc to get server timestamp correctly (optional but good)
      const newDoc = await docRef.get();
      const newPost = { id: newDoc.id, ...newDoc.data() };

      // Fetch linked entity details for the new post
      if (newPost.linkedEntityType && newPost.linkedEntityId) {
         try {
            const entityCollection = `${newPost.linkedEntityType}s`;
            const entityDoc = await db.collection(entityCollection).doc(newPost.linkedEntityId).get();
            if (entityDoc.exists) {
              newPost.linkedEntity = {
                name: entityDoc.data().name,
                title: entityDoc.data().title
              };
            }
          } catch (entityErr) {
             console.error(`Error fetching linked entity for new post ${newPost.id}:`, entityErr);
          }
      }


      posts.value.unshift(newPost); // Add to the beginning of the array
      console.log("usePosts: Post added locally.");
      return newPost; // Return the newly added post

    } catch (err) {
      console.error("usePosts: Error adding post:", err);
      error.value = err.message;
      // Handle image cleanup if post creation failed after upload (optional)
      if (imagePath) {
        try { await deleteFile(imagePath); } catch (delErr) { console.error("Failed to clean up image after error:", delErr); }
      }
      throw err; // Re-throw error to be caught in component
    } finally {
      loading.value = false;
    }
  };

  // Add updatePost and deletePost functions later as needed

  return {
    posts,
    loading,
    error,
    fetchPosts,
    addPost,
    // updatePost,
    // deletePost
  };
}