// src/composables/useSkills.js
import { ref } from 'vue';
import firebase, { db, auth } from '@/firebase/firebaseInit'; // Import firebase namespace

// Define skill categories and levels
const skillCategories = [
  { id: 'frontend', name: 'Frontend' },
  { id: 'backend', name: 'Backend' },
  { id: 'database', name: 'Database' },
  { id: 'devops', name: 'DevOps' },
  { id: 'mobile', name: 'Mobile' },
  { id: 'other', name: 'Other' }
];

const skillLevels = [
  { value: 1, label: 'Beginner' },
  { value: 2, label: 'Elementary' },
  { value: 3, label: 'Intermediate' },
  { value: 4, label: 'Advanced' },
  { value: 5, label: 'Expert' }
];

export default function useSkills() {
  const skills = ref([]);
  const loading = ref(false);
  const error = ref(null);
  const userId = auth.currentUser?.uid; // Get userId directly

  const skillsCollectionRef = userId ? db.collection(`users/${userId}/skills`) : null; // v8 collection

  // Fetch skills for the current user
  const fetchUserSkills = async () => {
    if (!skillsCollectionRef) {
      error.value = 'User not authenticated';
      skills.value = [];
      return;
    }
    
    loading.value = true;
    error.value = null;
    try {
      const snapshot = await skillsCollectionRef.get(); // v8 get
      skills.value = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    } catch (err) {
      console.error("Error fetching skills:", err);
      error.value = 'Failed to load skills.';
      skills.value = [];
    } finally {
      loading.value = false;
    }
  };

  // Add a new skill
  const addSkill = async (skillData) => {
    if (!skillsCollectionRef) throw new Error('User not authenticated');
    
    loading.value = true;
    try {
      const newSkill = {
        ...skillData,
        userId: userId, // Already have userId
        dateAcquired: firebase.firestore.FieldValue.serverTimestamp(), // v8 serverTimestamp
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
        progressHistory: [{ level: skillData.level, date: firebase.firestore.Timestamp.now() }] // v8 Timestamp
      };
      const docRef = await skillsCollectionRef.add(newSkill); // v8 add
      
      // Add skill locally for immediate UI update
      const addedSkill = { id: docRef.id, ...newSkill, dateAcquired: new Date(), lastUpdated: new Date() }; // Approximate timestamp locally
      skills.value.push(addedSkill);
      
      return addedSkill; // Return the added skill with ID
    } catch (err) {
      console.error("Error adding skill:", err);
      error.value = 'Failed to add skill.';
      throw err; // Re-throw error for handling in component
    } finally {
      loading.value = false;
    }
  };

  // Update an existing skill
  const updateSkill = async (skillId, skillData) => {
    if (!skillsCollectionRef) throw new Error('User not authenticated');
    
    loading.value = true;
    try {
      const skillRef = skillsCollectionRef.doc(skillId); // v8 doc
      const existingSkill = skills.value.find(s => s.id === skillId);
      
      const updatedData = {
        ...skillData,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp() // v8 serverTimestamp
      };

      // Add to progress history if level changed
      if (existingSkill && existingSkill.level !== skillData.level) {
        updatedData.progressHistory = [
          ...(existingSkill.progressHistory || []),
          { level: skillData.level, date: firebase.firestore.Timestamp.now() } // v8 Timestamp
        ];
      }

      await skillRef.update(updatedData); // v8 update
      
      // Update skill locally
      const index = skills.value.findIndex(s => s.id === skillId);
      if (index !== -1) {
        // Merge existing data with updates, approximate timestamp locally
        skills.value[index] = { 
          ...skills.value[index], 
          ...updatedData, 
          lastUpdated: new Date() 
        };
      }
      
      return skills.value[index]; // Return the updated skill
    } catch (err) {
      console.error("Error updating skill:", err);
      error.value = 'Failed to update skill.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Delete a skill
  const deleteSkill = async (skillId) => {
    if (!skillsCollectionRef) throw new Error('User not authenticated');
    
    loading.value = true;
    try {
      await skillsCollectionRef.doc(skillId).delete(); // v8 delete
      
      // Remove skill locally
      skills.value = skills.value.filter(s => s.id !== skillId);
    } catch (err) {
      console.error("Error deleting skill:", err);
      error.value = 'Failed to delete skill.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    skills,
    skillCategories,
    skillLevels,
    loading,
    error,
    fetchUserSkills,
    addSkill,
    updateSkill,
    deleteSkill
  };
}