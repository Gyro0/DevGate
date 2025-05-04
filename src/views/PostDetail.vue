<template>
  <div class="post-detail-view">
    <AppHeader />
    <div class="main-layout">
      <AppSidebar /> <!-- Or hide sidebar if preferred -->
      <div class="content-area">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div> Loading post...
        </div>
        <div v-else-if="error" class="error-state">
          <i class="fas fa-exclamation-circle"></i>
          <p>{{ error }}</p>
          <router-link to="/dashboard">Back to Feed</router-link>
        </div>
        <div v-else-if="post" class="post-container">
          <!-- Re-use PostItem structure or create detailed view -->
          <div class="post-card detailed">
             <div class="post-header">
               <img :src="post.authorPhotoURL || '/default-avatar.png'" alt="Author" class="post-avatar">
               <div>
                 <span class="post-author">{{ post.authorName }}</span>
                 <span class="post-timestamp">{{ formatTimestamp(post.createdAt) }}</span>
               </div>
             </div>
             <div class="post-content">
               <h3 v-if="post.title" class="post-title">{{ post.title }}</h3>
               <p class="post-description">{{ post.description }}</p>
               <img v-if="post.imageUrl" :src="post.imageUrl" alt="Post image" class="post-image"/>
               <div v-if="post.linkedEntityType && post.linkedEntity" class="linked-entity">
                 <i :class="getEntityTypeIcon(post.linkedEntityType)"></i>
                 Linked {{ post.linkedEntityType }}:
                 <router-link :to="`/${post.linkedEntityType}s/${post.linkedEntityId}`">
                   {{ post.linkedEntity.name || post.linkedEntity.title }}
                 </router-link>
               </div>
             </div>
             <div class="post-footer">
               <VoteButtons :post-id="postId" />
               <!-- Comment count is implicitly shown by the section -->
             </div>
          </div>

          <!-- Comment Section -->
          <CommentSection :post-id="postId" />

        </div>
         <div v-else class="error-state">
           <p>Post not found.</p>
           <router-link to="/dashboard">Back to Feed</router-link>
         </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, onMounted, watch } from 'vue';
import { useRoute } from 'vue-router';
import { db } from '@/firebase/firebaseInit';
import { formatDistanceToNow } from 'date-fns';
import AppHeader from '@/components/common/AppHeader.vue';
import AppSidebar from '@/components/common/AppSidebar.vue';
import VoteButtons from '@/components/posts/VoteButtons.vue';
import CommentSection from '@/components/posts/CommentSection.vue';

export default {
  name: 'PostDetailView',
  components: { AppHeader, AppSidebar, VoteButtons, CommentSection },
  setup() {
    const route = useRoute();
    const postId = ref(route.params.id);
    const post = ref(null);
    const loading = ref(false);
    const error = ref(null);
    let postListener = null;

    const fetchPost = () => {
      if (!postId.value) return;
      loading.value = true;
      error.value = null;

      // Detach previous listener
      if (postListener) postListener();

      const postRef = db.collection('posts').doc(postId.value);

      postListener = postRef.onSnapshot(async (doc) => {
        if (doc.exists) {
          const postData = { id: doc.id, ...doc.data() };
          let linkedEntityData = null;

          // Fetch linked entity details
          if (postData.linkedEntityType && postData.linkedEntityId) {
            try {
              const entityCollection = `${postData.linkedEntityType}s`;
              const entityDoc = await db.collection(entityCollection).doc(postData.linkedEntityId).get();
              if (entityDoc.exists) {
                linkedEntityData = {
                  name: entityDoc.data().name,
                  title: entityDoc.data().title
                };
              }
            } catch (entityErr) {
              console.error(`Error fetching linked entity ${postData.linkedEntityId}:`, entityErr);
            }
          }
          post.value = { ...postData, linkedEntity: linkedEntityData };
          error.value = null;
        } else {
          post.value = null;
          error.value = 'Post not found.';
        }
        loading.value = false;
      }, err => {
        console.error("Error fetching post:", err);
        error.value = 'Failed to load post details.';
        loading.value = false;
      });
    };

    const formatTimestamp = (timestamp) => {
       if (!timestamp) return '';
       const date = timestamp?.toDate ? timestamp.toDate() : new Date(timestamp);
       if (isNaN(date.getTime())) return '';
       return formatDistanceToNow(date, { addSuffix: true });
    };

     const getEntityTypeIcon = (type) => {
       // Same as in PostItem
       switch (type) {
         case 'skill': return 'fas fa-chart-line';
         case 'project': return 'fas fa-code';
         case 'objective': return 'fas fa-bullseye';
         default: return 'fas fa-link';
       }
     };

    // Watch for route changes if navigating between post details
    watch(() => route.params.id, (newId) => {
      if (newId) {
        postId.value = newId;
        fetchPost();
      }
    });

    onMounted(fetchPost);

    // Cleanup listener on unmount
    // onUnmounted(() => { if (postListener) postListener(); }); // Import onUnmounted

    return {
      postId,
      post,
      loading,
      error,
      formatTimestamp,
      getEntityTypeIcon
    };
  }
}
</script>

