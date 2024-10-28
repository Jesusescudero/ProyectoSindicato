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
      documents: [], // Inicialmente vacío, se cargará desde el backend
      document: {
        file: null, // Para almacenar el archivo subido
        validUntil: "",
        version: "",
        id: null,
      }
    };
  },
  methods: {
    handleFileUpload(event) {
      this.document.file = event.target.files[0]; // Almacena el archivo subido en la variable `file`
    },

    handleSubmit() {
      if (this.isEditing) {
        this.updateDocument();
      } else {
        this.createDocument();
      }
    },
    
    async createDocument() {
      const formData = new FormData();
      formData.append("file", this.document.file);  // El archivo
      formData.append("validUntil", this.document.validUntil);

      try {
        // Enviar la solicitud al backend para guardar el documento en la base de datos
        const response = await fetch('https://proyectosin.onrender.com/upload-aviso-privacidad', {
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
        const response = await fetch('https://proyectosin.onrender.com/documents-aviso-privacidad');  // Verifica que esta URL sea correcta
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
    
    updateDocument() {
      // Código para actualizar el documento (similar a createDocument)
      const index = this.documents.findIndex(d => d.id === this.document.id);
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
          method: 'POST', // Cambiado a POST en lugar de PATCH
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
  .container {
    max-width: 800px;
    margin-top: 20px;
  }
  .table td, .table th {
    vertical-align: middle;
  }
</style>

