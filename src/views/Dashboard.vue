<template>
  <div class="dashboard-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar :active-page="'dashboard'" />

      <div class="content-area feed-layout">

        <!-- Button to Open Modal -->
        <CreatePostButton @open-modal="openPostModal()" />

        <!-- Feed Area -->
        <div class="feed-container">
          <h2>Feed</h2>
          <!-- Loading State -->
          <div v-if="loading" class="loading-state"> <!-- Use loading from usePosts -->
            <div class="spinner"></div>
            <span>Loading feed...</span>
          </div>
          <!-- Error State -->
          <div v-else-if="error" class="error-state"> <!-- Use error from usePosts -->
            <i class="fas fa-exclamation-circle"></i>
            <p>Error loading feed: {{ error }}</p>
            <button @click="fetchPosts" class="retry-btn">Retry</button>
          </div>
          <!-- Empty State -->
          <div v-else-if="posts.length === 0" class="empty-state">
            <i class="fas fa-stream"></i>
            <h3>No posts yet</h3>
            <p>Be the first to share an update!</p>
          </div>
          <!-- Feed Items (Use PostItem component) -->
          <div v-else class="post-list">
            <PostItem
              v-for="post in posts"
              :key="post.id"
              :post="post"
            />
          </div>
        </div>

      </div>
    </div>

    <!-- Post Form Modal -->
    <PostFormModal
      v-if="showPostModal"
      :post-to-edit="postToEdit"
      @close="closePostModal"
      @save="handleSavePost"
    />

  </div>
</template>

<script>
import { ref, onMounted } from 'vue';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import CreatePostButton from '@/components/dashboard/CreatePostButton.vue'; // Import button
import PostFormModal from '@/components/modals/PostFormModal.vue'; // Import modal
import PostItem from '@/components/posts/PostItem.vue'; // Import PostItem
import useAuth from '@/composables/useAuth';
import usePosts from '@/composables/usePosts'; // Import the actual composable

export default {
  name: 'DashboardView',
  components: {
    AppHeader,
    AppSidebar,
    CreatePostButton, // Register button
    PostFormModal,    // Register modal
    PostItem          // Register PostItem
  },
  setup() {
    const { user } = useAuth(); // Only need user info if used directly, otherwise usePosts handles it
    const { posts, loading, error, fetchPosts, addPost } = usePosts(); // Use the composable

    const showPostModal = ref(false);
    const postToEdit = ref(null); // For editing later

    onMounted(() => {
      fetchPosts(); // Fetch posts when component loads using the composable
    });

    const openPostModal = (post = null) => {
      postToEdit.value = post; // Set if editing
      showPostModal.value = true;
    };

    const closePostModal = () => {
      showPostModal.value = false;
      postToEdit.value = null;
    };

    const handleSavePost = async (postDetails, imageFile) => {
      try {
        // Call the addPost function from the composable
        await addPost(postDetails, imageFile);
        closePostModal(); // Close modal on success
      } catch (err) {
        console.error('Dashboard: Failed to save post:', err);
        // Error is already handled and logged in usePosts,
        // but you could show a specific UI error here if needed.
        // The modal itself might show the error from usePosts.
        alert(`Error saving post: ${err.message}`); // Simple alert for now
      }
      // Note: The modal's isSaving state needs to be managed.
      // We might need to pass a callback or use the loading state from usePosts.
      // For simplicity now, the modal handles its own saving state visually.
    };

    return {
      posts, // From usePosts
      loading, // From usePosts
      error,   // From usePosts
      fetchPosts, // From usePosts (for retry)
      showPostModal,
      postToEdit,
      openPostModal,
      closePostModal,
      handleSavePost
    };
  }
}
</script>

<style scoped>
.dashboard-view {
  min-height: 100vh;
  background: var(--background);
}
.main-layout {
  display: flex;
  min-height: calc(100vh - 64px);
}
.content-area.feed-layout {
  flex: 1;
  padding: 3rem 1.5rem 3rem 1.5rem;
  overflow-y: auto;
  max-width: 900px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: none;
}
.feed-container {
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  background: rgba(22, 27, 34, 0.92);
  border-radius: 2rem;
  box-shadow: 0 8px 32px 0 rgba(30, 203, 225, 0.12);
  padding: 2.5rem 2.5rem 2.5rem 2.5rem;
  border: 1.5px solid var(--border);
  min-height: 60vh;
}
.feed-container h2 {
  font-size: 2rem;
  margin-bottom: 2.5rem;
  color: var(--primary);
  font-weight: 900;
  letter-spacing: 1.5px;
  text-shadow: 0 0 18px var(--highlight);
  align-self: center;
}
.create-post-btn, .create-post-card {
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: 0 2px 16px 0 rgba(30, 203, 225, 0.10);
  border: 1.5px solid var(--highlight);
  padding: 1.25rem 1.5rem;
  margin-bottom: 2.5rem;
  display: flex;
  align-items: center;
  font-size: 1.1rem;
  color: var(--primary);
  font-weight: 700;
  cursor: pointer;
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
}
.create-post-btn:hover, .create-post-card:hover {
  box-shadow: 0 0 24px var(--primary);
  border-color: var(--primary);
  background: var(--background);
}
.post-list {
  display: flex;
  flex-direction: column;
  gap: 2.5rem;
  width: 100%;
}

.loading-state, .error-state, .empty-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text);
  background: var(--surface);
  border-radius: 1rem;
  border: 1.5px solid var(--highlight);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
  box-shadow: 0 0 16px var(--highlight);
}
.loading-state .spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(63, 208, 212, 0.15);
  border-radius: 50%;
  border-top-color: var(--primary);
  border-left-color: var(--secondary);
  background: transparent;
  box-shadow: 0 0 8px var(--highlight);
  animation: spin 1s linear infinite;
}
.error-state i, .empty-state i {
  font-size: 2rem;
  color: var(--highlight);
}
.retry-btn {
  background: var(--highlight);
  color: var(--background);
  border: none;
  border-radius: 8px;
  padding: 0.5rem 1rem;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  box-shadow: 0 0 8px var(--highlight);
  transition: background 0.2s, color 0.2s;
}
.retry-btn:hover {
  background: var(--primary);
  color: var(--background);
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>