<template>
  <div class="profile-card">
    <div class="profile-banner">
      <div class="profile-avatar-container">
        <!-- Use root-relative path for the default avatar -->
        <img :src="userProfile.photoURL || '/default-avatar.png'" alt="Profile" class="profile-avatar" />
        <button v-if="editMode" class="change-photo-btn" @click="triggerPhotoUpload">
          <i class="fas fa-camera"></i>
        </button>
        <input
          type="file"
          ref="photoInput"
          @change="handlePhotoChange"
          accept="image/*"
          class="hidden-input"
        />
      </div>
    </div>
    
    <div class="profile-info">
      <h2 class="profile-name">{{ userProfile.displayName }}</h2>
      <p class="profile-title">{{ userProfile.title || 'Developer' }}</p>
      <div class="profile-bio">
        {{ userProfile.bio || 'No bio added yet.' }}
      </div>
      
      <div class="profile-meta">
        <div class="meta-item">
          <i class="fas fa-envelope"></i>
          <span>{{ userProfile.email }}</span>
        </div>
        <div v-if="userProfile.location" class="meta-item">
          <i class="fas fa-map-marker-alt"></i>
          <span>{{ userProfile.location }}</span>
        </div>
        <div v-if="userProfile.website" class="meta-item">
          <i class="fas fa-globe"></i>
          <a :href="userProfile.website" target="_blank" rel="noopener noreferrer">{{ formatWebsiteUrl(userProfile.website) }}</a>
        </div>
        <div v-if="userProfile.github" class="meta-item">
          <i class="fab fa-github"></i>
          <a :href="'https://github.com/' + userProfile.github" target="_blank" rel="noopener noreferrer">{{ userProfile.github }}</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';
import useProfile  from '@/composables/useProfile';

export default {
  name: 'ProfileCard',
  props: {
    userProfile: {
      type: Object,
      required: true,
      default: () => ({}) 
    },
    editMode: {
      type: Boolean,
      default: false
    }
  },
  emits: ['triggerPhotoUpload', 'handlePhotoChange'],
  setup(props, { emit }) { // Pass props and context { emit }
    const { formatWebsiteUrl } = useProfile(); // userProfile comes from props now
    const photoInput = ref(null);

    const triggerPhotoUpload = () => {
      photoInput.value.click();
      emit('triggerPhotoUpload'); // Emit event if parent needs to know
    };

    const handlePhotoChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        console.log("Selected file:", file);
        emit('handlePhotoChange', file); // Emit event with file
      }
    };

    // Return reactive state and methods
    return {
      photoInput,
      triggerPhotoUpload,
      handlePhotoChange,
      formatWebsiteUrl // Expose if used in template
    };
  }
}
</script>

<style scoped>
/* ... existing styles ... */
.profile-card {
  background: white;
  border-radius: 10px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  padding: 1.5rem;
}

.profile-banner {
  position: relative;
}

.profile-avatar-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 100px;
  height: 100px;
  margin-bottom: 1rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid white;
  box-shadow: 0 1px 3px rgba(0,0,0,0.2);
}

.change-photo-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: #4f46e5;
  color: white;
  width: 32px;
  height: 32px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  transition: background-color 0.2s;
}

.change-photo-btn:hover {
  background-color: #4338CA;
}

.change-photo-btn i {
  font-size: 0.9rem;
}

.hidden-input {
  display: none;
}

.profile-info {
  /* Styles for profile info section */
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 600;
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.profile-title {
  color: #6b7280;
  font-size: 0.875rem;
  margin-bottom: 0.75rem;
}

.profile-bio {
  margin: 0.75rem 0;
  color: #374151;
  font-size: 0.875rem;
  line-height: 1.5;
}

.profile-meta {
  margin-top: 1rem;
  font-size: 0.875rem;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: #4b5563;
}

.meta-item i {
  margin-right: 0.75rem;
  color: #9ca3af;
  width: 16px;
  text-align: center;
}

.meta-item a {
  color: #4f46e5;
  text-decoration: none;
  transition: color 0.2s;
}

.meta-item a:hover {
  color: #4338CA;
  text-decoration: underline;
}
</style>