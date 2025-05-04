<template>
  <form @submit.prevent="submitComment" class="comment-form">
    <img :src="user?.photoURL || '/default-avatar.png'" alt="Your avatar" class="comment-avatar">
    <div class="input-wrapper">
      <textarea
        v-model="commentText"
        placeholder="Add a comment..."
        rows="1"
        required
        :disabled="addingComment || !isLoggedIn"
        ref="textareaRef"
        @input="autoResize"
      ></textarea>
      <button type="submit" class="submit-btn" :disabled="!commentText.trim() || addingComment || !isLoggedIn">
        <span v-if="addingComment" class="spinner small"></span>
        <span v-else>Post</span>
      </button>
    </div>
    <p v-if="addError" class="error-message">{{ addError }}</p>
     <p v-if="!isLoggedIn" class="login-prompt">
       Please <router-link to="/login">log in</router-link> to comment.
     </p>
  </form>
</template>

<script>
import { ref, computed } from 'vue';
import useAuth from '@/composables/useAuth';

export default {
  name: 'CommentForm',
  props: {
    addingComment: Boolean, // From useComments
    addError: String      // From useComments
  },
  emits: ['submit-comment'],
  setup(props, { emit }) {
    const { user } = useAuth();
    const commentText = ref('');
    const textareaRef = ref(null);

    const isLoggedIn = computed(() => !!user.value);

    const submitComment = () => {
      if (!commentText.value.trim() || props.addingComment || !isLoggedIn.value) return;
      emit('submit-comment', commentText.value);
      commentText.value = ''; // Clear after emitting
      autoResize(); // Reset height
    };

    // Auto-resize textarea height
    const autoResize = () => {
      const textarea = textareaRef.value;
      if (textarea) {
        textarea.style.height = 'auto'; // Reset height
        textarea.style.height = `${textarea.scrollHeight}px`; // Set to scroll height
      }
    };

    return {
      user,
      commentText,
      submitComment,
      isLoggedIn,
      textareaRef,
      autoResize
    };
  }
}
</script>

<style scoped>
.comment-form {
  display: flex;
  gap: 0.75rem;
  margin-top: 1rem;
  padding-top: 1rem;
  border-top: 1.5px solid var(--highlight);
  position: relative;
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
.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-end;
  border: 1.5px solid var(--highlight);
  border-radius: 1.5rem;
  padding: 0.3rem 0.5rem 0.3rem 1rem;
  background: var(--surface);
  box-shadow: 0 0 8px var(--highlight);
}
.input-wrapper:focus-within {
   border-color: var(--primary);
   box-shadow: 0 0 0 2px var(--highlight);
}

textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 0.95rem;
  line-height: 1.4;
  background: none;
  color: var(--text);
  padding: 0.25rem 0;
  max-height: 150px;
  overflow-y: auto;
  align-self: center;
}
textarea:disabled {
  background: var(--background);
  cursor: not-allowed;
}

.submit-btn {
  background: var(--primary);
  color: var(--background);
  border: 1.5px solid var(--highlight);
  border-radius: 1rem;
  padding: 0.4rem 1rem;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  margin-left: 0.5rem;
  height: fit-content;
  box-shadow: 0 0 8px var(--highlight);
}
.submit-btn:disabled {
  background: var(--surface);
  color: var(--highlight);
  cursor: not-allowed;
  opacity: 0.7;
}
.submit-btn:hover:not(:disabled) {
  background: var(--secondary);
  color: var(--background);
  border-color: var(--primary);
  box-shadow: 0 0 12px var(--primary);
}
.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  position: absolute;
  bottom: -1.5rem;
  left: 50px;
}
.login-prompt {
   font-size: 0.8rem;
   color: var(--highlight);
   margin-top: 0.5rem;
   width: 100%;
   text-align: center;
}
.login-prompt a {
   color: var(--primary);
   text-decoration: underline;
}

/* Spinner */
.spinner.small {
  width: 1em; height: 1em; border-width: 2px;
  border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: #fff;
  animation: spin 1s linear infinite; display: inline-block;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>