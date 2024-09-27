<template>
  <div class="ventana" data-aos="fade-down" data-aos-duration="1000"
  :style="{ left: position.x + 'px', top: position.y + 'px' }" @mousedown="startDragging"
  >
    <div class="name_ventana" @mousedown.stop="startDragging">
        <h3>Modo Desarollador (Crear mod)</h3>
        <a href="https://launcher.dokidokispanish.club/codigo%20splash%20con%20launcher.txt" target="_blank" style="border-radius:5px;padding: 0.5%; border: solid 2px #fff;color:#fff;">Descargar compatibilidad</a>
        <router-link 
        :to="{ name: 'Navegador', query: { url: 'https://launcher.dokidokispanish.club/docs#dev' } }" 
        id="ayuda">Ayuda</router-link>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
    <div class="container_inicio">
      <div v-if="!isFileDeckpack || !isFileUnRPYC" style="display: flex;flex-direction: column;">
        <h3 style="color:#000">Selecciona la carpeat con los archivos depack.rpy y un.rpyc</h3>
        <div style="display: grid;grid-template-columns: 4fr 1fr 1fr; gap: 2%">
          <input type="text" v-model="depackFile" placeholder="../depack.rpy">
          <button @click="openFolderRpy" class="image_button"  >
            <img src="./../assets/gui/open_folder.png" alt="abrir"  title="Abrir Explorador">
          </button>
          <button @click="copyFilesRPY(depackFile)">Cargar</button>
        </div>
      </div>
      <div v-if="isFileUnRPYC && isFileDeckpack" style="display: flex;flex-direction: column;">
        <h2>1. Nombre de tu proyecto</h2>
        <div style=" grid-template-columns: 8fr 1fr 1fr;">
          <input
            v-model="modNameProyect"
            type="text"
            required
            placeholder="Coloca un nombre"
            
            
          />
          <button @click="createFolderAndCopyProyect" title="Crear Carpeta" class="image_button" >
            <img src="./../assets/gui/guardar.png" alt="Guardar">
          </button>
          <button class="image_button" style="position: relative;" >
            <img src="./../assets/gui/question.png" alt="about_name_mod">
            <div class="content_text_mod">
              <h4 style="padding: 5% !important;color: black !important;font-weight: 300;">En esta sección podrás agregar un nombre para guardar el mod<br>La carpeta tendrá este mismo nombre</h4>
            </div>
          </button>
        </div>
        <hr style="margin: 2% 0;">
        <div style="width: 90%; display: grid;gap: 2%;grid-template-columns: 10fr 1fr;margin: 2% 0;" >
          <button @click="copyDDLCFilesProyect" >Cargar archivos base de DDLC y de desarollo (Primer paso)</button>
          <button class="image_button" style="position: relative;" >
            <img src="./../assets/gui/question.png" alt="about_name_mod">
            <div class="content_text_mod">
              <h4 style="padding: 5% !important;color: black !important;font-weight: 300;">Se necesita tener los archivos de ddlc original<br><b>Haz click en este botón para agregarlos a la carpeta del proyecto y agregar los archivos de desarrollador.</b></h4>
            </div>
          </button>
        </div>
        <hr style="margin: 2% 0;">
        <div style="width: 90%; display: grid;gap: 2%;grid-template-columns: 10fr 1fr;margin: 2% 0;" >
          <button @click="copyRPYCProyect" >Continuar con la configuración (Segundo paso)</button>
          <button class="image_button" style="position: relative;" >
            <img src="./../assets/gui/question.png" alt="about_name_mod">
            <div class="content_text_mod">
              <h4 style="padding: 5% !important;color: black !important;font-weight: 300;">Como requisito se necesitan traducir los archivos de código<br><b>Haz click en este botón para continuar con el proceso.</b></h4>
            </div>
          </button>
        </div>
        <hr style="margin: 2% 0;">
        <div style="width: 90%; display: grid;gap: 2%;grid-template-columns: 10fr 1fr;margin: 2% 0;" >
          <button @click="deleteFilesProyect" >Terminar con la configuración (Ultimo paso)</button>
          <button class="image_button" style="position: relative;" >
            <img src="./../assets/gui/question.png" alt="about_name_mod">
            <div class="content_text_mod">
              <h4 style="padding: 5% !important;color: black !important;font-weight: 300;">Finaliza la configuracion con este botón<br><b>Limpiar archivos antes de finalizar es de importancia.</b></h4>
            </div>
          </button>
        </div>
      </div>
      <button @click="cancelar_modProyect" style="background: red;position: absolute;bottom: 1%; right: 1%;width: 20%;">Cancelar</button>
    </div>
  </div>
</template>
  
<script setup>
import { onMounted, ref } from 'vue';
import Swal from 'sweetalert2';
const props = defineProps({
  title: String,
  initialPosition: {
    type: Object,
    default: () => ({ x: 150, y: 20 })
  }
});
const depackFile = ref('');
// Función para abrir el explorador de archivos y seleccionar una carpeta
const openFolderRpy = async () => {
    const result = await window.api.selectFolder()
    if (!result.canceled) {
      depackFile.value = result.filePaths[0]
    }
}

