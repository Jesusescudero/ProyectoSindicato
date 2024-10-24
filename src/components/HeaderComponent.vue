<template>
  <header>
    <h1>SUTUTEH</h1>
    <nav>
      <router-link to="/">Inicio</router-link>
      <router-link to="/login">Iniciar Sesión</router-link>
      <router-link to="/register">Registrarse</router-link>
      <button v-if="isAuthenticated" @click="logout">Cerrar Sesión</button>
    </nav>
  </header>
</template>

<script>
export default {
  name: 'HeaderComponent',
  data() {
    return {
      isAuthenticated: false, // Estado inicial
    };
  },
  created() {
    // Comprobar si hay un token en el almacenamiento local o en las cookies
    const token = localStorage.getItem('token'); // o document.cookie para verificar cookies
    this.isAuthenticated = !!token; // Establecer el estado basado en la existencia del token
  },
  methods: {
    async logout() {
      try {
        const response = await fetch('https://proyectosin.onrender.com/logout', {
          method: 'POST',
        credentials: 'include', // Incluye las cookies de sesión
      });

      if (!response.ok) {
        throw new Error('Error al cerrar sesión');
      }

      // Eliminar el token del almacenamiento local
      // Eliminar el token del almacenamiento local o de las cookies
    localStorage.removeItem('token'); 
    document.cookie = "token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";

    // Actualizar el estado de autenticación
    this.isAuthenticated = false;

    alert('Sesión cerrada con éxito');
    this.$router.push('/'); // Redirigir a la página de inicio
    } catch (error) {
      console.error(error);
      alert('Ocurrió un problema al cerrar sesión. Por favor, inténtalo de nuevo.');
    }
    },
  },
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

