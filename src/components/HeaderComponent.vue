<template>
  <header>
    <h1>SUTUTEH</h1>
    <nav>
      <router-link to="/">Inicio</router-link>
      <!-- Mostrar "Iniciar Sesión" y "Registrarse" solo si no está autenticado -->
      <router-link v-if="!isAuthenticated" to="/login">Iniciar Sesión</router-link>
      <router-link v-if="!isAuthenticated" to="/register">Registrarse</router-link>
      <!-- Mostrar "Cerrar Sesión" solo si está autenticado -->
      <button v-if="isAuthenticated" @click="logout">Cerrar Sesión</button>
      <!-- Mostrar "Panel de Admin" solo si es administrador -->
      <router-link v-if="isAuthenticated && userRole === 'admin'" to="/admin/documents">Documento Regulatorio</router-link>
      <router-link v-if="isAuthenticated && userRole === 'admin'" to="/admin/legal-disclaimer">Deslinde Legal</router-link>
      <router-link v-if="isAuthenticated && userRole === 'admin'" to="/admin/terms-and-conditions">Términos y Condiciones</router-link>
      <!-- Mostrar otras rutas si es un usuario normal -->
      <router-link v-if="isAuthenticated && userRole === 'user'" to="/user-dashboard">Mi Panel</router-link>
      <!-- Mostrar "Componente Especial" solo para usuarios regulares -->
      <!-- Mostrar "Bienvenida" solo si es un usuario normal (user) -->
      <router-link v-if="isAuthenticated && userRole === 'user'" to="/bienvenida">Bienvenida</router-link>
    </nav>
  </header>
</template>

<script>
import { jwtDecode } from 'jwt-decode'; // Importación correcta

export default {
  name: 'HeaderComponent',
  data() {
    return {
      isAuthenticated: false,
      userRole: null
    };
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      this.verifyToken(token);
    }
  },
  watch: {
    // Monitorea cambios en la ruta actual
    $route() {
      const token = localStorage.getItem('token');
      if (token) {
        this.verifyToken(token);
      } else {
        this.isAuthenticated = false;
        this.userRole = null;
      }
    }
  },
  methods: {
    verifyToken(token) {
      try {
        const decoded = jwtDecode(token); // Decodificar el token
        this.isAuthenticated = true;
        this.userRole = decoded.role;
      } catch (error) {
        console.error('Error al decodificar el token:', error);
        this.isAuthenticated = false;
        this.userRole = null;
      }
    },
    async logout() {
      localStorage.removeItem('token');
      this.isAuthenticated = false;
      this.userRole = null;
      this.$router.push('/login');
    }
  }
};
</script>



<style scoped>
header {
  background-color: #049206;
  color: white;
  padding: 20px;
}

nav {
  margin: 10px 0;
}

nav a {
  margin: 0 15px;
  color: white;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}

button {
  background-color: #ff4c4c; /* Color para el botón de cerrar sesión */
  color: white;
  border: none;
  padding: 10px;
  cursor: pointer;
}

button:hover {
  background-color: #e03a3a; /* Color al pasar el ratón */
}
</style>

