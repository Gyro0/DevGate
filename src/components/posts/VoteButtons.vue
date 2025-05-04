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
  color: var(--highlight);
}
.vote-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  background: var(--background);
  border: 1.5px solid var(--highlight);
  border-radius: 1rem;
  padding: 0.25rem 0.75rem;
  font-size: 0.9rem;
  color: var(--text);
  cursor: pointer;
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 8px var(--highlight);
}
.vote-btn:hover:not(.disabled) {
  background: var(--highlight);
  color: var(--background);
  border-color: var(--primary);
  box-shadow: 0 0 12px var(--primary);
}
.vote-btn.disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
.vote-btn .count {
  font-weight: 600;
  min-width: 10px;
  text-align: center;
}
.vote-btn.upvote.active {
  background: var(--primary);
  border-color: var(--primary);
  color: var(--background);
  box-shadow: 0 0 12px var(--primary);
}
.vote-btn.downvote.active {
  background: var(--secondary);
  border-color: var(--secondary);
  color: var(--background);
  box-shadow: 0 0 12px var(--secondary);
}
.vote-error {
  color: #ef4444;
  font-size: 0.75rem;
  margin-left: 0.5rem;
}
</style>