import { createApp } from 'vue';
import App from './App.vue';
import router from './router'; // Importa el router
import '@fortawesome/fontawesome-free/css/all.min.css';

const app = createApp(App);
app.use(router); // Usa el router
app.mount('#app');
