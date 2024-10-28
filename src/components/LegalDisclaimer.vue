<template>
  <div class="container">
    <h2>Gestión de Deslinde Legal</h2>

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
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Deslinde' : 'Registrar Deslinde' }}</button>
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
            <a :href="`https://proyectosin.onrender.com/documents/${doc.id}`" class="btn btn-sm btn-info" target="_blank">Ver Documento</a>


          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="message" class="text-success">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: 'LegalDisclaimer',
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
      formData.append("version", this.document.version);
      formData.append("validUntil", this.document.validUntil);

      try {
        // Enviar la solicitud al backend para guardar el documento en la base de datos
        const response = await fetch('https://proyectosin.onrender.com/upload-document', {
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
        const response = await fetch('https://proyectosin.onrender.com/documents');  // Verifica que esta URL sea correcta
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
    const response = await fetch(`https://proyectosin.onrender.com/delete-document/${docId}`, {
      method: 'POST', // Cambiamos de PATCH a POST
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    const data = await response.json();
    
    if (response.ok) {
      this.message = "Documento marcado como no vigente.";
      // Refrescamos la lista de documentos
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

.table {
  width: 100%;
  margin-bottom: 20px;
}

.thead-dark {
  background-color: #343a40;
  color: white;
}

.table td, .table th {
  vertical-align: middle;
  text-align: center;
}

.actions {
  display: flex;
  justify-content: space-around;
  gap: 5px;
}

.actions .btn {
  margin-right: 5px;
}

.btn {
  border-radius: 20px;
}

.form-control {
  margin-bottom: 10px;
}

button {
  cursor: pointer;
  transition: all 0.3s ease;
}

button:hover {
  opacity: 0.8;
}
</style>

