<script setup>
import { ref, onMounted } from 'vue'
import Header from './components/Header.vue'
import UpdateProgress from './components/UpdateProgress.vue';
import Music from './components/music.vue';
import Swal from 'sweetalert2'

const appVersion = ref('');
const isOnline = ref(navigator.onLine);

const savedImage = localStorage.getItem('backgroundImage');
if (!isOnline) {
  document.body.style.backgroundImage = `linear-gradient(to right, #7f7fd5, #86a8e7, #91eae4)`;
}else{
  if(savedImage){
    document.body.style.backgroundImage = `url(${savedImage})`;
  }
}
// :style="{ backgroundImage: `url(${backgroundImage})` }"


onMounted(async () => {
  // Verificar si hay conexión al iniciar
  checkConnectionStatus();
  // Escuchar cambios en la conexión
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
  try {
    // Llama a la función expuesta en preload.js
    appVersion.value = await window.electron.getAppVersion();
  } catch (error) {
    console.error('Error al obtener la versión de la aplicación:', error);
  }
  Swal.fire({
    icon: "info",
    title: `Bienvenidos a DDSC Launcher v`+appVersion.value,
    html: `<b>Atención:</b><br><br>Este software (DDSC Launcher) esta hecho por fans de Doki Doki Literature CLub (DDLC), los cuales no estamos afiliados con <a href="https://teamsalvato.com/games" target="_blank">Team Salvato</a>.
    <br><br>Para una mayor experiencia, recomendamos ejecutar DDSC Launcher despues de haber juagado DDLC!`
  });

})

function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
}

function checkConnectionStatus() {
  isOnline.value = navigator.onLine;
}
</script>

<template>
  <div class="content_app">
    <UpdateProgress />
    <div class="content_router">
      <router-view  ></router-view>
    </div>
    <Header></Header>
    <!-- 
    <img src="./assets/gui/beta.png" id="beta_add">
    -->
    <Music></Music>
  </div>
  
</template>
<style scoped>

.content_app {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100%;
  background-size: cover; /* Ajusta el tamaño del fondo si es necesario */
  background-position: center; /* Centra el fondo si es necesario */
}
.content_app .content_router{
  width: 100%;
  height: 94%;
  display: flex;
  transition: all 1s linear;
}
</style>