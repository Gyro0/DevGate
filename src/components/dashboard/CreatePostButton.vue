<template>
  <button class="create-post-btn" @click="$emit('open-modal')">
    <i class="fas fa-plus"></i> Create Post
  </button>
</template>

<script>
export default {
  name: 'CreatePostButton',
  emits: ['open-modal']
}
</script>

<style scoped>
.create-post-btn {
  display: block; /* Make it block to take width */
  width: 100%;   /* Full width */
  background-color: #ffffff;
  color: #4b5563;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
  padding: 1rem;
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  text-align: left; /* Align text left */
  margin-bottom: 1.5rem;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.05);
  transition: background-color 0.2s, box-shadow 0.2s;
}

.create-post-btn:hover {
  background-color: #f9fafb;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.07);
}

.create-post-btn i {
  margin-right: 0.75rem;
  color: #9ca3af;
}
</style>