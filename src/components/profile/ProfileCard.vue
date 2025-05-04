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
.profile-card {
  background: var(--surface-card);
  border-radius: 1.2rem;
  box-shadow: 0 2px 16px 0 rgba(0,0,0,0.35), 0 0 0 2px var(--primary-glow), 0 0 8px 2px var(--circuit-accent);
  border: 1.5px solid var(--border-color, #23272e);
  padding: 2rem 1.5rem;
  color: var(--text);
  max-width: 480px;
  margin: 2rem auto;
}

.profile-banner {
  position: relative;
}

.profile-avatar-container {
  display: flex;
  align-items: center;
  position: relative;
  width: 110px;
  height: 110px;
  margin-bottom: 1.2rem;
}

.profile-avatar {
  width: 110px;
  height: 110px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--primary-glow);
  box-shadow: 0 0 16px var(--primary-glow), 0 0 0 2px var(--circuit-accent);
  background: var(--background);
}

.change-photo-btn {
  position: absolute;
  bottom: 0;
  right: 0;
  background: var(--primary);
  color: #fff;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 8px var(--primary-glow);
  transition: background 0.18s, box-shadow 0.18s;
  font-size: 1.1rem;
}
.change-photo-btn:hover {
  background: var(--primary-glow);
  box-shadow: 0 0 16px 2px var(--primary-glow);
}
.change-photo-btn i {
  font-size: 1rem;
}

.hidden-input {
  display: none;
}

.profile-info {
  margin-top: 0.5rem;
}

.profile-name {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--primary);
  margin: 0 0 0.25rem 0;
  text-shadow: 0 0 8px var(--primary-glow);
}

.profile-title {
  color: var(--secondary);
  font-size: 1rem;
  margin-bottom: 0.75rem;
  font-weight: 600;
}

.profile-bio {
  margin: 0.75rem 0;
  color: var(--text-secondary);
  font-size: 0.98rem;
  line-height: 1.5;
}

.profile-meta {
  margin-top: 1.2rem;
  font-size: 0.95rem;
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.5rem;
  color: var(--text-tertiary, #7a869a);
}

.meta-item i {
  margin-right: 0.75rem;
  color: var(--primary-glow);
  width: 18px;
  text-align: center;
  font-size: 1.1rem;
}

.meta-item a {
  color: var(--primary);
  text-decoration: underline;
  font-weight: 600;
  transition: color 0.18s;
}
.meta-item a:hover {
  color: var(--primary-glow);
  text-decoration: underline;
}
</style>