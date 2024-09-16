<template>
  <div class="ventana" data-aos="fade-down" data-aos-duration="1000">
    <div class="name_ventana">
        <h3>Descargar</h3>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
    <div class="container_inicio">
      <h2>Selecciona el mod/traducción a descargar e instalar!</h2>
      <div style="grid-template-columns: 8fr 1fr 1fr;">
        <select v-model="selectedOption">
          <option value="Doki Doki Literature Club">Doki Doki Literature Club (parche en español)</option>
          <option value="Peruvian Club">Peruvian Club</option>
          <option value="Meni Cuquis">Meni Cuquis</option>
          <option value="Celestial Restraint">Celestial Restraint</option>
          <option value="Love and Shyness">Love & Shyness</option>
          <option value="Chavist Club">Chavist Club</option>
          <option value="Destinos Sombrios">Destinos Sombrios</option>
          <option value="First And Last">First and Last</option>
          <!-- Agrega más opciones aquí si es necesario -->
        </select>
        <button @click="descargar" class="image_button">
          <img src="./../assets/gui/download.png" alt="Descargar" title="Descargar">
        </button>
        <button class="image_button" style="position: relative;">
          <img src="./../assets/gui/question.png" alt="about_name_mod">
          <div class="content_text_mod">
            <h4 style="padding: 5% !important;color: black !important;font-weight: 300;">En esta sección puede <b>descargar mods/traducciones de manera directa</b>, sin realizar ningún otro paso adicional.</h4>
          </div>
        </button>
      </div>
    </div>
  </div>
</template>
  

<script setup>
import { ref } from 'vue';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';

const isLoading = ref(false);
const selectedOption = ref('');
const currentFileName = ref('');
const router = useRouter();

const setLoadingCursor = () => {
  document.body.style.cursor = 'progress';
  isLoading.value = true;
};

const resetCursor = () => {
  document.body.style.cursor = 'default';
  isLoading.value = false;
};

const descargar = async () => {
  try {
    const folderExists3 = await window.api.checkFolderExists();
    if (!folderExists3) {
      router.push({ name: 'DDLC' }); // Redirigir a otra vista si la carpeta no existe
    }
    // Verificar espacio en disco antes de iniciar la descarga
    const basePath = await window.api.getBasePath();
    Swal.fire({
    title: `Revisando espacio en la ruta de instalción`,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    }
  });
    const diskSpace = await window.api.checkDiskSpace(basePath);

    if (diskSpace.free < 2048 * 1024 * 1024) { // Si hay menos de 500 MB libres
      Swal.close()
      Swal.fire({
        icon: 'error',
        title: 'El espacio dispoible en disco es menor a 2GB',
        text: 'No tienes suficiente espacio en el disco para descargar archivos. Te recomendamos liberar espacio e inténtalo de nuevo.\n\nSi continuas, puede que surgan problemas en la instalación'
      });
      return;
    }

    switch (selectedOption.value) {
      case 'Doki Doki Literature Club':
        downloadFile(selectedOption.value, 'https://www.dokidokispanish.club/assets/ddlc/descargables/DDLCEspLatino.zip', true);
        break;
      case 'Meni Cuquis':
        downloadFile(selectedOption.value, 'https://www.dokidokispanish.club/mods_comunidad/Meni_Cuquis/DDMC_ver1.6.zip', true);
        break;
      case 'Celestial Restraint':
        downloadFile(selectedOption.value, 'https://www.dokidokispanish.club/mods_comunidad/Celestial_Restraint/DDLCCD.zip', false);
        break;
      case 'Peruvian Club':
        downloadFile(selectedOption.value, 'https://www.dokidokispanish.club/mods_comunidad/Peruvian_Club/Peruvian_club.zip', true);
        break;
      case 'Love and Shyness':
        downloadFile(selectedOption.value, 'https://www.dokidokispanish.club/mods_comunidad/Love_and_Shyness/Love_and_Shyness.zip', true);
        break;
      case 'Chavist Club':
        downloadFile(selectedOption.value, 'https://www.dokidokispanish.club/mods_comunidad/Chavist_Club/Chavist_Club.zip', false);
        break;
      case 'Destinos Sombrios':
        downloadFile(selectedOption.value, 'https://www.dokidokispanish.club/mods_comunidad/Destinos_Sombrios/Destinos_Sombrios.zip', true);
        break;
      case 'First And Last':
        downloadFile(selectedOption.value,'https://www.dokidokispanish.club/mods_comunidad/First_and_last/FirstAndLast.zip',true);
        break;
      // Agrega más casos según sea necesario
      default:
        Swal.close()
        Swal.fire({
          icon: 'error',
          title: 'Opción no reconocida',
          text: `No se reconoce la opción seleccionada: ${selectedOption.value}`
        });
        break;
    }
  } catch (error) {
    console.error('Error:', error);
    Swal.close()
    Swal.fire({
      icon: 'error',
      title: 'Error inesperado',
      text: `Ha ocurrido un error: ${error.message}`
    });
  }
};

