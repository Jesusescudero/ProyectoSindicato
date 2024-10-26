<template>
    <div class="container">
      <h2>Configuración del Perfil de Empresa</h2>
  
      <!-- Sección: Configuración de Redes Sociales -->
      <section class="section">
        <h3>Registro y Actualización de Redes Sociales</h3>
        <form @submit.prevent="handleSubmitSocialLinks" class="form">
          <div v-for="(link, index) in socialLinks" :key="index" class="form-group">
            <label :for="'social_' + index">Enlace de {{ link.platform }}</label>
            <input 
              :id="'social_' + index"
              type="url" 
              v-model="link.url" 
              class="form-control"
              placeholder="https://example.com"
            />
          </div>
          <button type="submit" class="btn btn-primary">Guardar Redes Sociales</button>
          <p v-if="socialLinksMessage" :class="{'text-success': success, 'text-danger': !success}">
            {{ socialLinksMessage }}
          </p>
        </form>
      </section>
  
      <!-- Sección: Registro y Actualización de Slogan -->
      <section class="section">
        <h3>Registro y Actualización de Slogan</h3>
        <form @submit.prevent="handleSubmitSlogan" class="form">
          <div class="form-group">
            <label for="slogan">Slogan</label>
            <input
              id="slogan"
              type="text"
              v-model="slogan"
              class="form-control"
              maxlength="100"
              placeholder="Ingresa el slogan de la empresa"
            />
          </div>
          <button type="submit" class="btn btn-primary">Guardar Slogan</button>
          <p v-if="sloganMessage" :class="{'text-success': success, 'text-danger': !success}">
            {{ sloganMessage }}
          </p>
        </form>
      </section>
  
      <!-- Sección: Subida y Actualización del Logo -->
      <section class="section">
        <h3>Subida y Actualización del Logo</h3>
        <form @submit.prevent="handleSubmitLogo" class="form">
          <div class="form-group">
            <label for="logo">Logo</label>
            <input
              id="logo"
              type="file"
              @change="handleLogoUpload"
              class="form-control"
              accept=".jpg, .jpeg, .png"
            />
          </div>
          <button type="submit" class="btn btn-primary">Guardar Logo</button>
          <p v-if="logoMessage" :class="{'text-success': success, 'text-danger': !success}">
            {{ logoMessage }}
          </p>
        </form>
      </section>
  
      <!-- Sección: Configuración del Título de Página -->
      <section class="section">
        <h3>Configuración del Título de Página</h3>
        <form @submit.prevent="handleSubmitTitle" class="form">
          <div class="form-group">
            <label for="title">Título de la Página</label>
            <input
              id="title"
              type="text"
              v-model="title"
              class="form-control"
              maxlength="50"
              placeholder="Ingresa el título de la página"
            />
          </div>
          <button type="submit" class="btn btn-primary">Guardar Título</button>
          <p v-if="titleMessage" :class="{'text-success': success, 'text-danger': !success}">
            {{ titleMessage }}
          </p>
        </form>
      </section>
  
      <!-- Sección: Registro y Actualización de Datos de Contacto -->
      <section class="section">
        <h3>Registro y Actualización de Datos de Contacto</h3>
        <form @submit.prevent="handleSubmitContactInfo" class="form">
          <div class="form-group">
            <label for="address">Dirección</label>
            <input
              id="address"
              type="text"
              v-model="contactInfo.address"
              class="form-control"
              placeholder="Dirección de la empresa"
            />
          </div>
          <div class="form-group">
            <label for="email">Correo Electrónico</label>
            <input
              id="email"
              type="email"
              v-model="contactInfo.email"
              class="form-control"
              placeholder="Correo de contacto"
            />
          </div>
          <div class="form-group">
            <label for="phone">Teléfono</label>
            <input
              id="phone"
              type="tel"
              v-model="contactInfo.phone"
              class="form-control"
              placeholder="Teléfono de contacto"
            />
          </div>
          <button type="submit" class="btn btn-primary">Guardar Datos de Contacto</button>
          <p v-if="contactInfoMessage" :class="{'text-success': success, 'text-danger': !success}">
            {{ contactInfoMessage }}
          </p>
        </form>
      </section>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: "CompanySettings",
    data() {
      return {
        socialLinks: [
          { platform: "Facebook", url: "" },
          { platform: "Instagram", url: "" },
        ],
        slogan: "",
        logo: null,
        title: "",
        contactInfo: {
      direccion_contacto: "",  // Dirección de la empresa
      correo_contacto: "",     // Correo de contacto
      telefono_contacto: "",   // Teléfono de contacto
    },
        success: true,  // Indicador para determinar si la operación fue exitosa o no
        socialLinksMessage: "",
        sloganMessage: "",
        logoMessage: "",
        titleMessage: "",
        contactInfoMessage: ""
      };
    },
    methods: {
        async handleSubmitSocialLinks() {
  try {
    const urlPattern = /^(https?:\/\/)?([a-zA-Z0-9-]+\.)+[a-zA-Z]{2,6}(\/[a-zA-Z0-9@:%._+~#?&//=]*)?$/;

    for (const link of this.socialLinks) {
      if (link.url && !urlPattern.test(link.url)) {
        this.success = false;
        this.socialLinksMessage = `El enlace de ${link.platform} no tiene un formato válido.`;
        return;
      }
    }

    const token = localStorage.getItem('token');
    await axios.post('https://proyectosin.onrender.com/update-social-links', this.socialLinks, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    this.success = true;
    this.socialLinksMessage = "Enlaces sociales guardados correctamente.";
  } catch (error) {
    this.success = false;
    this.socialLinksMessage = "Error al guardar enlaces sociales.";
    console.error("Error al guardar enlaces sociales:", error);
  }
},     
     async handleSubmitSlogan() {
        try {
          const token = localStorage.getItem('token');
          await axios.post('https://proyectosin.onrender.com/slogan', { slogan: this.slogan }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.success = true;
          this.sloganMessage = "Slogan guardado correctamente.";
        } catch (error) {
          this.success = false;
          this.sloganMessage = "Error al guardar el slogan.";
          console.error("Error al guardar el slogan:", error);
        }
      },
  
      handleLogoUpload(event) {
        this.logo = event.target.files[0];
      },
  
      async handleSubmitLogo() {
  if (this.logo) {
    const formData = new FormData();
    formData.append("logo", this.logo);
    try {
      // Enviar la solicitud de subida del logo al servidor
      await axios.post('https://proyectosin.onrender.com/upload-logo', formData, {
        headers: {
          'Content-Type': 'multipart/form-data'  // Asegura que se está enviando el archivo correctamente
        }
      });
      this.success = true;
      this.logoMessage = "Logo guardado correctamente.";
    } catch (error) {
      this.success = false;
      this.logoMessage = "Error al subir el logo.";
      console.error("Error al subir el logo:", error);
    }
  } else {
    this.logoMessage = "No se ha seleccionado ningún logo.";
  }
},
  
      async handleSubmitTitle() {
        try {
          const token = localStorage.getItem('token');
          await axios.post('https://proyectosin.onrender.com/update-title', { title: this.title }, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          this.success = true;
          this.titleMessage = "Título guardado correctamente.";
        } catch (error) {
          this.success = false;
          this.titleMessage = "Error al guardar el título.";
          console.error("Error al guardar el título:", error);
        }
      },
  
      async handleSubmitContactInfo() {
  try {
    // Verificar que al menos uno de los campos no está vacío
    if (!this.contactInfo.address && !this.contactInfo.email && !this.contactInfo.phone) {
      this.success = false;
      this.contactInfoMessage = "Debe llenar al menos un campo para actualizar.";
      return;
    }

    // Validación de formato de correo electrónico
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (this.contactInfo.email && !emailPattern.test(this.contactInfo.email)) {
      this.success = false;
      this.contactInfoMessage = "El formato del correo electrónico no es válido.";
      return;
    }

    // Validación de formato de teléfono (puedes ajustar el patrón según tu país)
    const phonePattern = /^[0-9]{10}$/;
    if (this.contactInfo.phone && !phonePattern.test(this.contactInfo.phone)) {
      this.success = false;
      this.contactInfoMessage = "El formato del teléfono no es válido. Debe tener 10 dígitos.";
      return;
    }

    // Enviar los datos al servidor como parámetros separados
    await axios.post('https://proyectosin.onrender.com/update-contact-info', {
      direccion_contacto: this.contactInfo.address || null,
      correo_contacto: this.contactInfo.email || null,
      telefono_contacto: this.contactInfo.phone || null
    });

    this.success = true;
    this.contactInfoMessage = "Datos de contacto guardados correctamente.";
  } catch (error) {
    this.success = false;
    this.contactInfoMessage = "Error al guardar los datos de contacto.";
    console.error("Error al guardar los datos de contacto:", error);
  }
}



    }
  };
  </script>
  
  
  <style scoped>
  .container {
    max-width: 800px;
    margin: auto;
    padding: 20px;
  }
  .section {
    margin-bottom: 20px;
  }
  .form-group {
    margin-bottom: 10px;
  }
  </style>
  