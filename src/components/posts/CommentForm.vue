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
  position: relative;
  align-items: flex-start; /* Align avatar top */
}
.comment-avatar {
  width: 36px; /* Slightly larger */
  height: 36px;
  border-radius: 50%;
  margin-top: 0; /* Align with top of textarea */
  border: 2px solid var(--primary-glow); /* Use primary glow */
  box-shadow: 0 0 6px var(--primary-glow); /* Use primary glow */
  background: var(--background);
  flex-shrink: 0; /* Prevent shrinking */
}
.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-end; /* Align button bottom */
  border: 1.5px solid var(--primary); /* Use standard border color */
  border-radius: 8px; /* Standard border radius */
  padding: 0; /* Remove padding, handle internally */
  background-color: var(--surface-ground); /* Use ground background */
  transition: border-color 0.2s, box-shadow 0.2s, background-color 0.2s; /* Added background-color transition */
}
.input-wrapper:focus-within {
  background-color: var(--surface-section); /* Slightly change background on focus */
  box-shadow: 0 0 0 3px var(--primary-glow, rgba(79, 72, 211, 0.3)); /* Enhanced glow on focus */
}

textarea {
  flex: 1;
  background: transparent; /* Inherit background */
  border: none;
  padding: 0.75rem 1rem; /* Internal padding */
  color: var(--text);
  font-size: 0.95rem;
  line-height: 1.5;
  resize: none; /* Disable manual resize */
  overflow-y: hidden; /* Hide scrollbar, rely on autoResize */
  min-height: 40px; /* Adjust min-height */
  max-height: 150px; /* Add max-height */
  outline: none;
}
textarea::placeholder {
  color: var(--text-secondary);
}
textarea:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}

.submit-btn {
  background: var(--primary); /* Use primary color */
  color: white;
  border: none;
  border-radius: 6px; /* Match inner radius */
  padding: 0.5rem 1rem; /* Adjust padding */
  margin: 0.4rem; /* Margin inside wrapper */
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s, transform 0.1s;
  height: fit-content; /* Fit button height */
  display: inline-flex; /* For spinner */
  align-items: center; /* For spinner */
  justify-content: center; /* For spinner */
  min-width: 60px; /* Ensure minimum width */
}
.submit-btn:hover:not(:disabled) {
  background: var(--primary-dark); /* Darken on hover */
  transform: scale(1.02);
}
.submit-btn:disabled {
  background: var(--surface-section); /* Use section background */
  color: var(--text-secondary);
  cursor: not-allowed;
  opacity: 0.7;
}

.error-message {
  color: #ef4444;
  font-size: 0.8rem;
  position: absolute; /* Position below input */
  bottom: -1.4rem;
  left: calc(36px + 0.75rem); /* Align with input start */
}
.login-prompt {
  color: var(--text-secondary);
  font-size: 0.85rem;
  position: absolute; /* Position below input */
  bottom: -1.4rem;
  left: calc(36px + 0.75rem); /* Align with input start */
}
.login-prompt a {
  color: var(--primary);
  text-decoration: underline;
}

/* Spinner */
.spinner.small {
  width: 1em; height: 1em; border-width: 2px;
  border: 2px solid rgba(255, 255, 255, 0.3); border-radius: 50%; border-top-color: #fff;
  animation: spin 1s linear infinite;
}
@keyframes spin { to { transform: rotate(360deg); } }
</style>