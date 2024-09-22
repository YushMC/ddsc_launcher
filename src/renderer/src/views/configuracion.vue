<template>
    <div class="ventana" data-aos="fade-down" data-aos-duration="1000">
      <div class="name_ventana">
        <h3>Configuración</h3>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
        <div class="container_inicio">
          <div class="content_card">
            <div style="margin: 2% 0;display: grid;grid-template-columns: 3fr 1fr 1fr; width:100%;gap:2%;">
              <router-link to="/change_rute" style="background: red;color: white;padding: 2%;border-radius: 5px;text-decoration: none">
                <h5>Cambia ubicación </h5>
                <h6>Ruta actual: {{ rutaBase }}</h6>
              </router-link>
              <button  @click.prevent="openFileExplorer">
                <h5>Abrir carpeta de persistentes</h5>
              </button>
              <button @click.prevent="openExplorerRaiz"> 
                <h5>Abrir carpeta raíz DDLC Launcher</h5>
              </button>
            </div>
            <div>
              <h5 style="text-align: center;
              position: relative;
              z-index: 80;
              background: rgba(255, 255, 255, 1);
              box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.1);
              padding: 2% 0;
              border-radius: 5px;
              ">Seleccionar fondo de pantalla</h5>
            </div>
            <div class="content_wallpapers" style="margin-top: -2%;">
              <img v-for="imageAPi in imagesApi"
                :src="imageAPi.src" 
                :key="imageAPi.id" 
                :title="imageAPi.title"
                @click="setAsBackground(imageAPi.src)"  
                :class="{
                   wallpaper: true, 
                   wallpaper_selected: imagen_seleccion_mostrar === imageAPi.src
                }"/>
              <img v-for="image in images"
               :src="image" 
               :key="image" 
               @click="setAsBackground(image)"  
               :class="{
                  wallpaper: true, 
                  wallpaper_selected: imagen_seleccion_mostrar === image
                  }"/>
            </div>
         </div>
      </div>
    </div>
</template>  
  
<script setup>
import { ref, onMounted } from 'vue'
import Swal from 'sweetalert2'
const imagen_seleccion_mostrar = ref('');

const imagesApi = ref([]);
// Lista de imágenes disponibles
const images = ref([
  //imagenes de mods
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
  'https://www.dokidokispanish.club/assets/gui/Winter_Neva.png',
  'https://www.dokidokispanish.club/assets/gui/Mauve.png'
]);

// Función para cambiar el fondo y guardar en localStorage
const setAsBackground = (image) => {
  imagen_seleccion_mostrar.value = image;
  localStorage.setItem('backgroundImage', image); // Guardar en localStorage
  document.body.style.backgroundImage = `url(${image})`; // Cambiar el fondo
  console.log('Imagen seleccionada:', imagen_seleccion_mostrar.value);
  Swal.fire({
        position: 'center',
        icon: "success",
        title: "Fondo seleccionado correctamente!" 
  });

};



// Abrir el explorador de archivos en la ruta deseada
const openFileExplorer = async () => {
  await window.api.openFolderPersistent()
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

onMounted(async () => {
  fetchBasePath();
  const savedImage3 = localStorage.getItem('backgroundImage');
  if (savedImage3) {
    imagen_seleccion_mostrar.value = savedImage3;
    console.log('Imagen guardada:', imagen_seleccion_mostrar.value);
  }
  // Cargar imágenes de la API al montar el componente
  try {
    const response = await fetch('https://www.dokidokispanish.club/api_ddsc/wallpapers'); // Reemplaza con tu URL de API
    const data = await response.json();
    imagesApi.value = data.results; // Asumiendo que la respuesta tiene un campo `images` que es un array
  } catch (error) {
    console.error('Error al cargar las imágenes:', error);
  }
})
</script>
  

<style scoped>
#changeRuta{
  color: white;
  text-align: center;
  background: red;
  padding: 5%;
  border-radius: 5px;
  text-decoration: none;
}
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
  border: solid 2px transparent;
}
.content_wallpapers .wallpaper_selected{
  border: solid 2px #e016d1 !important;
  background-color: rgba(255, 255, 255, 0.5) !important;
  box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.5) !important;
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