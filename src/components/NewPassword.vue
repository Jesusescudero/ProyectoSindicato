<template>
  <div class="container mt-5">
    <div class="row justify-content-center">
      <div class="col-md-6">
        <h1 class="text-center mb-4">Establecer Nueva Contraseña</h1>
        <form @submit.prevent="resetPassword" class="shadow p-4 rounded bg-light">
          <div class="form-group mb-3">
            <label for="newPassword" class="form-label">Nueva Contraseña</label>
            <div class="input-group">
              <input :type="passwordFieldType" id="newPassword" v-model="newPassword" @input="validatePassword"
                class="form-control" required />
              <button type="button" class="btn btn-outline-secondary"
                @click="togglePasswordVisibility('passwordFieldType')">
                <i :class="passwordFieldType === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
            <div class="password-strength-bar mt-2">
              <div :style="{ width: passwordStrengthBarWidth }"></div>
            </div>
            <p v-if="passwordError" class="text-danger">{{ passwordError }}</p>
            <p v-if="passwordStrengthMessage" class="text-info">{{ passwordStrengthMessage }}</p>
          </div>
          <div class="form-group mb-3">
            <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
            <div class="input-group">
              <input :type="confirmPasswordFieldType" id="confirmPassword" v-model="confirmPassword"
                @input="checkPasswordsMatch" class="form-control" required />
              <button type="button" class="btn btn-outline-secondary"
                @click="togglePasswordVisibility('confirmPasswordFieldType')">
                <i :class="confirmPasswordFieldType === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
              </button>
            </div>
            <p v-if="passwordMismatchMessage" class="text-danger">{{ passwordMismatchMessage }}</p>
          </div>
          <button type="submit" class="btn btn-primary w-100" :disabled="!isPasswordValid || !passwordsMatch">
            Restablecer Contraseña
          </button>
        </form>
        <p v-if="message" class="text-success text-center mt-3">{{ message }}</p>
        <p v-if="errorMessage" class="text-danger text-center mt-3">{{ errorMessage }}</p>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';
import zxcvbn from 'zxcvbn';

export default {
  props: {
    token: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      newPassword: '',
      confirmPassword: '',
      confirmPasswordTouched: false,
      message: '',
      errorMessage: '',
      passwordError: '',
      passwordMismatchMessage: '',
      isPasswordValid: false,
      passwordsMatch: false,
      passwordStrengthMessage: '',
      passwordStrengthBarWidth: '0%',
      passwordFieldType: 'password', // Tipo de campo de contraseña
      confirmPasswordFieldType: 'password', // Tipo de campo de confirmación
    };
  },
  methods: {
    validatePassword() {
      const password = this.newPassword;

      // Validar fuerza con zxcvbn
      const passwordStrength = zxcvbn(password);
      this.passwordStrengthBarWidth = (passwordStrength.score / 4) * 100 + '%';
      this.passwordStrengthMessage = this.getPasswordStrengthMessage(
        passwordStrength.score
      );

      if (passwordStrength.score < 2) {
        this.passwordError = 'La contraseña es demasiado débil.';
        this.isPasswordValid = false;
        return;
      }

      // Validaciones adicionales
      if (!/[A-Z]/.test(password)) {
        this.passwordError = 'Debe contener al menos una letra mayúscula.';
        this.isPasswordValid = false;
        return;
      }

      if (!/[a-z]/.test(password)) {
        this.passwordError = 'Debe contener al menos una letra minúscula.';
        this.isPasswordValid = false;
        return;
      }

      if (!/[0-9]/.test(password)) {
        this.passwordError = 'Debe contener al menos un número.';
        this.isPasswordValid = false;
        return;
      }

      if (!/[!@#$%^&*(),.?":{}|<>]/.test(password)) {
        this.passwordError = 'Debe contener al menos un carácter especial.';
        this.isPasswordValid = false;
        return;
      }

      if (this.containsSequentialPattern(password)) {
        this.passwordError =
          'No debe contener patrones de sucesión (ej. "123", "abc").';
        this.isPasswordValid = false;
        return;
      }

      this.passwordError = '';
      this.isPasswordValid = true;

      // Revalidar si coinciden las contraseñas al cambiar la contraseña principal
      this.checkPasswordsMatch();
    },


    containsSequentialPattern(password) {
      const length = password.length;

      for (let i = 0; i < length - 2; i++) {
        const currentChar = password.charCodeAt(i);
        const nextChar = password.charCodeAt(i + 1);
        const nextNextChar = password.charCodeAt(i + 2);

        // Patrón de incremento (ej. "123", "abc")
        if (
          nextChar === currentChar + 1 &&
          nextNextChar === currentChar + 2
        ) {
          return true;
        }

        // Patrón de decremento (ej. "321", "cba")
        if (
          nextChar === currentChar - 1 &&
          nextNextChar === currentChar - 2
        ) {
          return true;
        }
      }

      return false;
    },

    getPasswordStrengthMessage(score) {
      switch (score) {
        case 0:
          return 'Muy débil';
        case 1:
          return 'Débil';
        case 2:
          return 'Aceptable';
        case 3:
          return 'Fuerte';
        case 4:
          return 'Muy fuerte';
        default:
          return '';
      }
    },

    togglePasswordVisibility(field) {
      this[field] = this[field] === 'password' ? 'text' : 'password';
    },

    checkPasswordsMatch() {
      if (this.newPassword !== this.confirmPassword) {
        this.passwordMismatchMessage = "Las contraseñas no coinciden.";
        this.passwordsMatch = false;
      } else {
        this.passwordMismatchMessage = "";
        this.passwordsMatch = true;
      }
    },

    async resetPassword() {
      if (!this.isPasswordValid) {
        this.errorMessage = 'La contraseña no cumple con los requisitos.';
        return;
      }

      if (!this.passwordsMatch) {
        this.errorMessage = 'Las contraseñas no coinciden.';
        return;
      }

      try {
        const response = await axios.post(
          'https://proyectosin.onrender.com/reset-password',
          {
            token: this.token,
            newPassword: this.newPassword,
          }
        );

        if (response.status === 200) {
          this.message = 'Contraseña restablecida con éxito.';
          this.errorMessage = '';
          // Redirigir al usuario a la página de inicio de sesión después de 2 segundos
          setTimeout(() => {
            this.$router.push('/login'); // Reemplaza '/iniciar-sesion' con la ruta de inicio de sesión en tu aplicación
          }, 2000);
        }
      } catch (error) {
        this.errorMessage =
          'Error al restablecer la contraseña. Inténtalo de nuevo.';
        console.error('Error al restablecer la contraseña:', error);
      }
    },
  },
};
</script>

