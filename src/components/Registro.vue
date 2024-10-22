<template>
    <div class="registration-container">
        <h1>Registro</h1>

        <form @submit.prevent="handleSubmit" class="registration-form">
            <div v-if="step === 1">
                <label for="firstName">Nombre</label>
            <input type="text" id="firstName" v-model="firstName" required />
            <p v-if="firstNameError" class="error-message">{{ firstNameError }}</p>

            <label for="lastName">Apellido Paterno</label>
            <input type="text" id="lastName" v-model="lastName" required />
            <p v-if="lastNameError" class="error-message">{{ lastNameError }}</p>

            <label for="motherLastName">Apellido Materno</label>
            <input type="text" id="motherLastName" v-model="motherLastName" required />
            <p v-if="motherLastNameError" class="error-message">{{ motherLastNameError }}</p>

            <label for="phoneNumber">Número de Teléfono</label>
            <input type="tel" id="phoneNumber" v-model="phoneNumber" required />
            <p v-if="phoneNumberError" class="error-message">{{ phoneNumberError }}</p>

            <label for="email">Correo Electrónico</label>
            <input type="email" id="email" v-model="email" required />
            <p v-if="emailError" class="error-message">{{ emailError }}</p>

            <button type="button" class="btn btn-primary" @click="nextStep">Siguiente</button>
            </div>
            


            <div v-if="step === 2">
                <h2>Información Académica</h2>

                <label for="position">Puesto</label>
                <input type="text" id="position" v-model="position" required />
                <p v-if="positionError" class="error-message">{{ positionError }}</p>

                <label for="hasMaster">¿Tiene Maestría?</label>
                <select id="hasMaster" v-model="hasMaster" required>
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                </select>

                <label v-if="hasMaster === 'si'" for="masterName">Nombre de la Maestría</label>
                <input v-if="hasMaster === 'si'" type="text" id="masterName" v-model="masterName" />

                <label for="hasDoctorate">¿Tiene Doctorado?</label>
                <select id="hasDoctorate" v-model="hasDoctorate" required>
                    <option value="no">No</option>
                    <option value="si">Sí</option>
                </select>

                <label v-if="hasDoctorate === 'si'" for="doctorateName">Nombre del Doctorado</label>
                <input v-if="hasDoctorate === 'si'" type="text" id="doctorateName" v-model="doctorateName" />

                <label for="isGraduated">¿Está titulado o es pasante?</label>
                <select id="isGraduated" v-model="isGraduated" required>
                    <option value="Titulado">Titulado</option>
                    <option value="Pasante">Pasante</option>
                </select>
                <p v-if="graduationError" class="error-message">{{ graduationError }}</p>

                <label for="employeeNumber">Número de Trabajador</label>
                <input type="text" id="employeeNumber" v-model="employeeNumber" required />
                <p v-if="employeeNumberError" class="error-message">{{ employeeNumberError }}</p>

                <label for="unionNumber">Número de Sindicalizado</label>
                <input type="text" id="unionNumber" v-model="unionNumber" required />
                <p v-if="unionNumberError" class="error-message">{{ unionNumberError }}</p>

                <button type="button" class="btn btn-primary" @click="nextStep">Siguiente</button>
            </div>


            <div v-if="step === 3">
                <h2>Credenciales de Acceso</h2>
                <label for="username">Usuario</label>
                <input type="text" id="username" v-model="username" required />

                <label for="password">Contraseña</label>
                <input type="password" id="password" v-model="password" @input="evaluatePassword" required />
                <div :style="{ width: passwordStrengthBarWidth }" class="password-strength-bar"></div>
                <p v-if="passwordStrengthMessage">{{ passwordStrengthMessage }}</p>
                <p v-if="passwordTooWeakMessage" class="error-message">{{ passwordTooWeakMessage }}</p>

                <label for="confirmPassword">Confirmar Contraseña</label>
                <input type="password" id="confirmPassword" v-model="confirmPassword" @input="checkPasswordsMatch"
                    required />
                <p v-if="passwordMismatchMessage" class="error-message">{{ passwordMismatchMessage }}</p>


                <button type="submit" class="btn btn-success" @click="register">Registrar</button>
            </div>
        </form>
        <p v-if="errorMessage" class="error-message">{{ errorMessage }}</p>
        <p v-if="successMessage" class="success-message">{{ successMessage }}</p>
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
        };
    },

    methods: {


        nextStep() {
            if (this.step === 1) {
                if (this.validateStep1()) {
                    this.step++;
                }
            } else if (this.step === 2) {
                if (this.validateStep2()) {
                    this.step++;
                }
            }
        },

        // Validaciones del primer paso
        validateStep1() {
            // Resetear errores
            this.firstNameError = '';
            this.lastNameError = '';
            this.motherLastNameError = '';
            this.phoneNumberError = '';
            this.emailError = '';

            // Validar nombre
            if (!/^[a-zA-Z\s]+$/.test(this.firstName) || this.firstName.length < 2 || this.firstName.length > 50) {
                this.firstNameError = 'Nombre inválido. Debe contener solo letras y tener entre 2 y 50 caracteres.';
                return false;
            }

            // Validar apellido paterno
            if (!/^[a-zA-Z\s]+$/.test(this.lastName) || this.lastName.length < 2 || this.lastName.length > 50) {
                this.lastNameError = 'Apellido paterno inválido. Debe contener solo letras y tener entre 2 y 50 caracteres.';
                return false;
            }

            // Validar apellido materno (opcional)
            if (!/^[a-zA-Z\s]*$/.test(this.motherLastName) || this.motherLastName.length > 50) {
                this.motherLastNameError = 'Apellido materno inválido. Debe contener solo letras y tener hasta 50 caracteres.';
                return false;
            }

            // Validar teléfono
            if (!/^\d{10}$/.test(this.phoneNumber)) {
                this.phoneNumberError = 'Teléfono inválido. Debe ser un número de 10 dígitos.';
                return false;
            }

            // Validar correo electrónico
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
                this.emailError = 'Correo electrónico inválido.';
                return false;
            }

            return true; // Si todas las validaciones pasan
        },

        // Validaciones del segundo paso
        validateStep2() {
            // Validar puesto
            if (!/^[a-zA-Z\s]+$/.test(this.position) || this.position.length < 2 || this.position.length > 100) {
                alert('Puesto inválido. Debe contener solo letras y tener entre 2 y 100 caracteres.');
                return false;
            }

            // Validar si está titulado o es pasante
            if (this.isGraduated !== 'Titulado' && this.isGraduated !== 'Pasante') {
                alert('Debe seleccionar si está titulado o es pasante.');
                return false;
            }

            // Validar número de trabajador
            if (!/^\d+$/.test(this.employeeNumber) || this.employeeNumber.length < 1 || this.employeeNumber.length > 20) {
                alert('Número de trabajador inválido. Debe ser un número.');
                return false;
            }

            // Validar número de sindicalizado
            if (!/^\d+$/.test(this.unionNumber) || this.unionNumber.length < 1 || this.unionNumber.length > 20) {
                alert('Número de sindicalizado inválido. Debe ser un número.');
                return false;
            }

            return true; // Si todas las validaciones pasan
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

                });
                console.log(response.data);

                if (response.status === 200) {
                    this.successMessage = 'Registro exitoso. ¡Bienvenido!';
                    this.errorMessage = '';
                    this.resetForm(); // Opcional: Resetear el formulario
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
    max-width: 600px;
    margin: 0 auto;
}

.registration-form {
    display: flex;
    flex-direction: column;
}

.password-strength-bar {
    height: 5px;
    background-color: green;
    /* Cambia el color según la fuerza */
}

.error-message {
    color: red;
}

.success-message {
    color: green;
}
</style>