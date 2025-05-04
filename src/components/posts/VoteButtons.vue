<template>
  <div class="reaction-buttons">
    <button
      @click="react('like')"
      :class="['reaction-btn', 'like-btn', { 'active': userReaction === 'like' }]"
      :disabled="loading"
      title="Like"
    >
      <i :class="userReaction === 'like' ? 'fas fa-thumbs-up' : 'far fa-thumbs-up'"></i>
    </button>
    <button
      @click="react('dislike')"
      :class="['reaction-btn', 'dislike-btn', { 'active': userReaction === 'dislike' }]"
      :disabled="loading"
      title="Dislike"
    >
      <i :class="userReaction === 'dislike' ? 'fas fa-thumbs-down' : 'far fa-thumbs-down'"></i>
    </button>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue';
import usePosts from '@/composables/usePosts';
import useAuth from '@/composables/useAuth';

export default {
  name: 'ReactionButtons',
  props: {
    postId: {
      type: String,
      required: true
    },
    initialLikes: {
      type: Number,
      default: 0
    },
    initialDislikes: {
      type: Number,
      default: 0
    },
    initialUserReaction: {
      type: String, // 'like', 'dislike', or null
      default: null
    }
  },
  setup(props) {
    const { user } = useAuth();
    const { likeDislikePost, loading: postsLoading } = usePosts();

    const likeCount = ref(props.initialLikes);
    const dislikeCount = ref(props.initialDislikes);
    const userReaction = ref(props.initialUserReaction);
    const loading = ref(false);

    watch(() => props.initialLikes, (newLikes) => likeCount.value = newLikes);
    watch(() => props.initialDislikes, (newDislikes) => dislikeCount.value = newDislikes);
    watch(() => props.initialUserReaction, (newReaction) => userReaction.value = newReaction);

    const react = async (reactionType) => {
      if (!user.value || loading.value || postsLoading.value) return;

      loading.value = true;
      const previousReaction = userReaction.value;
      let newReaction = reactionType;

      if (previousReaction === reactionType) {
        if (reactionType === 'like') likeCount.value--;
        if (reactionType === 'dislike') dislikeCount.value--;
        userReaction.value = null;
        newReaction = null;
      } else {
        if (previousReaction === 'like') likeCount.value--;
        if (previousReaction === 'dislike') dislikeCount.value--;

        if (reactionType === 'like') likeCount.value++;
        if (reactionType === 'dislike') dislikeCount.value++;
        userReaction.value = reactionType;
      }

      try {
        const updatedPostData = await likeDislikePost(props.postId, newReaction);

        if (updatedPostData) {
          if (typeof updatedPostData.likes === 'number') {
            likeCount.value = updatedPostData.likes;
          }
          if (typeof updatedPostData.dislikes === 'number') {
            dislikeCount.value = updatedPostData.dislikes;
          }
          if (typeof updatedPostData.userReaction !== 'undefined') {
            userReaction.value = updatedPostData.userReaction;
          }
        }
      } catch (error) {
        console.error("Reaction failed:", error);
        if (previousReaction === reactionType) {
          if (reactionType === 'like') likeCount.value++;
          if (reactionType === 'dislike') dislikeCount.value++;
          userReaction.value = previousReaction;
        } else {
          if (reactionType === 'like') likeCount.value--;
          if (reactionType === 'dislike') dislikeCount.value--;

          if (previousReaction === 'like') likeCount.value++;
          if (previousReaction === 'dislike') dislikeCount.value++;
          userReaction.value = previousReaction;
        }
      } finally {
        loading.value = false;
      }
    };

    return {
      likeCount,
      dislikeCount,
      userReaction,
      loading: computed(() => loading.value || postsLoading.value),
      react
    };
  }
}
</script>

<style scoped>
.reaction-buttons {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.reaction-btn {
  background: none;
  border: 1px solid #d1d5db;
  color: #6b7280;
  cursor: pointer;
  padding: 0.3rem 0.7rem;
  border-radius: 16px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 0.4rem;
  transition: color 0.2s, background-color 0.2s, border-color 0.2s;
  font-size: 0.85rem;
}

.reaction-btn:hover:not(:disabled) {
  background-color: #f3f4f6;
}

.reaction-btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

.reaction-btn i {
  font-size: 0.9rem;
  line-height: 1;
}

.like-btn.active {
  color: #3b82f6;
  border-color: #bfdbfe;
  background-color: #eff6ff;
}
.like-btn:hover:not(.active):not(:disabled) {
  border-color: #93c5fd;
}

.dislike-btn.active {
  color: #ef4444;
  border-color: #fecaca;
  background-color: #fef2f2;
}
.dislike-btn:hover:not(.active):not(:disabled) {
  border-color: #fca5a5;
}
</style>