<template>
  <div class="post-detail-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar /> <!-- Or hide sidebar if preferred -->
      <div class="content-area" v-if="post && !loading && !error">
         <div class="post-detail-card">
            <div class="post-main-content">
               <div class="post-header">
                  <div class="author-info">
                      <img :src="post.authorPhotoURL || '/default-avatar.png'" alt="Author" class="post-avatar" />
                      <div>
                          <span class="post-author">{{ post.authorName }}</span>
                          <span class="post-timestamp">{{ formatTimestamp(post.createdAt) }}</span>
                      </div>
                  </div>
                  <!-- Edit/Delete Buttons for Author -->
                  <div v-if="isAuthor" class="post-actions">
                      <button @click="startEditing" class="action-btn edit-btn" title="Edit Post">
                          <i class="fas fa-edit"></i>
                      </button>
                      <button @click="confirmDelete" class="action-btn delete-btn" title="Delete Post">
                          <i class="fas fa-trash"></i>
                      </button>
                  </div>
               </div>

               <!-- Display Mode -->
               <template v-if="!isEditing">
                  <h1 class="post-title">{{ post.title }}</h1>
                  <p class="post-description">{{ post.description }}</p>
                  <img v-if="post.imageUrl" :src="post.imageUrl" alt="Post image" class="post-image"/>
                   <!-- Linked Entity Display -->
                   <div v-if="post.linkedEntityType && post.linkedEntity" class="linked-entity">
                     <i :class="getEntityTypeIcon(post.linkedEntityType)"></i>
                     Linked {{ post.linkedEntityType }}:
                     <router-link :to="`/${post.linkedEntityType}s/${post.linkedEntityId}`">
                       {{ post.linkedEntity.name || post.linkedEntity.title }}
                     </router-link>
                   </div>
               </template>

               <!-- Edit Mode (Simple Inline Example) -->
               <template v-else>
                   <div class="edit-form">
                      <div class="form-group">
                          <label for="edit-title">Title</label>
                          <input id="edit-title" type="text" v-model="editablePost.title" class="form-input">
                      </div>
                      <div class="form-group">
                          <label for="edit-description">Description</label>
                          <textarea id="edit-description" v-model="editablePost.description" class="form-input" rows="5"></textarea>
                      </div>
                      <!-- Add image upload/remove controls if needed -->
                      <!-- Add linked entity selection if needed -->
                      <div class="edit-form-actions">
                          <button @click="cancelEditing" class="btn btn-secondary btn-sm">Cancel</button>
                          <button @click="saveChanges" class="btn btn-primary btn-sm" :disabled="postsLoading">
                              {{ postsLoading ? 'Saving...' : 'Save Changes' }}
                          </button>
                      </div>
                   </div>
               </template>

            </div>
            <div class="post-interactions" v-if="!isEditing"> <!-- Hide interactions while editing -->
               <ReactionButtons
                  :post-id="post.id"
                  :initial-likes="post.likesCount || 0"
                  :initial-dislikes="post.dislikesCount || 0"
                  :initial-user-reaction="post.userReaction"
               />
               <div class="comment-info">
                  <i class="far fa-comment"></i>
                  <span>{{ post.commentsCount || 0 }} Comments</span>
               </div>
               <!-- Share button? -->
            </div>
         </div>
         <!-- Comment Section (Hide while editing post?) -->
         <CommentSection v-if="!isEditing" :post-id="postId" />
      </div>
      <!-- Loading State -->
      <div class="content-area state-container loading-state" v-else-if="loading">
        <div class="spinner"></div>
        <p>Loading post...</p>
      </div>
      <!-- Error State -->
       <div class="content-area state-container error-state" v-else-if="error">
         <i class="fas fa-exclamation-triangle"></i>
         <p>{{ error }}</p>
         <router-link to="/dashboard" class="btn btn-secondary btn-sm">Back to Feed</router-link>
      </div>
      <!-- Not Found State (if fetch completes but post is null) -->
      <div class="content-area state-container error-state" v-else>
         <i class="fas fa-question-circle"></i>
         <p>Post not found.</p>
         <router-link to="/dashboard" class="btn btn-secondary btn-sm">Back to Feed</router-link>
      </div>
    </div>

    <!-- Simple Confirmation Modal (Example) -->
    <div v-if="showDeleteConfirm" class="modal-backdrop">
        <div class="modal-content">
            <h4>Confirm Deletion</h4>
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
            <div class="modal-actions">
                <button @click="showDeleteConfirm = false" class="btn btn-secondary">Cancel</button>
                <button @click="executeDelete" class="btn btn-danger" :disabled="postsLoading">
                    {{ postsLoading ? 'Deleting...' : 'Delete Post' }}
                </button>
            </div>
        </div>
    </div>

  </div>
