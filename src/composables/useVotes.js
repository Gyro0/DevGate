import { ref, watch } from 'vue';
import firebase, { db } from '@/firebase/firebaseInit';
import useAuth from './useAuth';

export default function useVotes(postId) {
  const { user, waitForAuth } = useAuth();
  const userVote = ref(null); // 'up', 'down', or null
  const upvotesCount = ref(0);
  const downvotesCount = ref(0);
  const loading = ref(false);
  const error = ref(null);

  const postRef = db.collection('posts').doc(postId);
  let votesListener = null;
  let postListener = null;

  // Fetch initial counts and user's vote
  const fetchVoteData = async () => {
    if (!postId) return;
    loading.value = true;
    error.value = null;

    try {
      const authUser = await waitForAuth();

      // Get initial post counts (can be done via listener too)
      const postDoc = await postRef.get();
      if (postDoc.exists) {
        upvotesCount.value = postDoc.data().upvotesCount || 0;
        downvotesCount.value = postDoc.data().downvotesCount || 0;
      }

      // Get user's current vote if logged in
      if (authUser) {
        const voteDocId = `${authUser.uid}_${postId}`;
        const voteRef = db.collection('votes').doc(voteDocId);
        const voteDoc = await voteRef.get();
        if (voteDoc.exists) {
          userVote.value = voteDoc.data().voteType;
        } else {
          userVote.value = null;
        }
      } else {
        userVote.value = null;
      }

      // Set up listeners
      setupListeners(authUser);

    } catch (err) {
      console.error(`useVotes: Error fetching vote data for post ${postId}:`, err);
      error.value = 'Failed to load vote data.';
    } finally {
      loading.value = false;
    }
  };

  // Set up real-time listeners for counts and user vote
  const setupListeners = (authUser) => {
    // Listen for changes in post counts
    postListener = postRef.onSnapshot(doc => {
      if (doc.exists) {
        upvotesCount.value = doc.data().upvotesCount || 0;
        downvotesCount.value = doc.data().downvotesCount || 0;
      }
    }, err => {
      console.error(`useVotes: Error listening to post ${postId}:`, err);
      error.value = 'Error updating vote counts.';
    });

    // Listen for changes in the user's vote (if logged in)
    if (authUser) {
      const voteDocId = `${authUser.uid}_${postId}`;
      const voteRef = db.collection('votes').doc(voteDocId);
      votesListener = voteRef.onSnapshot(doc => {
        userVote.value = doc.exists ? doc.data().voteType : null;
      }, err => {
        console.error(`useVotes: Error listening to user vote for post ${postId}:`, err);
        error.value = 'Error updating your vote status.';
      });
    }
  };

  // Function to cast a vote
  const castVote = async (voteType) => { // voteType: 'up' or 'down'
    if (!user.value) {
      alert('Please log in to vote.');
      return;
    }
    if (!postId) return;

    loading.value = true; // Indicate activity
    error.value = null;
    const voteDocId = `${user.value.uid}_${postId}`;
    const voteRef = db.collection('votes').doc(voteDocId);
    const currentVote = userVote.value;

    // Use a transaction to ensure atomicity
    try {
      await db.runTransaction(async (transaction) => {
        const postDoc = await transaction.get(postRef);
        if (!postDoc.exists) throw new Error("Post not found.");

        const voteDoc = await transaction.get(voteRef);
        const existingVoteType = voteDoc.exists ? voteDoc.data().voteType : null;

        let upvoteIncrement = 0;
        let downvoteIncrement = 0;

        if (existingVoteType === voteType) {
          // --- Undoing the vote ---
          transaction.delete(voteRef);
          if (voteType === 'up') upvoteIncrement = -1;
          else downvoteIncrement = -1;
          userVote.value = null; // Optimistic UI update
        } else {
          // --- Casting a new vote or changing vote ---
          transaction.set(voteRef, {
            userId: user.value.uid,
            postId: postId,
            voteType: voteType,
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
          });

          if (existingVoteType === 'up') upvoteIncrement = -1; // Changing from up
          if (existingVoteType === 'down') downvoteIncrement = -1; // Changing from down

          if (voteType === 'up') upvoteIncrement = 1; // Casting upvote
          else downvoteIncrement = 1; // Casting downvote

          userVote.value = voteType; // Optimistic UI update
        }

        // Update post counts
        const currentUpvotes = postDoc.data().upvotesCount || 0;
        const currentDownvotes = postDoc.data().downvotesCount || 0;
        transaction.update(postRef, {
          upvotesCount: currentUpvotes + upvoteIncrement,
          downvotesCount: currentDownvotes + downvoteIncrement
        });
      });
      console.log(`useVotes: Vote ${voteType} processed for post ${postId}`);
    } catch (err) {
      console.error(`useVotes: Error casting vote for post ${postId}:`, err);
      error.value = `Failed to cast vote: ${err.message}`;
      userVote.value = currentVote; // Revert optimistic update on error
    } finally {
      loading.value = false;
    }
  };

  // Cleanup listeners on unmount (or when postId changes)
  const cleanup = () => {
    if (votesListener) votesListener();
    if (postListener) postListener();
    votesListener = null;
    postListener = null;
  };

  // Watch for postId changes to refetch/re-listen
  watch(() => postId, (newPostId, oldPostId) => {
    if (newPostId !== oldPostId) {
      cleanup();
      fetchVoteData();
    }
  }, { immediate: true }); // Fetch immediately on setup

  // Watch for user changes
  watch(user, (newUser) => {
      cleanup();
      fetchVoteData(); // Refetch/re-listen when user logs in/out
  });


  return {
    userVote,
    upvotesCount,
    downvotesCount,
    loading,
    error,
    castVote,
    cleanup // Expose cleanup for manual call if needed
  };
}