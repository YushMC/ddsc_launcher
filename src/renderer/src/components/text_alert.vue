<!-- src/components/UpdateProgress.vue -->
<template>
    <div  class="alertLauncher">
      <p>Atención:

        <br><br>
        Este proyecto esta hecho por fans no afiliados con Team Salvato
        

      </p>
      
    </div>
</template>
  
<script setup>
 import { ref, onMounted, onUnmounted } from 'vue';

// Refs para manejar el estado de la actualización
const isUpdating = ref(false);
const progress = ref(0);

// Manejadores de eventos para IPC
const handleUpdateDownloadProgress = (percent) => {
  isUpdating.value = true;
  progress.value = percent;
};

const handleUpdateDownloaded = () => {
  isUpdating.value = false;
};

// Registrar eventos al montar el componente
onMounted(() => {
  window.api.onUpdateDownloadProgress(handleUpdateDownloadProgress);
  window.api.onUpdateDownloaded(handleUpdateDownloaded);
});

// Limpiar eventos al desmontar el componente
onUnmounted(() => {
  window.api.removeUpdateDownloadProgressListener(handleUpdateDownloadProgress);
  window.api.removeUpdateDownloadedListener(handleUpdateDownloaded);
});
  </script>
  
  <style scoped>
  .alertLauncher {
    position: fixed;
    top: 20%;
    left: 5%;
    width: 90%;
    padding: 5em;
    background-color: #f0f0f0;
    border: 1px solid #ddd;
    border-radius: 5px;
    box-shadow: 0px 0px 80px 20px #000;
    z-index: 100;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
  }

.alertLauncher  p{
    font-size: 2em;
    font-weight: 300;
    text-transform: uppercase
  }
  </style>