</template>

<script>
import { ref, computed, onMounted, watch, onUnmounted } from 'vue'; // Added onUnmounted
import { useRoute, useRouter } from 'vue-router';
import useAuth from '@/composables/useAuth'; // Import useAuth
import usePosts from '@/composables/usePosts'; // Import usePosts
import AppHeader from '@/components/common/AppHeader.vue'; // Added import
import AppSidebar from '@/components/common/AppSidebar.vue'; // Added import
import ReactionButtons from '@/components/posts/VoteButtons.vue'; // Check name, changed from VoteButtons
import CommentSection from '@/components/posts/CommentSection.vue'; // Assuming component exists in 'posts' folder

export default {
  name: 'PostDetail', // Changed from PostDetailView
  components: {
    AppHeader, // Added
    AppSidebar, // Added
    ReactionButtons,
    CommentSection
  },
  setup() {
    const route = useRoute();
    const router = useRouter();
    const { user } = useAuth(); // Get current user
    // Destructure new functions from usePosts
    const {
        loading: postsLoading, // Rename loading to avoid conflict if needed
        error: postsError,
        fetchSinglePost, // Assuming you have a function to fetch one post
        updatePost,
        deletePost
    } = usePosts();

    const postId = ref(route.params.id);
    const post = ref(null);
    const loading = ref(false); // Local loading state for fetching
    const error = ref(null); // Local error state for fetching

    const isEditing = ref(false);
    const editablePost = ref({}); // Store editable data
    const showDeleteConfirm = ref(false);

    // --- Define formatTimestamp function ---
    const formatTimestamp = (timestamp) => {
      if (!timestamp) return 'Date unknown';
      let date;
      // Check if timestamp is a Firestore Timestamp object
      if (timestamp && typeof timestamp.toDate === 'function') {
        date = timestamp.toDate();
      } else if (timestamp instanceof Date) {
        date = timestamp;
      } else {
        // Try parsing if it's a string or number (milliseconds)
        date = new Date(timestamp);
      }

      if (isNaN(date.getTime())) {
        return 'Invalid date';
      }

      // Simple relative time (can be expanded)
      const now = new Date();
      const secondsPast = (now.getTime() - date.getTime()) / 1000;

      if (secondsPast < 60) {
        return parseInt(secondsPast) + 's ago';
      }
      if (secondsPast < 3600) {
        return parseInt(secondsPast / 60) + 'm ago';
      }
      if (secondsPast <= 86400) { // 24 hours
        return parseInt(secondsPast / 3600) + 'h ago';
      }
      // Older than a day, show date
      const options = { year: 'numeric', month: 'short', day: 'numeric' };
      return date.toLocaleDateString(undefined, options);
    };

    // --- Define getEntityTypeIcon function ---
    const getEntityTypeIcon = (entityType) => {
      switch (entityType?.toLowerCase()) {
        case 'project':
          return 'fas fa-project-diagram';
        case 'skill':
          return 'fas fa-code';
        case 'user':
          return 'fas fa-user';
        case 'job':
          return 'fas fa-briefcase';
        // Add more cases as needed
        default:
          return 'fas fa-link'; // Default link icon
      }
    };

    // Check if the current user is the author
    const isAuthor = computed(() => {
      return user.value && post.value && user.value.uid === post.value.authorId;
    });

    const loadPost = async () => {
      loading.value = true;
      error.value = null;
      post.value = null; // Reset post
      try {
        // Assuming fetchSinglePost exists and fetches post + user reaction
        const fetchedPost = await fetchSinglePost(postId.value);
        post.value = fetchedPost;
        if (!post.value) {
            error.value = "Post not found.";
            // Optional: Redirect if post not found after load
            // router.replace('/not-found');
        }
      } catch (err) {
        console.error("Error loading post:", err);
        error.value = err.message || "Failed to load post.";
      } finally {
        loading.value = false;
      }
    };

    // --- Edit Handlers ---
    const startEditing = () => {
        if (!isAuthor.value) return;
        // Clone post data for editing to avoid modifying original reactive object directly
        editablePost.value = {
            title: post.value.title,
            description: post.value.description,
            // Copy other editable fields like linkedEntityId/Type if needed
        };
        isEditing.value = true;
    };

    const cancelEditing = () => {
        isEditing.value = false;
        editablePost.value = {}; // Clear editable data
    };

    const saveChanges = async () => {
        if (!isAuthor.value || postsLoading.value) return;
        try {
            // Prepare payload - only include fields that can be edited
            const updatePayload = {
                title: editablePost.value.title,
                description: editablePost.value.description,
                // Add other fields from editablePost if they exist
            };
            // Pass postId and payload to the composable function
            // Pass newImageFile or removeImage flag if handling image updates
            const updated = await updatePost(postId.value, updatePayload /*, newImageFile, removeImage */);
            // Update local post ref with returned data for immediate UI update
            // Ensure we merge correctly, keeping potentially non-updated fields like author info
            post.value = { ...post.value, ...updated };
            isEditing.value = false; // Exit edit mode
        } catch (err) {
            console.error("Error saving post changes:", err);
            // Optionally show an error message to the user
            error.value = `Failed to save changes: ${err.message}`; // Show error locally
        }
    };

    // --- Delete Handlers ---
    const confirmDelete = () => {
        if (!isAuthor.value) return;
        showDeleteConfirm.value = true;
    };

    const executeDelete = async () => {
        if (!isAuthor.value || postsLoading.value) return;
        try {
            await deletePost(postId.value);
            showDeleteConfirm.value = false;
            // Navigate away after successful deletion
            router.push('/'); // Or to the user's profile, feed, etc.
        } catch (err) {
            console.error("Error deleting post:", err);
            error.value = `Failed to delete post: ${err.message}`; // Show error locally
            showDeleteConfirm.value = false; // Close modal on error too
        }
    };

    onMounted(loadPost);

    // Watch for route changes if needed (e.g., navigating between posts)
    watch(() => route.params.id, (newId) => {
      if (newId && newId !== postId.value) { // Check if ID actually changed
        postId.value = newId;
        isEditing.value = false; // Exit edit mode if navigating to a different post
        loadPost();
      }
    });

    // Cleanup listener if fetchSinglePost uses onSnapshot internally
    // onUnmounted(() => { /* cleanup logic if needed */ });

    return {
      post,
      postId,
      loading, // Use local loading for fetch
      error,   // Use local error for fetch
      postsLoading, // Use composable loading for actions (update/delete)
      postsError,   // Use composable error for actions
      isAuthor,
      formatTimestamp, // Return the locally defined function
      getEntityTypeIcon, // Return the locally defined function
      isEditing,
      editablePost,
      startEditing,
      cancelEditing,
      saveChanges,
      showDeleteConfirm,
      confirmDelete,
      executeDelete
    };
  }
}
</script>