<style scoped>
.main-layout {
  display: flex;
  min-height: calc(100vh - 64px);
}
.content-area {
  flex: 1;
  padding: 1.5rem;
  overflow-y: auto;
  max-width: 800px;
  margin: 0 auto;
}

.post-container {
  background: none;
  border-radius: 0;
  box-shadow: none;
  border: none;
  overflow: visible;
}

.post-card.detailed {
  background: var(--surface-card);
  border-radius: 1.1rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.35), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding-bottom: 0;
  margin-bottom: 2rem;
  color: var(--text);
  position: relative;
  overflow: hidden;
}
.post-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.5rem 1.5rem 0.5rem;
}
.post-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--primary-glow);
  box-shadow: 0 0 8px var(--primary-glow);
  object-fit: cover;
  background: var(--background);
}
.post-author {
  font-weight: 700;
  color: var(--primary);
  display: block;
  font-size: 1.08rem;
  letter-spacing: 0.5px;
}
.post-timestamp {
  font-size: 0.95rem;
  color: var(--highlight);
  margin-left: 0.5rem;
}
.post-content {
  padding: 0.5rem 1.5rem 1rem;
}
.post-title {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--secondary);
  margin-bottom: 0.7rem;
  letter-spacing: 0.5px;
  text-shadow: 0 0 8px var(--primary-glow);
}
.post-description {
  font-size: 1.13rem;
  line-height: 1.7;
  color: var(--text-secondary);
  margin-bottom: 1.1rem;
}
.post-image {
  max-width: 100%;
  border-radius: 0.75rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  border: 1.5px solid var(--primary-glow);
  box-shadow: 0 0 8px var(--primary-glow);
}
.linked-entity {
  font-size: 0.97rem;
  color: var(--highlight);
  background: var(--surface-2);
  padding: 0.3rem 0.7rem;
  border-radius: 0.5rem;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  margin-top: 0.5rem;
  box-shadow: 0 0 0 1.5px var(--primary-glow), 0 0 8px 0 var(--circuit-accent-fade, #2e8b57cc);
}
.linked-entity a {
  color: var(--primary);
  text-decoration: underline;
  font-weight: 600;
}
.linked-entity i {
  color: var(--primary-glow);
}
.post-footer {
  padding: 0.75rem 1.5rem;
  border-top: 1px solid var(--border-color, #23272e);
  background: var(--surface-2);
  display: flex;
  align-items: center;
  gap: 1.2rem;
}

/* Loading/Error States */
.loading-state, .error-state {
  text-align: center;
  padding: 3rem 1rem;
  color: var(--text-tertiary, #7a869a);
}
.loading-state .spinner {
  width: 24px;
  height: 24px;
  border: 3px solid rgba(60, 65, 80, 0.18);
  border-radius: 50%;
  border-top-color: var(--primary-glow);
  animation: spin 1s linear infinite;
  display: inline-block;
  margin-bottom: 0.5rem;
}
.error-state i {
  font-size: 2rem;
  color: var(--primary-glow);
  margin-bottom: 0.5rem;
}
.error-state a {
  color: var(--primary);
  text-decoration: underline;
}
@keyframes spin { to { transform: rotate(360deg); } }

@media (max-width: 600px) {
  .post-card.detailed {
    padding: 0.5rem 0.2rem;
  }
  .post-title {
    font-size: 1.1rem;
  }
  .post-content {
    padding: 0.5rem 0.5rem 1rem;
  }
  .post-header, .post-footer {
    padding-left: 0.5rem;
    padding-right: 0.5rem;
  }
}
</style>