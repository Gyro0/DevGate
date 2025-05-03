// src/composables/useSkills.js
import { ref } from 'vue';
import firebase, { db } from '@/firebase/firebaseInit';
import useAuth from './useAuth';

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
  const { user, waitForAuth } = useAuth();
  const skills = ref([]);
  const loading = ref(false);
  const error = ref(null);

  // Fetch user skills with auth waiting
  const fetchUserSkills = async () => {
    loading.value = true;
    error.value = null;

    try {
      console.log("Skills: Waiting for authentication...");
      const authUser = await waitForAuth();

      if (!authUser) {
        console.warn("Skills: No user logged in after auth check");
        loading.value = false;
        return [];
      }

      console.log("Skills: Fetching for user:", authUser.uid);
      const snapshot = await db.collection('skills')
        .where('userId', '==', authUser.uid)
        .get();

      skills.value = snapshot.docs.map(doc => {
        const data = doc.data();
        return {
          id: doc.id,
          ...data,
          // Handle timestamps similar to projects
          createdAt: data.createdAt?.toDate?.() || new Date(data.createdAt || Date.now()),
          updatedAt: data.updatedAt?.toDate?.() || new Date(data.updatedAt || Date.now())
        };
      });

      console.log("Skills: Fetched", skills.value.length, "skills");
      return skills.value;
    } catch (err) {
      console.error("Skills: Error fetching:", err);
      error.value = err.message;
      return [];
    } finally {
      loading.value = false;
    }
  };

  // Add a new skill
  const addSkill = async (skillData) => {
    loading.value = true;
    try {
      const currentUser = await waitForAuth();

      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const newSkill = {
        ...skillData,
        userId: currentUser.uid,
        dateAcquired: firebase.firestore.FieldValue.serverTimestamp(),
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp(),
        progressHistory: [{ level: skillData.level, date: firebase.firestore.Timestamp.now() }]
      };
      const docRef = await db.collection('skills').add(newSkill);

      // Add skill locally for immediate UI update
      const addedSkill = { id: docRef.id, ...newSkill, dateAcquired: new Date(), lastUpdated: new Date() };
      skills.value.push(addedSkill);

      return addedSkill;
    } catch (err) {
      console.error("Error adding skill:", err);
      error.value = 'Failed to add skill.';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  // Update an existing skill
  const updateSkill = async (skillId, skillData) => {
    loading.value = true;
    try {
      const currentUser = await waitForAuth();

      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      const skillRef = db.collection('skills').doc(skillId);
      const existingSkill = skills.value.find(s => s.id === skillId);

      const updatedData = {
        ...skillData,
        lastUpdated: firebase.firestore.FieldValue.serverTimestamp()
      };

      // Add to progress history if level changed
      if (existingSkill && existingSkill.level !== skillData.level) {
        updatedData.progressHistory = [
          ...(existingSkill.progressHistory || []),
          { level: skillData.level, date: firebase.firestore.Timestamp.now() }
        ];
      }

      await skillRef.update(updatedData);

      // Update skill locally
      const index = skills.value.findIndex(s => s.id === skillId);
      if (index !== -1) {
        skills.value[index] = {
          ...skills.value[index],
          ...updatedData,
          lastUpdated: new Date()
        };
      }

      return skills.value[index];
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
    loading.value = true;
    try {
      const currentUser = await waitForAuth();

      if (!currentUser) {
        throw new Error('User not authenticated');
      }

      await db.collection('skills').doc(skillId).delete();

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