const isFileDeckpack = ref(null);
const isFileUnRPYC = ref(null);

const copyFilesRPY = async (rute)=>{
  Swal.fire({
    title: 'Iniciando la copia de archivos de desarrollador...',
    html: 'Copiando archivos...',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
  try{
  const basePath = await window.api.getBasePath();
  const { success, error } = await window.api.copyModFolder({
    src: String(rute),
    dest: String(basePath)
  });
  if (success) {
    Swal.fire('Archivos cargados!', 'Los archivos de desarrollador fueron copiados correctamente.', 'success');
    
  } else {
    Swal.fire('Error', `Error al copiar archivos: ${error}`, 'error');
  }
  isFileDeckpack.value = true
  isFileUnRPYC.value = true
}catch(err){

}
}
const modNameProyect = ref('')
//crear la carpeta del mod
const createFolderAndCopyProyect = async () => {
  if (!modNameProyect.value) {
    Swal.fire('Error', 'Debes colocar un nombre para el mod', 'error');
    return;
  }

  try {
    const modFolder = modNameProyect.value.trim()+' dev';
    //const modPath = `${basePath}\\mods\\${modFolder}`;
    Swal.fire({
        title: `Creando carpeta del mod \n${modFolder}...`,
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    // Crear la carpeta
    await window.api.createModFolder(modFolder);
    
    Swal.close(); 
  } catch (error) {
    Swal.close();
    Swal.fire('Error', `Hubo un problema: ${error.message}`, 'error');
  }
}

const copyDDLCFilesProyect = async ()=>{
  try{
    const basePath = await await window.api.getBasePath(); // Obtener la ruta base desde el archivo de configuración
    const modFolder = modNameProyect.value.trim()+' dev';
    const modPath = `${basePath}\\mods\\${modFolder}`;
    const src = `${basePath}\\DDLC-1.1.1-pc`;
    const dest = `${modPath}\\DDLC-1.1.1-pc`;
    Swal.fire({
        title: 'Copiando archivos de DDLC base a la carpeta...',
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
    await copyRPYCFilesProyect();
  }catch(err){
    Swal.close()
    Swal.fire({
      icon: "error",
      title: `Ocurrio un problema!`,
      html: `Error: ${err}`
    });
  }
}

const copyRPYCFilesProyect = async ()=>{
  try{
    const basePath = await window.api.getBasePath(); // Obtener la ruta base desde el archivo de configuración
    const modFolder = modNameProyect.value.trim()+' dev';
    const modPath = `${basePath}\\mods\\${modFolder}`;
    const src = `${basePath}\\depack.rpy`;
    const dest = `${modPath}\\DDLC-1.1.1-pc\\game\\depack.rpy`;
    Swal.fire({
        title: 'Copiando archivos de RPY a la carpeta...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    // Copiar archivos
    const { success, error } = await window.api.copyFiles({ 
      src: String(src),
      dest: String(dest) 
    });

    if (!success) {
      throw new Error(error);
    }
    Swal.close(); 
    runMod();
  }catch(err){
    Swal.close()
    Swal.fire({
      icon: "error",
      title: `Ocurrio un problema!`,
      html: `Error: ${err}`
    });
  }
}

const copyRPYCProyect = async ()=>{
  try{
    const basePath = await window.api.getBasePath(); // Obtener la ruta base desde el archivo de configuración
    const modFolder = modNameProyect.value.trim()+' dev';
    const modPath = `${basePath}\\mods\\${modFolder}`;
    const fileRPY = `${modPath}\\DDLC-1.1.1-pc\\game\\depack.rpy`;
    const fileRPYc = `${modPath}\\DDLC-1.1.1-pc\\game\\depack.rpyc`;
    Swal.close();
    Swal.fire({
        title: 'Continuando con la configuración...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    // Copiar archivos
    await window.api.deleteFFile(String(fileRPY));
    
    await window.api.deleteFFile(String(fileRPYc));
    
    Swal.close();
    Swal.fire({
        title: 'Copiando archivos desempaquetados a la carpeta...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
    });
    const game_mod = `${modPath}\\DDLC-1.1.1-pc\\game`;
    const unpacked_game = `${modPath}\\DDLC-1.1.1-pc\\unpacked\\game`;
    await window.api.copyModFolder({
      src: String(unpacked_game),
      dest: String(game_mod)
    });

    const src_un = `${basePath}\\un.rpyc`;
    const dest_un = `${modPath}\\DDLC-1.1.1-pc\\game\\un.rpyc`;
    Swal.close();
    Swal.fire({
        title: 'Copiando archivos de RPY a la carpeta...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    // Copiar archivos
    await window.api.copyFiles({ 
      src: String(src_un),
      dest: String(dest_un) 
    });
    Swal.close(); 
    runModBatProyect();
  }catch(err){
    Swal.close()
    Swal.fire({
      icon: "error",
      title: `Ocurrio un problema!`,
      html: `Error: ${err}`
    });
  }
}

const runMod = async () => {
  Swal.fire({
      position: 'center',
      title: "Ejecutando: " + modNameProyect.value +' dev en modo de configuración de desarrollo',
      html: '<i>En algunos mods es necesario ejecutar 2 veces para su reproducción.</i>',
      allowOutsideClick: true,
      showConfirmButton: true,
      didOpen: () => {
        Swal.showLoading();
      }
  });
  try{
    await window.api.runMod(modNameProyect.value+' dev')
  }catch{

  }
  Swal.close();
  Swal.fire({
      position: 'center',
      icon: "success",
      title: "Ejecutando: " + modNameProyect.value + ' dev',
      html: '<b>IMPORTANTE:</b><br>Cierra la ventana del juego y regresa a esta sección para continuar con la configuración.'
  }) 
}
// Método para ejecutar el archivo .bat
const runModBatProyect = async () => {
  const modPath = await window.api.getBasePath(); // Ruta base para los mods (ajústala según sea necesario)
  const batFilePath = `${modPath}\\mods\\${modNameProyect.value} dev\\iniciar_mod.bat`; // Ruta del archivo .bat
  console.log("ruta bat: ", batFilePath) 
  Swal.fire({
    title: `Se abrirá una ventana CMD para ejecutar el mod \n${modNameProyect.value}...`,
    icon: 'warning',
    allowOutsideClick: true,
    showConfirmButton: true,
    confirmButtonText: 'Cerrar',
    
  });

  try {
    await window.electron.runBatFile(batFilePath);
    Swal.close();
    Swal.fire(
      'CMD',
      'Ejecutando en modo CDM.',
      'success'
    );
    console.log('Archivo .bat ejecutado con éxito');
    
  } catch (err) {
    console.error('Error al ejecutar runModBat:', err);
  }
};
const deleteFilesProyect = async ()=>{
  try{
    const basePath = await window.api.getBasePath();

    const filePath = `${basePath}\\mods\\${modNameProyect.value} dev\\DDLC-1.1.1-pc\\unpacked`;  // Cambia esta ruta por la que necesites eliminar
    Swal.close();
    Swal.fire({
        title: 'Finalizando con la configuración...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    await window.api.deleteFolderOrFile(filePath);    
    Swal.close();
    Swal.fire({
        title: 'Finalizando con la configuración 2...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    Swal.close();
    Swal.fire('Instalación lista', 'Ahora puedes empezar a crear tus mods!', 'success');
  }catch(err){

  }
}
const cancelar_modProyect = async ()=>{
  if(modNameProyect.value == ''){
    return
  }
  try{
        const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás deshacer esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar',
      })

        if (result.isConfirmed) {
          // Aquí pones la acción a ejecutar si el usuario confirma
          Swal.close(); 
          Swal.fire({
            title: `Eliminando carpeta del mod \n${modNameProyect.value}...`,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
            try{
                const basePath = await window.api.getBasePath();

                const filePath = `${basePath}\\mods\\${modNameProyect.value} dev`;  // Cambia esta ruta por la que necesites eliminar
                const { success, message } = await window.api.deleteFolderOrFile(filePath);

                Swal.close(); // Cierra el swal de carga si el proceso terminó
                if (success) {
                    console.log('Eliminación exitosa:', message);
                    // Aquí puedes mostrar una alerta o notificación de éxito
                    Swal.fire(
                        'Eliminado!',
                        'Tu archivo ha sido eliminado.',
                        'success'
                    )
                } else {
                    Swal.fire({
                        icon: "error",
                        title: `Error al eliminar carpeta del mod \n${modName.value}`,
                        html: `Error: ${message}`
                      });
                    console.error('Error al eliminar:', message);
                    // Aquí puedes mostrar una alerta o notificación de error
                }
            }catch(err){
                Swal.close();
                Swal.fire({
                    icon: "error",
                    title: `Ocurrio un problema!`,
                    html: `Error: ${err}`
                });
            }
        }

    }catch(err){
        Swal.close();
        Swal.fire({
            icon: "error",
            title: `Ocurrio un problema!`,
            html: `Error: ${err}`
        });
    }
  modNameProyect.value= ''
}

const position = ref({ ...props.initialPosition });
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });

function startDragging(event) {
  isDragging.value = true;
  offset.value.x = event.clientX - position.value.x;
  offset.value.y = event.clientY - position.value.y;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDragging);
}

function onDrag(event) {
  if (isDragging.value) {
    position.value.x = event.clientX - offset.value.x;
    position.value.y = event.clientY - offset.value.y;
  }
}

function stopDragging() {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDragging);
}
onMounted(async ()=>{
  try{
  isFileDeckpack.value = await window.api.checkDepackExists();
  isFileUnRPYC.value = await window.api.checkUnRPYCkExists();

  }catch(err){

  }
})
</script>
  

<style scoped>
.readonly-input {
  opacity: 0.5;
  display: none;
}
.readonly-input-2 {
  opacity: 0.5;
}
#ayuda{
  color: #fff;
  padding:0.5% 2%;
  border-radius: 5px;
  border: 2px solid #fff;
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