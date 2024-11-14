<template>
    <div class="container mt-5">
        <div class="card shadow-lg p-4 rounded">
            <h2 class="text-center mb-4">Registro de Usuario</h2>

            <form @submit.prevent="handleSubmit">
                <div v-if="step === 1" class="animate__animated animate__fadeIn">
                    <h4 class="mb-3">Datos Personales</h4>

                    <div class="mb-3">
                        <label for="firstName" class="form-label">Nombre</label>
                        <input type="text" id="firstName" v-model="firstName" class="form-control" required />
                        <p v-if="firstNameError" class="text-danger">{{ firstNameError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="lastName" class="form-label">Apellido Paterno</label>
                        <input type="text" id="lastName" v-model="lastName" class="form-control" required />
                        <p v-if="lastNameError" class="text-danger">{{ lastNameError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="motherLastName" class="form-label">Apellido Materno</label>
                        <input type="text" id="motherLastName" v-model="motherLastName" class="form-control" required />
                        <p v-if="motherLastNameError" class="text-danger">{{ motherLastNameError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="phoneNumber" class="form-label">Número de Teléfono</label>
                        <input type="tel" id="phoneNumber" v-model="phoneNumber" class="form-control" required />
                        <p v-if="phoneNumberError" class="text-danger">{{ phoneNumberError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Correo Electrónico</label>
                        <input type="email" id="email" v-model="email" class="form-control" required />
                        <p v-if="emailError" class="text-danger">{{ emailError }}</p>
                    </div>

                    <button type="button" class="btn btn-primary w-100" @click="nextStep">Siguiente</button>
                </div>

                <div v-if="step === 2" class="animate__animated animate__fadeIn">
                    <h4 class="mb-3">Información Académica</h4>

                    <div class="mb-3">
                        <label for="position" class="form-label">Puesto</label>
                        <input type="text" id="position" v-model="position" class="form-control" required />
                        <p v-if="positionError" class="text-danger">{{ positionError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="hasMaster" class="form-label">¿Tiene Maestría?</label>
                        <select id="hasMaster" v-model="hasMaster" class="form-select" required>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>

                    <div v-if="hasMaster === 'si'" class="mb-3">
                        <label for="masterName" class="form-label">Nombre de la Maestría</label>
                        <input type="text" id="masterName" v-model="masterName" class="form-control" />
                    </div>

                    <div class="mb-3">
                        <label for="hasDoctorate" class="form-label">¿Tiene Doctorado?</label>
                        <select id="hasDoctorate" v-model="hasDoctorate" class="form-select" required>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>

                    <div v-if="hasDoctorate === 'si'" class="mb-3">
                        <label for="doctorateName" class="form-label">Nombre del Doctorado</label>
                        <input type="text" id="doctorateName" v-model="doctorateName" class="form-control" />
                    </div>

                    <div class="form-group row">
                        <label for="isGraduated" class="col-sm-4 col-form-label">¿Está titulado o es pasante?</label>
                        <div class="col-sm-8">
                            <select id="isGraduated" v-model="isGraduated" class="form-control" required>
                                <option value="Titulado">Titulado</option>
                                <option value="Pasante">Pasante</option>
                            </select>
                            <p v-if="graduationError" class="text-danger">{{ graduationError }}</p>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="employeeNumber">Número de Trabajador</label>
                        <input type="text" id="employeeNumber" v-model="employeeNumber" class="form-control" required />
                        <p v-if="employeeNumberError" class="text-danger">{{ employeeNumberError }}</p>
                    </div>

                    <div class="form-group">
                        <label for="unionNumber">Número de Sindicalizado</label>
                        <input type="text" id="unionNumber" v-model="unionNumber" class="form-control" required />
                        <p v-if="unionNumberError" class="text-danger">{{ unionNumberError }}</p>
                    </div>

                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" @click="previousStep">Anterior</button>
                        <button type="button" class="btn btn-primary" @click="nextStep">Siguiente</button>
                    </div>
                </div>

                <div v-if="step === 3" class="animate__animated animate__fadeIn">
                    <h4 class="mb-3">Credenciales de Acceso</h4>

                    <div class="mb-3">
                        <label for="username" class="form-label">Usuario</label>
                        <input type="text" id="username" v-model="username" class="form-control" required />
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <input type="password" id="password" v-model="password" @input="evaluatePassword"
                            class="form-control" required />
                        <div :style="{ width: passwordStrengthBarWidth }" class="password-strength-bar mt-2"></div>
                        <p v-if="passwordStrengthMessage" class="text-info">{{ passwordStrengthMessage }}</p>
                        <p v-if="passwordTooWeakMessage" class="text-danger">{{ passwordTooWeakMessage }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                        <input type="password" id="confirmPassword" v-model="confirmPassword"
                            @input="checkPasswordsMatch" class="form-control" required />
                        <p v-if="passwordMismatchMessage" class="text-danger">{{ passwordMismatchMessage }}</p>
                    </div>

                    <div class="d-flex justify-content-between">
                        <button type="button" class="btn btn-secondary" @click="previousStep">Anterior</button>
                        <button type="submit" class="btn btn-success">Registrar</button>
                    </div>
                </div>
            </form>

            <p v-if="errorMessage" class="text-danger text-center mt-3">{{ errorMessage }}</p>
            <p v-if="successMessage" class="text-success text-center mt-3">{{ successMessage }}</p>
        </div>
    </div>
</template>


<script>

import zxcvbn from 'zxcvbn';
import axios from 'axios';


export default {
    name: 'UsuarioRegister',
    data() {
        return {
            firstName: '',
            lastName: '',
            motherLastName: '',
            phoneNumber: '',
            email: '', // Añade esta línea
            position: '',
            hasMaster: 'no',
            masterName: '',
            hasDoctorate: 'no',
            doctorateName: '',
            isGraduated: 'graduated',
            employeeNumber: '',
            unionNumber: '',
            username: '',
            password: '',
            confirmPassword: '',
            errorMessage: '',
            successMessage: '',
            passwordStrengthMessage: '',
            passwordStrengthBarWidth: '0%',
            passwordTooWeakMessage: '',
            isPasswordStrong: false,
            passwordsMatch: true,
            passwordMismatchMessage: '',

            firstNameError: '',
            lastNameError: '',
            motherLastNameError: '',
            phoneNumberError: '',
            emailError: '',
            positionError: '',
            graduationError: '',
            employeeNumberError: '',
            unionNumberError: '',
            step: 1,
            csrfToken: '',
        };
    },

    
    methods: {

        sanitizeInput(input) {
            return input.replace(/[<>/\\{}()"'`]/g, ''); // Elimina caracteres peligrosos
        },


        // Manejo del cambio de paso
        nextStep() {
            if (this.step === 1) {
                if (this.validateStep1()) {
                    this.step++;
                }
            } else if (this.step === 2) {
                if (this.validateStep2()) {
                    this.step++;
                }
            } else if (this.step === 3) {
                if (this.validateStep3()) {
                    this.handleSubmit(); // Llama a la función de envío de datos si se validó el último paso
                }
            }
        },
        previousStep() {
            if (this.step > 1) {
                this.step--;
            }
        },

        // Validaciones del primer paso
        // Validaciones y sanitización del primer paso
        validateStep1() {
            // Resetear errores
            this.firstNameError = '';
            this.lastNameError = '';
            this.motherLastNameError = '';
            this.phoneNumberError = '';
            this.emailError = '';

            // Sanitizar las entradas antes de validar
            this.firstName = this.sanitizeInput(this.firstName);
            this.lastName = this.sanitizeInput(this.lastName);
            this.motherLastName = this.sanitizeInput(this.motherLastName);
            this.phoneNumber = this.sanitizeInput(this.phoneNumber);
            this.email = this.sanitizeInput(this.email);

            // Validaciones
            if (!/^[a-zA-Z\s]+$/.test(this.firstName) || this.firstName.length < 2 || this.firstName.length > 50) {
                this.firstNameError = 'Nombre inválido. Debe contener solo letras y tener entre 2 y 50 caracteres.';
                return false;
            }

            if (!/^[a-zA-Z\s]+$/.test(this.lastName) || this.lastName.length < 2 || this.lastName.length > 50) {
                this.lastNameError = 'Apellido paterno inválido. Debe contener solo letras y tener entre 2 y 50 caracteres.';
                return false;
            }

            if (!/^[a-zA-Z\s]*$/.test(this.motherLastName) || this.motherLastName.length > 50) {
                this.motherLastNameError = 'Apellido materno inválido. Debe contener solo letras y tener hasta 50 caracteres.';
                return false;
            }

            if (!/^\d{10}$/.test(this.phoneNumber)) {
                this.phoneNumberError = 'Teléfono inválido. Debe ser un número de 10 dígitos.';
                return false;
            }

            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
                this.emailError = 'Correo electrónico inválido.';
                return false;
            }

            return true; // Si todas las validaciones pasan
        },

        // Validaciones y sanitización del segundo paso
        validateStep2() {
            this.position = this.sanitizeInput(this.position);
            this.employeeNumber = this.sanitizeInput(this.employeeNumber);
            this.unionNumber = this.sanitizeInput(this.unionNumber);

            if (!/^[a-zA-Z\s]+$/.test(this.position) || this.position.length < 2 || this.position.length > 100) {
                alert('Puesto inválido. Debe contener solo letras y tener entre 2 y 100 caracteres.');
                return false;
            }

            if (this.isGraduated !== 'Titulado' && this.isGraduated !== 'Pasante') {
                alert('Debe seleccionar si está titulado o es pasante.');
                return false;
            }

            if (!/^\d+$/.test(this.employeeNumber) || this.employeeNumber.length < 1 || this.employeeNumber.length > 20) {
                alert('Número de trabajador inválido. Debe ser un número.');
                return false;
            }

            if (!/^\d+$/.test(this.unionNumber) || this.unionNumber.length < 1 || this.unionNumber.length > 20) {
                alert('Número de sindicalizado inválido. Debe ser un número.');
                return false;
            }

            return true; // Si todas las validaciones pasan
        },

        // Validaciones y sanitización del tercer paso (usuario y contraseña)
        validateStep3() {
            this.username = this.sanitizeInput(this.username);

            if (!this.username || this.username.length < 4) {
                alert('El nombre de usuario debe tener al menos 4 caracteres.');
                return false;
            }

            // Verificación de contraseña (ya tienes esta lógica en evaluatePassword)
            this.evaluatePassword();
            if (!this.isPasswordStrong) {
                this.errorMessage = 'La contraseña es demasiado débil.';
                return false;
            }

            // Verificar si las contraseñas coinciden
            this.checkPasswordsMatch();
            if (!this.passwordsMatch) {
                this.errorMessage = 'Las contraseñas no coinciden.';
                return false;
            }

            return true;
        },


        evaluatePassword() {
            const password = this.password;
            const passwordStrength = zxcvbn(password);

            // Actualizar la barra de progreso de fortaleza
            this.passwordStrengthBarWidth = (passwordStrength.score / 4) * 100 + '%';
            this.passwordStrengthMessage = this.getPasswordStrengthMessage(passwordStrength.score);

            // Advertencia visual, pero no bloqueo del registro
            if (passwordStrength.score < 2) {
                this.passwordTooWeakMessage = 'Advertencia: La contraseña es débil.';
            } else {
                this.passwordTooWeakMessage = '';
            }

            // Ya no se bloquea el registro, solo se muestra la advertencia
            this.isPasswordStrong = true; // Siempre permite registrar
        },

        async validatePassword() {
            // 1. Longitud mínima
            if (this.password.length < 8) {
                this.errorMessage = 'La contraseña debe tener al menos 8 caracteres.';
                return false;
            }

            // 2. Detección de patrones comunes
            const commonPasswords = ['123456', 'password', '12345678', 'qwerty', 'abc123', 'letmein'];
            if (commonPasswords.includes(this.password)) {
                this.errorMessage = 'La contraseña es demasiado común.';
                return false;
            }

            // 3. Verificación de contraseñas comprometidas
            const isCompromised = await this.checkPasswordCompromised(this.password);
            if (isCompromised) {
                this.errorMessage = 'La contraseña ha sido comprometida. Por favor, elige otra.';
                return false;
            }

            this.errorMessage = ''; // Si todas las validaciones son correctas
            return true;
        },

        async checkPasswordCompromised(password) {
            const passwordHash = await this.hashPassword(password);
            const prefix = passwordHash.slice(0, 5);
            const suffix = passwordHash.slice(5);
            try {
                const response = await axios.get(`https://api.pwnedpasswords.com/range/${prefix}`);
                const data = response.data;
                const isCompromised = data.split('\n').some(line => line.startsWith(suffix));
                return isCompromised;
            } catch (error) {
                console.error('Error al verificar la contraseña:', error);
                return false;
            }
        },

        async hashPassword(password) {
            const encoder = new TextEncoder();
            const data = encoder.encode(password);
            const hash = await crypto.subtle.digest('SHA-1', data);
            return Array.from(new Uint8Array(hash)).map(b => ('0' + b.toString(16)).slice(-2)).join('');
        },

        getPasswordStrengthMessage(score) {
            switch (score) {
                case 0:
                    return 'Contraseña muy débil';
                case 1:
                    return 'Contraseña débil';
                case 2:
                    return 'Contraseña media';
                case 3:
                    return 'Contraseña fuerte';
                case 4:
                    return 'Contraseña muy fuerte';
                default:
                    return '';
            }
        },

        checkPasswordsMatch() {
            if (this.password !== this.confirmPassword) {
                this.passwordMismatchMessage = 'Las contraseñas no coinciden.';
            } else {
                this.passwordMismatchMessage = ''; // Limpiar el mensaje si coinciden
            }
        },
        watch: {
            // Monitorea cambios en ambas contraseñas
            password() {
                this.checkPasswordsMatch();
            },
            confirmPassword() {
                this.checkPasswordsMatch();
            }
        },


        async registerUser() {
            const isPasswordValid = await this.validatePassword();
            if (!isPasswordValid) {
                return; // Si la contraseña no es válida, salir de la función
            }

            try {
                console.log({
                    nombre: this.firstName,
                    apellidoPaterno: this.lastName,
                    apellidoMaterno: this.motherLastName,
                    telefono: this.phoneNumber,
                    correo: this.email,
                    puesto: this.position,
                    tieneMaestria: this.hasMaster,
                    nombreMaestria: this.masterName,
                    tieneDoctorado: this.hasDoctorate,
                    nombreDoctorado: this.doctorateName,
                    estatus: this.isGraduated,
                    numeroTrabajador: this.employeeNumber,
                    numeroSindicalizado: this.unionNumber,
                    usuarios: this.username,
                    password: this.password,

                });
                const response = await axios.post('https://proyectosin.onrender.com/register', {
                    nombre: this.firstName,
                    apellidoPaterno: this.lastName,
                    apellidoMaterno: this.motherLastName,
                    telefono: this.phoneNumber,
                    correo: this.email,
                    puesto: this.position,
                    tieneMaestria: this.hasMaster,
                    nombreMaestria: this.masterName,
                    tieneDoctorado: this.hasDoctorate,
                    nombreDoctorado: this.doctorateName,
                    estatus: this.isGraduated,
                    numeroTrabajador: this.employeeNumber,
                    numeroSindicalizado: this.unionNumber,
                    usuarios: this.username,
                    password: this.password,

                },
                    {
                        headers: {
                            'X-CSRF-Token': this.csrfToken, // Incluir el token CSRF en los encabezados
                        },
                        withCredentials: true, // Permitir el envío de cookies
                    }
                );
                console.log(response.data);

                if (response.status === 200) {
                    this.successMessage = 'Registro exitoso. Se ha enviado un correo de verificación.';
                    this.errorMessage = '';
                    this.resetForm(); // Opcional: Resetear el formulario

                    // Redirigir al usuario a la página de inicio de sesión después de unos segundos
                    setTimeout(() => {
                        this.$router.push('/login');
                    }, 3000); // 3 segundos de retraso antes de redirigir
                }
            } catch (error) {
                if (error.response?.data.includes('comprometida')) {
                    this.errorMessage = 'La contraseña ha sido comprometida en una filtración. Por favor, elige una contraseña diferente.';
                } else {
                    this.errorMessage = error.response?.data || 'Error en el registro.';
                }
                this.successMessage = '';
            }
        },



        async handleSubmit() {
            // Verificar si las contraseñas coinciden antes de registrar
            this.checkPasswordsMatch();

            // Si las contraseñas no coinciden, no se puede proceder
            if (!this.passwordsMatch) {
                this.errorMessage = 'Las contraseñas no coinciden.';
                return; // No permitir registro si no coinciden
            }

            // Continúa con el registro solo si las contraseñas coinciden
            const isPasswordValid = await this.validatePassword();
            if (!isPasswordValid) {
                return; // Si la contraseña no es válida, salir de la función
            }

            // Llamar a la función para registrar el usuario
            await this.registerUser();
        },

        resetForm() {
            this.firstName = '';
            this.lastName = '';
            this.motherLastName = '';
            this.phoneNumber = '';
            this.email = '';
            this.position = '';
            this.hasMaster = 'no';
            this.masterName = '';
            this.hasDoctorate = 'no';
            this.doctorateName = '';
            this.isGraduated = 'graduated';
            this.employeeNumber = '';
            this.unionNumber = '';
            this.username = '';
            this.password = '';
            this.confirmPassword = '';
            this.step = 1; // Reiniciar a la primera sección
        },
    },
};
</script>

<style scoped>
.registration-container {
    max-width: 500px;
    margin: 0 auto;
    background-color: #f8f9fa;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.step-title {
    text-align: center;
    font-size: 1.5rem;
    margin-bottom: 1.5rem;
    color: #333;
}

.card {
    animation: fadeIn 1s;
}

.btn {
    padding: 10px 20px;
    font-size: 16px;
}

.btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
}

.btn-success {
    background-color: #28a745;
    border-color: #28a745;
}

.btn-primary {
    background-color: #007bff;
    border-color: #007bff;
}

.btn-primary,
.btn-secondary,
.btn-success {
    width: 48%;
    /* Hace que los botones ocupen la mitad del espacio cada uno */
    text-align: center;
}

.password-strength-bar {
    height: 5px;
    background-color: green;
}

.animate__fadeIn {
    animation: fadeIn 0.5s ease-in-out;
}

@keyframes fadeIn {
    0% {
        opacity: 0;
        transform: translateY(-10px);
    }

    100% {
        opacity: 1;
        transform: translateY(0);
    }
}

.error-message {
    color: red;
    font-size: 0.9rem;
}

.success-message {
    color: green;
    font-size: 1rem;
}

.text-info {
    font-size: 0.9rem;
}
</style>