<template>
    <div>
      <h2>{{ status }}</h2>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        status: 'Verificando...',
      };
    },
    created() {
      // Obtener los parámetros de la URL
      const token = this.$route.query.token;
      const userId = this.$route.query.userId;
  
      if (!token || !userId) {
        this.status = 'Faltan parámetros de verificación.';
        return;
      }
  
      // Llamar a la API de verificación
      axios.get(`http://localhost:3000/verify-email?token=${token}&userId=${userId}`)
        .then(() => { // Eliminamos 'response' ya que no lo usamos
          this.status = 'Correo verificado exitosamente. Redirigiendo a inicio de sesión...';
          // Esperar 2 segundos antes de redirigir
          setTimeout(() => {
            this.$router.push('/login');
          }, 2000); // Redirige después de 2 segundos
        })
        .catch(error => {
          this.status = error.response?.data?.message || 'Error al verificar el correo.';
        });
    },
  };
  </script>
  
  <style scoped>
  h2 {
    text-align: center;
    margin-top: 20px;
  }
  </style>
  