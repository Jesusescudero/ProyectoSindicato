<template>
  <div class="container">
    <h2>Gestión de Política de Privacidad</h2>

    <!-- Formulario para crear o actualizar el documento -->
    <form @submit.prevent="handleSubmit" class="shadow p-4 rounded bg-light" enctype="multipart/form-data">
      <!-- Campo para subir el archivo PDF o Word -->
      <div class="form-group mb-3">
        <label for="file">Subir Documento (PDF o Word)</label>
        <input type="file" id="file" @change="handleFileUpload" class="form-control" accept=".pdf, .doc, .docx" required />
      </div>

      <div class="form-group mb-3">
        <label for="validUntil">Fecha de Vigencia</label>
        <input type="date" id="validUntil" v-model="document.validUntil" class="form-control" required />
      </div>

      <div class="d-flex justify-content-between">
        <!-- Botón de registro, visible si no estás en modo edición -->
        <button v-if="!isEditing" type="submit" class="btn btn-primary">Registrar Política de Privacidad</button>
        <!-- Botón de cancelar, visible si estás en modo edición -->
        <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>

    <!-- Listado de documentos -->
    <h3 class="mt-5">Historial de Versiones</h3>
    <div class="table-container">
      <table class="table table-striped mt-3">
      <thead>
        <tr>
          <th>Versión</th>
          <th>Fecha de Creación</th>
          <th>Fecha de Vigencia</th>
          <th>Estado</th> <!-- Mostrar si está eliminado o no -->
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in documents" :key="doc.id">
          <td>{{ doc.version }}</td>
          <td>{{ new Date(doc.createdAt).toLocaleDateString() }}</td>
          <td>{{ new Date(doc.validUntil).toLocaleDateString() }}</td>
          <!-- Evitar el error si 'deleted' no está presente -->
          <td>{{ doc.deleted !== undefined ? (doc.deleted ? 'No vigente' : 'Vigente') : 'Vigente' }}</td>
          <td>
            <button @click="deleteDocument(doc.id)" class="btn btn-sm btn-danger" :disabled="doc.deleted === true">Eliminar</button>
            <a :href="`https://proyectosin.onrender.com/documents-aviso-privacidad/${doc.id}`" class="btn btn-sm btn-info" target="_blank">Ver Documento</a>
          </td>
        </tr>
      </tbody>
    </table>
    </div>
    

    <p v-if="message" class="text-success">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'DocumentManager',
  data() {
    return {
      isEditing: false,
      message: '',
      documents: [],
      document: {
        file: null, // Para almacenar el archivo subido
        validUntil: "",
        version: "",
        id: null,
      },
      errors: {
        file: null, // Para manejar errores relacionados con el archivo
        validUntil: null,
      },
    };
  },
  methods: {
    handleFileUpload(event) {
      const file = event.target.files[0];
      this.document.file = file;

      // Validar tipo de archivo
      const allowedTypes = ["application/pdf", "application/msword", "application/vnd.openxmlformats-officedocument.wordprocessingml.document"];
      if (!file || !allowedTypes.includes(file.type)) {
        this.errors.file = "Solo se permiten archivos PDF o Word.";
        this.document.file = null; // Elimina el archivo si no cumple
        return;
      }

      // Validar tamaño del archivo (5 MB máximo)
      const maxSize = 5 * 1024 * 1024; // 5 MB
      if (file.size > maxSize) {
        this.errors.file = "El archivo no debe exceder los 5 MB.";
        this.document.file = null; // Elimina el archivo si no cumple
        return;
      }

      // Si todo está bien, limpiar errores
      this.errors.file = null;
    },

    validateForm() {
      let isValid = true;

      // Validar que se haya subido un archivo válido
      if (!this.document.file) {
        this.errors.file = "Debes subir un archivo.";
        isValid = false;
      } else {
        this.errors.file = null;
      }

      // Validar que la fecha de vigencia sea válida
      const today = new Date().toISOString().split("T")[0];
      if (!this.document.validUntil || this.document.validUntil < today) {
        this.errors.validUntil = "La fecha de vigencia debe ser posterior a la fecha actual.";
        isValid = false;
      } else {
        this.errors.validUntil = null;
      }

      return isValid;
    },

    handleSubmit() {
      // Validar el formulario antes de continuar
      if (!this.validateForm()) {
        return;
      }

      if (this.isEditing) {
        this.updateDocument();
      } else {
        this.createDocument();
      }
    },

    async createDocument() {
      const formData = new FormData();
      formData.append("file", this.document.file); // El archivo
      formData.append("validUntil", this.document.validUntil);

      try {
        const response = await fetch("https://proyectosin.onrender.com/upload-aviso-privacidad", {
          method: "POST",
          body: formData,
        });
        const result = await response.json();
        if (response.ok) {
          this.message = "Documento creado exitosamente.";
          this.fetchDocuments();
          this.resetForm();
        } else {
          this.message = `Error: ${result.message}`;
        }
      } catch (error) {
        this.message = "Error al guardar el documento.";
        console.error(error);
      }
    },

    async fetchDocuments() {
      try {
        const response = await fetch("https://proyectosin.onrender.com/documents-aviso-privacidad");
        const data = await response.json();
        if (response.ok) {
          this.documents = data;
        } else {
          console.error("Error al obtener documentos:", data.message);
        }
      } catch (error) {
        console.error("Error al obtener documentos:", error);
      }
    },

    editDocument(doc) {
      this.isEditing = true;
      this.document = { ...doc };
    },

    async updateDocument() {
      // Código para actualizar el documento (similar a createDocument)
      const index = this.documents.findIndex((d) => d.id === this.document.id);
      if (index !== -1) {
        this.document.version = (parseFloat(this.document.version) + 0.1).toFixed(1);
        this.documents.splice(index, 1, { ...this.document });
        this.message = "Documento actualizado correctamente.";
        this.resetForm();
      }
    },

    async deleteDocument(docId) {
      try {
        const response = await fetch(`https://proyectosin.onrender.com/delete-aviso-privacidad/${docId}`, {
          method: "POST",
        });
        const data = await response.json();
        if (response.ok) {
          this.message = "Documento marcado como no vigente.";
          this.fetchDocuments();
        } else {
          this.message = `Error: ${data.message}`;
        }
      } catch (error) {
        this.message = "Error al eliminar el documento.";
        console.error(error);
      }
    },

    resetForm() {
      this.isEditing = false;
      this.document = { file: null, validUntil: "", version: "", id: null };
      this.errors = { file: null, validUntil: null };
    },
  },
  created() {
    this.fetchDocuments();
  },
};
</script>



