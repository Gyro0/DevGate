import { ref, watch } from 'vue';
import firebase, { db } from '@/firebase/firebaseInit';
import useAuth from './useAuth';

export default function useComments(postId) {
  const { user, waitForAuth } = useAuth();
  const comments = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const addingComment = ref(false);
  const addError = ref(null);

  let commentsListener = null;

  // Fetch comments for the post
  const fetchComments = () => {
    if (!postId) {
      comments.value = [];
      return;
    }
    loading.value = true;
    error.value = null;
    console.log(`useComments: Fetching comments for post ${postId}...`);

    // Detach previous listener if exists
    if (commentsListener) commentsListener();

    const commentsQuery = db.collection('comments')
      .where('postId', '==', postId)
      .orderBy('createdAt', 'asc'); // Show oldest first

    commentsListener = commentsQuery.onSnapshot(snapshot => {
      comments.value = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        // Ensure createdAt is a JS Date for formatting
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : new Date()
      }));
      loading.value = false;
      console.log(`useComments: Loaded ${comments.value.length} comments for post ${postId}.`);
    }, err => {
      console.error(`useComments: Error fetching comments for post ${postId}:`, err);
      error.value = 'Failed to load comments.';
      loading.value = false;
    });
  };

  // Add a new comment
  const addComment = async (text) => {
    if (!user.value) {
      alert('Please log in to comment.');
      return;
    }
    if (!postId || !text.trim()) return;

    addingComment.value = true;
    addError.value = null;

    try {
      const commentData = {
        postId: postId,
        userId: user.value.uid,
        authorName: user.value.displayName || 'Anonymous',
        authorPhotoURL: user.value.photoURL || null,
        text: text.trim(),
        createdAt: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Add comment doc
      const docRef = await db.collection('comments').add(commentData);

      // Increment commentsCount on the post (using FieldValue.increment)
      const postRef = db.collection('posts').doc(postId);
      await postRef.update({
        commentsCount: firebase.firestore.FieldValue.increment(1)
      });

      console.log(`useComments: Comment added ${docRef.id} to post ${postId}.`);
      // No need for optimistic update, listener will catch it.
      return true; // Indicate success

    } catch (err) {
      console.error(`useComments: Error adding comment to post ${postId}:`, err);
      addError.value = `Failed to add comment: ${err.message}`;
      return false; // Indicate failure
    } finally {
      addingComment.value = false;
    }
  };

  // Cleanup listener
  const cleanup = () => {
    if (commentsListener) commentsListener();
    commentsListener = null;
  };

  // Watch for postId changes
  watch(() => postId, (newPostId, oldPostId) => {
    if (newPostId !== oldPostId) {
      fetchComments();
    }
  }, { immediate: true }); // Fetch immediately

  return {
    comments,
    loading,
    error,
    addingComment,
    addError,
    addComment,
    fetchComments, // Expose fetch if manual refresh is needed
    cleanup
  };
}