<template>
  <div class="profile-card">
    <div class="profile-banner">
      <div class="profile-avatar-container">
        <!-- Use root-relative path for the default avatar -->
        <img :src="userProfile.photoURL || '/default-avatar.png'" alt="Profile" class="profile-avatar" />
        <!-- Removed editMode check, button is always present but functionality depends on parent -->
        <button class="change-photo-btn" @click="triggerPhotoUpload">
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
      <h2 class="profile-name">{{ userProfile.displayName || 'No Name Set' }}</h2>
      <p class="profile-title">{{ userProfile.title || 'No Title Set' }}</p>
      <div class="profile-bio">
        {{ userProfile.bio || 'No bio added yet.' }}
      </div>

      <div class="profile-meta">
        <div class="meta-item">
          <i class="fas fa-envelope"></i>
          <span>{{ userProfile.email || 'No Email' }}</span>
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
    // editMode prop is no longer used for the button visibility
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
  background: #ffffff; /* White background */
  border-radius: 12px; /* Slightly more rounded corners */
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08); /* Softer shadow */
  border: 1px solid #e5e7eb; /* Light border */
  overflow: hidden; /* Ensure content stays within rounded corners */
  display: flex;
  flex-direction: column;
}

.profile-banner {
  /* Optional: Add a subtle background or keep it clean */
  /* background: linear-gradient(to right, #6366f1, #8b5cf6); */
  /* height: 80px; */
  padding: 1.5rem 1.5rem 0 1.5rem; /* Padding for content below */
  position: relative;
  margin-bottom: 50px; /* Space for the avatar overlap */
}

.profile-avatar-container {
  position: absolute;
  bottom: -50px; /* Overlap banner */
  left: 1.5rem; /* Align with padding */
  width: 100px;
  height: 100px;
  border-radius: 50%;
  border: 4px solid white; /* White border around avatar */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.15); /* Shadow for avatar */
  background-color: #e5e7eb; /* Placeholder bg */
}

.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
  display: block; /* Remove potential extra space */
}

.change-photo-btn {
  position: absolute;
  bottom: 2px; /* Adjust position relative to avatar border */
  right: 2px;
  background: #4f46e5;
  color: white;
  width: 30px; /* Slightly smaller */
  height: 30px;
  border: 2px solid white; /* Match avatar border */
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 1px 3px rgba(0,0,0,0.3);
  transition: background-color 0.2s, transform 0.2s;
}

.change-photo-btn:hover {
  background-color: #4338CA;
  transform: scale(1.1);
}

.change-photo-btn i {
  font-size: 0.8rem; /* Adjust icon size */
}

.hidden-input {
  display: none;
}

.profile-info {
  padding: 1.5rem;
  padding-top: 1rem; /* Less top padding as avatar takes space */
}

.profile-name {
  font-size: 1.6rem; /* Slightly larger name */
  font-weight: 700; /* Bolder */
  color: #111827;
  margin: 0 0 0.25rem 0;
}

.profile-title {
  color: #6b7280;
  font-size: 0.9rem; /* Slightly larger title */
  margin-bottom: 1rem; /* More space below title */
  font-weight: 500;
}

.profile-bio {
  margin: 1rem 0 1.5rem 0; /* More vertical margin */
  color: #374151;
  font-size: 0.9rem;
  line-height: 1.6; /* Improved readability */
}

.profile-meta {
  margin-top: 1.5rem; /* More space above meta */
  font-size: 0.875rem;
  border-top: 1px solid #f3f4f6; /* Separator line */
  padding-top: 1.5rem; /* Space above first meta item */
}

.meta-item {
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem; /* More space between items */
  color: #4b5563;
}

.meta-item i {
  margin-right: 0.85rem; /* Slightly more space */
  color: #9ca3af;
  width: 18px; /* Ensure consistent icon width */
  text-align: center;
  flex-shrink: 0; /* Prevent icon shrinking */
}

.meta-item span,
.meta-item a {
  word-break: break-word; /* Prevent long text overflow */
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