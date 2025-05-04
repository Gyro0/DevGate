import { createRouter, createWebHistory } from 'vue-router';
import { auth } from '@/firebase/firebaseInit';

import LoginHome from '@/views/LoginHome.vue';
import Dashboard from '@/views/Dashboard.vue';
import Objectives from '@/views/Objectives.vue';
import SkillTracker from '@/views/SkillTracker.vue';
import Timeline from '@/views/Timeline.vue';
import Profile from '@/views/Profile.vue';
import Projects from '@/views/Projects.vue';
import Settings from '../views/Settings.vue';
import PostDetail from '../views/PostDetail.vue';

const routes = [
  {
    path: '/login',
    name: 'login',
    component: LoginHome,
    meta: { guestOnly: true }
  },
  {
    path: '/dashboard',
    name: 'Dashboard',
    component: Dashboard,
    meta: { requiresAuth: true }
  },
  {
    path: '/objectives',
    name: 'objectives',
    component: Objectives,
    meta: { requiresAuth: true }
  },
  {
    path: '/skills',
    name: 'skillTracker',
    component: SkillTracker,
    meta: { requiresAuth: true }
  },
  {
    path: '/timeline',
    name: 'timeline',
    component: Timeline,
    meta: { requiresAuth: true }
  },
  {
    path: '/profile',
    name: 'profile',
    component: Profile,
    meta: { requiresAuth: true }
  },
  {
    path: '/projects',
    name: 'projects',
    component: Projects,
    meta: { requiresAuth: true }
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/posts/:id',
    name: 'PostDetail',
    component: PostDetail,
    meta: { requiresAuth: true }
  },
  {
    path: '/',
    redirect: '/login'
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

router.beforeEach(async (to, from, next) => {
  const requiresAuth = to.matched.some(record => record.meta.requiresAuth);
  const guestOnly = to.matched.some(record => record.meta.guestOnly);

  const currentUser = auth.currentUser;

  if (guestOnly && currentUser) {
    next('/dashboard');
    return;
  }

  if (requiresAuth && !currentUser) {
    next({
      path: '/login',
      query: { redirect: to.fullPath }
    });
    return;
  }

  next();
});

export default router;
