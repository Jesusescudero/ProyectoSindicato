<template>
  <header>
    
    <div class="header-content">
      <!-- Mostrar el logo -->
      <img :src="logoUrl" alt="Logo de la Empresa" class="company-logo" v-if="logoUrl" />
      <div class="text-container">
        <h1 class="company-name">{{ companyName }}</h1>
        <p class="company-slogan">{{ companySlogan }}</p> <!-- Mostrar el slogan -->
      </div>
    </div>
    <nav>
      <router-link to="/">Inicio</router-link>
      <!-- Mostrar "Iniciar Sesión" y "Registrarse" solo si no está autenticado -->
      <router-link v-if="!isAuthenticated" to="/login">Iniciar Sesión</router-link>
      <router-link v-if="!isAuthenticated" to="/register">Registrarse</router-link>
      <!-- Mostrar "Cerrar Sesión" solo si está autenticado -->
      <button v-if="isAuthenticated" @click="logout">Cerrar Sesión</button>
      <!-- Mostrar "Panel de Admin" solo si es administrador -->
      <router-link v-if="isAuthenticated && userRole === 'admin'" to="/admin/documents">Politicas de Privacidad</router-link>
      <router-link v-if="isAuthenticated && userRole === 'admin'" to="/admin/legal-disclaimer">Deslinde Legal</router-link>
      <router-link v-if="isAuthenticated && userRole === 'admin'" to="/admin/terms-and-conditions">Términos y Condiciones</router-link>
      <router-link v-if="isAuthenticated && userRole === 'admin'" to="/admin/company-settings">Configuración de Empresa</router-link>
      <!-- Mostrar otras rutas si es un usuario normal -->
      <router-link v-if="isAuthenticated && userRole === 'user'" to="/user-dashboard">Mi Panel</router-link>
      <!-- Mostrar "Componente Especial" solo para usuarios regulares -->
      <!-- Mostrar "Bienvenida" solo si es un usuario normal (user) -->
      <router-link v-if="isAuthenticated && userRole === 'user'" to="/bienvenida">Bienvenida</router-link>
    </nav>
  </header>
</template>

<script>
import axios from 'axios';

import { jwtDecode } from 'jwt-decode'; // Importación correcta

export default {
  name: 'HeaderComponent',
  data() {
    return {
      companyName: '',
      companySlogan: '',  // Para guardar el slogan
      logoUrl: '',
      isAuthenticated: false,
      userRole: null
    };
  },
  created() {
    const token = localStorage.getItem('token');
    if (token) {
      this.verifyToken(token);
    }
    this.fetchCompanyData();
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
    async fetchCompanyData() {
    try {
      // Obtener el nombre de la empresa
      // Obtener el nombre y el slogan de la empresa
      const companyResponse = await axios.get('https://proyectosin.onrender.com/company-name');
        this.companyName = companyResponse.data.nombre_empresa;
        this.companySlogan = companyResponse.data.eslogan; // Asignamos el slogan de la empresa

      // En lugar de obtener el logo como Blob, usa la URL directamente
      this.logoUrl = 'https://proyectosin.onrender.com/logo';  // URL directa del logo
    } catch (error) {
      console.error('Error al obtener los datos de la empresa:', error);
    }
  },
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
    async fetchCompanyName() {
      try {
        const response = await axios.get('https://proyectosin.onrender.com/company-name');
        this.companyName = response.data.nombre_empresa; // Asignamos el nombre de la empresa
      } catch (error) {
        console.error('Error al obtener el nombre de la empresa:', error);
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
.header-content {
  position: relative;            /* Para poder posicionar el logo sin afectar el contenido */
  text-align: center;            /* Centra el texto en el contenedor */
}

.company-logo {
  position: absolute;            /* Hace que el logo no interfiera con el contenido centrado */
  left: 20px;                    /* Alinea el logo a la izquierda con un margen */
  max-width: 80px;               /* Tamaño más pequeño */
  height: 80px;                  /* Altura fija */
  border-radius: 50%;            /* Hacer el logo redondo */
  object-fit: cover;             /* Asegurar que la imagen no se deforme */
}

.text-container {
  text-align: center;
}

.company-name {
  font-size: 2rem;
  margin: 0;
}

.company-slogan {
  font-size: 1.2rem;
  font-style: italic;
  margin-top: 5px;
  color: #e0e0e0;
}
</style>

