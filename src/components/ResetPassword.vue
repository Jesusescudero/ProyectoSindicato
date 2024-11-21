<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="text-center mb-4">Recuperar Contraseña</h1>
          <form @submit.prevent="sendResetLink" class="shadow p-4 rounded bg-light">
            <div class="form-group mb-3">
              <label for="email" class="form-label">Por favor, introduce tu correo electrónico registrado en la plataforma.</label>
              <input type="email" id="email" v-model="email" class="form-control" required />
            </div>
            <button type="submit" class="btn btn-primary w-100">Enviar Enlace de Recuperación</button>
          </form>
          <p v-if="message" class="text-success text-center mt-3">{{ message }}</p>
          <p v-if="errorMessage" class="text-danger text-center mt-3">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </template>
  
  <script>
import axios from 'axios';

export default {
  data() {
    return {
      email: '',
      message: '',
      errorMessage: '',
    };
  },
  methods: {
    async sendResetLink() {
      try {
        const response = await axios.post('https://proyectosin.onrender.com/recover-password', {
          email: this.email,
        }); // No se requiere withCredentials

        if (response.status === 200) {
          this.message = 'Enlace de recuperación enviado. Revisa tu correo electrónico.';
          this.errorMessage = '';
        }
      } catch (error) {
        this.errorMessage = 'Error al enviar el enlace de recuperación. Inténtalo de nuevo.';
        console.error('Error en la recuperación de contraseña:', error);
      }
    },
  },
};
</script>

  