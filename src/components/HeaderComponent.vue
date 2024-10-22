<template>
    <header>
      <h1>Sindicato</h1>
      <nav>
        <router-link to="/">Inicio</router-link>
        <router-link to="/login">Iniciar Sesión</router-link>
        <router-link to="/register">Registrarse</router-link>
        <button @click="logout">Cerrar Sesión</button>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: 'HeaderComponent',
    methods: {
      async logout() {
        try {
          const response = await fetch('http://localhost:3000/logout', {
            method: 'POST',
            credentials: 'include', // Asegúrate de incluir las cookies de sesión
          });
          
          if (!response.ok) {
            throw new Error('Error al cerrar sesión');
          }
          
          // Aquí puedes redirigir al usuario a la página de inicio o hacer algo más
          alert('Sesión cerrada con éxito');
          this.$router.push('/'); // Redirige a la página de inicio
        } catch (error) {
          console.error(error);
          alert('Error al cerrar sesión');
        }
      },
    },
  };
  </script>
  
  <style scoped>
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
  