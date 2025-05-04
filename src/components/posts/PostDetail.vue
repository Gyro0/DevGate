<style scoped>
.post-detail-container {
  background: var(--surface);
  border-radius: 1rem;
  box-shadow: 0 4px 32px 0 rgba(30, 203, 225, 0.08), 0 0 0 2px var(--highlight);
  border: 1.5px solid var(--highlight);
  padding: 2rem 1.5rem;
  margin: 2rem auto;
  max-width: 700px;
  color: var(--text);
}
.post-detail-header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
.post-detail-avatar {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: 2px solid var(--highlight);
  box-shadow: 0 0 8px var(--highlight);
  object-fit: cover;
  background: var(--background);
}
.post-detail-author {
  font-weight: 700;
  color: var(--primary);
  letter-spacing: 0.5px;
}
.post-detail-date {
  color: var(--highlight);
  font-size: 1rem;
  margin-left: auto;
}
.post-detail-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--secondary);
  margin-bottom: 0.75rem;
  letter-spacing: 0.5px;
}
.post-detail-description {
  color: var(--text);
  margin-bottom: 1.5rem;
  font-size: 1.1rem;
}
.post-detail-image {
  width: 100%;
  max-height: 400px;
  object-fit: cover;
  border-radius: 0.75rem;
  margin-bottom: 1.5rem;
  border: 1.5px solid var(--highlight);
  box-shadow: 0 0 8px var(--highlight);
}
</style>
