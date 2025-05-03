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
/* Basic layout styles */
.main-layout { display: flex; min-height: calc(100vh - 64px); }
.content-area { flex: 1; padding: 1.5rem; overflow-y: auto; max-width: 800px; margin: 0 auto; } /* Center content */

.post-container {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border: 1px solid #e5e7eb;
  overflow: hidden; /* Contain elements */
}

/* Use styles from PostItem, potentially adjust padding/margins */
.post-card.detailed {
   box-shadow: none; border: none; border-radius: 0;
   padding-bottom: 0; /* Remove bottom padding as footer/comments follow */
}
.post-header { padding: 1.5rem 1.5rem 0.5rem; }
.post-content { padding: 0.5rem 1.5rem 1rem; }
.post-footer { padding: 0.75rem 1.5rem; border-top: 1px solid #f3f4f6; }
.post-title { font-size: 1.5rem; margin-bottom: 1rem; } /* Larger title */
.post-description { font-size: 1rem; line-height: 1.7; } /* Slightly larger text */

/* Inherited styles from PostItem.vue */
.post-avatar { width: 40px; height: 40px; border-radius: 50%; margin-right: 0.75rem; object-fit: cover; border: 1px solid #eee; }
.post-author { font-weight: 600; color: #111827; display: block; font-size: 0.9rem; }
.post-timestamp { font-size: 0.75rem; color: #6b7280; }
.post-image { max-width: 100%; border-radius: 6px; margin-top: 1rem; margin-bottom: 1rem; border: 1px solid #e5e7eb; }
.linked-entity { font-size: 0.8rem; color: #4b5563; background-color: #f3f4f6; padding: 0.3rem 0.6rem; border-radius: 4px; display: inline-flex; align-items: center; gap: 0.4rem; margin-top: 0.5rem; }
.linked-entity a { color: #4f46e5; text-decoration: none; font-weight: 500; }
.linked-entity a:hover { text-decoration: underline; }
.linked-entity i { color: #9ca3af; }

/* Loading/Error States */
.loading-state, .error-state { text-align: center; padding: 3rem 1rem; color: #6b7280; }
.loading-state .spinner { width: 24px; height: 24px; border: 3px solid rgba(79, 70, 229, 0.2); border-radius: 50%; border-top-color: #4f46e5; animation: spin 1s linear infinite; display: inline-block; margin-bottom: 0.5rem; }
.error-state i { font-size: 2rem; color: #d1d5db; margin-bottom: 0.5rem; }
.error-state a { color: #4f46e5; text-decoration: underline; }
@keyframes spin { to { transform: rotate(360deg); } }
</style>