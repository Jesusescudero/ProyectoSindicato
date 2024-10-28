<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2024 {{ companyName }}. Todos los derechos reservados.</p>
      <p>Dirección: {{ contactInfo.address }}</p>
      <p>Contacto: {{ contactInfo.email }} | Teléfono: {{ contactInfo.phone }}</p>
      <p>
        <a :href="socialLinks.facebook" target="_blank">Facebook</a> | 
        <a :href="socialLinks.instagram" target="_blank">Instagram</a>
      </p>
      
      <!-- Enlaces para descargar los documentos -->
      <div class="document-links">
        <p><a href="https://proyectosin.onrender.com/download-terminos-condiciones" target="_blank">Términos y Condiciones</a></p>
        <p><a href="https://proyectosin.onrender.com/download-politica-privacidad" target="_blank">Política de Privacidad</a></p>
        <p><a href="https://proyectosin.onrender.com/download-deslinde-legal" target="_blank">Deslinde Legal</a></p>
      </div>
    </div>
  </footer>
</template>

<script>
import axios from 'axios';

export default {
  name: 'FooterComponent',
  data() {
    return {
      companyName: '',       // Nombre de la empresa
      contactInfo: {         // Información de contacto
        address: '',         // Dirección de la empresa
        email: '',
        phone: '',
      },
      socialLinks: {         // Enlaces de redes sociales
        facebook: '',
        instagram: ''
      },
      activeDocuments: [],   // Documentos vigentes
      success: true,         // Para indicar si la consulta fue exitosa
    };
  },
  created() {
    this.fetchCompanyData();     // Llamar a la función al crear el componente
    this.fetchActiveDocuments(); // Llamar a la función para obtener documentos vigentes
  },
  methods: {
    async fetchCompanyData() {
      try {
        const companyResponse = await axios.get('https://proyectosin.onrender.com/company-name');
        this.companyName = companyResponse.data.nombre_empresa;

        const contactResponse = await axios.get('https://proyectosin.onrender.com/contact-info');
        this.contactInfo.address = contactResponse.data.direccion_contacto;
        this.contactInfo.email = contactResponse.data.correo_contacto;
        this.contactInfo.phone = contactResponse.data.telefono_contacto;

        const socialResponse = await axios.get('https://proyectosin.onrender.com/social-links');
        this.socialLinks.facebook = socialResponse.data.facebook;
        this.socialLinks.instagram = socialResponse.data.instagram;

        this.success = true;
      } catch (error) {
        this.success = false;
        console.error("Error al obtener los datos de la empresa:", error);
      }
    },
    async fetchActiveDocuments() {
      try {
        const response = await axios.get('https://proyectosin.onrender.com/documents-vigentes');
        if (response.status === 200) {
          this.activeDocuments = response.data;
        } else {
          console.error('Error al obtener documentos vigentes:', response.data.message);
        }
      } catch (error) {
        console.error('Error al obtener documentos vigentes:', error);
      }
    }
  }
};
</script>

<style scoped>
.footer {
  background-color: #049206; /* Color de fondo */
  color: white; /* Color del texto */
  padding: 20px; /* Espaciado interior */
  text-align: center; /* Centrar texto */
  width: 100%; /* Abarcar todo el ancho */
  position: relative; /* Asegura que el pie de página se mantenga en su lugar */
  bottom: 0; /* Asegúrate de que esté al final */
  margin-top: 30px; /* Margen superior para separarlo del contenido */
}

.footer-content {
  max-width: 1200px; /* Limitar el ancho del contenido */
  margin: auto; /* Centrar el contenido */
}

.footer p {
  margin: 5px 0; /* Espaciado entre párrafos */
}

.footer a {
  color: white; /* Color de los enlaces */
  text-decoration: none; /* Quitar subrayado */
}

.footer a:hover {
  text-decoration: underline; /* Subrayar al pasar el cursor */
}

.documents-list {
  margin-top: 20px;
}

.documents-list h4 {
  margin-bottom: 10px;
  font-weight: bold;
}

.documents-list ul {
  list-style: none;
  padding: 0;
}

.documents-list li {
  margin-bottom: 5px;
}

.documents-list a {
  color: #ffffff;
  text-decoration: none;
}

.documents-list a:hover {
  text-decoration: underline;
}
</style>

