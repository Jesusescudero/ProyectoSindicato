<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2024 {{ companyName }}. Todos los derechos reservados.</p>
      <p>Dirección: {{ contactInfo.address }}</p> <!-- Aquí se muestra la dirección -->
      <p>Contacto: {{ contactInfo.email }} | Teléfono: {{ contactInfo.phone }}</p>
      <p>
        <a :href="socialLinks.facebook" target="_blank">Facebook</a> | 
        <a :href="socialLinks.instagram" target="_blank">Instagram</a>
      </p>
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
      success: true,          // Para indicar si la consulta fue exitosa
    };
  },
  created() {
    this.fetchCompanyData(); // Llamar a la función al crear el componente
  },
  methods: {
    async fetchCompanyData() {
      try {
        // Obtener el nombre de la empresa
        const companyResponse = await axios.get('https://proyectosin.onrender.com/company-name');
        this.companyName = companyResponse.data.nombre_empresa;

        // Obtener la información de contacto
        const contactResponse = await axios.get('https://proyectosin.onrender.com/contact-info');
        this.contactInfo.address = contactResponse.data.direccion_contacto;  // Obtener la dirección
        this.contactInfo.email = contactResponse.data.correo_contacto;
        this.contactInfo.phone = contactResponse.data.telefono_contacto;

        // Obtener los enlaces de redes sociales
        const socialResponse = await axios.get('https://proyectosin.onrender.com/social-links');
        this.socialLinks.facebook = socialResponse.data.facebook;
        this.socialLinks.instagram = socialResponse.data.instagram;

        this.success = true;  // La operación fue exitosa
      } catch (error) {
        this.success = false; // La operación falló
        console.error("Error al obtener los datos de la empresa:", error);
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
</style>
