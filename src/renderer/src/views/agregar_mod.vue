<template>
  <div class="ventana" data-aos="fade-down" data-aos-duration="1000"
  :style="{ left: position.x + 'px', top: position.y + 'px' }" @mousedown="startDragging"
  >
    <div class="name_ventana" @mousedown.stop="startDragging">
        <h3>Agregar Mod</h3>
        <router-link 
        :to="{ name: 'Navegador', query: { url: 'https://launcher.dokidokispanish.club/docs#modo_manual' } }" 
        id="ayuda">Ayuda</router-link>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
    <div class="container_inicio">
      <h2>1. Nombre del mod</h2>
      <div style=" grid-template-columns: 8fr 1fr 1fr;">
        <input
          v-model="modName"
          type="text"
          list="list-mods"
          required
          @input="handleInput"
          placeholder="Coloca un nombre"
          :readonly="isReadonly"
          :class="{ 'readonly-input-2': isReadonly }"
        />

        <datalist id="list-mods">
          <option v-for="mod in filteredMods" :key="mod" :value="mod">{{ mod }}</option>
        </datalist>
        <button @click="createFolderAndCopy" title="Crear Carpeta" class="image_button" :class="{ 'readonly-input': isReadonly }">
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
      <button @click="copyDDLCFiles" :class="{ 'readonly-input': isReadonly2 }">Cargar archivos base de DDLC (Opcional)</button>
      <button class="image_button" style="position: relative;" :class="{ 'readonly-input': isReadonly2 }">
          <img src="./../assets/gui/question.png" alt="about_name_mod">
          <div class="content_text_mod">
            <h4 style="padding: 5% !important;color: black !important;font-weight: 300;">Algunos mods necesitan tener los archivos de ddlc original<br><b>Haz click en este botón si el mod los necesita.</b></h4>
          </div>
        </button>
      </div>
      <hr>
      <h2 style="margin: 2% 0;">2. Ubicación del mod</h2>
      <div class="mod_files" style="grid-template-columns: 8fr 1fr 1fr 1fr 1fr;" :class="{ 'readonly-input': isReadonly2 }">
        <input v-model="modFiles" type="text" required placeholder="C:\ubicacion" name="ubicacion" :readonly="isReadonly2" >
        <button @click="pasteClipboard" class="image_button"  title="Pegar" :class="{ 'readonly-input': isReadonly2 }">
         <img src="./../assets/gui/pegar.png" alt="Pegar">
        </button>
        <button @click="openFolder" class="image_button" :class="{ 'readonly-input': isReadonly2 }" >
          <img src="./../assets/gui/open_folder.png" alt="abrir"  title="Abrir Explorador">
        </button>
        <button @click="copyFilesToModFolder" class="image_button" :class="{ 'readonly-input': isReadonly2 }">
          <img src="./../assets/gui/guardar.png" alt="Guardar"  title="Copiar archivos">
        </button>
        <button class="image_button" style="position: relative;">
          <img src="./../assets/gui/question.png" alt="about_name_mod">
          <div class="content_text_mod">
            <h4 style="padding: 5% !important;color: black !important;font-weight: 300;">Coloca/pega la ruta de los archivos del mod o buscalo en el explorador de archivos<br><br>Si el mod <b>necesita los archivos de DDLC</b>, da click en la opción anterior <b>ANTES de continuar este paso</b>.</h4>
          </div>
        </button>
      </div>
      <button v-if=" isReadonly" @click="cancelar_mod" style="background: red;position: absolute;bottom: 1%; right: 1%;width: 20%;">Cancelar</button>
    </div>
  </div>
</template>
  
