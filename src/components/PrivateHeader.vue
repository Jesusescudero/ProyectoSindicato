<template>
    <header>
      <h1>Sindicato</h1>
      <nav>
        <button @click="$emit('logout')">Cerrar Sesión</button>
      </nav>
    </header>
  </template>
  
  <script>
  export default {
    name: 'PrivateHeader',
  };
  </script>
  
  <style scoped>
  /* Estilos para el encabezado privado */
  </style>
  