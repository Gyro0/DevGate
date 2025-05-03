import { ref, computed } from 'vue';
import firebase, { db } from '@/firebase/firebaseInit';
import useAuth from './useAuth';

export default function useTimeline() {
  const { user, waitForAuth } = useAuth();
  const events = ref([]);
  const loading = ref(false);
  const error = ref(null);
  
  // Define event types with icons and colors for consistent display
  const eventTypes = [
    { id: 'skill', label: 'Skills', icon: 'fa-code' },
    { id: 'project', label: 'Projects', icon: 'fa-folder-open' },
    { id: 'objective', label: 'Objectives', icon: 'fa-bullseye' }
  ];

  // Fetch timeline events
  const fetchUserTimeline = async (limit = 50) => {
    loading.value = true;
    error.value = null;
    
    try {
      console.log("Timeline: Waiting for authentication...");
      const authUser = await waitForAuth();
      
      if (!authUser) {
        console.warn("Timeline: No user logged in after auth check");
        loading.value = false;
        return [];
      }
      
      console.log("Timeline: Fetching for user:", authUser.uid);
      const snapshot = await db.collection('timeline')
        .where('userId', '==', authUser.uid)
        .orderBy('timestamp', 'desc')
        .limit(limit)
        .get();
      
      events.value = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Handle timestamp conversion
          timestamp: data.timestamp?.toDate?.() || new Date(data.timestamp || Date.now())
        };
      });
      
      console.log("Timeline: Retrieved", events.value.length, "events");
      
      // If no events were found, trigger backfill (optionally)
      if (events.value.length === 0) {
        console.log('Timeline: No events found. Consider using backfillTimelineEvents()');
      }
      
      return events.value;
    } catch (err) {
      console.error("Timeline: Error fetching:", err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Record a new timeline event
  const recordEvent = async (type, action, entityId, entityData, timestamp = null) => {
    try {
      console.log(`Timeline: Recording ${type} ${action} event`);
      const currentUser = await waitForAuth();
      
      if (!currentUser) {
        console.warn("Timeline: Cannot record event - no user logged in");
        return null;
      }
      
      const newEvent = {
        userId: currentUser.uid,
        type,
        action,
        entityId,
        entityData,
        timestamp: timestamp || firebase.firestore.FieldValue.serverTimestamp()
      };
      
      const docRef = await db.collection('timeline').add(newEvent);
      console.log('Timeline: Event recorded with ID:', docRef.id);
      
      // Add to local events array for immediate display
      const createdEvent = { 
        id: docRef.id, 
        ...newEvent, 
        timestamp: timestamp || new Date() 
      };
      
      events.value.unshift(createdEvent);
      
      return createdEvent;
    } catch (err) {
      console.error('Timeline: Error recording event:', err);
      error.value = err.message;
      throw err;
    }
  };

  // Debug helper to create sample timeline data
  const generateSampleTimelineData = async () => {
    loading.value = true;
    
    try {
      console.log('Timeline: Generating sample data');
      const currentUser = await waitForAuth();
      
      if (!currentUser) {
        console.warn("Timeline: Cannot generate sample data - no user logged in");
        return;
      }
      
      const now = new Date();
      const types = ['skill', 'project', 'objective'];
      const actions = ['added', 'updated', 'completed'];
      const names = ['JavaScript', 'React', 'Vue.js', 'Portfolio', 'API Project', 'TypeScript', 'Mobile App'];
      
      // Generate 15 sample events spread over the last 90 days
      for (let i = 0; i < 15; i++) {
        const date = new Date(now);
        date.setDate(now.getDate() - Math.floor(Math.random() * 90)); // Random date in last 90 days
        
        const type = types[Math.floor(Math.random() * types.length)];
        const action = actions[Math.floor(Math.random() * actions.length)];
        const name = names[Math.floor(Math.random() * names.length)];
        
        await recordEvent(
          type, 
          action, 
          `sample-${i}`, 
          { name, title: name, description: `Sample ${type} for testing` },
          date
        );
      }
      
      console.log('Timeline: Sample data generated');
      return events.value;
    } catch (err) {
      console.error('Timeline: Error generating sample data:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Backfill timeline events for existing entities (helpful if you already have data)
  const backfillTimelineEvents = async () => {
    loading.value = true;
    
    try {
      console.log('Timeline: Backfilling events for existing data');
      const currentUser = await waitForAuth();
      
      if (!currentUser) {
        console.warn("Timeline: Cannot backfill events - no user logged in");
        return 0;
      }
      
      let eventsCreated = 0;
      
      // Fetch existing projects
      const projectsSnapshot = await db.collection('projects')
        .where('userId', '==', currentUser.uid)
        .get();
        
      // Record events for each project
      for (const doc of projectsSnapshot.docs) {
        const project = { id: doc.id, ...doc.data() };
        
        // Check if an event for this project already exists
        const existingCheck = await db.collection('timeline')
          .where('userId', '==', currentUser.uid)
          .where('entityId', '==', project.id)
          .where('type', '==', 'project')
          .limit(1)
          .get();
          
        if (existingCheck.empty) {
          await recordEvent(
            'project',
            'added',
            project.id,
            { title: project.title },
            project.createdAt?.toDate ? project.createdAt.toDate() : project.createdAt || new Date()
          );
          eventsCreated++;
        }
      }
      
      // Fetch existing objectives
      const objectivesSnapshot = await db.collection('objectives')
        .where('userId', '==', currentUser.uid)
        .get();
        
      // Record events for each objective
      for (const doc of objectivesSnapshot.docs) {
        const objective = { id: doc.id, ...doc.data() };
        
        // Check if an event for this objective already exists
        const existingCheck = await db.collection('timeline')
          .where('userId', '==', currentUser.uid)
          .where('entityId', '==', objective.id)
          .where('type', '==', 'objective')
          .limit(1)
          .get();
          
        if (existingCheck.empty) {
          await recordEvent(
            'objective',
            'added',
            objective.id,
            { title: objective.title },
            objective.createdAt?.toDate ? objective.createdAt.toDate() : objective.createdAt || new Date()
          );
          eventsCreated++;
          
          // If objective is completed, add a completion event too
          if (objective.status === 'completed') {
            await recordEvent(
              'objective',
              'completed',
              objective.id,
              { title: objective.title },
              objective.completedAt?.toDate ? objective.completedAt.toDate() : 
                (objective.updatedAt?.toDate ? objective.updatedAt.toDate() : new Date())
            );
            eventsCreated++;
          }
        }
      }
      
      // Fetch existing skills
      const skillsSnapshot = await db.collection('skills')
        .where('userId', '==', currentUser.uid)
        .get();
        
      // Record events for each skill
      for (const doc of skillsSnapshot.docs) {
        const skill = { id: doc.id, ...doc.data() };
        
        // Check if an event for this skill already exists
        const existingCheck = await db.collection('timeline')
          .where('userId', '==', currentUser.uid)
          .where('entityId', '==', skill.id)
          .where('type', '==', 'skill')
          .limit(1)
          .get();
          
        if (existingCheck.empty) {
          await recordEvent(
            'skill',
            'added',
            skill.id,
            { name: skill.name },
            skill.createdAt?.toDate ? skill.createdAt.toDate() : skill.createdAt || new Date()
          );
          eventsCreated++;
        }
      }
      
      console.log(`Timeline: Backfill complete, ${eventsCreated} events created`);
      return eventsCreated;
    } catch (err) {
      console.error('Timeline: Error backfilling events:', err);
      error.value = err.message;
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Group events by month for display
  const eventsByMonth = computed(() => {
    if (!events.value || events.value.length === 0) return [];
    
    const months = {};
    
    events.value.forEach(event => {
      let date;
      
      // Handle different timestamp formats
      if (event.timestamp) {
        if (event.timestamp.seconds) {
          // Firestore timestamp
          date = new Date(event.timestamp.seconds * 1000);
        } else if (event.timestamp instanceof Date) {
          // JavaScript Date
          date = event.timestamp;
        } else {
          // Try to parse as date string or timestamp
          date = new Date(event.timestamp);
        }
      } else {
        // Fallback if no timestamp
        console.warn('Event missing timestamp:', event);
        date = new Date();
      }
      
      // Skip invalid dates
      if (isNaN(date.getTime())) {
        console.warn('Invalid date for event:', event);
        return;
      }
      
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      const monthName = date.toLocaleString('default', { month: 'long', year: 'numeric' });
      
      if (!months[monthKey]) {
        months[monthKey] = {
          id: monthKey,
          name: monthName,
          events: []
        };
      }
      
      months[monthKey].events.push(event);
    });
    
    // Convert to array sorted by date (newest first)
    return Object.values(months)
      .sort((a, b) => b.id.localeCompare(a.id));
  });
  
  return {
    events,
    loading,
    error,
    eventTypes,
    eventsByMonth,
    fetchUserTimeline,
    recordEvent,
    backfillTimelineEvents,
    generateSampleTimelineData
  };
}