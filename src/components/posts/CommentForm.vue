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
  border-top: 1px solid #e5e7eb;
  position: relative; /* For absolute positioning of button */
}
.comment-avatar {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  margin-top: 0.25rem;
}
.input-wrapper {
  flex: 1;
  position: relative;
  display: flex;
  align-items: flex-end; /* Align button with bottom */
  border: 1px solid #d1d5db;
  border-radius: 1.5rem; /* Pill shape */
  padding: 0.3rem 0.5rem 0.3rem 1rem; /* Adjust padding */
  background-color: #fff;
}
.input-wrapper:focus-within {
   border-color: #4f46e5;
   box-shadow: 0 0 0 1px #4f46e5;
}

textarea {
  flex: 1;
  border: none;
  outline: none;
  resize: none;
  font-size: 0.875rem;
  line-height: 1.4;
  background: none;
  padding: 0.25rem 0; /* Minimal vertical padding */
  max-height: 150px; /* Limit max height */
  overflow-y: auto; /* Allow scrolling if needed */
  align-self: center; /* Center text vertically */
}
textarea:disabled {
  background-color: #f9fafb;
  cursor: not-allowed;
}

.submit-btn {
  background-color: #4f46e5;
  color: white;
  border: none;
  border-radius: 1rem; /* Pill shape */
  padding: 0.4rem 1rem;
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s;
  margin-left: 0.5rem; /* Space between textarea and button */
  height: fit-content; /* Match height to content */
}
.submit-btn:disabled {
  background-color: #a5b4fc;
  cursor: not-allowed;
}
.submit-btn:hover:not(:disabled) {
  background-color: #4338ca;
}
.error-message {
  color: #ef4444;
  font-size: 0.75rem;
  position: absolute;
  bottom: -1.5rem;
  left: 50px; /* Align with input area */
}
.login-prompt {
   font-size: 0.8rem;
   color: #6b7280;
   margin-top: 0.5rem;
   width: 100%;
   text-align: center;
}
.login-prompt a {
   color: #4f46e5;
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