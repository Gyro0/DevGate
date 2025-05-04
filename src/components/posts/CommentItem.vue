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
  padding: 0.75rem 0;
  border-bottom: 1.5px solid var(--highlight);
}
.comment-item:last-child {
  border-bottom: none;
  padding-bottom: 0;
}
.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-top: 0.25rem;
  border: 2px solid var(--highlight);
  box-shadow: 0 0 8px var(--highlight);
  background: var(--background);
}
.comment-content {
  flex: 1;
}
.comment-header {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}
.comment-author {
  font-weight: 700;
  font-size: 0.95rem;
  color: var(--primary);
}
.comment-timestamp {
  font-size: 0.8rem;
  color: var(--highlight);
}
.comment-text {
  font-size: 0.95rem;
  color: var(--text);
  line-height: 1.5;
  margin: 0;
  white-space: pre-wrap;
}
</style>