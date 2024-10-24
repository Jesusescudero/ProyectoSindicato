<template>
  <div class="dashboard-container">
    <h1 class="text-center">Bienvenido al Panel de Usuario</h1>
    <p class="text-center">Has iniciado sesión correctamente. Aquí puedes acceder a los recursos disponibles solo para usuarios registrados.</p>
    
    <!-- Tarjetas de navegación para diferentes secciones -->
    <div class="row mt-4">
      <div class="col-md-4">
        <div class="card shadow-lg p-4 mb-4">
          <h4 class="text-center">Mis Datos</h4>
          <p class="text-center">Accede a la información de tu cuenta y edita tus datos personales.</p>
          <button class="btn btn-primary w-100">Ver mis datos</button>
        </div>
      </div>
      
      <div class="col-md-4">
        <div class="card shadow-lg p-4 mb-4">
          <h4 class="text-center">Documentos del Sindicato</h4>
          <p class="text-center">Accede a documentos importantes y comunicados.</p>
          <button class="btn btn-primary w-100">Ver documentos</button>
        </div>
      </div>

      <div class="col-md-4">
        <div class="card shadow-lg p-4 mb-4">
          <h4 class="text-center">Beneficios</h4>
          <p class="text-center">Consulta los beneficios que tienes como miembro del sindicato.</p>
          <button class="btn btn-primary w-100">Ver beneficios</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'BienbenidaUser',
};
</script>

<style scoped>
.dashboard-container {
  margin-top: 50px;
}

.card {
  background-color: #f8f9fa;
  border-radius: 10px;
  transition: transform 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
}

h1, h4 {
  color: #343a40;
}

p {
  color: #6c757d;
}
</style>
