import { ref } from 'vue';
import firebase, { db, storage } from '@/firebase/firebaseInit';
import useAuth from './useAuth';
import useFileUpload from './useFileUpload';

export default function usePosts() {
  const { user, waitForAuth } = useAuth();
  const { uploadFile, deleteFile } = useFileUpload();

  const posts = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch posts (basic version)
  const fetchPosts = async (limit = 20) => {
    loading.value = true;
    error.value = null;
    console.log("usePosts: Fetching posts...");

    try {
      const snapshot = await db.collection('posts')
        .orderBy('createdAt', 'desc')
        .limit(limit)
        .get();

      const postPromises = snapshot.docs.map(async (doc) => {
        const postData = { id: doc.id, ...doc.data() };
        let linkedEntityData = null;

        if (postData.linkedEntityType && postData.linkedEntityId) {
          try {
            const entityCollection = `${postData.linkedEntityType}s`;
            const entityDoc = await db.collection(entityCollection).doc(postData.linkedEntityId).get();
            if (entityDoc.exists) {
              linkedEntityData = {
                name: entityDoc.data().name,
                title: entityDoc.data().title
              };
            } else {
              console.warn(`Linked entity ${postData.linkedEntityId} not found in ${entityCollection}`);
            }
          } catch (entityErr) {
            console.error(`Error fetching linked entity ${postData.linkedEntityId}:`, entityErr);
          }
        }

        let userReaction = null;
        if (user.value) {
          try {
            const reactionRef = db.collection('posts').doc(doc.id).collection('reactions').doc(user.value.uid);
            const reactionDoc = await reactionRef.get();
            if (reactionDoc.exists) {
              userReaction = reactionDoc.data().type;
            }
          } catch (reactErr) {
            console.error(`Error fetching user reaction for post ${doc.id}:`, reactErr);
          }
        }

        return { ...postData, linkedEntity: linkedEntityData, userReaction };
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

  const fetchSinglePost = async (postId) => {
    loading.value = true;
    error.value = null;
    console.log(`usePosts: Fetching single post ${postId}...`);

    try {
      const postRef = db.collection('posts').doc(postId);
      const doc = await postRef.get();

      if (!doc.exists) {
        throw new Error("Post not found");
      }

      const postData = { id: doc.id, ...doc.data() };
      let linkedEntityData = null;
      let userReaction = null;

      if (postData.linkedEntityType && postData.linkedEntityId) {
        try {
          const entityCollection = `${postData.linkedEntityType}s`;
          const entityDoc = await db.collection(entityCollection).doc(postData.linkedEntityId).get();
          if (entityDoc.exists) {
            linkedEntityData = {
              name: entityDoc.data().name,
              title: entityDoc.data().title
            };
          } else {
            console.warn(`Linked entity ${postData.linkedEntityId} not found in ${entityCollection}`);
          }
        } catch (entityErr) {
          console.error(`Error fetching linked entity ${postData.linkedEntityId}:`, entityErr);
        }
      }

      const authUser = await waitForAuth();
      if (authUser) {
        try {
          const reactionRef = postRef.collection('reactions').doc(authUser.uid);
          const reactionDoc = await reactionRef.get();
          if (reactionDoc.exists) {
            userReaction = reactionDoc.data().type;
          }
        } catch (reactErr) {
          console.error(`Error fetching user reaction for post ${postId}:`, reactErr);
        }
      }

      console.log(`usePosts: Fetched single post ${postId} successfully.`);
      return { ...postData, linkedEntity: linkedEntityData, userReaction };
    } catch (err) {
      console.error(`usePosts: Error fetching single post ${postId}:`, err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const addPost = async (postDetails, imageFile = null) => {
    loading.value = true;
    error.value = null;
    console.log("usePosts: Adding post...", postDetails);

    try {
      const authUser = await waitForAuth();
      if (!authUser) throw new Error("User not authenticated");

      let imageUrl = null;
      let imagePath = null;

      if (imageFile) {
        const uploadPath = `posts/${authUser.uid}/${Date.now()}_${imageFile.name}`;
        console.log("usePosts: Uploading image to", uploadPath);
        const result = await uploadFile(imageFile, uploadPath);
        imageUrl = result.downloadURL;
        imagePath = result.filePath;
        console.log("usePosts: Image uploaded", imageUrl);
      }

      const postData = {
        title: postDetails.title || '',
        description: postDetails.description,
        authorId: authUser.uid,
        authorName: authUser.displayName || 'Anonymous',
        authorPhotoURL: authUser.photoURL || null,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        imageUrl: imageUrl,
        imagePath: imagePath,
        linkedEntityType: postDetails.linkedEntityType || null,
        linkedEntityId: postDetails.linkedEntityId || null,
        likesCount: 0,
        dislikesCount: 0,
        commentsCount: 0,
      };

      const docRef = await db.collection('posts').add(postData);
      console.log("usePosts: Post added with ID:", docRef.id);

      const newDoc = await docRef.get();
      const newPost = { id: newDoc.id, ...newDoc.data() };

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

      posts.value.unshift(newPost);
      console.log("usePosts: Post added locally.");
      return newPost;
    } catch (err) {
      console.error("usePosts: Error adding post:", err);
      error.value = err.message;
      if (imagePath) {
        try {
          await deleteFile(imagePath);
        } catch (delErr) {
          console.error("Failed to clean up image after error:", delErr);
        }
      }
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const likeDislikePost = async (postId, reactionType) => {
    loading.value = true;
    error.value = null;
    console.log(`usePosts: Reacting to post ${postId} with ${reactionType}`);

    try {
      const authUser = await waitForAuth();
      if (!authUser) throw new Error("User not authenticated");

      const userId = authUser.uid;
      const postRef = db.collection('posts').doc(postId);
      const reactionRef = postRef.collection('reactions').doc(userId);

      const updatedData = await db.runTransaction(async (transaction) => {
        const reactionDoc = await transaction.get(reactionRef);

        const previousReaction = reactionDoc.exists ? reactionDoc.data().type : null;

        let likesIncrement = 0;
        let dislikesIncrement = 0;

        if (previousReaction === reactionType) {
          console.log(`Undoing reaction: ${previousReaction}`);
          if (previousReaction === 'like') likesIncrement = -1;
          if (previousReaction === 'dislike') dislikesIncrement = -1;
          transaction.delete(reactionRef);
          reactionType = null;
        } else {
          if (previousReaction) {
            console.log(`Changing reaction from ${previousReaction} to ${reactionType}`);
            if (previousReaction === 'like') likesIncrement = -1;
            if (previousReaction === 'dislike') dislikesIncrement = -1;
          } else {
            console.log(`Adding new reaction: ${reactionType}`);
          }

          if (reactionType === 'like') likesIncrement += 1;
          if (reactionType === 'dislike') dislikesIncrement += 1;

          transaction.set(reactionRef, { type: reactionType, reactedAt: firebase.firestore.FieldValue.serverTimestamp() });
        }

        const postUpdateData = {};
        if (likesIncrement !== 0) {
          postUpdateData.likesCount = firebase.firestore.FieldValue.increment(likesIncrement);
        }
        if (dislikesIncrement !== 0) {
          postUpdateData.dislikesCount = firebase.firestore.FieldValue.increment(dislikesIncrement);
        }

        if (Object.keys(postUpdateData).length > 0) {
          transaction.update(postRef, postUpdateData);
        }

        return { userReaction: reactionType };
      });

      console.log(`usePosts: Reaction transaction successful for post ${postId}. New state:`, updatedData);

      const postIndex = posts.value.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        try {
          const updatedPostDoc = await postRef.get();
          if (updatedPostDoc.exists) {
            const updatedPostData = updatedPostDoc.data();
            posts.value[postIndex] = {
              ...posts.value[postIndex],
              likesCount: updatedPostData.likesCount,
              dislikesCount: updatedPostData.dislikesCount,
              userReaction: updatedData.userReaction
            };
            console.log("usePosts: Local post state updated with new counts/reaction.");
            return posts.value[postIndex];
          }
        } catch (fetchErr) {
          console.error("usePosts: Error fetching updated post data after reaction:", fetchErr);
          posts.value[postIndex].userReaction = updatedData.userReaction;
          return { userReaction: updatedData.userReaction };
        }
      } else {
        return updatedData;
      }
    } catch (err) {
      console.error(`usePosts: Error reacting to post ${postId}:`, err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updatePost = async (postId, updatedDetails, newImageFile = null, removeImage = false) => {
    loading.value = true;
    error.value = null;
    console.log(`usePosts: Updating post ${postId}...`, updatedDetails);

    try {
      const authUser = await waitForAuth();
      if (!authUser) throw new Error("User not authenticated");

      const postRef = db.collection('posts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) throw new Error("Post not found");
      if (postDoc.data().authorId !== authUser.uid) throw new Error("User not authorized to update this post");

      let imageUrl = postDoc.data().imageUrl;
      let imagePath = postDoc.data().imagePath;
      let imageUpdated = false;

      if (removeImage && imagePath) {
        console.log("usePosts: Removing existing image", imagePath);
        await deleteFile(imagePath);
        imageUrl = null;
        imagePath = null;
        imageUpdated = true;
      } else if (newImageFile) {
        if (imagePath) {
          try {
            await deleteFile(imagePath);
          } catch (delErr) {
            console.warn("Failed to delete old image during update:", delErr);
          }
        }
        const uploadPath = `posts/${authUser.uid}/${Date.now()}_${newImageFile.name}`;
        console.log("usePosts: Uploading new image to", uploadPath);
        const result = await uploadFile(newImageFile, uploadPath);
        imageUrl = result.downloadURL;
        imagePath = result.filePath;
        imageUpdated = true;
        console.log("usePosts: New image uploaded", imageUrl);
      }

      const updateData = {
        ...updatedDetails,
        updatedAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      if (imageUpdated) {
        updateData.imageUrl = imageUrl;
        updateData.imagePath = imagePath;
      }

      await postRef.update(updateData);
      console.log(`usePosts: Post ${postId} updated successfully.`);

      const postIndex = posts.value.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        const updatedDoc = await postRef.get();
        const updatedPost = { id: updatedDoc.id, ...updatedDoc.data() };

        if (updatedPost.linkedEntityType && updatedPost.linkedEntityId) {
          try {
            const entityCollection = `${updatedPost.linkedEntityType}s`;
            const entityDoc = await db.collection(entityCollection).doc(updatedPost.linkedEntityId).get();
            if (entityDoc.exists) {
              updatedPost.linkedEntity = {
                name: entityDoc.data().name,
                title: entityDoc.data().title
              };
            }
          } catch (entityErr) {
            console.error(`Error fetching linked entity for updated post ${updatedPost.id}:`, entityErr);
          }
        } else {
          updatedPost.linkedEntity = null;
        }

        posts.value[postIndex] = updatedPost;
        console.log("usePosts: Local post updated.");
        return updatedPost;
      }

      const finalDoc = await postRef.get();
      const finalPostData = { id: finalDoc.id, ...finalDoc.data() };

      if (finalPostData.linkedEntityType && finalPostData.linkedEntityId) {
        try {
          const entityCollection = `${finalPostData.linkedEntityType}s`;
          const entityDoc = await db.collection(entityCollection).doc(finalPostData.linkedEntityId).get();
          if (entityDoc.exists) {
            finalPostData.linkedEntity = {
              name: entityDoc.data().name,
              title: entityDoc.data().title
            };
          }
        } catch (entityErr) {
          console.error(`Error fetching linked entity for updated post ${finalPostData.id}:`, entityErr);
        }
      }
      return finalPostData;
    } catch (err) {
      console.error(`usePosts: Error updating post ${postId}:`, err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const deletePost = async (postId) => {
    loading.value = true;
    error.value = null;
    console.log(`usePosts: Deleting post ${postId}...`);

    try {
      const authUser = await waitForAuth();
      if (!authUser) throw new Error("User not authenticated");

      const postRef = db.collection('posts').doc(postId);
      const postDoc = await postRef.get();

      if (!postDoc.exists) {
        console.warn(`usePosts: Post ${postId} not found for deletion.`);
        const postIndex = posts.value.findIndex(p => p.id === postId);
        if (postIndex !== -1) posts.value.splice(postIndex, 1);
        return;
      }

      const postData = postDoc.data();
      if (postData.authorId !== authUser.uid) throw new Error("User not authorized to delete this post");

      if (postData.imagePath) {
        console.log("usePosts: Deleting associated image", postData.imagePath);
        try {
          await deleteFile(postData.imagePath);
          console.log("usePosts: Image deleted successfully.");
        } catch (delErr) {
          console.error("usePosts: Failed to delete image during post deletion:", delErr);
        }
      }

      await postRef.delete();
      console.log(`usePosts: Post ${postId} document deleted.`);

      try {
        const reactionsSnapshot = await postRef.collection('reactions').get();
        const batch = db.batch();
        reactionsSnapshot.docs.forEach(doc => batch.delete(doc.ref));
        await batch.commit();
        console.log(`usePosts: Deleted ${reactionsSnapshot.size} reactions for post ${postId}.`);
      } catch (subErr) {
        console.error(`usePosts: Error deleting reactions for post ${postId}:`, subErr);
      }

      const postIndex = posts.value.findIndex(p => p.id === postId);
      if (postIndex !== -1) {
        posts.value.splice(postIndex, 1);
        console.log("usePosts: Post removed from local state.");
      }
    } catch (err) {
      console.error(`usePosts: Error deleting post ${postId}:`, err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    posts,
    loading,
    error,
    fetchPosts,
    fetchSinglePost,
    addPost,
    likeDislikePost,
    updatePost,
    deletePost
  };
}