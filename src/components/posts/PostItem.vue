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
  background-color: #ffffff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  border: 1px solid #e5e7eb;
  display: flex;
  flex-direction: column;
  overflow: hidden; /* Prevent content overflow */
}
.post-header {
  display: flex;
  align-items: center;
  padding: 1rem 1.5rem 0.5rem; /* Adjust padding */
}
.post-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  margin-right: 0.75rem;
  object-fit: cover;
  border: 1px solid #eee;
}
.post-author {
  font-weight: 600;
  color: #111827;
  display: block;
  font-size: 0.9rem;
}
.post-timestamp {
  font-size: 0.75rem;
  color: #6b7280;
}

.post-link-wrapper {
  text-decoration: none; /* Remove underline from link */
  color: inherit; /* Inherit text color */
  display: block; /* Make link take up space */
  padding: 0.5rem 1.5rem 1rem; /* Adjust padding */
  flex-grow: 1; /* Allow content to grow */
}

.post-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: #1f2937;
  margin-top: 0;
}
.post-description {
  margin-top: 0;
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #374151;
  white-space: pre-wrap; /* Keep line breaks */
  font-size: 0.9rem;
  word-break: break-word; /* Prevent long words from overflowing */
}
.post-image {
  max-width: 100%;
  border-radius: 6px;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 1px solid #e5e7eb;
  display: block; /* Ensure image behaves like a block */
}
.linked-entity {
  font-size: 0.8rem;
  color: #4b5563;
  background-color: #f3f4f6;
  padding: 0.3rem 0.6rem;
  border-radius: 4px;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
}
.linked-entity a {
  color: #4f46e5;
  text-decoration: none;
  font-weight: 500;
}
.linked-entity a:hover {
  text-decoration: underline;
}
.linked-entity i {
  color: #9ca3af;
}

.post-footer {
  display: flex;
  align-items: center;
  gap: 1rem; /* Adjust gap between vote block and comment button */
  padding: 0.75rem 1.5rem;
  border-top: 1px solid #f3f4f6;
  background-color: #f9fafb; /* Subtle background for footer */
}

/* Comment button styling */
.comment-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem; /* Slightly increased gap */
  background: none;
  border: none;
  color: #6b7280;
  font-size: 0.85rem; /* Slightly larger */
  cursor: pointer;
  padding: 0.35rem 0.6rem; /* Adjust padding */
  border-radius: 6px; /* Rounded corners */
  transition: background-color 0.2s, color 0.2s;
}
.comment-btn:hover {
  background-color: #e5e7eb; /* Slightly darker hover */
  color: #1f2937;
}
.comment-btn .count {
  font-weight: 600; /* Bolder count */
}
.comment-btn i {
  font-size: 0.9rem;
  line-height: 1; /* Align icon better */
}
</style>