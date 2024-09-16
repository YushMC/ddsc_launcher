<template>
    <div class="ventana" data-aos="fade-down" data-aos-duration="1000">
      <div class="name_ventana">
        <h3>Configuración</h3>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
        <div class="container_inicio">
          <div class="content_card">
            <div style="display: grid;grid-template-columns: repeat(3,1fr);width: 80%; gap: 2%;">
              <button @click="cambiarFolder" style="background-color: red;"><i class="fa-solid fa-rotate-right"></i> Cambiar ubicación</button>
            
            
              <button @click="openFileExplorer"><i class="fa-solid fa-file-shield"></i> Abrir carpeta de archivos persistentes</button>
            
              <button @click="openExplorerRaiz"><i class="fa-regular fa-folder-open"></i> Abrir carpeta raiz</button>
            </div>
            <div>
              <h5 style="text-align: center;">Seleccionar fondo de pantalla</h5>
              <hr>
            </div>
            <div class="content_wallpapers">
              <img v-for="image in images" :src="image" :key="image" @click="setAsBackground(image)" class="wallpaper" />
            </div>
         </div>
      </div>
    </div>
</template>  
  
<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'

// Lista de imágenes disponibles
const images = ref([
  //imagenes de mods
  'https://www.dokidokispanish.club/assets/capturas/Celestial_Restraint/sayo1.png',
  'https://www.dokidokispanish.club/assets/capturas/meni_cuquis/cap_1.png',
  'https://www.dokidokispanish.club/assets/capturas/esquizofrenia/banner.jpg',
  'https://www.dokidokispanish.club/assets/capturas/mexican_club/ddmc.gif',
  'https://www.dokidokispanish.club/assets/capturas/mexican_club/cap_1.png',
  'https://www.dokidokispanish.club/assets/capturas/christmas_time/cap_1.png',
  'https://www.dokidokispanish.club/assets/capturas/Doki_Doki_Recovery_Project/140%20sin%20t%C3%ADtulo_20240826160042.png',
  //imagenes o edits de escenas del ddlc
  'https://www.dokidokispanish.club/assets/ddlc/cgs/1.png',
  'https://www.dokidokispanish.club/assets/ddlc/cgs/2.png',
  'https://www.dokidokispanish.club/assets/ddlc/cgs/3.png',
  'https://www.dokidokispanish.club/assets/ddlc/cgs/4.png',
  'https://www.dokidokispanish.club/assets/ddlc/cgs/5.png',
  'https://www.dokidokispanish.club/assets/ddlc/cgs/6.png',
  'https://www.dokidokispanish.club/assets/ddlc/cgs/7.png',
  'https://www.dokidokispanish.club/assets/ddlc/cgs/8.png',
  'https://www.dokidokispanish.club/assets/ddlc/cgs/9.png',
  'https://www.dokidokispanish.club/assets/ddlc/cgs/10.png',
  'https://www.dokidokispanish.club/assets/capturas/Doki_Chronicles_Longing_to_Burn_Alpha/3image.png',
  'https://www.dokidokispanish.club/assets/capturas/Doki_Chronicles_Longing_to_Burn_Alpha/4image.png',
  //imagenes por defecto
  'https://www.dokidokispanish.club/assets/gui/banner_inicio.jpg',
  'https://www.dokidokispanish.club/assets/gui/Dania.png',
  'https://www.dokidokispanish.club/assets/gui/Mauve.png'
]);

// Función para cambiar el fondo y guardar en localStorage
const setAsBackground = (image) => {
  localStorage.setItem('backgroundImage', image); // Guardar en localStorage
  document.body.style.backgroundImage = `url(${image})`; // Cambiar el fondo
};

// Abrir el explorador de archivos en la ruta deseada
const openFileExplorer = async () => {
  await window.api.openFolderPersistent()
}
const cambiarFolder = async () => {
  Swal.fire({
      icon: "info",
      title: `Se abrirá la antigua ubicación.`,
      html: `Si cuenta con archivos de mods, así como los archivos originales de DDLC, te recomendamos copiarlos y pegarlos en la nueva ubicación.<br><b>Los archivos no se eliminarán</b><br><br>Para acceder a la nueva ubicación, ve a inicio, escoge la nueva ubicación y abre la carpeta raiz desde la configuración.`
    });
  await window.api.openFolderRaiz()
  await window.api.deleteFileConfig()
}
const openExplorerRaiz = async () => {
  await window.api.openFolderRaiz()
}

const rutaBase = ref('')

// Función para obtener la ruta base desde el main process
const fetchBasePath = async () => {
  try {
    rutaBase.value = await window.api.getBasePath()
  } catch (error) {
    console.error('Error al obtener la ruta base:', error)
  }
}

onMounted(() => {
  fetchBasePath()
  const savedImage = localStorage.getItem('backgroundImage');
  if (savedImage) {
    document.body.style.backgroundImage = `url(${savedImage})`;
  }
})
</script>
  

<style scoped>
.ventana{
  width: 100%;
  height: 99% !important;
    border: solid 3px #e016d1;
    background: #e016d1;
    border-radius: 5px;
    filter: drop-shadow(5px 5px 10px black);
    height: 100%;
    overflow: hidden;
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
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    background-image: url('https://www.dokidokispanish.club/assets/ddlc/gui/tilebg.png');
    background-repeat: repeat;
    background-size: inherit;
    animation: fondo_moc linear infinite 60s;
    
}
.content_card{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(2px);
  overflow: auto;
  padding:  1% !important;
}
.content_card  > div{
  width: 90%;
  margin: 1% 0 ;
}

label{
  font-weight: 600;
  margin: 2% 0;
}
.container_inicio div input{
  padding: 0.5%;
  opacity: 0.5;
}
.image_button{
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.5;
}
.image_button img{
  width: 40%;
}
button{
  width: 100%;
  padding: 5%;
  color: white;
  background: #e016d1;
  border-radius: 10px;
  cursor: pointer;
  border: none;
}
.content_wallpapers{
  width: 100%;
  display: flex !important;
  flex-wrap: wrap;
  gap: 2%;
  overflow-y: scroll !important;
  padding: 2%;
}
.content_wallpapers .wallpaper{
  width: 48% !important;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 1%;
  border-radius: 5px;
  margin: 1% 0;
  border: solid 2px black;
}
.wallpaper img{
  width: 100%;
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