<template>
    <div class="main-container">
      <!-- Banner -->
      <section class="hero">
        <div class="hero-content">
          <h1>SINDICATO ÚNICO DE TRABAJADORES DE LAS UNIVERSIDADES TECNOLÓGICAS EN EL ESTADO DE HIDALGO</h1>
          <p>Unidos por la defensa de los derechos laborales, la educación y el bienestar de nuestros agremiados.</p>
        </div>
      </section>
  
      <!-- About Section -->
      <section class="about-sindicate">
        <h2>¿Quiénes Somos?</h2>
        <p>
          El SINDICATO ÚNICO DE TRABAJADORES DE LAS UNIVERSIDADES TECNOLÓGICAS EN EL ESTADO DE HIDALGO (SUTUTEH) es una organización que lucha por los derechos laborales de los docentes y personal administrativo de las universidades tecnológicas de Hidalgo. Estamos comprometidos con mejorar las condiciones laborales y garantizar la justicia en el ámbito educativo.
        </p>
      </section>
  
      <!-- Objectives Section -->
      <section class="objectives">
        <h2>Nuestros Objetivos</h2>
        <ul>
          <li>Defender los derechos laborales de los trabajadores.</li>
          <li>Fomentar la unidad y la solidaridad entre nuestros agremiados.</li>
          <li>Garantizar mejores condiciones laborales para los trabajadores universitarios.</li>
          <li>Promover el desarrollo profesional de los docentes y personal administrativo.</li>
        </ul>
      </section>
  
      <!-- Services Section -->
      <section class="services">
        <h2>Servicios</h2>
        <div class="service-list">
          <div class="service-item">
            <h3>Asesoría Legal</h3>
            <p>Ofrecemos asistencia legal en temas laborales para todos nuestros miembros.</p>
          </div>
          <div class="service-item">
            <h3>Capacitación y Formación</h3>
            <p>Programas de formación continua y talleres para el desarrollo profesional.</p>
          </div>
          <div class="service-item">
            <h3>Representación Sindical</h3>
            <p>Representación en negociaciones con las instituciones educativas y autoridades laborales.</p>
          </div>
        </div>
      </section>
  
      
    </div>
  </template>
  
  <script>
  export default {
   name: 'PrincipalPage'
  };
  </script>
  
  <style scoped>
  .main-container {
    font-family: Arial, sans-serif;
    padding: 20px;
  }
  
  .hero {
    
    color: rgb(17, 13, 13);
    padding: 50px 20px;
    text-align: center;
  }
  
  .hero h1 {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }
  
  .hero p {
    font-size: 1.2rem;
  }
  
  .about-sindicate, .objectives, .services, .contact-info {
    margin: 40px 0;
  }
  
  .about-sindicate h2, .objectives h2, .services h2, .contact-info h2 {
    font-size: 2rem;
    margin-bottom: 10px;
    color: #0056b3;
  }
  
  .objectives ul {
    list-style-type: none;
    padding: 0;
  }
  
  .objectives li {
    font-size: 1.1rem;
    margin-bottom: 10px;
  }
  
  .services .service-list {
    display: flex;
    justify-content: space-between;
  }
  
  .services .service-item {
    background-color: #f0f0f0;
    padding: 20px;
    flex-basis: 30%;
    text-align: center;
  }
  
  .services .service-item h3 {
    color: #0056b3;
    margin-bottom: 10px;
  }
  
  .contact-info ul {
    list-style-type: none;
    padding: 0;
  }
  
  .contact-info li {
    font-size: 1rem;
    margin-bottom: 5px;
  }
  </style>
  