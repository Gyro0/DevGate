<template>
  <div class="comment-section">
    <h4>Comments ({{ comments.length }})</h4>
    
    <CommentForm
      :adding-comment="addingComment"
      :add-error="addError"
      @submit-comment="handleCommentSubmit"
    />
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
  background: var(--surface-card); /* Match post card background */
  border: 1.5px solid var(--border-color, #23272e); /* Add border */
  border-top: none; /* Remove top border specifically */
  border-bottom-left-radius: 1.1rem; /* Match post card bottom radius */
  border-bottom-right-radius: 1.1rem; /* Match post card bottom radius */
  padding: 1.5rem; /* Add padding inside the section */
  box-shadow: 0 8px 16px -4px rgba(0,0,0,0.2); /* Add subtle shadow continuation */
}
.comment-section h4 {
  margin-top: 0;
  margin-bottom: 1.5rem; /* Increased bottom margin */
  font-size: 1.1rem; /* Slightly larger */
  font-weight: 700;
  color: var(--secondary); /* Use secondary color */
  letter-spacing: 0.5px;
  text-shadow: 0 0 6px var(--secondary-glow, rgba(124, 58, 237, 0.4)); /* Use secondary glow */
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--border-color); /* Add underline */
}
.comment-list {
  margin-bottom: 2rem; /* More space before the form */
  display: flex;
  flex-direction: column;
  gap: 1rem; /* Add gap between comment items */
}

/* Small states for inline display */
.loading-state.small, .error-state.small, .empty-state.small {
  font-size: 0.95rem;
  color: var(--text-secondary); /* Use secondary text color */
  padding: 1.5rem 0; /* More padding */
  text-align: center;
  background: var(--surface-ground); /* Use ground background */
  border-radius: 8px; /* Add rounding */
  border: 1px dashed var(--border-color); /* Dashed border */
  margin-bottom: 2rem; /* Match list margin */
}
.loading-state.small .spinner {
   width: 18px; height: 18px; border-width: 2px; display: inline-block; margin-right: 0.5rem; vertical-align: middle;
   border: 2px solid var(--primary-glow, rgba(79, 70, 229, 0.2)); /* Use primary glow */
   border-radius: 50%;
   border-top-color: var(--primary); /* Use primary */
   animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>