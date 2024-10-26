import { createRouter, createWebHistory } from 'vue-router';
import Login from './components/Login.vue';
import Registro from './components/Registro.vue';
import Bienvenida from './components/Bienvenida.vue'; // Importa el componente de bienvenida
import Principal from './components/PrincipalPage.vue';
import ResetPassword from './components/ResetPassword.vue';
import NewPassword from './components/NewPassword.vue';
import DocumentManager from './components/DocumentManager.vue';
import LegalDisclaimerManager from './components/LegalDisclaimer.vue';
import TermsAndConditions from './components/TermsAndConditions.vue';
import CompanySettings from './components/CompanySettings.vue';
import { jwtDecode } from 'jwt-decode'; // Importa jwt_decode para manejar el token

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
    meta: { requiresAuth: true, role: 'user' },
  },
  {
    path: '/admin/documents', // Ruta para la gestión de documentos del admin
    name: 'DocumentManager',
    component: DocumentManager,
    meta: { requiresAuth: true, role: 'admin' }, // Solo accesible para administradores
  },
  {
    path: '/admin/legal-disclaimer',
    name: 'LegalDisclaimer',
    component: LegalDisclaimerManager, // Aquí incluirías el componente de Deslinde Legal
    meta: { requiresAuth: true, role: 'admin' }, // Solo para admin
  },
  {
    path: '/admin/terms-and-conditions', // Ruta para términos y condiciones
    name: 'TermsAndConditions',
    component: TermsAndConditions,
    meta: { requiresAuth: true, role: 'admin' },
  },
  {
    path: '/admin/company-settings',
    name: 'CompanySettings',
    component: CompanySettings,
    meta: { requiresAuth: true, role: 'admin' }, // Solo accesible para administradores
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

// Guard global para proteger las rutas
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token'); // Obtener el token del almacenamiento local

  // Si la ruta requiere autenticación
  if (to.matched.some(record => record.meta.requiresAuth)) {
    if (!token) {
      // Si no hay token, redirigir al login
      return next({ path: '/login' });
    } else {
      // Si hay token, verificar el rol
      try {
        const decoded = jwtDecode(token); // Aquí usamos jwtDecode, ya que fue como la importaste
        const userRole = decoded.role;

        // Verificar si el rol coincide con el requerido por la ruta
        if (to.meta.role && to.meta.role !== userRole) {
          // Si no coincide el rol, redirigir al Home o donde prefieras
          return next({ path: '/' });
        } else {
          // Si coincide el rol, permitir acceso a la ruta
          next();
        }
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        return next({ path: '/login' }); // Si hay error, redirigir al login
      }
    }
  } else {
    // Si la ruta no requiere autenticación, continuar
    next();
  }
});

export default router;
