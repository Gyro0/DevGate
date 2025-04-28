import { createRouter, createWebHashHistory } from 'vue-router'
import { auth } from '@/firebase/firebaseInit'



import LoginHome from '@/views/LoginHome.vue' 
import Dashboard from '@/views/Dashboard.vue'
import Objectives from '@/views/Objectives.vue'
import SkillTracker from '@/views/SkillTracker.vue'
import Timeline from '@/views/Timeline.vue'
import Profile from '@/views/Profile.vue'
import Projects from '@/views/Projects.vue'

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginHome,
  },
  {
    path: '/dashboard',
    name: 'dashboard',
    component:Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/objectives',
    name: 'objectives',
    component:Objectives,
    meta: { requiresAuth: true }
  },
  {
    path: '/skillTracker',
    name: 'skillTracker',
    component:SkillTracker,
    meta: { requiresAuth: true }
  },
  {
    path: '/timeline',
    name: 'timeline',
    component:Timeline,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component:Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'projects',
    component:Projects,
    meta: { requiresAuth: true }
  },

]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);
  
  // Wait for auth state to initialize before routing
  const currentUser = auth.currentUser;
  
  // Guest only routes check
  if (guestOnly && currentUser) {
    next('/dashboard');
    return;
  }
  
  // Authentication check
  if (requiresAuth && !currentUser) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }
  
  next();
});


export default router
