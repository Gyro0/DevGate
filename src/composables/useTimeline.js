// src/composables/useTimeline.js
import { ref, computed } from 'vue';
import firebase, { db } from '@/firebase/firebaseInit'; // Import firebase namespace
import useAuth from './useAuth';

/**
 * Timeline management composable for activity tracking
 * @returns {Object} Timeline state and methods
 */
export default function useTimeline() {
  const { user } = useAuth();
  const events = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // Event types for filtering
  const eventTypes = [
    { id: 'skill', label: 'Skill' },
    { id: 'project', label: 'Project' },
    { id: 'objective', label: 'Objective' }
  ]
  
  // Event actions
  const eventActions = [
    { id: 'added', label: 'Added' },
    { id: 'updated', label: 'Updated' },
    { id: 'completed', label: 'Completed' },
    { id: 'deleted', label: 'Deleted' }
  ]
  
  // Fetch timeline events for user
  const fetchUserTimeline = async (limit = 50) => {
    if (!user.value) return;
    loading.value = true;
    error.value = null;
    try {
      const timelineQuery = db.collection('timeline') // v8 collection
                              .where('userId', '==', user.value.uid) // v8 where
                              .orderBy('timestamp', 'desc'); // v8 orderBy
      const snapshot = await timelineQuery.limit(limit).get(); // v8 get with limit
      events.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (e) {
      error.value = e.message
      console.error('Error fetching timeline:', e)
    } finally {
      loading.value = false
    }
  }
  
  // Record a timeline event
  const recordEvent = async (type, action, entityId, entityData) => {
    if (!user.value) return;
    try {
      const newEvent = {
        userId: user.value.uid,
        type,
        action,
        entityId,
        entityData, // Ensure this doesn't contain undefined values for v8
        timestamp: firebase.firestore.FieldValue.serverTimestamp() // v8 serverTimestamp
      };
      const docRef = await db.collection('timeline').add(newEvent); // v8 add
      const createdEvent = { id: docRef.id, ...newEvent }
      events.value.unshift(createdEvent) // Add to start of array
      
      return createdEvent
    } catch (e) {
      console.error('Error recording timeline event:', e)
      throw e
    }
  }
  
  // Group events by month for timeline display
  const eventsByMonth = computed(() => {
    const months = {}
    
    events.value.forEach(event => {
      const date = new Date(event.timestamp.seconds * 1000)
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' })
      
      if (!months[monthKey]) {
        months[monthKey] = {
          id: monthKey,
          name: monthName,
          events: []
        }
      }
      
      months[monthKey].events.push(event)
    })
    
    // Convert to array sorted by date (newest first)
    return Object.values(months).sort((a, b) => b.id.localeCompare(a.id))
  })
  
  return {
    events,
    loading,
    error,
    eventTypes,
    eventActions,
    eventsByMonth,
    fetchUserTimeline,
    recordEvent
  }
}