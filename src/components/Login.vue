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
            <!-- Campo de contraseña -->
            <input :type="showPassword ? 'text' : 'password'" id="password" v-model="password"
              class="form-control input-field" required />
            <!-- Botón del ojito -->
            <button type="button" class="password-toggle-btn" @click="togglePasswordVisibility">
              <i :class="showPassword ? 'bi bi-eye-slash' : 'bi bi-eye'"></i>
            </button>
          </div>

          <div class="mb-3 text-center">
            <div class="g-recaptcha" data-sitekey="6LdkUWIqAAAAAL7LRBLA0SpRVLgAUs7KRwAuZRDf"></div>
          </div>
          <!-- Botón de Iniciar Sesión -->
          <button type="submit" :disabled="isVerifying" class="btn btn-primary w-100 btn-lg">Iniciar Sesión</button>
        </form>

        <form v-if="isVerifying" @submit.prevent="verifyCode" class="shadow p-4 rounded bg-light mt-4 verify-code-form">
          <div class="form-group mb-3">
            <label for="verificationCode" class="form-label">Ingresa el código de Verificación enviado a tu correo</label>
            <input
              type="text"
              id="verificationCode"
              v-model="verificationCode"
              class="form-control input-field verification-input"
              required
            />
          </div>
          <button type="submit" class="btn btn-success w-100 verify-btn">Verificar Código</button>
        </form>

        <p v-if="errorMessage" class="text-danger text-center mt-3">{{ sanitizedErrorMessage }}</p>

        <!-- Mensaje de error -->

        <!-- Botón de restablecer contraseña si la cuenta está bloqueada -->
        <p v-if="errorMessage === 'La cuenta está bloqueada. Inténtalo más tarde.'" class="text-center mt-3">

        </p>
        <p v-if="!isVerifying" class="text-center mt-3">
          <button @click="goToResetPassword" class="btn btn-link btn-forgot-password">¿Olvidaste tu contraseña?</button>
        </p>
      </div>
    </div>
  </div>
</template>

<script>
/* global grecaptcha */
import axios from 'axios';
import validator from 'validator';


