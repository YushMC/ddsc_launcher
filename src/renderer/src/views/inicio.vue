<template>
  <div class="ventana" data-aos="fade-down" data-aos-duration="1000">
    <div class="name_ventana">
        <h3>Inicio</h3>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
    <div class="container_inicio">
      <div class="seleccionar_mods">
        <div class="logo">
          <img :src="imageUrl" alt="Logo">
        </div>
        <h2>Selecciona un mod</h2>
        <select name="mod" v-model="selectedMod" @change="fetchModInfo" placeholder="Seleccionar mod">
          <option v-for="mod in mods" :key="mod" :value="mod">{{ mod }}</option>
        </select>
        <!-- Mostrar el botón solo si hay una opción seleccionada -->
        <button v-if="selectedMod" @click="runMod" style="background: green;margin-bottom: 2%;"><i class="fa-solid fa-play"></i> Ejecutar</button>
        <button v-if="selectedMod && batFileExists" @click="runModBat" style="background: orangered; margin-bottom: 2%;"><i class="fa-solid fa-play"></i> <i class="fa-solid fa-terminal"></i> Ejecutar por cmd</button>
        <hr style="width: 100%; background: rgba(0,0,0,0.5);border: none;height: 2px;">
        <button v-if="selectedMod" @click="openExplorerMod" style="margin: 2% 0;background: green;"><i class="fa-regular fa-folder-open"></i> Abrir carpeta</button>
        <button v-if="selectedMod" @click="deleteFolderOrFile" style="background: red;"><i class="fa-solid fa-trash"></i> Eliminar</button>
      </div>
      <div class="datos_mod" :style="{ backgroundImage: `url(${modInfo.url_img})` }"  v-if="modInfo">
        <div class="contenido">
          <div class="card">
            <div class="datos_mod_info">
              <div class="logo_mod">
                <img :src="modInfo.url_logo" alt="">
              </div>
              <div class="datos_info_mod_extra">
                <h2>{{ modInfo.nombre }}</h2>
                <label v-if="ejecucion">Jugado: {{ ejecucion }} veces</label>
              </div>
              
            </div>
            <p>{{ modInfo.descripcion }}</p>
            <a target="_blank" :href="modInfo.url_sitio" id="about">Más información</a>
          </div>
        </div>
      </div>
      <div v-else class="sin_info">
          <p v-if="isOnline"><i>No se encontraron datos</i><br>
          Selecciona un mod para ver la información.<br></p>
          <p v-else>
            <i><b>No hay conexión a internet</b></i><br>
            Para ver datos acerca de los mods, <br>revisa tu conexion a internet y vuelve a intentarlo.<br>
          </p>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router';
import Swal from 'sweetalert2'

const imageUrl = 'https://www.dokidokispanish.club/assets/gui/Logo_DDSC.png'
const mods = ref([])
const selectedMod = ref('')
const modInfo = ref(null)
const ejecucion = ref(null)
const batFileExists = ref(false);

// Obtener la ruta de la carpeta seleccionada al iniciar la aplicación
const router = useRouter();


const isOnline = ref(navigator.onLine);

function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
}

function checkConnectionStatus() {
  isOnline.value = navigator.onLine;
}


onMounted(async () => {
  try {
    mods.value = await window.api.getMods();
    const folderExists = await window.api.checkFolderExists();
    if (!folderExists) {
      router.push({ name: 'DDLC' }); // Redirigir a otra vista si la carpeta no existe
    }
  } catch (error) {
    console.error('Error en onMounted:', error);
    // Puedes mostrar una alerta o redirigir a una página de error
  }
  // Verificar si hay conexión al iniciar
  checkConnectionStatus();

  // Escuchar cambios en la conexión
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
})

// Método para ejecutar el archivo .bat
const runModBat = async () => {
  const modPath = await window.api.getBasePath(); // Ruta base para los mods (ajústala según sea necesario)
  const batFilePath = `${modPath}\\mods\\${selectedMod.value}\\iniciar_mod.bat`; // Ruta del archivo .bat
  console.log("ruta bat: ", batFilePath)
  const result = await Swal.fire({
        title: 'Ejecutar con CMD',
        html: "Se abrirá una ventana CMD para ejecutar el mod<br><b>USA ESTE MODO EN CASO DE PROBLEMAS O DE COMPATIBILIDAD</b>",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, ejecutar con cmd',
        cancelButtonText: 'Cancelar',
      })
        if (result.isConfirmed) {
          // Aquí pones la acción a ejecutar si el usuario confirma
          Swal.close(); 
          Swal.fire({
            title: `Ejecutando en modo cmd: \n${selectedMod.value}...`,
            icon: 'warning',
            allowOutsideClick: true,
            showConfirmButton: true,
            confirmButtonText: 'Cerrar',
            
          });

          try {
            const result = await window.electronAPI.runBatFile(batFilePath);
            if (!result.success) {
              console.error('Error al ejecutar el archivo .bat:', result.error);
            } else {
              Swal.fire(
                        'CMD',
                        'Ejecutando en modo CDM.',
                        'success'
                    )
              console.log('Archivo .bat ejecutado con éxito');
            }
          } catch (err) {
            console.error('Error al ejecutar runModBat:', err);
          }
      }
};

