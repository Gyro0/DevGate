<template>
  <div class="modal-backdrop" @click.self="$emit('cancel')">
    <div class="modal-content confirm-dialog">
      <div class="modal-header">
        <h3>Confirmation</h3>
        <button @click="$emit('cancel')" class="modal-close">
          <i class="fas fa-times"></i>
        </button>
      </div>
      
      <div class="modal-body">
        <p class="confirm-message">{{ message }}</p>
      </div>
      
      <div class="modal-footer">
        <button @click="$emit('cancel')" class="btn-secondary">
          Cancel
        </button>
        <button @click="$emit('confirm')" class="btn-danger">
          Confirm
        </button>
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
      required: true
    }
  },
  emits: ['confirm', 'cancel'],
  setup() {
    // No additional reactive state or methods needed
    return {};
  }
}
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050; /* Ensure it's above other modals if needed */
}

.modal-content {
  background-color: white;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.2);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid #e5e7eb;
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: #111827;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: #6b7280;
  cursor: pointer;
}

.modal-body {
  padding: 1.5rem;
}

.confirm-message {
  margin: 0;
  font-size: 1rem;
  color: #374151;
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid #e5e7eb;
  background-color: #f9fafb;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 8px;
}

.btn-secondary, .btn-danger {
  padding: 0.6rem 1.2rem;
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  cursor: pointer;
}

.btn-secondary {
  background-color: white;
  color: #4b5563;
  border: 1px solid #d1d5db;
}

.btn-secondary:hover {
  background-color: #f9fafb;
}

.btn-danger {
  background-color: #ef4444;
  color: white;
  border: none;
}

.btn-danger:hover {
  background-color: #dc2626;
}
</style>