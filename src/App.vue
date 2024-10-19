<template>
  <div id="app">
    <header>
      <h1>Sindicato</h1>
      <nav>
        <router-link to="/login">Iniciar Sesión</router-link>
        <router-link to="/register">Registrarse</router-link>
      </nav>
    </header>
    <main>
      <router-view />
    </main>
    <FooterComponent /> <!-- Cambia aquí el nombre del componente -->
  </div>
</template>

<script>
import FooterComponent from './components/FooterComponent.vue'; // Cambia aquí el nombre

export default {
  name: 'App',
  components: {
    FooterComponent, // Cambia aquí el nombre
  },
}
</script>

<style scoped>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  text-align: center;
  color: #2c3e50;
  margin-top: 30px;
}

header {
  background-color: #3b8cff;
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
</style>
