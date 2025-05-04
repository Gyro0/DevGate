<template>
  <div class="vote-buttons">
    <button
      @click="handleVote('up')"
      :class="{ 'green': userVote === 'up', 'disabled': loading }"
      :disabled="loading || !isLoggedIn"
      class="btn"
      title="Like"
    >
      <i class="fa fa-thumbs-up fa-lg" aria-hidden="true"></i>
      <span class="count">{{ upvotesCount }}</span>
    </button>
    <button
      @click="handleVote('down')"
      :class="{ 'red': userVote === 'down', 'disabled': loading }"
      :disabled="loading || !isLoggedIn"
      class="btn"
      title="Dislike"
    >
      <i class="fa fa-thumbs-down fa-lg" aria-hidden="true"></i>
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
         // Consider using a more integrated notification system instead of alert
         console.warn('User not logged in, cannot vote.');
         // Optionally emit an event to show a login prompt
         // emit('requestLogin');
         return;
      }
      // Determine the new vote type: if clicking the same button, undo (null), otherwise set new type
      const newVoteType = userVote.value === type ? null : type;
      castVote(newVoteType); // Pass null to undo
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
  gap: 0.75rem; /* Increased gap slightly */
}

.btn {
  cursor: pointer;
  outline: 0;
  color: var(--text-secondary, #AAA); /* Default icon color */
  background: none; /* Transparent background */
  border: none; /* No border */
  padding: 0.4rem 0.6rem; /* Adjust padding */
  display: inline-flex; /* Align icon and count */
  align-items: center;
  gap: 0.4rem; /* Space between icon and count */
  border-radius: 4px; /* Optional: slight rounding */
  transition: color 0.2s ease-in-out, transform 0.1s ease;
}

.btn:focus {
  outline: none; /* Remove default focus outline */
  /* Optional: Add custom focus style if needed */
  /* box-shadow: 0 0 0 2px var(--primary-glow); */
}

.btn:hover:not(.disabled) {
  color: var(--text, #DDD); /* Slightly brighter on hover */
  transform: scale(1.1); /* Add slight scale effect */
}

.btn.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.btn .count {
  font-size: 0.9em; /* Adjust count size */
  font-weight: 600;
  color: var(--text-secondary, #AAA); /* Match default icon color */
  min-width: 10px;
  text-align: center;
  transition: color 0.2s ease-in-out;
}

/* Active state colors */
.btn.green {
  color: #28a745; /* Green color for active upvote */
}
.btn.green .count {
  color: #28a745; /* Match count color */
}

.btn.red {
  color: #dc3545; /* Red color for active downvote */
}
.btn.red .count {
  color: #dc3545; /* Match count color */
}

.vote-error {
  color: #ef4444; /* Keep error styling */
  font-size: 0.8rem;
  margin-left: 0.5rem;
}
</style>