<style scoped>
/* Basic layout styles */
.main-layout { display: flex; min-height: calc(100vh - 64px); /* Adjust based on AppHeader height */ }
.content-area { flex: 1; padding: 1.5rem; overflow-y: auto; max-width: 800px; margin: 0 auto; } /* Center content */

.post-detail-card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  margin-bottom: 2rem;
  overflow: hidden;
}

.post-main-content {
  padding: 1.5rem 2rem; /* More padding */
}

.post-header {
  display: flex;
  justify-content: space-between; /* Space out author info and actions */
  align-items: flex-start; /* Align top */
  margin-bottom: 1rem;
  gap: 1rem; /* Add gap between author info and actions */
}
.author-info {
    display: flex;
    align-items: center;
    gap: 0.75rem;
    flex-grow: 1; /* Allow author info to take available space */
    min-width: 0; /* Prevent overflow issues */
}
.author-info > div { /* Container for name/timestamp */
    min-width: 0;
}
.post-avatar {
  width: 40px; height: 40px; border-radius: 50%; margin-right: 0; /* Removed margin-right */ object-fit: cover; border: 1px solid #eee; flex-shrink: 0;
}
.post-author {
  font-weight: 600; color: #111827; display: block; font-size: 0.9rem; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
}
.post-timestamp {
  font-size: 0.75rem; color: #6b7280;
}
.post-actions {
  display: flex;
  gap: 0.5rem;
  flex-shrink: 0; /* Prevent shrinking */
}

