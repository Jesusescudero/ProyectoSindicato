<template>
  <footer class="footer">
    <div class="footer-content">
      <!-- Columna 1: Información de la empresa -->
      <div class="footer-left">
        <p>&copy; 2024 <strong>{{ companyName }}</strong>. Todos los derechos reservados.</p>
        <p>Dirección: <span>{{ contactInfo.address }}</span></p>
        <div class="contact-info">
          <p>Contacto:</p>
          <p>
      <strong>Correo:</strong> <a :href="`mailto:${contactInfo.email}`">{{ contactInfo.email }}</a>
    </p>
    <p>
      <strong>Teléfono:</strong> <a :href="`tel:${contactInfo.phone}`">{{ contactInfo.phone }}</a>
    </p>
        </div>
      </div>

      <!-- Columna 2: Redes sociales -->
      <div class="footer-column social-links">
        <p>Síguenos:</p>
        <div class="social-icons">
          <a :href="socialLinks.facebook" target="_blank" aria-label="Facebook">
            <i class="fab fa-facebook-f"></i>
          </a>
          <a :href="socialLinks.instagram" target="_blank" aria-label="Instagram">
            <i class="fab fa-instagram"></i>
          </a>
        </div>
      </div>


      <!-- Columna 3: Documentos legales -->
      <div class="footer-column document-links">
        <p><a href="https://proyectosin.onrender.com/download-terminos-condiciones" target="_blank">Términos y
            Condiciones</a></p>
        <p><a href="https://proyectosin.onrender.com/download-politica-privacidad" target="_blank">Política de
            Privacidad</a></p>
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

    };
  },
  created() {
    this.fetchCompanyData();     // Llamar a la función al crear el componente

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

  }
};
</script>

<style scoped>
.footer-left {
  text-align: center; /* Centrar el contenido */
}

.contact-info {
  margin-top: 10px; /* Espaciado superior */
}

.contact-info p {
  margin: 5px 0; /* Espaciado entre líneas */
}

.contact-info a {
  color: white; /* Mantener el color blanco para los enlaces */
  text-decoration: none; /* Sin subrayado */
  transition: color 0.3s ease;
}

.contact-info a:hover {
  color: #b0ffc3; /* Cambiar color al pasar el cursor */
}
/* Contenedor principal del pie de página */
.footer {
  background-color: #049206;
  /* Fondo verde */
  color: white;
  /* Texto blanco */
  padding: 20px 0;
  /* Espaciado superior e inferior */
  text-align: center;
  /* Centrar texto por defecto */
  width: 100%;
  /* Ocupa todo el ancho */
}

/* Contenido del pie */
.footer-content {
  max-width: 1200px;
  margin: auto;
  /* Centra el contenido horizontalmente */
  display: flex;
  /* Usamos flexbox para organizar las columnas */
  justify-content: space-between;
  /* Espacio entre columnas */
  flex-wrap: wrap;
  /* Permitir que las columnas se acomoden en pantallas pequeñas */
}

/* Columnas individuales */
.footer-column {
  flex: 1;
  /* Cada columna toma el mismo espacio */
  margin: 10px;
  /* Separación entre columnas */
  text-align: left;
  /* Alineación del texto */
}

/* Estilo para enlaces */
.footer a {
  color: white;
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer a:hover {
  color: #b0ffc3;
  /* Color más claro al pasar el cursor */
}

/* Redes sociales */
.social-links {
  text-align: center;
  /* Centra el contenido de la columna */
}

.social-links .social-icons {
  margin-top: 10px;
  /* Espaciado entre el texto y los íconos */
  display: flex;
  justify-content: center;
  /* Centra los íconos horizontalmente */
  gap: 15px;
  /* Espaciado entre los íconos */
}

.social-links .social-icons a {
  color: rgb(255, 255, 255);
  /* Color del ícono */
  font-size: 24px;
  /* Tamaño del ícono */
  transition: transform 0.3s ease, color 0.3s ease;
}

.social-links .social-icons a:hover {
  transform: scale(1.2);
  /* Efecto de zoom */
  color: #b0ffc3;
  /* Cambia el color al pasar el cursor */
}

/* Documentos legales */
.document-links p {
  margin: 5px 0;
  /* Separación entre enlaces */
}

.document-links a {
  display: inline-block;
  font-size: 14px;
  border: 1px solid white;
  padding: 5px 10px;
  border-radius: 5px;
  transition: background-color 0.3s ease, color 0.3s ease;
}

.document-links a:hover {
  background-color: white;
  color: #049206;
  /* Verde del fondo */
}
</style>