function downloadFile(nombre, enlace, exeDDLC1) {
  Swal.close();
  const swalInstance = Swal.fire({
    title: `Descargando \n${nombre}`,
    html: 'Por favor, espere mientras se descarga el archivo.<br>Este proceso puede durar algún tiempo...',
    allowOutsideClick: false,
    showConfirmButton: true,
    showCancelButton: true,
    cancelButtonText: 'Cancelar',
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
      window.api.downloadFile(enlace);
    }
  });

  window.api.onDownloadError((err) => {
    Swal.fire({
      icon: 'error',
      title: 'Error en la descarga',
      text: `Ha ocurrido un error durante la descarga: ${err.message}`
    });
  });

  window.api.onDownloadComplete(() => {
    Swal.fire({
      title: 'Descomprimiendo archivo descargado...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });
  });

  window.api.onUnzipError((err) => {
    Swal.fire({
      icon: 'error',
      title: 'Error al descomprimir',
      text: `Hubo un problema al descomprimir el archivo: ${err.message}`
    });
  });

  window.api.onExtractionComplete(() => {
    Swal.close();
    crearCarpeta(nombre, exeDDLC1);
  });

  window.api.onDownloadCancelled(() => {
    Swal.fire({
      icon: 'info',
      title: 'Descarga cancelada',
      text: 'La descarga ha sido cancelada y los archivos han sido eliminados.'
    });
  });

  swalInstance.then((result) => {
    if (result.dismiss === Swal.DismissReason.cancel) {
      window.api.cancelDownload();
      Swal.fire({
        icon: 'info',
        title: 'Cancelando...',
        text: 'Por favor, espere mientras se cancela la descarga y se eliminan los archivos.',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });
    }
  });
}

async function crearCarpeta(folderName, exeDDLC2) {
  try {
    Swal.fire({
      title: 'Creando carpeta del mod...',
      allowOutsideClick: false,
      showConfirmButton: false,
      didOpen: () => Swal.showLoading()
    });

    await window.api.createModFolder(folderName);
    Swal.close();
    await copiarACarpetaArchivosBase(folderName, exeDDLC2);
  } catch (err) {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un problema!',
      html: `Error: ${err}`
    });
  }
}

async function copiarACarpetaArchivosBase(mod_nombre, exeDDLC3) {
  try {
    const basePath = await window.api.getBasePath();
    const modFolder = mod_nombre;
    const modPath = `${basePath}\\mods\\${modFolder}`;
    const dest = `${modPath}\\DDLC-1.1.1-pc`;

    if (exeDDLC3 === true) {
      const src = `${basePath}\\DDLC-1.1.1-pc`;
      Swal.fire({
        title: 'Copiando archivos base de DDLC a carpeta generada...',
        allowOutsideClick: false,
        showConfirmButton: false,
        didOpen: () => Swal.showLoading()
      });
      const { success, error } = await window.api.copyFolder({ src, dest });
      if (!success) throw new Error(error);
      Swal.close();
      await startCopy(`${basePath}\\Downloads\\extracted`, dest);
    } else {
      await startCopy(`${basePath}\\Downloads\\extracted`, dest);
    }
  } catch (err) {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un problema!',
      html: `Error: ${err}`
    });
  }
}

async function startCopy(src_ruta, dest_ruta) {
  Swal.fire({
    title: 'Iniciando la copia de archivos del mod...',
    html: 'Copiando archivos...',
    showConfirmButton: false,
    allowOutsideClick: false,
    didOpen: () => Swal.showLoading()
  });

  
  const { success, error } = await window.api.copyModFolder({
    src: String(src_ruta),
    dest: String(dest_ruta)
  });

  window.api.onCopyProgress((data) => {
  currentFileName.value = data.fileName;

  Swal.update({
    title: 'Copiando archivos...',
    });
  });
  deleteFolderOrFile();
  if (success) {
    Swal.fire('Mod descargado!', 'Todos los archivos del mod fueron descargados y copiados correctamente.\nEl mod aparacerá en la página de inicio', 'success').then(() => {window.location.reload(); // Recargar la página
    });
    resetCursor();
  } else {
    Swal.fire('Error',` Error al copiar archivos: ${error}`, 'error').then(() => {window.location.reload(); // Recargar la página
    });
  }
}

async function deleteFolderOrFile() {
  try {
    const basePath = await window.api.getBasePath();
    const src2 = `${basePath}\\Downloads`;
    await window.api.deleteFolderOrFile(src2);
  } catch (err) {
    Swal.close();
    Swal.fire({
      icon: 'error',
      title: 'Ocurrió un problema!',
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
select{
  width: 100%;
  padding: 1% 2%;
  border-radius: 7px;
  border: solid 2px #e016d1;
  margin: 3% 0;
  cursor: pointer;
  font-size: 1.1em;
  background: none;
}
.ventana h3{
    margin-left: 1%;
    color: white;
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