/* Reuse action-btn styles from SkillCard or define here */
.action-btn {
  background: none;
  border: none;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  color: #6b7280;
  transition: background-color 0.2s, color 0.2s;
}
.action-btn i { font-size: 0.9rem; }
.edit-btn:hover { background-color: #eef2ff; color: #4f46e5; }
.delete-btn:hover { background-color: #fee2e2; color: #ef4444; }


.post-title {
  font-size: 1.8rem; /* Larger title */
  font-weight: 700;
  margin-top: 0;
  margin-bottom: 1rem;
  color: #1f2937;
  line-height: 1.3;
  word-break: break-word; /* Prevent overflow */
}

.post-description {
  font-size: 1rem; /* Slightly larger description */
  color: #374151;
  line-height: 1.7;
  margin-bottom: 1.5rem;
  white-space: pre-wrap;
  word-break: break-word; /* Prevent overflow */
}

.post-image {
  max-width: 100%; border-radius: 6px; margin-top: 1rem; margin-bottom: 1.5rem; border: 1px solid #e5e7eb; display: block;
}

.linked-entity {
  font-size: 0.85rem; color: #4b5563; background-color: #f3f4f6; padding: 0.4rem 0.8rem; border-radius: 6px; display: inline-flex; align-items: center; gap: 0.5rem; margin-top: 1rem;
}
.linked-entity a { color: #4f46e5; text-decoration: none; font-weight: 500; }
.linked-entity a:hover { text-decoration: underline; }
.linked-entity i { color: #9ca3af; }

.post-interactions {
  display: flex;
  align-items: center;
  gap: 1.5rem; /* Space between votes and comments info */
  padding: 1rem 2rem;
  border-top: 1px solid #f3f4f6;
  background-color: #f9fafb;
}

.comment-info {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
  font-size: 0.9rem;
}
.comment-info i {
  font-size: 1rem;
}

/* Edit Form Styles */
.edit-form {
    margin-top: 1rem;
    padding-top: 1rem;
    border-top: 1px solid #e5e7eb;
}
.form-group {
    margin-bottom: 1rem;
}
.form-group label {
    display: block;
    font-weight: 500;
    margin-bottom: 0.5rem;
    font-size: 0.9rem;
}
.form-input { /* Reuse from AccountSettings or define here */
  width: 100%;
  padding: 0.5rem 0.75rem;
  border: 1px solid #d1d5db;
  border-radius: 6px;
  font-size: 0.9rem;
  color: #1f2937;
  background-color: #fff;
  transition: border-color 0.2s, box-shadow 0.2s;
}
.form-input:focus {
  outline: none;
  border-color: #4f46e5;
  box-shadow: 0 0 0 2px rgba(79, 70, 229, 0.2);
}
textarea.form-input { resize: vertical; min-height: 80px; }
.edit-form-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
    margin-top: 1.5rem;
}

/* Simple Modal Styles (Example) */
.modal-backdrop {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
}
.modal-content {
    background-color: #fff;
    padding: 1.5rem 2rem;
    border-radius: 8px;
    box-shadow: 0 5px 15px rgba(0,0,0,0.2);
    max-width: 400px;
    width: 90%;
}
.modal-content h4 {
    margin-top: 0;
    margin-bottom: 1rem;
}
.modal-content p {
    margin-bottom: 1.5rem;
    color: #4b5563;
}
.modal-actions {
    display: flex;
    justify-content: flex-end;
    gap: 0.75rem;
}

/* Loading/Error States */
.state-container { text-align: center; padding: 3rem 1rem; color: #6b7280; display: flex; flex-direction: column; align-items: center; justify-content: center; }
.loading-state .spinner { width: 24px; height: 24px; border: 3px solid rgba(79, 70, 229, 0.2); border-radius: 50%; border-top-color: #4f46e5; animation: spin 1s linear infinite; display: inline-block; margin-bottom: 0.5rem; }
.error-state i { font-size: 2rem; color: #d1d5db; margin-bottom: 0.5rem; }
.error-state p { margin-bottom: 1rem; }
.error-state .btn { margin-top: 0.5rem; } /* Adjust button margin */
@keyframes spin { to { transform: rotate(360deg); } }

/* Button Styles (Ensure these are defined or imported globally/locally) */
.btn { display: inline-block; font-weight: 500; line-height: 1.25; text-align: center; text-decoration: none; vertical-align: middle; cursor: pointer; user-select: none; background-color: transparent; border: 1px solid transparent; padding: 0.5rem 1rem; font-size: 0.875rem; border-radius: 0.375rem; transition: color .15s ease-in-out,background-color .15s ease-in-out,border-color .15s ease-in-out,box-shadow .15s ease-in-out; }
.btn-sm { padding: 0.3rem 0.8rem; font-size: 0.8rem; }
.btn-primary { color: #fff; background-color: #4f46e5; border-color: #4f46e5; }
.btn-primary:hover { background-color: #4338ca; border-color: #3e33b7; }
.btn-secondary { color: #374151; background-color: #fff; border-color: #d1d5db; box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
.btn-secondary:hover { background-color: #f9fafb; border-color: #d1d5db; }
.btn-danger { color: #fff; background-color: #ef4444; border-color: #ef4444; }
.btn-danger:hover { background-color: #dc2626; border-color: #b91c1c; }
.btn:disabled { opacity: 0.65; cursor: not-allowed; }

</style>