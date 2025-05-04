<template>
  <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="confirmDialogLabel" aria-hidden="true">
    <div class="modal-dialog modal-dialog-centered" role="document">
      <div class="modal-content">
        <!-- Header -->
        <div class="modal-header">
          <h5 class="modal-title" id="confirmDialogLabel">Confirmation</h5>
          <button type="button" class="btn-close" aria-label="Close" @click="$emit('cancel')"></button>
        </div>

        <!-- Body -->
        <div class="modal-body">
          <p class="mb-0">{{ message }}</p>
        </div>

        <!-- Footer -->
        <div class="modal-footer">
          <button type="button" class="btn btn-secondary" @click="$emit('cancel')">Cancel</button>
          <button type="button" class="btn btn-danger" @click="$emit('confirm')">Confirm</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ConfirmDialog',
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  emits: ['confirm', 'cancel'],
};
</script>

<style scoped>
/* No additional custom styles needed as Bootstrap is used */
</style>