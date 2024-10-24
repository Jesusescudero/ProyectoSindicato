<template>
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-6">
          <h1 class="text-center mb-4">Establecer Nueva Contraseña</h1>
          <form @submit.prevent="resetPassword" class="shadow p-4 rounded bg-light">
            <div class="form-group mb-3">
              <label for="newPassword" class="form-label">Nueva Contraseña</label>
              <input
                type="password"
                id="newPassword"
                v-model="newPassword"
                class="form-control"
                required
              />
            </div>
            <div class="form-group mb-3">
              <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
              <input
                type="password"
                id="confirmPassword"
                v-model="confirmPassword"
                class="form-control"
                required
              />
            </div>
            <button type="submit" class="btn btn-primary w-100">Restablecer Contraseña</button>
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
    props: {
      token: {
        type: String,
        required: true
      }
    },
    data() {
      return {
        newPassword: '',
        confirmPassword: '',
        message: '',
        errorMessage: ''
      };
    },
    methods: {
      async resetPassword() {

        console.log('Token enviado:', this.token);
        // Validar que ambas contraseñas coincidan
        if (this.newPassword !== this.confirmPassword) {
          this.errorMessage = 'Las contraseñas no coinciden.';
          return;
        }
  
        try {
          const response = await axios.post('https://proyectosin.onrender.com/reset-password', {
            token: this.token,   // Enviar el token que se pasó en la URL
            newPassword: this.newPassword
          });
  
          if (response.status === 200) {
            this.message = 'Contraseña restablecida con éxito.';
            this.errorMessage = '';
          }
        } catch (error) {
          this.errorMessage = 'Error al restablecer la contraseña. Inténtalo de nuevo.';
          console.error('Error al restablecer la contraseña:', error);
        }
      }
    }
  };
  </script>
  