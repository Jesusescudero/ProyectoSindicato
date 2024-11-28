<template>
    <div class="container mt-5">
        <div class="card shadow-lg p-4 rounded">
            <h2 class="text-center mb-4">Registro de Usuario</h2>

            <form @submit.prevent="handleSubmit">
                <div v-if="step === 1" class="animate__animated animate__fadeIn">
                    <h4 class="mb-3">Datos Personales</h4>

                    <div class="mb-3">
                        <label for="firstName" class="form-label">Nombre</label>
                        <input type="text" id="firstName" v-model="firstName" @input="validateFirstName"
                            class="form-control" required />
                        <p v-if="firstNameError" class="text-danger">{{ firstNameError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="lastName" class="form-label">Apellido Paterno</label>
                        <input type="text" id="lastName" v-model="lastName" @input="validateLastName"
                            class="form-control" required />
                        <p v-if="lastNameError" class="text-danger">{{ lastNameError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="motherLastName" class="form-label">Apellido Materno</label>
                        <input type="text" id="motherLastName" v-model="motherLastName" @input="validateMotherLastName"
                            class="form-control" required />
                        <p v-if="motherLastNameError" class="text-danger">{{ motherLastNameError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="phoneNumber" class="form-label">Número de Teléfono</label>
                        <input type="tel" id="phoneNumber" v-model="phoneNumber" @input="validatePhoneNumber"
                            class="form-control" required />
                        <p v-if="phoneNumberError" class="text-danger">{{ phoneNumberError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="email" class="form-label">Correo Electrónico</label>
                        <input type="email" id="email" v-model="email" @input="validateEmail" class="form-control"
                            required />
                        <p v-if="emailError" class="text-danger">{{ emailError }}</p>
                    </div>

                    <button type="button" class="btn btn-primary w-100" @click="nextStep">Siguiente</button>
                </div>

                <div v-if="step === 1.5" class="animate__animated animate__fadeIn">
                    <h4 class="mb-3">Verificación de Correo</h4>
                    <p>Por favor, introduce el código de verificación enviado a tu correo electrónico.</p>

                    <div class="mb-3">
                        <label for="verificationCode" class="form-label">Código de Verificación</label>
                        <input type="text" id="verificationCode" v-model="verificationCode" class="form-control"
                            maxlength="6" required />
                        <p v-if="verificationError" class="text-danger">{{ verificationError }}</p>
                    </div>



                    <button type="button" class="btn btn-primary w-100 mt3" @click="validateVerificationCode">Validar
                        Código</button>
                    <button type="button" class="btn btn-secondary w-100 mt-3" @click="previousStep">Regresar</button>
                </div>



                <div v-if="step === 2" class="animate__animated animate__fadeIn">
                    <h4 class="mb-3">Información Académica</h4>

                    <div class="mb-3">
                        <label for="position" class="form-label">Seleccione un puesto</label>
                        <!-- Dropdown dinámico para seleccionar el puesto -->
                        <select id="position" v-model="selectedPosition" class="form-select" @change="validatePosition"
                            required>
                            <option disabled value="">Seleccione un puesto</option>
                            <option v-for="puesto in puestos" :key="puesto.id" :value="puesto.id">
                                {{ puesto.nombre }}
                            </option>
                        </select>
                        <p v-if="errorPosition" class="text-danger">{{ errorPosition }}</p>
                    </div>

                    <div class="form-group row">
                        <label for="isGraduated" class="col-sm-4 col-form-label">¿Está titulado o es pasante?</label>
                        <div class="col-sm-8">
                            <select id="isGraduated" v-model="isGraduated" @change="validateGraduation"
                                class="form-control" required>
                                <option value="Titulado">Titulado</option>
                                <option value="Pasante">Pasante</option>
                            </select>
                            <p v-if="graduationError" class="text-danger">{{ graduationError }}</p>
                        </div>
                    </div>

                    <div v-if="isGraduated === 'Titulado'" class="mb-3">
                        <label for="titulo" class="form-label">¿En qué estás titulado?</label>
                        <input type="text" id="titulo" v-model="titulo" @input="validateTitulo" class="form-control"
                            required />
                        <p v-if="tituloError" class="text-danger">{{ tituloError }}</p>
                    </div>

                    <div v-if="isGraduated === 'Pasante'" class="mb-3">
                        <label for="carrera" class="form-label">¿De qué carrera eres pasante?</label>
                        <input type="text" id="carrera" v-model="carrera" @input="validateCarrera" class="form-control"
                            required />
                        <p v-if="carreraError" class="text-danger">{{ carreraError }}</p>
                    </div>



                    <div class="mb-3">
                        <label for="hasMaster" class="form-label">¿Tiene Maestría?</label>
                        <select id="hasMaster" v-model="hasMaster" @change="handleHasMasterChange" class="form-select"
                            required>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>

                    <div v-if="hasMaster === 'si'" class="mb-3">
                        <label for="masterName" class="form-label">Nombre de la Maestría</label>
                        <input type="text" id="masterName" v-model="masterName" @input="validateMasterName"
                            @focus="masterNameTouched = true" class="form-control" />
                        <p v-if="masterNameError" class="text-danger">{{ masterNameError }}</p>
                    </div>

                    <div v-if="hasMaster === 'si'" class="mb-3">
                        <label for="hasDoctorate" class="form-label">¿Tiene Doctorado?</label>
                        <select id="hasDoctorate" v-model="hasDoctorate" @change="validateHasDoctorate"
                            class="form-select" required>
                            <option value="no">No</option>
                            <option value="si">Sí</option>
                        </select>
                    </div>

                    <!-- Cambiar aquí la condición para incluir `hasMaster === 'si'` -->
                    <div v-if="hasMaster === 'si' && hasDoctorate === 'si'" class="mb-3">
                        <label for="doctorateName" class="form-label">Nombre del Doctorado</label>
                        <input type="text" id="doctorateName" v-model="doctorateName" @input="validateDoctorateName"
                            @focus="doctorateNameTouched = true" class="form-control" />
                        <p v-if="doctorateNameError" class="text-danger">{{ doctorateNameError }}</p>
                    </div>


                    <div class="form-group">
                        <label for="employeeNumber">Número de Trabajador</label>
                        <input type="text" id="employeeNumber" v-model="employeeNumber" @input="validateEmployeeNumber"
                            class="form-control" required />
                        <p v-if="employeeNumberError" class="text-danger">{{ employeeNumberError }}</p>
                    </div>

                    <div class="form-group">
                        <label for="unionNumber">Número de Sindicalizado</label>
                        <input type="text" id="unionNumber" v-model="unionNumber" @input="validateUnionNumber"
                            class="form-control" required />
                        <p v-if="unionNumberError" class="text-danger">{{ unionNumberError }}</p>
                    </div>

                    <!-- Botones de navegación -->
                    <div class="button-group mt-4">
                        <button type="button" class="btn btn-secondary" @click="previousStep">Anterior</button>
                        <button type="button" class="btn btn-primary" @click="nextStep">Siguiente</button>
                    </div>
                </div>


                <div v-if="step === 3" class="animate__animated animate__fadeIn">
                    <h4 class="mb-3">Credenciales de Acceso</h4>

                    <div class="mb-3">
                        <label for="username" class="form-label">Usuario</label>
                        <input type="text" id="username" v-model="username" class="form-control"
                            @input="validateUsername" required />
                        <p v-if="usernameError" class="text-danger">{{ usernameError }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="password" class="form-label">Contraseña</label>
                        <div class="input-group">
                            <input :type="passwordFieldType" id="password" v-model="password" @input="evaluatePassword"
                                class="form-control" required />
                            <span class="input-group-text" @click="togglePasswordVisibility" style="cursor: pointer">
                                <i :class="passwordFieldType === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                            </span>
                        </div>
                        <div :style="{ width: passwordStrengthBarWidth }" class="password-strength-bar mt-2"></div>
                        <p v-if="passwordStrengthMessage" class="text-info">{{ passwordStrengthMessage }}</p>
                        <p v-if="passwordTooWeakMessage" class="text-danger">{{ passwordTooWeakMessage }}</p>
                    </div>

                    <div class="mb-3">
                        <label for="confirmPassword" class="form-label">Confirmar Contraseña</label>
                        <div class="input-group">
                            <input :type="confirmPasswordFieldType" id="confirmPassword" v-model="confirmPassword"
                                @input="checkPasswordsMatch" class="form-control" required />
                            <span class="input-group-text" @click="toggleConfirmPasswordVisibility"
                                style="cursor: pointer">
                                <i
                                    :class="confirmPasswordFieldType === 'password' ? 'fas fa-eye' : 'fas fa-eye-slash'"></i>
                            </span>
                        </div>
                        <p v-if="passwordMismatchMessage" class="text-danger">{{ passwordMismatchMessage }}</p>
                    </div>

                    <div class="d-flex justify-content-between custom-gap">
                        <button type="button" class="btn btn-secondary" @click="previousStep">Anterior</button>

                        <button type="submit" class="btn btn-success" :disabled="isSubmitting">Registrar</button>
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
            masterNameError: '',
            doctorateNameError: '',
            isGraduated: '', // Titulado o Pasante
            titulo: '',
            carrera: '',
            tituloError: '',
            carreraError: '',
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
            masterNameTouched: false, // Indicador para saber si el usuario interactuó con el campo
            doctorateNameTouched: false, // Lo mismo para el doctorado
            selectedPosition: '', // Nuevo campo para el ID del puesto seleccionado
            puestos: [], // Lista de puestos obtenida desde el backend
            errorPosition: '', // Error para el puesto
            passwordFieldType: 'password',
            confirmPasswordFieldType: 'password',
            verificationCode: '', // Código de verificación introducido por el usuario
            verificationError: '', // Error de validación del código
            originalEmail: null, // Nuevo estado para almacenar el correo original

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
            isSubmitting: false,
        };
        
    },
    async mounted() {
        await this.fetchPuestos(); // Cargar los puestos al montar el componente
    },

    methods: {

        // Alternar visibilidad del campo Confirmar Contraseña
        toggleConfirmPasswordVisibility() {
            this.confirmPasswordFieldType =
                this.confirmPasswordFieldType === 'password' ? 'text' : 'password';
        },

        togglePasswordVisibility() {
            this.passwordFieldType = this.passwordFieldType === 'password' ? 'text' : 'password';
        },
        // Método para obtener los puestos del backend
        async fetchPuestos() {
            try {
                const response = await axios.get('https://proyectosin.onrender.com/puestos');
                this.puestos = response.data; // Lista de puestos cargada desde el backend
            } catch (error) {
                console.error('Error al obtener los puestos:', error);
                this.errorMessage = 'No se pudieron cargar los puestos.';
            }
        },



        sanitizeInput(input) {
            return input.replace(/[<>/\\{}()"'`]/g, ''); // Elimina caracteres peligrosos
        },



        validateFirstName() {
            this.firstNameError = '';
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(this.firstName) || this.firstName.length < 3 || this.firstName.length > 50) {
                this.firstNameError = 'Nombre inválido. Debe contener solo letras y tener entre 3 y 50 caracteres.';
            }
        },

        validateLastName() {
            this.lastNameError = '';
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(this.lastName) || this.lastName.length < 3 || this.lastName.length > 50) {
                this.lastNameError = 'Apellido paterno inválido. Debe contener solo letras y tener entre 3 y 50 caracteres.';
            }
        },

        validateMotherLastName() {
            this.motherLastNameError = '';
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(this.motherLastName) || this.motherLastName.length < 3 || this.motherLastName.length > 50) {
                this.motherLastNameError = 'Apellido materno inválido. Debe contener solo letras y tener entre 3 y 50 caracteres.';
            }
        },
        validatePhoneNumber() {
            this.phoneNumberError = '';
            if (!/^\d{10}$/.test(this.phoneNumber)) {
                this.phoneNumberError = 'Teléfono inválido. Debe ser un número de 10 dígitos.';
            }
        },
        validateEmail() {
            this.emailError = '';
            if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(this.email)) {
                this.emailError = 'Correo electrónico inválido.';
            }
        },
        // Validar que se haya seleccionado un puesto
        validatePosition() {
            // Si no se ha seleccionado un puesto, mostrar el error
            if (!this.selectedPosition) {
                this.errorPosition = 'Debe seleccionar un puesto.';
                return false;
            }

            // Si se seleccionó un puesto, eliminar el error
            this.errorPosition = '';
            return true;
        },
        validateHasMaster() {
            // Valida solo si el usuario seleccionó "Sí" en ¿Tiene Maestría?
            if (this.hasMaster === 'si') {
                this.validateMasterName(); // Llama a la validación específica del nombre de la maestría
            } else {
                this.masterNameError = ''; // Limpia los errores si no tiene maestría
            }
        },

        validateMasterName() {
            if (this.hasMaster === 'si' && this.masterNameTouched) {
                // Validar que solo contenga letras y espacios, con una longitud entre 2 y 100 caracteres
                if (!/^[a-zA-Z\s]+$/.test(this.masterName) || this.masterName.trim().length < 2 || this.masterName.trim().length > 100) {
                    this.masterNameError = 'Nombre de la Maestría inválido. Debe contener solo letras y tener entre 2 y 100 caracteres.';
                } else {
                    this.masterNameError = ''; // Limpia el error si la validación pasa
                }
            }
        },



        validateHasDoctorate() {
            // Valida solo si el usuario seleccionó "Sí" en ¿Tiene Doctorado?
            if (this.hasDoctorate === 'si') {
                this.validateDoctorateName(); // Llama a la validación específica del nombre del doctorado
            } else {
                this.doctorateNameError = ''; // Limpia los errores si no tiene doctorado
            }
        },

        validateDoctorateName() {
            if (this.hasDoctorate === 'si' && this.doctorateNameTouched) {
                // Validar que solo contenga letras y espacios, con una longitud entre 2 y 100 caracteres
                if (!/^[a-zA-Z\s]+$/.test(this.doctorateName) || this.doctorateName.trim().length < 2 || this.doctorateName.trim().length > 100) {
                    this.doctorateNameError = 'Nombre del Doctorado inválido. Debe contener solo letras y tener entre 2 y 100 caracteres.';
                } else {
                    this.doctorateNameError = ''; // Limpia el error si la validación pasa
                }
            }
        },
        validateGraduation() {
            if (!this.isGraduated || (this.isGraduated !== 'Titulado' && this.isGraduated !== 'Pasante')) {
                this.graduationError = 'Debe seleccionar si está titulado o es pasante.';
            } else {
                this.graduationError = '';
            }
        },
        validateTitulo() {
            this.tituloError = '';
            if (!this.titulo.trim()) {
                this.tituloError = 'El título no puede estar vacío.';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(this.titulo)) {
                this.tituloError = 'El título solo puede contener letras y espacios.';
            } else if (this.titulo.trim().length < 3 || this.titulo.trim().length > 100) {
                this.tituloError = 'El título debe tener entre 3 y 100 caracteres.';
            }
        },
        validateCarrera() {
            this.carreraError = '';
            if (!this.carrera.trim()) {
                this.carreraError = 'La carrera no puede estar vacía.';
            } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s]+$/.test(this.carrera)) {
                this.carreraError = 'La carrera solo puede contener letras y espacios.';
            } else if (this.carrera.trim().length < 3 || this.carrera.trim().length > 100) {
                this.carreraError = 'La carrera debe tener entre 3 y 100 caracteres.';
            }
        },
        validateGraduationDetails() {
            // Validar título si es titulado
            if (this.isGraduated === 'Titulado') {
                this.validateTitulo();
                if (this.tituloError) return false;
            }

            // Validar carrera si es pasante
            if (this.isGraduated === 'Pasante') {
                this.validateCarrera();
                if (this.carreraError) return false;
            }

            return true; // Pasan las validaciones
        },
        validateEmployeeNumber() {
            if (!/^\d+$/.test(this.employeeNumber) || this.employeeNumber.length < 1 || this.employeeNumber.length > 20) {
                this.employeeNumberError = 'Número de Trabajador inválido. Debe contener solo números.';
            } else {
                this.employeeNumberError = '';
            }
        },
        validateUnionNumber() {
            if (!/^\d+$/.test(this.unionNumber) || this.unionNumber.length < 1 || this.unionNumber.length > 20) {
                this.unionNumberError = 'Número de Sindicalizado inválido. Debe contener solo números.';
            } else {
                this.unionNumberError = '';
            }
        },
        handleHasMasterChange() {
            this.validateHasMaster(); // Llamar al método existente para validación
            if (this.hasMaster === 'no') {
                this.hasDoctorate = 'no'; // Restablecer la selección de doctorado
                this.doctorateName = '';  // Limpiar el nombre del doctorado
            }
        },

        // Manejo del cambio de paso

        // Manejo del cambio de paso
        nextStep() {
            if (this.step === 1) {
                // Verificar si el correo ha cambiado
                if (this.validateStep1()) {
                    if (this.email !== this.originalEmail) {
                        // Si el correo ha cambiado, guarda los datos y avanza al paso 1.5
                        this.verificationCode = ''; // Limpia el código de verificación
                        this.saveTemporaryData(); // Guarda los datos en el backend
                    } else {
                        // Si no cambió el correo, avanza directamente al paso 2
                        this.step = 2;
                    }
                }
            } else if (this.step === 1.5) {
                // Validar el código de verificación antes de avanzar al paso 2
                if (this.validateVerificationCode()) {
                    this.step = 2;
                }
            } else if (this.step === 2) {
                // Validar campos del paso 2 (Información Académica)
                if (!this.validateStep2()) {
                    this.errorMessage = "Por favor, completa todos los campos obligatorios.";
                    return; // Detener avance si las validaciones fallan
                }
                this.errorMessage = ""; // Limpiar mensajes de error
                this.step = 3;
            }
        },

        previousStep() {
            if (this.step === 1.5) {
                // Regresar directamente al paso 1
                this.step = 1;
            } else if (this.step === 2) {
                // Regresar al paso 1, saltando el paso 1.5
                this.step = this.email === this.originalEmail ? 1 : 1.5;
            } else if (this.step === 3) {
                // Regresar al paso 2
                this.step = 2;
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
            if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(this.firstName) || this.firstName.length < 3 || this.firstName.length > 50) {
                this.firstNameError = 'Nombre inválido. Debe contener solo letras y tener entre 2 y 50 caracteres.';
                return false;
            }

            if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(this.lastName) || this.lastName.length < 3 || this.lastName.length > 50) {
                this.lastNameError = 'Apellido paterno inválido. Debe contener solo letras y tener entre 3 y 50 caracteres.';
                return false;
            }

            if (!/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/.test(this.motherLastName) || this.firstName.length < 3 || this.motherLastName.length > 50) {
                this.motherLastNameError = 'Apellido materno inválido. Debe contener solo letras y tener entre 3 y 50 caracteres.';
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
            // Validar que se haya seleccionado un puesto válido
            // Llamar a validatePosition dentro del flujo de validación del paso 2
            if (!this.validatePosition()) {
                return false; // Detiene el avance si no se ha seleccionado un puesto
            }
            

            // Validar detalles de graduación
            if (!this.validateGraduationDetails()) {
                return false; // Detener si hay errores en titulación o carrera
            }


            // Validar si tiene maestría, entonces nombreMaestria es obligatorio
            if (this.hasMaster === 'si') {
                if (!this.masterName || this.masterName.trim().length < 2 || this.masterName.trim().length > 100) {
                    this.masterNameError = 'Nombre de la maestría inválido. Debe contener entre 2 y 100 caracteres.';
                    return false;
                }
            }

            // Validar si tiene doctorado, entonces doctorateName es obligatorio
            if (this.hasDoctorate === 'si') {
                if (!this.doctorateName || this.doctorateName.trim().length < 2 || this.doctorateName.trim().length > 100) {
                    this.doctorateNameError = 'Nombre del doctorado inválido. Debe contener entre 2 y 100 caracteres.';
                    return false;
                }
            }

            if (this.isGraduated !== 'Titulado' && this.isGraduated !== 'Pasante') {
                this.graduationError = 'Debe seleccionar si está titulado o es pasante.';
                return false;
            }

            if (!/^\d+$/.test(this.employeeNumber) || this.employeeNumber.length < 1 || this.employeeNumber.length > 20) {
                this.employeeNumberError = 'Número de trabajador inválido. Debe ser un número.';
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


            if (!this.validateUsername()) {
                this.errorMessage = this.usernameError; // Mostrar el error general, si es necesario
                return false; // Detener el flujo si no pasa la validación
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

        async saveTemporaryData() {
            try {
                const response = await axios.post('https://proyectosin.onrender.com/guardar-temporal', {
                    nombre: this.firstName,
                    apellidoPaterno: this.lastName,
                    apellidoMaterno: this.motherLastName,
                    telefono: this.phoneNumber,
                    correo: this.email,
                });

                if (response.status === 200) {
                    this.successMessage = 'Código enviado a tu correo.';
                    this.errorMessage = '';
                    this.originalEmail = this.email; // Almacena el correo enviado exitosamente
                    this.step = 1.5; // Avanza al paso de verificación de código
                }
            } catch (error) {
                this.errorMessage = error.response?.data || 'Error al guardar datos.';
            }
        },
        async validateVerificationCode() {
            try {
                const response = await axios.post('https://proyectosin.onrender.com/validar-codigo', {
                    correo: this.email,
                    codigo: this.verificationCode,
                });

                if (response.status === 200) {
                    this.successMessage = 'Correo verificado correctamente.';
                    this.errorMessage = '';

                    // Ocultar mensaje después de 5 segundos
                    setTimeout(() => {
                        this.successMessage = '';
                    }, 3500);

                    this.step = 2; // Avanzar al paso 2
                }
            } catch (error) {
                this.verificationError = error.response?.data || 'Código de verificación incorrecto o expirado.';
            }
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
        validateUsername() {
            this.usernameError = ''; // Reiniciar errores previos

            // Verificar que el nombre de usuario tenga al menos 4 caracteres
            if (!this.username || this.username.trim().length < 4) {
                this.usernameError = 'El nombre de usuario debe tener al menos 4 caracteres.';
                return false;
            }

            // Verificar que no tenga caracteres no permitidos
            if (!/^[a-zA-Z0-9_]+$/.test(this.username)) {
                this.usernameError = 'El usuario solo puede contener letras, números y guiones bajos.';
                return false;
            }

            return true; // Pasa la validación
        },



        evaluatePassword() {
            const password = this.password;

            // Verifica si contiene patrones de sucesión
            if (this.containsSequentialPattern(password)) {
                this.passwordTooWeakMessage = 'La contraseña contiene patrones de sucesión numérica o alfabética.';
                this.isPasswordStrong = false;
                return;
            }

            // Valida la fortaleza usando zxcvbn
            const passwordStrength = zxcvbn(password);
            this.passwordStrengthBarWidth = (passwordStrength.score / 4) * 100 + '%';
            this.passwordStrengthMessage = this.getPasswordStrengthMessage(passwordStrength.score);

            if (passwordStrength.score < 2) {
                this.passwordTooWeakMessage = 'Advertencia: La contraseña es débil.';
                this.isPasswordStrong = false;
            } else {
                this.passwordTooWeakMessage = '';
                this.isPasswordStrong = true;
            }
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
                // Buscar el nombre del puesto a partir del ID seleccionado
                const puestoSeleccionado = this.puestos.find(
                    (puesto) => puesto.id === this.selectedPosition
                );

                if (!puestoSeleccionado) {
                    this.errorMessage = 'Debe seleccionar un puesto válido.';
                    return;
                }
                const graduationDetail = this.isGraduated === 'Titulado' ? this.titulo : this.carrera;
                const response = await axios.post('https://proyectosin.onrender.com/register', {
                    nombre: this.firstName,
                    apellidoPaterno: this.lastName,
                    apellidoMaterno: this.motherLastName,
                    telefono: this.phoneNumber,
                    correo: this.email,
                    puesto: puestoSeleccionado.nombre,
                    tieneMaestria: this.hasMaster,
                    nombreMaestria: this.masterName,
                    tieneDoctorado: this.hasDoctorate,
                    nombreDoctorado: this.doctorateName,
                    estatus: this.isGraduated,
                     // Unifica título o carrera aquí
                    numeroTrabajador: this.employeeNumber,
                    numeroSindicalizado: this.unionNumber,
                    graduation_detail: graduationDetail,
                    usuarios: this.username,
                    password: this.password,
                    

                },

                );
                console.log(response.data);

                if (response.status === 200) {
                    this.successMessage = 'Registro exitoso.';
                    this.errorMessage = '';
                    this.resetForm(); // Opcional: Resetear el formulario

                    // Redirigir al usuario a la página de inicio de sesión después de unos segundos
                    setTimeout(() => {
                        this.$router.push('/login');
                    }, 3000); // 2 segundos de retraso antes de redirigir
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

            if (!this.validateUsername()) {
                return; // Detener si la validación falla
            }

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
/* Contenedor principal */
.container {
    max-width: 450px;
    margin: auto;
    /* Centrar en la página */
    background-color: #e4e9ee;
    /* Fondo suave */
    padding: 30px;
    border-radius: 10px;
    box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
    /* Sombra */
}

/* Título principal */
h2 {
    font-size: 1.8rem;
    font-weight: bold;
    color: #333;
    /* Texto oscuro */
    text-align: center;
    margin-bottom: 20px;
}

/* Subtítulo */
h4 {
    font-size: 1.2rem;
    font-weight: bold;
    color: #666;
    /* Texto más claro */
    text-align: center;
    margin-bottom: 20px;
}

/* Campos de entrada */
.form-control {
    width: 100%;
    /* Ancho del 100% del contenedor */
    max-width: 250px;
    /* Tamaño máximo */
    padding: 10px;
    /* Ajusta el espacio interno (alto del campo) */
    font-size: 1rem;
    /* Ajusta el tamaño del texto */
    border-radius: 8px;
    /* Bordes redondeados */
    border: 1px solid #ced4da;
    margin: 0 auto;
    /* Centrar dentro del contenedor */
    transition: border-color 0.3s ease-in-out;
    margin-bottom: 20px;
    /* Espacio inferior entre campos y botones */
}

/* Campos en hover o focus */
.form-control:focus {
    border-color: #007bff;
    box-shadow: 0 0 5px rgba(0, 123, 255, 0.5);
    /* Efecto de foco */
    outline: none;
}


/* Etiquetas */
label {
    font-weight: bold;
    color: #333;
    margin-bottom: 8px;
    display: block;
    /* Mantiene el texto arriba del campo */
    font-size: 1rem;
    line-height: 1.5;
    /* Espaciado adecuado entre etiquetas */
}

select {
    font-size: 1rem;
    /* Ensure consistent font size */
    padding: 0.375rem 0.75rem;
    /* Match Bootstrap padding */
    border-radius: 0.25rem;
    /* Ensure consistent border radius */
}

/* Botones */
/* Botones: Ajustados al ancho de los campos de entrada */
.btn {
    border-radius: 8px;
    font-size: 0.9rem;
    /* Texto compacto */
    padding: 8px 16px;
    /* Alto reducido */
    width: 40%;
    /* Hacer que ocupen el mismo ancho que los inputs */
    max-width: 250px;
    /* Tamaño máximo para mantener la proporción */
    margin: 0 auto;
    /* Centrar en el contenedor */
    transition: all 0.3s ease-in-out;
    margin-top: 10px;
    /* Espacio superior opcional si es necesario */
}

/* Botón "Siguiente" (azul) */
.btn-primary {
    background-color: #007bff;
    border: none;
    color: white;
    width: auto;
    /* Ajusta al contenido */
    min-width: 120px;
    /* Evita que el botón sea muy pequeño */
}

.btn-primary:hover {
    background-color: #0056b3;
    /* Azul más oscuro al pasar el mouse */
    color: white;
}

/* Botón "Regresar" (gris) */
.btn-secondary {
    background-color: #6c757d;
    border: none;
    color: white;
    width: auto;
    /* Ajusta al contenido */
    min-width: 120px;
}

.btn-secondary:hover {
    background-color: #495057;
    /* Gris más oscuro al pasar el mouse */
    color: white;
}

/* Botón "Registrar" (verde) */
.btn-success {
    background-color: #28a745;
    border: none;
    color: white;
    width: auto;
    /* Ajusta al contenido */
    min-width: 150px;
}

.custom-gap {
    gap: 50px;
    /* Cambia el valor según el espacio deseado */
}


.btn-success:hover {
    background-color: #218838;
    /* Verde más oscuro al pasar el mouse */
    color: white;
}

.button-group {
    display: flex;
    justify-content: center;
    gap: 1rem;
    /* Adjusts the space between buttons */
}

.button-group .btn {
    padding: 0.5rem 1.5rem;
    /* Adjusts button size */
}


/* Mensajes de error */
.text-danger {
    color: red;
    font-size: 0.9rem;
    margin-top: 5px;
}

/* Mensajes de éxito */
.text-success {
    color: green;
    font-size: 1rem;
    margin-top: 5px;
    text-align: center;
}

/* Espaciado entre secciones */
.mt-3 {
    margin-top: 1rem !important;
}

.mt-4 {
    margin-top: 1.5rem !important;
}

.w-100 {
    width: 100% !important;
}

/* Ajustes responsivos */
@media (max-width: 768px) {
    .container {
        max-width: 90%;
        /* Ancho dinámico en pantallas pequeñas */
        padding: 20px;
    }

    h2 {
        font-size: 1.5rem;
    }

    h4 {
        font-size: 1rem;
    }

    .btn {
        font-size: 0.9rem;
    }
}
</style>