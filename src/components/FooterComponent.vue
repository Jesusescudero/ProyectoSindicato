<template>
  <footer class="footer">
    <div class="footer-content">
      <p>&copy; 2024 SINDICATO ÚNICO DE TRABAJADORES DE LAS UNIVERSIDADES TECNOLOGICAS EN EL ESTADO DE HIDALGO. Todos los derechos reservados.</p>
      <p>Contacto: contacto@sindicato.com</p>
    </div>
  </footer>
</template>

<script>
export default {
  name: 'FooterComponent',
}
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

</style>