<style scoped>
  /* Contenedor principal */
  .container {
    max-width: 900px;
    margin: 30px auto;
    background: #dbd5d5;
    padding: 20px;
    border-radius: 10px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  /* Títulos principales */
  h2 {
    margin-bottom: 30px;
    text-align: center;
    color: #000000; /* Azul Bootstrap */
    font-weight: 600;
  }

  /* Subtítulos */
  h3 {
    margin-top: 30px;
    margin-bottom: 20px;
    color: #000000; /* Gris oscuro */
    font-weight: 500;
    text-align: center;
  }

  /* Estilos del formulario */
  form {
    padding: 20px;
    background-color: #f8f9fa; /* Fondo claro */
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05); /* Sombra ligera */
  }

  .form-group label {
    font-weight: 500;
    color: #495057; /* Gris Bootstrap */
  }

  .form-control {
    border-radius: 8px;
    padding: 10px;
    border: 1px solid #ced4da;
  }

  .btn-primary {
    background-color: #02aa0a;
    border-color: #02aa0a;
    border-radius: 20px;
    padding: 10px 20px;
    font-weight: bold;
    transition: all 0.3s ease-in-out;
  }

  .btn-primary:hover {
    background-color: #0fb300;
    border-color: #00b324;
    transform: scale(1.05);
  }

  .btn-secondary {
    background-color: #6c757d;
    border-color: #6c757d;
    border-radius: 20px;
    padding: 10px 20px;
    font-weight: bold;
    transition: all 0.3s ease-in-out;
  }

  .btn-secondary:hover {
    background-color: #5a6268;
    border-color: #545b62;
    transform: scale(1.05);
  }

   /* Contenedor de la tabla centrada */
   .table-container {
  display: flex; /* Usar Flexbox */
  justify-content: center; /* Centrar horizontalmente */
  align-items: center; /* Centrar verticalmente */
  margin-top: 20px;
  margin-bottom: 20px;
  height: 100%; /* Asegura que ocupe el espacio completo */
}

  /* Estilo general de la tabla */
  .table {
    border-collapse: collapse;
    border: 1px solid #dacfcf;
    border-radius: 8px;
    overflow: hidden;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  }

  /* Cabecera de la tabla */
  .table thead th {
    background-color: #02aa0a;
    color: #333;
    text-align: center;
    font-weight: bold;
    padding: 10px;
    border-bottom: 2px solid #ddd;
  }

  /* Cuerpo de la tabla */
  .table tbody tr:nth-child(odd) {
    background-color: #f9f9f9;
  }

  .table tbody tr:nth-child(even) {
    background-color: #fff;
  }

  .table tbody td {
    padding: 10px;
    text-align: center;
    vertical-align: middle;
    border-bottom: 1px solid #ddd;
  }

  /* Hover para las filas */
  .table tbody tr:hover {
    background-color: #f1f1f1;
  }

  /* Botones de acción */
  .btn {
    padding: 5px 10px;
    font-size: 14px;
    border-radius: 4px;
  }

  .btn-danger {
    background-color: #e74c3c;
    border-color: #e74c3c;
    color: white;
  }

  .btn-danger:hover {
    background-color: #c0392b;
    border-color: #c0392b;
  }

  .btn-info {
    background-color: #3498db;
    border-color: #3498db;
    color: white;
  }

  .btn-info:hover {
    background-color: #2980b9;
    border-color: #2980b9;
  }

  /* Columna de acciones */
  .actions-column .btn {
    margin: 0 5px;
  }
</style>



