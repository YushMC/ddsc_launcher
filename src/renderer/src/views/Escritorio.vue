<template>
    <div class="escritorio">
        <div class="iconos">
            <router-link class="icono" to="/inicio">
                <img src="./../assets/gui/home.png" alt="Inicio" >
                <h5>Inicio</h5>
            </router-link>
            <router-link class="icono" to="/agregar">
                <img src="./../assets/gui/agregar_mod.png" alt="Agregar">
                <h5>Agregar mod</h5>
            </router-link>
            <router-link class="icono" v-if="isOnline" to="/download" >
                <img src="./../assets/gui/download.png" alt="Descargar">
                <h5>Descargar</h5>
            </router-link>
            <router-link class="icono" to="/ajustes" title="Ajustes">
                <img src="./../assets/gui/settings.png" alt="Ajustes">
                <h5>Ajustes</h5>
            </router-link>
            <div class="icono" @click="toggleMusicPlayer" v-if="isOnline">
                <img src="./../assets/gui/music.png" alt="Música">
                <h5>Música</h5>
            </div>
            <router-link class="icono" to="/navegador" v-if="isOnline">
                <img src="./../assets/gui/navegador.png" alt="Navegaodr">
                <h5>Navegador</h5>
            </router-link>
            <router-link class="icono" to="/informacion">
                <img src="./../assets/gui/info.png" alt="Archicos">
                <h5>Información</h5>
            </router-link>
        </div>
        <div class="mods_iconos" v-if="isOnline">
            <div class="mod_icono" v-for="mod in modsListInstalled" :key="mod.id" :value="mod" >
                <img v-if="!isLoading" :src="mod.url_logo" alt="{{mod.nombre}}" @click="runModInstalled(mod.nombre)" :title=" mod.nombre" style="cursor: pointer;">
                <h5 @click="runModInstalled(mod.nombre)" :title=" mod.nombre" style="cursor: pointer;" v-if="!isLoading">{{ mod.nombre }}</h5>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref,onMounted } from 'vue'
import { useMusicPlayer } from '../composables/useMusicPlayer';
import Swal from 'sweetalert2'

const { toggleMusicPlayer } = useMusicPlayer();
const isOnline = ref(navigator.onLine);
const ejecucionInstalled = ref(null)
const modsListInstalled = ref([]);
const isLoading = ref(true)
const openExplorerRaiz = async () => {
  await window.api.openFolderRaiz()
}

onMounted(async () => {
    try {
        const modsInstalled = await window.api.getMods();
        // Convertir los nombres de mods en objetos con un campo "name"
        modsListInstalled.value = modsInstalled.map(modName => ({
          name: modName,
          url_logo: '', // Inicializamos como cadena vacía
          nombre: ''    // Inicializamos como cadena vacía
        }));
        // Llama a fetchModInfoIcono después de obtener los mods
        await fetchModInfoIcono();
    } catch(err) {
        console.error(err);
    }
})

const fetchModInfoIcono = async () => {
  try {
    // Itera sobre cada mod en modsListInstalled
    for (const mod of modsListInstalled.value) {
      const response = await fetch(`https://www.dokidokispanish.club/api_ddsc/mods/name/${mod.name}`);
      const data = await response.json();
      
      console.log('API Response:', data);

      // Verifica que data.results exista y sea un array con al menos un elemento
      if (data.results && Array.isArray(data.results) && data.results.length > 0) {
        const modInfo = data.results[0];  // Obtén la primera entrada de resultados
        isLoading.value = false;
        // Solo asigna si url_logo está presente en el objeto devuelto
        if (modInfo.url_logo) {
          mod.url_logo = modInfo.url_logo;
        } else {
          mod.url_logo = '';  // Asigna una cadena vacía si no se encuentra la URL
        }
        
        // Asigna el nombre si está presente
        if (modInfo.nombre) {
          mod.nombre = modInfo.nombre;
        } else {
          mod.nombre = '';  // Asigna una cadena vacía si no se encuentra el nombre
        }
      } else {
        console.warn(`No se encontró información para el mod: ${mod.name}`);
      }
    }
  } catch (error) {
    console.error('Error al obtener información de los mods:', error);
  }
};

const runModInstalled = async (selectedMod) => {
    Swal.fire({
        position: 'center',
        title: "Ejecutando: " + selectedMod,
        html: '<i>En algunos mods es necesario ejecutar 2 veces para su reproducción.</i>',
        allowOutsideClick: true,
        showConfirmButton: true,
        didOpen: () => {
          Swal.showLoading();
        }
    });
    await window.api.runMod(selectedMod);
    ejecucionInstalled.value = await window.api.getEjecucion(selectedMod);
    // Cambia estos valores según sea necesario
    let detallesEscritorio = 'Jugando: ' + selectedMod;
    let estadoEscritorio = 'Partidas: '+ ejecucionInstalled.value;
    // Llama a la función expuesta por el preload
    window.electron.updateDiscordStatus(detallesEscritorio, estadoEscritorio, 'ddlc_icon');
    Swal.close();
    Swal.fire({
        position: 'center',
        icon: "success",
        title: "Ejecutando: " + selectedMod,
        html: 'Mod ejecutado en otra ventana!'
    }).then(() => {
      window.location.reload(); // Recargar la página
    });
  }

window.api.onModExecutionEnded((event, { code }) => {
  console.log(`El proceso terminó con el código: ${code}`);
  if (code === 0) {
    window.electron.updateDiscordStatus();
    // Actualiza el estado de Discord o muestra un mensaje de éxito
    Swal.fire({
      icon: 'success',
      title: 'El mod ha terminado correctamente!',
    });
  } else {
    // Muestra un mensaje de error si el proceso no terminó correctamente
    Swal.fire({
      icon: 'error',
      title: 'Error',
      text: 'El mod no terminó correctamente.',
    });
  }
});
</script>

<style scoped>
.escritorio{
    width: 100%;
    display: flex;
    justify-content: start;
    height: 100%;
    margin: 0.5% !important;
}
.escritorio .iconos{
    width: 10%;
    height: 100%;
    display: flex;
    flex-direction: column;
}
.escritorio .iconos .icono{
    width: 100%;
    display: flex !important;
    flex-direction: column !important;
    justify-content: center !important;
    align-items: center !important;
    margin: 9% 0 !important;
    text-decoration: none;
    filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.555));
    cursor: pointer;
}
 h5{
    text-decoration: none;
    font-weight: 800;
    font-size: 1.1em;
    -webkit-text-stroke: 1px black;
    color: white; 
    text-align: center;
    width: 100%; /* Ajusta el ancho del contenedor */
    white-space: nowrap; /* Evita el salto de línea */
    overflow: hidden; /* Oculta el texto que no cabe */
    text-overflow: ellipsis; /* Añade los puntos suspensivos */
}
.mods_iconos{
    width: 90%;
    height: 95%;
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(4%, 1fr));
    gap: 4%;
    margin: 1% 2%;
    grid-template-rows: repeat(auto-fill, minmax(10%, 1fr))
    
}
.mods_iconos .mod_icono{
    width: 100%;
    display: flex;
    flex-direction: column;
    filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.555));
}
</style>