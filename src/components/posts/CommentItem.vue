<template>
  <div class="comment-item">
    <img :src="comment.authorPhotoURL || '/default-avatar.png'" alt="Author" class="comment-avatar">
    <div class="comment-content">
      <div class="comment-header">
        <span class="comment-author">{{ comment.authorName }}</span>
        <span class="comment-timestamp">{{ formattedTimestamp }}</span>
        <!-- Add delete button if user is author -->
      </div>
      <p class="comment-text">{{ comment.text }}</p>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { formatDistanceToNow } from 'date-fns';

export default {
  name: 'CommentItem',
  props: {
    comment: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const formattedTimestamp = computed(() => {
      if (!props.comment.createdAt) return '';
      // createdAt should be a JS Date from useComments
      return formatDistanceToNow(props.comment.createdAt, { addSuffix: true });
    });

    return {
      formattedTimestamp
    };
  }
}
</script>

<style scoped>
.comment-item {
  display: flex;
  gap: 0.75rem;
  padding: 1rem; /* Increased padding */
  border-radius: 8px; /* Add rounding */
  background-color: var(--surface-ground); /* Use ground background */
  transition: background-color 0.2s;
}
.comment-item:hover {
  background-color: var(--surface-hover); /* Add hover effect */
}
.comment-avatar {
  width: 36px; /* Match form avatar */
  height: 36px;
  border-radius: 50%;
  margin-top: 0; /* Align top */
  border: 2px solid var(--primary-glow); /* Use primary glow */
  box-shadow: 0 0 6px var(--primary-glow); /* Use primary glow */
  background: var(--background);
  flex-shrink: 0; /* Prevent shrinking */
}
.comment-content {
  flex: 1;
}
.comment-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.35rem; /* Slightly more space */
}
.comment-author {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--primary); /* Keep primary color */
}
.comment-timestamp {
  font-size: 0.8rem;
  color: var(--text-secondary); /* Use secondary text color */
}
.comment-text {
  font-size: 0.95rem;
  color: var(--text); /* Use primary text color */
  line-height: 1.6; /* Increased line height */
  margin: 0;
  white-space: pre-wrap; /* Keep wrapping */
  word-break: break-word; /* Ensure long words break */
  text-align: left; /* Explicitly align text to the left */
}
</style>