<template>
  <div class="vote-buttons">
    <button
      @click="handleVote('up')"
      :class="{ 'active': userVote === 'up', 'disabled': loading }"
      :disabled="loading || !isLoggedIn"
      class="vote-btn upvote"
      title="Upvote"
    >
      <i class="fas fa-arrow-up"></i>
      <span class="count">{{ upvotesCount }}</span>
    </button>
    <button
      @click="handleVote('down')"
      :class="{ 'active': userVote === 'down', 'disabled': loading }"
      :disabled="loading || !isLoggedIn"
      class="vote-btn downvote"
      title="Downvote"
    >
      <i class="fas fa-arrow-down"></i>
      <span class="count">{{ downvotesCount }}</span>
    </button>
    <p v-if="error" class="vote-error">{{ error }}</p>
  </div>
</template>

<script>
import { computed } from 'vue';
import useVotes from '@/composables/useVotes';
import useAuth from '@/composables/useAuth';

export default {
  name: 'VoteButtons',
  props: {
    postId: {
      type: String,
      required: true
    }
  },
  setup(props) {
    const { user } = useAuth();
    const {
      userVote,
      upvotesCount,
      downvotesCount,
      loading,
      error,
      castVote
    } = useVotes(props.postId);

    const isLoggedIn = computed(() => !!user.value);

    const handleVote = (type) => {
      if (!isLoggedIn.value) {
         alert('Please log in to vote.');
         return;
      }
      castVote(type);
    };

    return {
      userVote,
      upvotesCount,
      downvotesCount,
      loading,
      error,
      handleVote,
      isLoggedIn
    };
  }
}
</script>

<style scoped>
.vote-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #6b7280;
}
.vote-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background-color: #f3f4f6;
  border: 1px solid #e5e7eb;
  border-radius: 1rem; /* Pill shape */
  padding: 0.25rem 0.75rem;
  font-size: 0.8rem;
  color: #4b5563;
  cursor: pointer;
  transition: all 0.2s ease;
}
.vote-btn:hover:not(.disabled) {
  background-color: #e5e7eb;
  border-color: #d1d5db;
}
.vote-btn.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.vote-btn .count {
  font-weight: 500;
  min-width: 10px; /* Ensure space for number */
  text-align: center;
}
.vote-btn.upvote.active {
  background-color: #dbeafe; /* Light blue */
  border-color: #93c5fd;
  color: #2563eb;
}
.vote-btn.downvote.active {
  background-color: #fee2e2; /* Light red */
  border-color: #fca5a5;
  color: #dc2626;
}
.vote-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}
</style>