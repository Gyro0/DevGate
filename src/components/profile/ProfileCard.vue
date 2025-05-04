<template>
  <div class="card shadow-sm border-0">
    <div class="card-body text-center">
      <div class="profile-avatar-container mx-auto mb-3">
        <img :src="userProfile.photoURL || '/default-avatar.png'" alt="Profile" class="profile-avatar" />
        <button v-if="editMode" class="btn btn-sm btn-primary change-photo-btn" @click="triggerPhotoUpload">
          <i class="fas fa-camera"></i>
        </button>
        <input type="file" ref="photoInput" @change="handlePhotoChange" accept="image/*" class="d-none" />
      </div>
      <h2 class="h5 fw-bold">{{ userProfile.displayName }}</h2>
      <p class="text-muted">{{ userProfile.title || 'Developer' }}</p>
      <p class="text-muted">{{ userProfile.bio || 'No bio added yet.' }}</p>
    </div>
  </div>
</template>

<script>
import { ref } from 'vue';

export default {
  name: 'ProfileCard',
  props: {
    userProfile: {
      type: Object,
      required: true,
    },
    editMode: {
      type: Boolean,
      default: false,
    },
  },
  emits: ['triggerPhotoUpload', 'handlePhotoChange'],
  setup(props, { emit }) {
    const photoInput = ref(null);

    const triggerPhotoUpload = () => {
      photoInput.value.click();
      emit('triggerPhotoUpload');
    };

    const handlePhotoChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        emit('handlePhotoChange', file);
      }
    };

    return {
      photoInput,
      triggerPhotoUpload,
      handlePhotoChange,
    };
  },
};
</script>

<style scoped>
.profile-avatar-container {
  position: relative;
  width: 100px;
  height: 100px;
}
.profile-avatar {
  width: 100%;
  height: 100%;
  border-radius: 50%;
  object-fit: cover;
}
.change-photo-btn {
  position: absolute;
  bottom: 0;
  right: 0;
}
</style>