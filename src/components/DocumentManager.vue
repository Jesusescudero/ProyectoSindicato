<template>
  <div class="container">
    <h2>Gestión de Documento Regulatorio</h2>

    <!-- Formulario para crear o actualizar el documento -->
    <form @submit.prevent="handleSubmit" class="shadow p-4 rounded bg-light">
      <div class="form-group mb-3">
        <label for="title">Título del Documento</label>
        <input type="text" id="title" v-model="document.title" class="form-control" required />
      </div>
      
      <div class="form-group mb-3">
        <label for="content">Contenido del Documento</label>
        <textarea id="content" v-model="document.content" class="form-control" required></textarea>
      </div>
      
      <div class="form-group mb-3">
        <label for="validUntil">Fecha de Vigencia</label>
        <input type="date" id="validUntil" v-model="document.validUntil" class="form-control" required />
      </div>

      <div class="d-flex justify-content-between">
        <button type="submit" class="btn btn-primary">{{ isEditing ? 'Actualizar Documento' : 'Registrar Documento' }}</button>
        <button v-if="isEditing" type="button" @click="resetForm" class="btn btn-secondary">Cancelar</button>
      </div>
    </form>

    <!-- Listado de documentos -->
    <h3 class="mt-5">Historial de Versiones</h3>
    <table class="table table-striped mt-3">
      <thead>
        <tr>
          <th>Título</th>
          <th>Versión</th>
          <th>Fecha de Creación</th>
          <th>Acciones</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="doc in documents" :key="doc.id">
          <td>{{ doc.title }}</td>
          <td>{{ doc.version }}</td>
          <td>{{ new Date(doc.createdAt).toLocaleDateString() }}</td>
          <td>
            <button @click="editDocument(doc)" class="btn btn-sm btn-warning">Editar</button>
            <button @click="deleteDocument(doc.id)" class="btn btn-sm btn-danger" :disabled="doc.deleted">Eliminar</button>
          </td>
        </tr>
      </tbody>
    </table>

    <p v-if="message" class="text-success">{{ message }}</p>
  </div>
</template>

<script>
export default {
  name: "DocumentManager",
  data() {
    return {
      isEditing: false,
      message: '',
      documents: [
        { id: 1, title: "Política de Privacidad", content: "Contenido de la política", version: "1.0", createdAt: "2024-10-01", validUntil: "2025-01-01", deleted: false },
        { id: 2, title: "Política de Privacidad", content: "Actualización del contenido", version: "1.1", createdAt: "2024-10-10", validUntil: "2025-01-01", deleted: false }
      ],
      document: {
        title: "",
        content: "",
        validUntil: "",
        version: "",
        id: null
      }
    };
  },
  methods: {
    handleSubmit() {
      if (this.isEditing) {
        this.updateDocument();
      } else {
        this.createDocument();
      }
    },
    
    createDocument() {
      const newDoc = {
        ...this.document,
        id: this.documents.length + 1,
        createdAt: new Date().toISOString(),
        version: "1.0",
        deleted: false
      };
      this.documents.push(newDoc);
      this.message = "Documento creado exitosamente.";
      this.resetForm();
    },
    
    editDocument(doc) {
      this.isEditing = true;
      this.document = { ...doc };
    },
    
    updateDocument() {
      const index = this.documents.findIndex(d => d.id === this.document.id);
      if (index !== -1) {
        this.document.version = (parseFloat(this.document.version) + 0.1).toFixed(1);
        this.documents.splice(index, 1, { ...this.document });
        this.message = "Documento actualizado correctamente.";
        this.resetForm();
      }
    },
    
    deleteDocument(docId) {
      const doc = this.documents.find(d => d.id === docId);
      if (doc) {
        doc.deleted = true;
        this.message = "Documento eliminado.";
      }
    },
    
    resetForm() {
      this.isEditing = false;
      this.document = { title: "", content: "", validUntil: "", version: "", id: null };
    }
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
