import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Registro from './components/Registro.vue';
import Bienvenida from './components/Bienvenida.vue'; // Importa el componente de bienvenida
import Principal from './components/PrincipalPage.vue';
import ResetPassword from './components/ResetPassword.vue';
import NewPassword from './components/NewPassword.vue';

const routes = [
    {
      path: '/',
      name: 'Home',
      component: Principal, // Componente que será la página principal
    },
  {
    path: '/login',
    name: 'Login',
    component: Login,
  },
  {
    path: '/register',
    name: 'Registro',
    component: Registro,
  },
  {
    path: '/bienvenida', // Ruta para la página de bienvenida
    name: 'bienvenida',
    component: Bienvenida, // Asegúrate de que este componente esté creado
  },
  {
    path: '/reset-password',
    name: 'reset-password',
    component: ResetPassword,
  },
  {
    path: '/new-password',  // Ruta en la URL
    name: 'NewPassword',
    component: NewPassword,  // El componente donde se ingresa la nueva contraseña
    props: (route) => ({ token: route.query.token })  // Pasar el token de la URL al componente
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
