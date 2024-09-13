<!-- src/components/UpdateProgress.vue -->
<template>
    <div v-if="isUpdating" class="update-progress">
      <p>Descargando actualización: {{ progress }}%</p>
      <progress :value="progress" max="100"></progress>
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
  .update-progress {
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
  }
  
  progress {
    width: 100%;
    height: 70px;
  }
  p{
    font-size: 2em;
    font-weight: 300;
    text-transform: uppercase
  }
  </style>