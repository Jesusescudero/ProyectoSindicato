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
/* Estilo general del encabezado */
header {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: #008000; /* Fondo verde */
  padding: 20px;
  text-align: center;
  gap: 10px; /* Espaciado uniforme */
}

/* Contenedor del contenido principal */
.header-content {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  width: 100%;
  gap: 15px; /* Espaciado entre logo y texto */
  position: relative;
}

/* Logo de la empresa */
.company-logo {
  max-width: 80px; /* Tamaño máximo del logo */
  height: auto;
  border-radius: 50%; /* Logo redondeado */
  object-fit: cover;
}

/* Contenedor del texto */
.text-container {
  flex: 1; /* Permite que el texto ocupe todo el espacio restante */
  text-align: center;
}

.company-name {
  font-size: 2rem;
  margin: 0;
  color: white;
}

.company-slogan {
  font-size: 1rem;
  font-style: italic;
  color: #e0e0e0;
}

/* Navegación */
nav {
  display: flex;
  flex-wrap: wrap; /* Permite que los enlaces se ajusten automáticamente */
  justify-content: center;
  gap: 15px; /* Espaciado uniforme entre enlaces */
}

nav a {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: 5px 10px;
  border: 1px solid transparent; /* Sin bordes por defecto */
  transition: background-color 0.3s, border-color 0.3s;
}

nav a:hover {
  background-color: white;
  color: #008000;
  border-color: #008000;
}

/* Botón de cerrar sesión */
button {
  background-color: #ff4c4c; /* Color para el botón */
  color: white;
  border: none;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 5px;
  cursor: pointer;
  transition: background-color 0.3s;
}

button:hover {
  background-color: #e03a3a;
}

/* Consultas de medios para pantallas pequeñas */
@media (max-width: 768px) {
  /* Ajustes para el contenido principal */
  .header-content {
    flex-direction: column; /* Logo y texto apilados */
    align-items: center;
  }

  .company-logo {
    max-width: 60px; /* Logo más pequeño en pantallas pequeñas */
  }

  .company-name {
    font-size: 1.5rem; /* Tamaño de texto reducido */
  }

  .company-slogan {
    font-size: 0.9rem;
  }

  /* Navegación adaptativa */
  nav {
    flex-direction: column; /* Enlaces apilados */
    gap: 10px; /* Espaciado menor */
  }

  nav a {
    font-size: 0.9rem;
    padding: 8px;
  }

  /* Botón de cerrar sesión */
  button {
    font-size: 0.9rem;
    padding: 8px;
  }
}

</style>