export default {
  name: 'UsuarioLogin',
  data() {
    return {
      username: '',
      password: '',
      verificationCode: '',
      errorMessage: '',
      isVerifying: false,
      showPassword: false, // Estado para alternar la visibilidad de la contraseña
    };
  },
  computed: {
    // Escapa el mensaje de error para prevenir posibles XSS
    sanitizedErrorMessage() {
      return validator.escape(this.errorMessage);
    },
  },
  mounted() {
    const recaptchaScript = document.createElement('script');
    recaptchaScript.src = 'https://www.google.com/recaptcha/api.js';
    recaptchaScript.async = true;
    recaptchaScript.defer = true;
    document.body.appendChild(recaptchaScript);
  },
  methods: {
    togglePasswordVisibility() {
      this.showPassword = !this.showPassword;
    },
    async loginUser() {
      try {
        const recaptchaToken = grecaptcha.getResponse();

        if (!recaptchaToken) {
          this.errorMessage = 'Por favor completa el reCAPTCHA';
          return;
        }

        // Validar username y password
        if (!this.isValidUsername(this.username) || !this.isValidPassword(this.password)) {
          this.errorMessage = 'Usuario o contraseña inválidos.';
          grecaptcha.reset(); // Reiniciar el reCAPTCHA en caso de error
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
        grecaptcha.reset();
        console.error('Error en el inicio de sesión:', error);
      }
    },
    isValidUsername(username) {
      return validator.isLength(username, { min: 4, max: 50 }) && validator.isAlphanumeric(username);
    },

    isValidPassword(password) {
      return validator.isLength(password, { min: 8 });
    },

    async verifyCode() {
      console.log('Usuario:', this.username);
      console.log('Código de verificación:', this.verificationCode);

      try {
        const response = await axios.post('https://proyectosin.onrender.com/verify-code', {
          usuarios: this.username,
          codigoVerificacion: this.verificationCode,
        }, {
          withCredentials: true // Asegurarse de que la cookie se envíe con la solicitud
        });
        // Si el token está en el cuerpo de la respuesta, guárdalo
        if (response.data.token) {
            localStorage.setItem('token', response.data.token);
            console.log('Token recibido y almacenado:', response.data.token);
          } else {
            console.error('Token no recibido');
          }

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
    goToResetPassword() {
      this.$router.push({ name: 'reset-password' }); // Cambia 'reset-password' por la ruta correspondiente
    },
  },
};
</script>

<style >
/* Contenedor del formulario */
/* Contenedor general */
.container {
  max-width: 400px;
  /* Ancho máximo del formulario */
  margin: auto;
  /* Centrar el contenedor */
  background-color: #f7f7f7;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
}

/* Títulos */
h1 {
  color: #333;
  text-align: center;
  font-size: 1.5rem;
  margin-bottom: 20px;
}

/* Campos de entrada */
.input-field {
  border: 1px solid #ced4da;
  border-radius: 5px;
  padding: 8px;
  font-size: 0.9rem;
  max-width: 300px;
  /* Ancho máximo de los campos */
  width: 100%;
  /* Asegura que se adapte a dispositivos pequeños */
  margin: 0 auto;
  /* Centrar el campo */
  display: block;
  box-sizing: border-box;
  /* Incluye el padding dentro del ancho */
}

.input-field {
  border: 1px solid #ced4da;
  border-radius: 5px;
  padding: 8px 40px 8px 8px;
  /* Espacio extra a la derecha para el botón */
  font-size: 0.9rem;
  width: 100%;
  box-sizing: border-box;
  /* Asegura que el padding no expanda el campo */
}


.input-field:focus {
  border-color: #007bff;
  outline: none;

}

/* Campo de contraseña con botón dentro */
.form-group {
  position: relative;
  /* Necesario para posicionar elementos dentro */
}

/* Icono de mostrar contraseña */
.password-toggle-btn {
  position: absolute;
  /* Coloca el ojito dentro del campo */
  top: 65%;
  /* Ajusta este valor para mover hacia abajo */
  right: 10px;
  /* Separación del borde derecho */
  transform: translateY(-50%);
  /* Asegura el centrado vertical relativo a la altura */
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
}

.password-toggle-btn i {
  font-size: 1rem;
  /* Tamaño del ícono ajustado */
  color: #333;
}

/* ReCaptcha */
.g-recaptcha {
  margin: 20px 0;
  display: flex;
  justify-content: center;
}

/* Botones */
/* Botón principal (Iniciar Sesión) */
.btn-primary {
  background-color: #09c30f;
  /* Color verde para Iniciar Sesión */
  color: white;
  border: none;
  padding: 12px;
  /* Más grande que el estándar */
  font-size: 1rem;
  /* Texto más grande */
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s ease;
}

.btn-primary:hover {
  background-color: #07a30c;
  /* Verde más oscuro */
}


/* Espaciado entre grupos */
.form-group {
  margin-bottom: 1rem;
  /* Reduce la separación entre campos */
  position: relative;
  /* Necesario para posicionar el ojito */
}

/* Botón secundario (Olvidaste tu contraseña) */
/* Botón de "¿Olvidaste tu contraseña?" */
.btn-forgot-password {
  background: none;
  border: none;
  color: #007bff;
  /* Color azul */
  font-size: 0.9rem;
  text-decoration: none;
  cursor: pointer;
}

.btn-forgot-password:hover {
  color: #0056b3;
  /* Azul más oscuro al pasar el cursor */
  text-decoration: underline;
}
/* Estilos específicos para el formulario de verificación de código */
.verify-code-form {
  border: 1px solid #28a745; /* Borde verde para resaltar */
  padding: 20px; /* Espaciado interno */
  border-radius: 8px; /* Bordes redondeados */
  background-color: #f8f9fa; /* Fondo claro */
}

.verify-code-form h1 {
  font-size: 1.8rem;
  color: #4a4a4a; /* Color neutro para el encabezado */
  text-align: center;
}

.verification-input {
  border: 1px solid #28a745; /* Color del borde verde */
  border-radius: 5px; /* Bordes redondeados */
  padding: 10px; /* Espaciado interno */
  font-size: 1rem; /* Tamaño de la fuente */
  width: 100%; /* Asegura que ocupe todo el ancho */
  margin-bottom: 15px; /* Separación entre campos */
}

.verify-btn {
  background-color: #28a745; /* Fondo verde */
  color: white; /* Texto blanco */
  border: none; /* Sin borde adicional */
  border-radius: 5px; /* Bordes redondeados */
  padding: 12px 20px; /* Tamaño del botón */
  font-size: 1.1rem; /* Tamaño de la fuente */
  width: 100%; /* Botón de ancho completo */
  cursor: pointer; /* Cambiar el cursor al pasar */
}

.verify-btn:hover {
  background-color: #218838; /* Color más oscuro al pasar */
}

.text-danger {
  font-weight: bold; /* Resaltar el texto */
  color: #dc3545; /* Rojo para mensajes de error */
  text-align: center; /* Centrar el mensaje */
  margin-top: 15px;
}

</style>