<style scoped>
/* General container styling */
.container {
  max-width: 500px;
  /* Ajustar ancho */
  margin: 0 auto;
  background-color: #f8f9fa;
  border-radius: 10px;
  padding: 20px;
  box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);
}

/* Header styling */
h1 {
  text-align: center;
  font-size: 1.6rem;
  font-weight: bold;
  margin-bottom: 1rem;
  color: #333;
}

/* Form labels */
.form-label {
  font-size: 0.9rem;
  /* Más pequeño */
  font-weight: 600;
  color: #495057;
}

/* Input fields styling */
.form-control {
  font-size: 0.9rem;
  /* Reducir fuente */
  height: 1.5rem;
  /* Reducir altura */
  border-radius: 5px;
  box-shadow: none;
}

/* Input group button for toggling password visibility */


.input-group .input-group-text i {
  font-size: 1.1rem;
  /* Tamaño ajustado del ícono */
  color: #6c757d;
}

.input-group .input-group-text:hover i {
  color: #495057;
}

/* Password strength message */
small {
  font-size: 0.85rem;
}

/* Error styling */
.text-danger {
  color: #dc3545;
  font-size: 0.9rem;
  margin-top: 5px;
}

/* Submit button styling */
.btn-success {
  font-size: 1rem;
  height: 2.6rem;
  /* Botón más compacto */
  border-radius: 5px;
  font-weight: bold;
  text-transform: uppercase;
  background-color: #28a745;
  border-color: #28a745;
}

.btn-success:hover {
  background-color: #218838;
  border-color: #1e7e34;
}

.password-toggle-btn {
  background: none;
  /* Quita el fondo */
  border: none;
  /* Quita el borde */
  padding: 0;
  /* Quita el padding interno */
  position: absolute;
  /* Posiciona el botón */
  right: 10px;
  /* Ajusta al lado derecho del campo */
  top: 50%;
  transform: translateY(-50%);
  /* Centra verticalmente */
  cursor: pointer;
  color: #6c757d;
  /* Color del ícono */
  font-size: 1.2rem;
  /* Tamaño del ícono */
}

/* Posicionar el ojito dentro del campo */
.password-toggle {
  position: absolute;
  right: 10px;
  /* Ajustar distancia del borde derecho */
  top: 50%;
  transform: translateY(-50%);
  cursor: pointer;
  font-size: 1.2rem;
  /* Tamaño del ícono */
  color: #6c757d;
  /* Color del ojito */
  z-index: 10;
}

/* Cambiar color al pasar el mouse */
.password-toggle:hover {
  color: #495057;
}

/* Ajustar padding del campo de texto para evitar superposición con el ojito */
.form-control {
  padding-right: 2.5rem;
  /* Espacio suficiente para el ícono */
}
</style>
