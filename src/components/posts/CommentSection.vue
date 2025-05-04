<template>
  <div class="comment-section">
    <h4>Comments ({{ comments.length }})</h4>

    <div v-if="loading" class="loading-state small">
      <div class="spinner"></div> Loading comments...
    </div>
    <div v-else-if="error" class="error-state small">
      {{ error }}
    </div>
    <div v-else-if="comments.length === 0" class="empty-state small">
      No comments yet.
    </div>
    <div v-else class="comment-list">
      <CommentItem v-for="comment in comments" :key="comment.id" :comment="comment" />
    </div>

    <CommentForm
      :adding-comment="addingComment"
      :add-error="addError"
      @submit-comment="handleCommentSubmit"
    />
  </div>
</template>

<script>
import useComments from '@/composables/useComments';
import CommentItem from './CommentItem.vue';
import CommentForm from './CommentForm.vue';

export default {
  name: 'CommentSection',
  components: { CommentItem, CommentForm },
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const {
      comments,
      loading,
      error,
      addingComment,
      addError,
      addComment,
      cleanup // Import cleanup
    } = useComments(props.postId);

    const handleCommentSubmit = (text) => {
      addComment(text);
    };

    // Call cleanup when the component is unmounted
    // onUnmounted(cleanup); // Need to import onUnmounted from vue

    return {
      comments,
      loading,
      error,
      addingComment,
      addError,
      handleCommentSubmit
    };
  }
}
</script>

<style scoped>
.comment-section {
  margin-top: 2rem;
  padding-top: 1.5rem;
  border-top: 1.5px solid var(--highlight);
}
.comment-section h4 {
  margin-top: 0;
  margin-bottom: 1rem;
  font-size: 1rem;
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px var(--highlight);
}
.comment-list {
  margin-bottom: 1rem;
}
/* Small states for inline display */
.loading-state.small, .error-state.small, .empty-state.small {
  font-size: 0.95rem;
  color: var(--highlight);
  padding: 1rem 0;
  text-align: center;
  background: none;
  border: none;
}
.loading-state.small .spinner {
   width: 16px; height: 16px; border-width: 2px; display: inline-block; margin-right: 0.5rem; vertical-align: middle;
   border: 2px solid rgba(63, 208, 212, 0.15); border-radius: 50%; border-top-color: var(--primary); border-left-color: var(--secondary);
   animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>