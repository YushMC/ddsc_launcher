<template>
    <div class="ventana" data-aos="fade-down" data-aos-duration="1000" :style="{ left: position.x + 'px', top: position.y + 'px' }" @mousedown="startDragging">
      <h2 style="color: white;">Agregar archivos de DDLC</h2>
      <div class="container_inicio"  @mousedown.stop="startDragging">
        <h2>Colocar ruta del archivo DDLC (ddlc-win.zip)</h2>
        <h3 style="color: black;">El archivo lo puedes descargar de https://ddlc.moe/</h3>
        <a target="_blank" href="https://ddlc.moe/" id="ddlc_zip">Descargar archivo</a>
        <div class="mod_files">
          <input v-model="modFiles" type="text" required placeholder="C:\ubicacion" name="ubicacion" >
          <button @click="pasteClipboard" class="image_button" >
           <img src="./../assets/gui/pegar.png" alt="Pegar">
          </button>
          <button @click="openFolder" class="image_button" >
            <img src="./../assets/gui/open_folder.png" alt="abrir">
          </button>
          <button @click="selectAndExtractZip" class="image_button" >
            <img src="./../assets/gui/guardar.png" alt="Guardar">
          </button>
        </div>
      </div>
    </div>
  </template>
    
  <script setup>
  import Swal from 'sweetalert2'
  import { ref } from 'vue'
  const modFiles = ref('')
  // Función para pegar desde el portapapeles
  const pasteClipboard = () => {
    modFiles.value = window.api.pasteClipboard()
  }
  
  // Función para abrir el explorador de archivos y seleccionar una carpeta
  const openFolder = async () => {
    const result = await window.api.selectZip()
    if (!result.canceled) {
      modFiles.value = result
    }
  }
  
const selectAndExtractZip = async () => {
  const zipFilePath = modFiles.value;

  if (zipFilePath) {
    let swalInstance = Swal.fire({
      title: 'Extrayendo archivo...',
      html: 'Progreso: <b></b>',
      timerProgressBar: true,
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => {
        Swal.showLoading();
        window.api.onExtractProgress((progress) => {
          swalInstance.update({
            html: `Progreso: <br><b>${progress}</b>`
          });
        });
      },
      willClose: () => {
        // Remover listener al cerrar la alerta
        window.api.removeExtractProgressListener();
      }
    });

    const success = await window.api.extractAndMoveZip(zipFilePath);

    if (success) {
      swalInstance.close();
      Swal.fire('Éxito', 'Archivo descomprimido con éxito', 'success');
      const folderExists = await window.api.checkFolderExists();
      if (folderExists) {
        router.push({ name: 'Home' }); // Redirigir a otra vista si la carpeta no existe
      } 
    } else {
      swalInstance.close();
      Swal.fire('Error', 'Error al descomprimir el archivo', 'error');
    }
  } else {
    Swal.fire('Advertencia', 'No se seleccionó ningún archivo', 'warning');
  }
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

  </script>
    
  
  <style scoped>
  #ddlc_zip{
    padding: 1%;
    border-radius: 10px;
    color: white;
    text-decoration: none;
    background: #e016d1;
  }
  .readonly-input {
    opacity: 0.5;
    display: none;
  }
  .container_inicio{
      width: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      flex-direction: column;
      height: 95%;
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
    width: 80%;
    display: grid;
    grid-template-columns: 8fr 1fr;
    gap: 2%;
  }
  .container_inicio .mod_files{
    width: 80%;
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