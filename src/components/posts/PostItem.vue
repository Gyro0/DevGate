<template>
  <div class="post-card">
    <div class="post-header">
      <img :src="post.authorPhotoURL || '/default-avatar.png'" alt="Author" class="post-avatar">
      <div>
        <span class="post-author">{{ post.authorName }}</span>
        <span class="post-timestamp">{{ formatTimestamp(post.createdAt) }}</span>
      </div>
      <!-- Add Edit/Delete Dropdown later -->
    </div>

    <router-link :to="postLink" class="post-link-wrapper">
      <div class="post-content">
        <h4 v-if="post.title" class="post-title">{{ post.title }}</h4>
        <p class="post-description">{{ post.description }}</p>
        <img v-if="post.imageUrl" :src="post.imageUrl" alt="Post image" class="post-image"/>
        <!-- Display linked entity info -->
        <div v-if="post.linkedEntityType && post.linkedEntity" class="linked-entity">
          <i :class="getEntityTypeIcon(post.linkedEntityType)"></i>
          Linked {{ post.linkedEntityType }}:
          <!-- Link to the actual entity page -->
          <router-link :to="`/${post.linkedEntityType}s/${post.linkedEntityId}`" @click.stop>
            {{ post.linkedEntity.name || post.linkedEntity.title }}
          </router-link>
        </div>
      </div>
    </router-link>

    <div class="post-footer">
      <VoteButtons :post-id="post.id" />
      <button @click="goToPostDetail" class="comment-btn" title="View Comments">
        <i class="far fa-comment"></i>
        <span class="count">{{ post.commentsCount || 0 }}</span>
      </button>
      <!-- Add Share button later -->
    </div>
  </div>
</template>

<script>
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { formatDistanceToNow } from 'date-fns';
import VoteButtons from './VoteButtons.vue';

export default {
  name: 'PostItem',
  components: { VoteButtons },
  props: {
    post: {
      type: Object,
      required: true
    }
  },
  setup(props) {
    const router = useRouter();

    const postLink = computed(() => `/posts/${props.post.id}`);

    const formatTimestamp = (timestamp) => {
      if (!timestamp) return '';
      const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
      if (isNaN(date.getTime())) return '';
      return formatDistanceToNow(date, { addSuffix: true });
    };

    const getEntityTypeIcon = (type) => {
      switch (type) {
        case 'skill': return 'fas fa-chart-line';
        case 'project': return 'fas fa-code';
        case 'objective': return 'fas fa-bullseye';
        default: return 'fas fa-link';
      }
    };

    const goToPostDetail = () => {
      router.push(postLink.value);
    };

    return {
      postLink,
      formatTimestamp,
      getEntityTypeIcon,
      goToPostDetail
    };
  }
}
</script>

<style scoped>
.post-card {
  background: var(--surface-card);
  border-radius: 1rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.35), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 1.5rem 1.25rem;
  margin-bottom: 2rem;
  color: var(--text);
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s;
  position: relative;
  overflow: hidden;
}
.post-card:hover {
  box-shadow: 0 0 32px 2px var(--primary-glow), 0 0 0 2.5px var(--primary-glow);
  border-color: var(--primary-glow);
  background: var(--surface-2);
}
.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.1rem;
}
.post-avatar {
  width: 44px;
  height: 44px;
  border-radius: 50%;
  border: 2px solid var(--primary-glow);
  box-shadow: 0 0 8px var(--primary-glow);
  object-fit: cover;
  background: var(--background);
}
.post-author {
  font-weight: 700;
  color: var(--primary);
  display: inline-block;
  font-size: 1.05rem;
  letter-spacing: 0.5px;
  margin-right: 0.7rem;
}
.post-timestamp {
  font-size: 0.95rem;
  color: var(--highlight);
  margin-left: 0;
}
.post-link-wrapper {
  text-decoration: none;
  color: inherit;
}
.post-content {
  margin-bottom: 1rem;
}
.post-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: var(--secondary);
  margin-bottom: 0.4rem;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px var(--primary-glow);
}
.post-description {
  color: var(--text-secondary);
  margin-bottom: 0.8rem;
  font-size: 1.08rem;
}
.post-image {
  width: 100%;
  max-height: 350px;
  object-fit: cover;
  border-radius: 0.75rem;
  margin-bottom: 1rem;
  border: 1.5px solid var(--primary-glow);
  box-shadow: 0 0 8px var(--primary-glow);
}
.linked-entity {
  margin-top: 0.5rem;
  font-size: 0.97rem;
  color: var(--highlight);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}
.linked-entity i {
  color: var(--primary-glow);
  margin-right: 0.3rem;
}
.linked-entity a {
  color: var(--primary);
  text-decoration: underline;
  font-weight: 600;
}
.post-footer {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  margin-top: 0.5rem;
  border-top: 1px solid var(--border-color, #23272e);
  padding-top: 0.7rem;
}
.comment-btn {
  background: var(--surface-2);
  color: var(--primary);
  border: 1.5px solid var(--primary-glow);
  border-radius: 1.2rem;
  padding: 0.35rem 1.1rem;
  font-weight: 700;
  font-size: 1rem;
  cursor: pointer;
  box-shadow: 0 0 8px var(--primary-glow);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  transition: background 0.18s, color 0.18s, border-color 0.18s, box-shadow 0.18s;
}
.comment-btn:hover {
  background: var(--primary-glow);
  color: #fff;
  border-color: var(--primary-glow);
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
.comment-btn .count {
  font-weight: 700;
  font-size: 1.05rem;
  margin-left: 0.3rem;
}
@media (max-width: 600px) {
  .post-card {
    padding: 1rem 0.5rem;
  }
  .post-title {
    font-size: 1.05rem;
  }
}
</style>