// Método para verificar si el archivo .bat existe
const checkBatFileExists = async () => {
  const batFilePath = `mods\\${selectedMod.value}\\iniciar_mod.bat`;
  const folderExists = await window.api.checkBatExists(String(batFilePath));
  if (folderExists) {
    batFileExists.value = true; // Mostrar el botón si existe el archivo
  }else{
    batFileExists.value = false;
  }
};

const deleteFolderOrFile =  async () => {
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
            title: `Eliminando carpeta del mod \n${selectedMod.value}...`,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
            try{
                const basePath = await window.api.getBasePath();

                const filePath = `${basePath}\\mods\\${selectedMod.value}`;  // Cambia esta ruta por la que necesites eliminar
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
                      window.location.reload(); // Recargar la página
                    });
                } else {
                    Swal.fire({
                        icon: "error",
                        title: `Error al eliminar carpeta del mod \n${selectedMod.value}`,
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
}

const openExplorerMod = async () => {
    await window.api.openFolderMod(selectedMod.value)
}

const fetchModInfo = async () => {
  await checkBatFileExists();
  console.log("buscando")
  if (selectedMod.value) {
    try {
      const response = await fetch(`https://www.dokidokispanish.club/api_ddsc/mods/name/${selectedMod.value}`)
      const data = await response.json()

      // Verificar la estructura de data y data.results
      console.log('API Response:', data) // Añadir un console.log para verificar la respuesta

      if (Array.isArray(data.results) && data.results.length > 0) {
        modInfo.value = data.results[0] // Accede al primer elemento del array
        ejecucion.value = await window.api.getEjecucion(selectedMod.value)
      } else {
        modInfo.value = null
      }
    } catch (error) {
      console.error('Error al obtener información del mod:', error)
      modInfo.value = null
    }
  } else {
    modInfo.value = null
  }
}

const runMod = async () => {
  if (selectedMod.value) {
    Swal.fire({
        position: 'center',
        title: "Ejecutando: " + selectedMod.value,
        html: '<i>En algunos mods es necesario ejecutar 2 veces para su reproducción.</i>',
        allowOutsideClick: true,
        showConfirmButton: true,
        didOpen: () => {
          Swal.showLoading();
        }
    });
    await window.api.runMod(selectedMod.value)
    ejecucion.value = await window.api.getEjecucion(selectedMod.value)
    Swal.close();
    Swal.fire({
        position: 'center',
        icon: "success",
        title: "Ejecutando: " + selectedMod.value,
        html: 'Mod ejecutado en otra ventana!'
    }).then(() => {
      window.location.reload(); // Recargar la página
    });
  }
}
</script>


<style scoped>
#about{
  padding: 2%;
  border-radius: 10px;
  background: #e016d1;
  color: white;
  border: none;
  text-decoration: none;
  cursor: pointer;
}
.ventana {
  width: 100%;
  height: 95%;
  border: solid 3px #e016d1;
  background: #e016d1;
  border-radius: 10px;
  filter: drop-shadow(5px 5px 10px black);
}

.ventana h3 {
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

.container_inicio {
  width: 100%;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 2%;
  height: 92.5%;
  border-radius: 5px;
  overflow: hidden;
  background-image: url('https://www.dokidokispanish.club/assets/ddlc/gui/tilebg.png');
  background-repeat: repeat;
  background-size: inherit;
  animation: fondo_moc linear infinite 60s;
}

.seleccionar_mods {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: 2%;
  background: rgba(255,255,255,0.1);
  border:solid 2px #00000093;
  padding: 2%;
  border-radius: 10px;
  backdrop-filter: blur(5px);
}

.seleccionar_mods select {
  width: 100%;
  padding: 1%;
  border-radius: 7px;
  border: solid 2px #e016d1;
  margin: 3% 0;
  cursor: pointer;
  font-size: 1.1em;
  background: none;
}

.logo {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}

.logo img {
  width: 70%;
  filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.555));
}

.seleccionar_mods option {
  padding: 1%;
}

.seleccionar_mods button {
  width: 100%;
  padding: 2%;
  border: none;
  background: #e016d1;
  color: white;
  cursor: pointer;
  border-radius: 10px;
  transition: all 0.3s linear;
}
.seleccionar_mods button:hover{
  transform: scale(1.03);
  box-shadow: 0px 0px 20px 5px rgba(0, 0, 0, 0.555);
}
.sin_info{
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  font-size: 2em;
  width: 100%;
}
.sin_info p{
  text-align: center;
  font-weight: 300;
  line-height: 2;
}
.datos_mod{
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-size: cover;
  background-repeat: no-repeat;
  overflow-y: auto;
  background-position: center;
}
.datos_mod .contenido{
  background: rgba(0,0,0,0.3);
  width: 100%;
  height: 100%;
  padding: 5%;
}
.contenido .card{
  background: rgba(255,255,255,0.4);
  backdrop-filter: blur(5px);
  border-radius: 10px;
  padding: 2%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 100%;
  filter: drop-shadow(5px 5px 10px black);
}
.card .datos_mod_info{
  width: 100%;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  flex-wrap: wrap;
}
.datos_mod_info .logo_mod{
  width: 20%;
  display: flex;
  justify-content: center;
  align-items: center;
}
.logo_mod img{
  width: 100%;
}
.datos_info_mod_extra{
  width: 50%;
  display: flex;
  flex-direction: column;
}
.datos_info_mod_extra h2{
  font-size: 2.2em;
  text-transform: uppercase;
}
p{
  margin: 2%;
  font-weight: 100;
  line-height: 1.5;
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