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
  background-color: rgba(22, 27, 34, 0.85);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1050;
}

.modal-content {
  background: var(--surface);
  border-radius: 1rem;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 4px 32px 0 rgba(30, 203, 225, 0.08), 0 0 0 2px var(--highlight);
  border: 1.5px solid var(--highlight);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1rem 1.5rem;
  border-bottom: 1px solid var(--border);
}

.modal-header h3 {
  margin: 0;
  font-size: 1.1rem;
  color: var(--primary);
  font-weight: 700;
  letter-spacing: 1px;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.25rem;
  color: var(--highlight);
  cursor: pointer;
  transition: color 0.2s;
}
.modal-close:hover {
  color: var(--secondary);
}

.modal-body {
  padding: 1.5rem;
}

.confirm-message {
  margin: 0;
  font-size: 1rem;
  color: var(--text);
  line-height: 1.6;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
  padding: 1rem 1.5rem;
  border-top: 1px solid var(--border);
  background: var(--background);
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
}

.btn-secondary, .btn-danger {
  padding: 0.6rem 1.2rem;
  border-radius: 8px;
  font-size: 0.95rem;
  font-weight: 600;
  cursor: pointer;
  border: 1.5px solid var(--highlight);
  background: var(--surface);
  color: var(--text);
  transition: background 0.2s, color 0.2s, border-color 0.2s, box-shadow 0.2s;
  box-shadow: 0 0 8px var(--highlight);
}
.btn-secondary:hover {
  background: var(--highlight);
  color: var(--background);
  border-color: var(--primary);
}
.btn-danger {
  background: linear-gradient(90deg, var(--secondary) 60%, var(--primary) 100%);
  color: var(--background);
  border: none;
  box-shadow: 0 0 8px var(--secondary);
}
.btn-danger:hover {
  background: var(--primary);
  color: var(--background);
  box-shadow: 0 0 12px var(--primary);
}
</style>