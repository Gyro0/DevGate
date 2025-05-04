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
  display: block;
  width: 100%;
  background: var(--surface);
  color: var(--primary);
  border: 1.5px solid var(--highlight);
  border-radius: 1rem;
  padding: 1.25rem 1.5rem;
  font-size: 1.1rem;
  font-weight: 700;
  cursor: pointer;
  text-align: left;
  margin-bottom: 2.5rem;
  box-shadow: 0 2px 16px 0 rgba(30, 203, 225, 0.10);
  transition: box-shadow 0.2s, border-color 0.2s, background 0.2s, color 0.2s;
}

.create-post-btn:hover {
  box-shadow: 0 0 24px var(--primary);
  border-color: var(--primary);
  background: var(--background);
  color: var(--secondary);
}

.create-post-btn i {
  margin-right: 0.75rem;
  color: var(--highlight);
}
</style>