<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">Recuperar Contraseña</h1>
        <form @submit.prevent="sendResetLink" class="shadow p-4 rounded bg-light">
          <div class="form-group mb-3">
            <label for="email" class="form-label d-block text-center">
              Por favor, introduce tu correo electrónico registrado en la plataforma.
            </label>
            <div class="mt-2">
              <input type="email" id="email" v-model="email" class="form-control form-control-lg" required />
            </div>
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

<style scoped>

/* Estilo para el contenedor principal */
.container {
  max-width: 500px;
  margin: 0 auto;
  background-color: #f8f9fa; /* Fondo claro */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); /* Sombra ligera */
}

/* Estilo para el título */
h1 {
  font-size: 1.8rem;
  font-weight: bold;
  color: #333;
}

/* Formulario */
form {
  padding: 20px;
  background-color: #ffffff; /* Fondo blanco */
}

/* Campo de entrada */
.form-control {
  border-radius: 6px;
  border: 1px solid #ced4da;
  padding: 10px;
  font-size: 1rem;
  width: 60%;
}

/* Botón de envío */
.btn-primary {
  background-color: #007bff; /* Azul primario */
  border-color: #007bff;
  padding: 10px 15px;
  font-size: 1rem;
  border-radius: 6px;
  transition: background-color 0.3s ease-in-out;
}

.btn-primary:hover {
  background-color: #0056b3; /* Azul más oscuro al pasar el mouse */
}

/* Mensajes */
.text-success {
  font-size: 0.95rem;
  color: #28a745; /* Verde éxito */
}

.text-danger {
  font-size: 0.95rem;
  color: #dc3545; /* Rojo error */
}

/* Espaciado entre secciones */
.mt-3 {
  margin-top: 1.5rem !important;
}


</style>

  