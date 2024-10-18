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
    <footer>
      <p>&copy; 2024 Proyecto del Sindicato. Todos los derechos reservados.</p>
    </footer>
  </div>
</template>

<script>
export default {
  name: 'App',
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

footer {
  margin-top: 20px;
  font-size: 0.8em;
  color: #777;
}
</style>
