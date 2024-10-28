<template>
  <div class="container">
    <h2>Gestión de Términos y Condiciones</h2>

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
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Términos y Condiciones' : 'Registrar Términos y Condiciones' }}</button>
        <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>

    <!-- Listado de documentos -->
    <h3 class="mt-5">Historial de Versiones</h3>
    <table class="table table-striped mt-3">
      <thead>
        <tr>
          <th>Versión</th>
          <th>Fecha de Creación</th>
          <th>Fecha de Vigencia</th>
          <th>Estado</th> <!-- Nueva columna para mostrar si está eliminado -->
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in documents" :key="doc.id">
          <td>{{ doc.version }}</td> <!-- Mostrar la versión -->
          <td>{{ new Date(doc.createdAt).toLocaleDateString() }}</td>
          <td>{{ new Date(doc.validUntil).toLocaleDateString() }}</td>
          <td>{{ doc.deleted ? 'No vigente' : 'Vigente' }}</td> <!-- Mostrar si está eliminado o no -->
          <td>
            <button @click="deleteDocument(doc.id)" class="btn btn-sm btn-danger" :disabled="doc.deleted">Eliminar</button>
            <a :href="`https://proyectosin.onrender.com/documents-terminos-condiciones/${doc.id}`" class="btn btn-sm btn-info" target="_blank">Ver Documento</a>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="message" class="text-success">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'TermsAndConditions',
  data() {
    return {
      isEditing: false,
      message: '',
      documents: [], // Inicialmente vacío, se cargará desde el backend
      document: {
        file: null, // Para almacenar el archivo subido
        validUntil: "",
        version: "",
        id: null
        
      }
    };
  },
  methods: {
    handleFileUpload(event) {
      this.document.file = event.target.files[0]; // Almacena el archivo subido en la variable `file`
    },

    async handleSubmit() {
      if (this.isEditing) {
        this.updateDocument();
      } else {
        this.createDocument();
      }
    },
    
    async createDocument() {
      const formData = new FormData();
      formData.append("file", this.document.file);  // El archivo
      formData.append("version", this.document.version);
      formData.append("validUntil", this.document.validUntil);

      try {
        // Enviar la solicitud al backend para guardar el documento en la base de datos
        const response = await fetch('https://proyectosin.onrender.com/upload-terminos-condiciones', {
          method: 'POST',
          body: formData
        });
        const result = await response.json();
        if (response.ok) {
          this.message = "Documento creado exitosamente.";
          // Recargar los documentos después de guardar
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
        const response = await fetch('https://proyectosin.onrender.com/documents-terminos-condiciones');  // Verifica que esta URL sea correcta
        const data = await response.json();
        if (response.ok) {
          this.documents = data;  // Asigna los documentos al arreglo
        } else {
          console.error('Error al obtener documentos:', data.message);
        }
      } catch (error) {
        console.error('Error al obtener documentos:', error);
      }
    },

    editDocument(doc) {
      this.isEditing = true;
      this.document = { ...doc };
    },

    async updateDocument() {
      const formData = new FormData();
      formData.append("file", this.document.file);
      formData.append("validUntil", this.document.validUntil);
      formData.append("version", this.document.version);

      try {
        const response = await fetch(`https://proyectosin.onrender.com/update-terminos-condiciones/${this.document.id}`, {
          method: 'PATCH',
          body: formData
        });
        const result = await response.json();
        if (response.ok) {
          this.message = "Documento actualizado correctamente.";
          this.fetchDocuments();
          this.resetForm();
        } else {
          this.message = `Error: ${result.message}`;
        }
      } catch (error) {
        console.error('Error al actualizar el documento:', error);
        this.message = "Error al actualizar el documento.";
      }
    },

    async deleteDocument(docId) {
      try {
        const response = await fetch(`https://proyectosin.onrender.com/delete-terminos-condiciones/${docId}`, {
          method: 'POST', 
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
    }
  },
  created() {
    // Cargar los documentos cuando se cargue el componente
    this.fetchDocuments();
  }
};
</script>

<style scoped>
 /* Centrar y agregar márgenes superiores */
 h2 {
    margin-top: 20px;
    margin-bottom: 20px;
  }

  /* Estilo para el formulario */
  form {
    margin-top: 20px;
    padding: 30px;
    background-color: #f9f9f9;
    border-radius: 8px;
  }

  /* Espaciado en las tablas */
  table {
    margin-top: 20px;
  }

  /* Tamaño de los botones en las acciones */
  table td button, table td a {
    margin-right: 5px;
  }

  /* Estilo de hover para las filas */
  table tbody tr:hover {
    background-color: #f0f0f0;
  }

  /* Espaciado inferior en el cuerpo */
  .container {
    margin-bottom: 50px;
  }

  /* Estilo para la tabla */
  .table-striped tbody tr:nth-of-type(odd) {
    background-color: rgba(0, 0, 0, 0.05);
  }

  .table-hover tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.1);
  }

  /* Ajustar márgenes y colores para la tabla */
  .table-dark {
    background-color: #343a40;
    color: white;
  }

  .btn-danger {
    background-color: #dc3545;
    border-color: #dc3545;
  }

  .btn-info {
    background-color: #17a2b8;
    border-color: #17a2b8;
  }

  .btn-info:hover {
    background-color: #138496;
    border-color: #117a8b;
  }

  .btn-danger:hover {
    background-color: #c82333;
    border-color: #bd2130;
  }
  .container {
    max-width: 800px;
    margin-top: 20px;
  }

  .table td, .table th {
    vertical-align: middle;
  }

  .table-hover tbody tr:hover {
    background-color: rgba(0, 0, 0, 0.05);
  }

  /* Añadir espacio entre los botones en la columna de acciones */
  .actions-column {
    white-space: nowrap;
  }

  .actions-column .btn {
    margin-bottom: 5px;
  }

  /* Ajustar el tamaño de los botones para que no se amontonen */
  .btn-danger, .btn-info {
    min-width: 100px;
  }

  /* Aplicar márgenes adicionales entre los botones */
  .me-2 {
    margin-right: 8px;
  }
</style>


  