<script setup>
import Swal from 'sweetalert2'
import { ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

import axios from 'axios';

const router = useRouter();

const modName = ref('')
const isReadonly = ref(false);
const isLoading = ref(false); // Estado para controlar el cursor
const isDataLoaded = ref(false);
const isReadonly2 = ref(true);

const cancelar_mod = async ()=>{
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
            title: `Eliminando carpeta del mod \n${modName.value}...`,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
            try{
                const basePath = await window.api.getBasePath();

                const filePath = `${basePath}\\mods\\${modName.value}`;  // Cambia esta ruta por la que necesites eliminar
                const { success, message } = await window.api.deleteFolderOrFile(filePath);

                Swal.close(); // Cierra el swal de carga si el proceso terminó
                if (success) {
                    console.log('Eliminación exitosa:', message);
                    // Aquí puedes mostrar una alerta o notificación de éxito
                    Swal.fire(
                        'Eliminado!',
                        'Tu archivo ha sido eliminado.',
                        'success'
                    ).then(() => {
                      router.push('/agregar');// Recargar la página
                    });
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
  modName.value= ''
  isReadonly.value = false;
}

const props = defineProps({
  title: String,
  initialPosition: {
    type: Object,
    default: () => ({ x: 150, y: 20 })
  }
});

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

// Crear una referencia para almacenar los mods
const mods = ref([]);

const filteredMods = computed(() => {
  return mods.value.filter(mod => mod.toLowerCase().includes(modName.value.toLowerCase()));
});

const fetchMods = async () => {
  try {
    const response = await axios.get('https://www.dokidokispanish.club/api_ddsc/mods/traductions_and_mods');
    mods.value = response.data.results.map(mod => mod.nombre);
    isDataLoaded.value = true;
  } catch (error) {
    console.error('Error fetching mods:', error);
    Swal.close()
    Swal.fire({
      icon: "info",
      title: `Sin conexion a internet`,
      html: `La sugerencia de nombres esta desactivada<br>conectate a internet para reactivar`
    });
  }
};
const debounce = (func, wait) => {
  let timeout;
  return function(...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
};

const handleInput = debounce(() => {
  // Maneja la entrada aquí si es necesario
}, 300); // 300 ms de retraso

// Función para pegar desde el portapapeles
const pasteClipboard = () => {
  modFiles.value = window.api.pasteClipboard()
}
// Cambiar el cursor a "cargando" (espera) 
const setLoadingCursor = () => {
  document.body.style.cursor = 'progress';
  isLoading.value = true;
};

// Restablecer el cursor al estado predeterminado
const resetCursor = () => {
  document.body.style.cursor = 'default';
  isLoading.value = false;
};

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
const openFolder = async () => {
  const result = await window.api.selectFolder()
  if (!result.canceled) {
    modFiles.value = result.filePaths[0]
  }
}
//crear la carpeta del mod
const createFolderAndCopy = async () => {
  if (!modName.value) {
    Swal.fire('Error', 'Debes colocar un nombre para el mod', 'error');
    return;
  }

  try {
    setLoadingCursor(); // Cambiar cursor a "cargando"
    const basePath = await window.api.getBasePath(); // Obtener la ruta base desde el archivo de configuración
    const modFolder = modName.value.trim();
    const modPath = `${basePath}\\mods\\${modFolder}`;
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
    isReadonly.value = true
    isReadonly2.value = false
    Swal.close(); 
  } catch (error) {
    Swal.close();
    Swal.fire('Error', `Hubo un problema: ${error.message}`, 'error');
  }
  resetCursor();
}
//copiar archivos de DDLC
const copyDDLCFiles = async ()=>{
  try{
    const basePath = await window.api.getBasePath(); // Obtener la ruta base desde el archivo de configuración
    const modFolder = modName.value.trim();
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
    Swal.fire('Éxito', 'Carpeta con archivos base creada correctamente', 'success');
    resetCursor();
  }catch(err){
    Swal.close()
    Swal.fire({
      icon: "error",
      title: `Ocurrio un problema!`,
      html: `Error: ${err}`
    });
  }
}

const modFiles = ref('');

const copyFilesToModFolder = async () => {
  if (!modName.value || !modFiles.value) {
    Swal.fire('Error', 'Debes colocar un nombre para el mod y seleccionar la carpeta de archivos', 'error');
    return;
  }

  try {
    setLoadingCursor(); // Cambiar cursor a "cargando"
    // Obtener la ruta base desde config.json
    const basePath = await window.api.getBasePath();

    const src = modFiles.value.trim();
    const dest = `${basePath}\\mods\\${modName.value.trim()}\\DDLC-1.1.1-pc`;

    // Copia de archivos
    await startCopy(src,dest)
  }catch(err){
    console.log("Error: ",err)
    Swal.close()
    Swal.fire({
      icon: "error",
      title: `Ocurrio un problema!`,
      html: `Error: ${err}`
    });
  }
};
window.api.onCopyProgress((data) => {
    progresso2.value = Math.round((data.currentFile / data.totalFiles) * 100);
    currentFileName.value = data.fileName;

    // Actualizar el SweetAlert con el progreso
    Swal.update({
      title: 'Copiando archivos...',
      html: `Archivo actual: ${currentFileName.value}`,
      didOpen: () => {
        Swal.showLoading();
      }
    });
  });

// Iniciar la copia de archivos y mostrar la alerta
async function startCopy(src_ruta,dest_ruta) {
  Swal.fire({
    title: 'Iniciando la copia...',
    html: 'Copiando archivos...',
    showConfirmButton: false,
    allowOutsideClick: false,
    allowEscapeKey: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });



  const { success, error } = await window.api.copyModFolder({
    src: String(src_ruta),
    dest: String(dest_ruta)
  });

  

  if (success) {
    Swal.fire('Mod Cargado!', 'Todos los archivos del mod fueron copiados correctamente.', 'success');
    resetCursor();
  } else {
    Swal.fire('Error', `Error al copiar archivos: ${error}`, 'error');
  }
}
onMounted(async () => {
  fetchMods();
 try{
  const folderExists = await window.api.checkFolderExists();
    if (!folderExists) {
      router.push({ name: 'DDLC' }); // Redirigir a otra vista si la carpeta no existe
    }
 }catch(err){

 }
});
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