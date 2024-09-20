<template>
    <div class="ventana">
      <div class="name_ventana">
        <h3>Navegador</h3>
        <h6 style="color:white;">Esta versión no soporta el sistema de cuentas!</h6>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
        <div class="container_inicio">
            <iframe 
              :src="url" 
              width="100%" 
              height="94%" 
              frameborder="0">
            </iframe>
      </div>
    </div>
</template>  
  
<script setup>
// Recibe la prop 'url' desde la ruta
const props = defineProps({
  url: {
    type: String,
    required: true,
    default: 'https://www.dokidokispanish.club/'
  }
});
</script>
  

<style scoped>
.ventana{
  width: 100%;
  height: 99% !important;
    border: solid 3px #e016d1;
    background: #e016d1;
    border-radius: 5px;
    filter: drop-shadow(5px 5px 10px black);
}
.ventana h3{
    margin-left: 1%;
    color: white;
}
.name_ventana{
  width: 100%;
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.name_ventana > a{
  text-decoration: none;
  margin-right: 2%;
}
.name_ventana > a > h3:last-child{
  font-size: 2em;
  padding: 0 1%;
}
.container_inicio{
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    background-image: url('https://www.dokidokispanish.club/assets/ddlc/gui/tilebg.png');
    background-repeat: repeat;
    background-size: inherit;
    animation: fondo_moc linear infinite 60s;
    
}
@keyframes fondo_moc{
  0%{
      background-position:0% 0%;
  }
  100%{
      background-position:100% 100%;
  }
}
</style>