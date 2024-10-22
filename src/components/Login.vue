<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">Iniciar Sesión</h1>
        <form v-if="!isVerifying" @submit.prevent="loginUser" class="shadow p-4 rounded bg-light">
          <div class="form-group mb-3">
            <label for="username" class="form-label">Usuario</label>
            <input type="text" id="username" v-model="username" class="form-control input-field" required />
          </div>
          <div class="form-group mb-3">
            <label for="password" class="form-label">Contraseña</label>
            <input type="password" id="password" v-model="password" class="form-control input-field" required />
          </div>
          <div class="mb-3 text-center">
            <div class="g-recaptcha" data-sitekey="6LdkUWIqAAAAAL7LRBLA0SpRVLgAUs7KRwAuZRDf"></div>
          </div>
          <button type="submit" :disabled="isVerifying" class="btn btn-primary w-100">Iniciar Sesión</button>
        </form>

        <form v-if="isVerifying" @submit.prevent="verifyCode" class="shadow p-4 rounded bg-light mt-4">
          <div class="form-group mb-3">
            <label for="verificationCode" class="form-label">Código de Verificación</label>
            <input type="text" id="verificationCode" v-model="verificationCode" class="form-control input-field" required />
          </div>
          <button type="submit" class="btn btn-success w-100">Verificar Código</button>
        </form>

        <p v-if="errorMessage" class="text-danger text-center mt-3">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
/* global grecaptcha */
import axios from 'axios';


export default {
  name: 'UsuarioLogin',
  data() {
    return {
      username: '',
      password: '',
      verificationCode: '', 
      errorMessage: '',
      isVerifying: false, 
    };
  },
  mounted() {
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
    recaptchaScript.async = true;
    recaptchaScript.defer = true;
    document.body.appendChild(recaptchaScript);
  },
  methods: {
    async loginUser() {
      try {
        const recaptchaToken = grecaptcha.getResponse();

        if (!recaptchaToken) {
          this.errorMessage = 'Por favor completa el reCAPTCHA';
          return;
        }

        // Hacer la solicitud de inicio de sesión con credenciales (cookies)
        const response = await axios.post('https://proyectosin.onrender.com/login', {
          usuarios: this.username,
          password: this.password,
          recaptchaToken: recaptchaToken,
        }, {
          withCredentials: true // Permitir el envío y recepción de cookies
        });

        if (response.status === 200) {
          this.errorMessage = '';
          this.isVerifying = true; 
          console.log('Inicio de sesión exitoso, revisa tu correo para el código de verificación');
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 403) {
            this.errorMessage = 'La cuenta está bloqueada. Inténtalo más tarde.';
          } else {
            this.errorMessage = error.response.data || 'Error en el inicio de sesión.';
          }
        } else {
          this.errorMessage = 'Error en la configuración de la solicitud: ' + error.message;
        }
        console.error('Error en el inicio de sesión:', error);
      }
    },
    async verifyCode() {
  console.log('Usuario:', this.username);
  console.log('Código de verificación:', this.verificationCode);
  
  try {
    const response = await axios.post('https://proyectosin.onrender.com/verify-code', {
      usuarios: this.username,
      codigoVerificacion: this.verificationCode,
    });

    if (response.status === 200) {
      // Redirigir a la página de bienvenida
      this.errorMessage = '';
      console.log('Verificación exitosa. Bienvenido!');
      this.$router.push({ name: 'bienvenida' }); 
    }
  } catch (error) {
    // Manejo de errores
    console.error('Error al verificar el código:', error.response ? error.response.data : error.message);
    this.handleError(error);
  }
},
    handleError(error) {
      if (error.response) {
        // Manejar el caso de cuenta bloqueada
        if (error.response.status === 403) {
          this.errorMessage = 'La cuenta está bloqueada. Inténtalo más tarde.';
        } else {
          this.errorMessage = error.response.data || 'Error en el inicio de sesión.';
        }
      } else if (error.request) {
        this.errorMessage = 'No se recibió respuesta del servidor.';
      } else {
        this.errorMessage = 'Error en la configuración de la solicitud: ' + error.message;
      }
      console.error('Error:', error);
    },
  },
};
</script>

<style>
.container {
  max-width: 400px; /* Limitar el ancho máximo del contenedor */
  margin: auto; /* Centrar el contenedor */
  background-color: #f7f7f7; /* Color de fondo suave */
  padding: 20px; /* Espacio interior */
  border-radius: 8px; /* Bordes redondeados */
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2); /* Sombra suave */
}

h1 {
  color: #333; /* Color del título */
}

.shadow {
  box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); /* Agregar sombra suave */
}

.bg-light {
  background-color: #ffffff !important; /* Fondo blanco para formularios */
}

.form-group {
  margin-bottom: 1.5rem; /* Espaciado entre campos */
}

.input-field {
  border: 1px solid #ced4da; /* Borde claro */
  border-radius: 5px; /* Bordes redondeados */
  padding: 10px; /* Espacio interior */
  transition: border-color 0.3s; /* Transición suave para el borde */
  max-width: 100%; /* Asegura que el campo no exceda el ancho del contenedor */
  width: calc(100% - 20px); /* Asegura que haya espacio a los lados */
  margin: 0 auto; /* Centra el campo */
}

.input-field:focus {
  border-color: #007bff; /* Color del borde al enfocarse */
  outline: none; /* Sin borde de enfoque */
}

.text-danger {
  color: red; /* Color rojo para mensajes de error */
}

.btn {
  background-color: #09c30f; /* Color de fondo del botón */
  color: white; /* Color del texto del botón */
  border: none; /* Sin borde */
  padding: 10px; /* Espaciado interior */
  border-radius: 4px; /* Bordes redondeados */
  cursor: pointer; /* Cambiar cursor al pasar sobre el botón */
  transition: background-color 0.3s ease; /* Transición suave */
}

.btn:hover {
  background-color: #09c30f; /* Color de fondo del botón al pasar el mouse */
}

form {
  padding: 20px; /* Agregar espacio interno al cuadro */
  margin-bottom: 20px; /* Agregar espacio inferior entre cuadros */
}

input {
  width: 100%;
  padding: 10px; /* Espacio interno en el campo de entrada */
  margin-bottom: 15px; /* Espacio inferior entre campos */
  border: 1px solid #ccc;
  border-radius: 4px;
}

/* Ajustar el padding del cuadro de verificación si es necesario */
.g-recaptcha {
  margin: 20px 0; /* Margen arriba y abajo del reCAPTCHA */
  display: flex;
  justify-content: center; /* Centrar el reCAPTCHA */
}

</style>
