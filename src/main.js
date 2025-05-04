// Core imports
import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Styles
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './assets/styles/custom.css';

// Optional Bootstrap JS
import 'bootstrap';

createApp(App).use(router).mount('#app')
