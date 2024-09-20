<template>
  <div class="ventana">
    <div class="name_ventana">
        <h3>Cambiar Ubicación</h3>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
    <div class="container_inicio">
      <h2 style="margin: 2% 0;">Colocar la nueva ubicación</h2>
      <div class="mod_files" style="grid-template-columns: 8fr 1fr 1fr 1fr 1fr;" >
        <input v-model="newRute" type="text" required placeholder="C:\ubicacion" name="ubicacion" >
        <button @click="pasteClipboard" class="image_button"  title="Pegar">
         <img src="./../assets/gui/pegar.png" alt="Pegar">
        </button>
        <button @click="openFolderNew" class="image_button" >
          <img src="./../assets/gui/open_folder.png" alt="abrir"  title="Abrir Explorador">
        </button>
        <button @click="createNewFolderAndCopy" class="image_button" >
          <img src="./../assets/gui/guardar.png" alt="Guardar"  title="Copiar archivos">
        </button>
        <button class="image_button" style="position: relative;">
          <img src="./../assets/gui/question.png" alt="about_name_mod">
          <div class="content_text_mod">
            <h4 style="padding: 5% !important;color: black !important;font-weight: 300;">Coloca/pega la ruta de la nueva ubicación de guardado.</h4>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
  
<script setup>
import { join } from 'lodash';
import Swal from 'sweetalert2'
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

const router = useRouter();

const newRute = ref('')


// Crear una referencia para almacenar los mods
const mods = ref([]);

// Función para pegar desde el portapapeles
const pasteClipboard = () => {
  newRute.value = window.api.pasteClipboard()
}

const getBasePath = async () => {
  try {
    const basePath = await window.api.getBasePath();
    return basePath;
  } catch (error) {
    Swal.fire('Error', `No se pudo obtener la ruta base: ${error.message}`, 'error');
    throw error;
  }
}
// Función para abrir el explorador de archivos y seleccionar una carpeta
const openFolderNew = async () => {
  const result = await window.api.selectFolder()
  if (!result.canceled) {
    newRute.value = result.filePaths[0]
  }
}
//crear la carpeta del mod
const createNewFolderAndCopy = async () => {
  try {
    const basePath = await getBasePath(); // Obtener la ruta base desde el archivo de configuración
    Swal.fire({
        title: `Creando nueva carpeta base \n${newRute.value}...`,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    // Crear la carpeta
    await window.api.createNewFolderRute(newRute.value);
    Swal.close(); 

    await copyToNewRuteDDLCFiles();


  } catch (error) {
    Swal.close();
    Swal.fire('Error', `Hubo un problema: ${error.message}`, 'error');
  }
}
//copiar archivos de DDLC
const copyToNewRuteDDLCFiles = async ()=>{
  try{
    const basePath = await getBasePath(); // Obtener la ruta base desde el archivo de configuración
    const src = `${basePath}\\DDLC-1.1.1-pc`;
    const dest = `${newRute.value}\\DDSC_Launcher\\DDLC-1.1.1-pc`;
    Swal.fire({
        title: 'Copiando archivos de DDLC base a la nueva carpeta...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    // Copiar archivos
    const { success, error } = await window.api.copyFolder({ src, dest });

    if (!success) {
      throw new Error(error);
    }
    Swal.close(); 
    Swal.fire({
        title: 'Copiando archivos de mods a la ubicación...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    // Copiar archivos
    const ruta_base = await getBasePath();
    console.log('ruta base actual: '+ruta_base);
    console.log('Ubicacion seleccionada: '+newRute.value)
    const srcMods = String(ruta_base)+ '\\mods';
    const destMods = String(newRute.value) + '\\DDSC_Launcher\\mods';
    console.log('ruta origen de mods: '+ srcMods);
    console.log('ruta destino: ' + destMods);

    await window.api.copyFolder({
    src: String(srcMods),
    dest: String(destMods)
    });
    Swal.close(); 
    Swal.fire({
        title: 'Eliminando carpetas antiguas...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      const basePathAntiguo = await window.api.getBasePath(); // Cambia esta ruta por la que necesites eliminar
      await window.api.deleteFolderOrFile(basePathAntiguo);
    Swal.close(); 
    Swal.fire({
        title: 'Actualizando rutas...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
      await window.api.deleteFileConfig();
      const newRuteValue = newRute.value; // Obtiene el valor del input
      await window.api.changeRuteConfig({ newRuteConfig: newRuteValue });
      Swal.close(); 
      Swal.fire('Éxito', 'Nueva ubicación con los archivos cargada correctamente', 'success');
  }catch(err){
    Swal.close()
    Swal.fire({
      icon: "error",
      title: `Ocurrio un problema!`,
      html: `Error: ${err}`
    });
  }
}

</script>
  

<style scoped>
.readonly-input {
  opacity: 0.5;
  display: none;
}
.readonly-input-2 {
  opacity: 0.5;
}
.ventana{
    border: solid 3px #e016d1;
    width: 100%;
    height: 99% !important;
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
hr{
  width: 90%;
    height: 3px;
    border: none;
    background: rgba(0, 0, 0, 0.5);
    opacity: 0.5;
}
button:hover > .content_text_mod{
  opacity: 1;
  visibility: visible;
}
.content_text_mod{
  position: absolute;
  background: white;
  color: black;
  width: 400% !important;
  padding: 2%;
  border: solid 2px black;
  border-radius: 10px;
  z-index: 100;
  right: 0;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.5);
  text-align: left;
  margin: 0 !important;
  gap: 0 !important;
  display: flex !important;
  justify-content: center !important;
  align-items: center;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s linear;
}

.container_inicio{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 93%;
    border-radius: 5px;
    background-image: url('https://www.dokidokispanish.club/assets/ddlc/gui/tilebg.png');
    background-repeat: repeat;
    background-size: inherit;
    animation: fondo_moc linear infinite 60s;
    
}
.container_inicio div{
  margin: 1% 0;
  display: flex;
  justify-content: space-around;
}
label{
  font-weight: 600;
  margin: 2% 0;
}
.container_inicio div{
  width: 90%;
  display: grid;
  grid-template-columns: 8fr 1fr;
  gap: 2%;
}
.container_inicio .mod_files{
  width: 90%;
  display: grid;
  grid-template-columns: 8fr 1fr 1fr 1fr;
  gap: 2%;
}
.container_inicio div input{
  padding: 0.5%;
}
.image_button{
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
}
.image_button img{
  width: 40%;
}
button{
  width: 100%;
  padding: 1%;
  color: white;
  background: #e016d1;
  border-radius: 10px;
  cursor: pointer;
  border: none;
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