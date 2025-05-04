<<<<<<< HEAD
import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import 'bootstrap/dist/css/bootstrap.min.css';
import './assets/theme.css';
=======
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

>>>>>>> 20c0385a9dfd9d8223f4cc853fc798ebf0956bc8
createApp(App).use(router).mount('#app')
