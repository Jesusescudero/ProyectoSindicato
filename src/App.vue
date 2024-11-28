<template>
  <div id="app">
    <HeaderComponent />
    <main>
      <router-view />
    </main>
    <FooterComponent /> <!-- Cambia aquí el nombre del componente -->
  </div>
</template>
<script>
import FooterComponent from './components/FooterComponent.vue'; // Cambia aquí el nombre
import HeaderComponent from './components/HeaderComponent.vue';
import axios from 'axios';

export default {
  name: 'App',
  components: {
    HeaderComponent,
    FooterComponent, // Cambia aquí el nombre
  },
  created() {
    this.fetchCompanyTitle();
  },
  methods: { // Coloca "methods" dentro de "export default"
    async fetchCompanyTitle() {
      try {
        const response = await axios.get('https://proyectosin.onrender.com/company-title'); // Ruta del backend
        if (response.data && response.data.nombre_empresa) {
          document.title = response.data.nombre_empresa; // Cambia el título de la pestaña dinámicamente
        } else {
          document.title = "Título por defecto"; // En caso de no encontrar datos
        }
      } catch (error) {
        console.error("Error al obtener el título de la empresa:", error);
        document.title = "Error al cargar"; // En caso de error
      }
    },
  },
}

</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 0px;
}

header {
  background-color: #049206;
  color: white;
  padding: 10px;
}

nav {
  margin: 10px 0;
}

nav a {
  margin: 0 10px;
  color: white;
  text-decoration: none;
}

nav a:hover {
  text-decoration: underline;
}
</style>
