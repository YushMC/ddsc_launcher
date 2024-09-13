<template>
  <!-- Contenedor de audio -->
  <audio ref="audio" preload="auto">
    <source :src="currentSong.src" type="audio/mpeg" />
    Tu navegador no soporta la reproducción de audio.
  </audio>

  <div v-if="isMusicPlayerVisible" class="card_music">
      <div class="titulo_ventana_music">
          <h2>Reproductor de Música (Beta)</h2>
          <h2 @click="ocultarMusica" style="cursor: pointer;">-</h2>
      </div>
      <div class="controls_music">
          <div class="datos_music">
              <div class="image_music">
                  <img :src="currentSong.image" alt="Logo">
              </div>
              <div class="info_music">
                  <h3>{{ currentSong.title }}</h3>
                  <h5>{{ currentSong.details }}</h5>
              </div>
          </div>
          <div class="progress_music_and_controls">
              <div id="progress_music" style="width: 100%;padding: 0 2%;">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span> [</span>
                  <div id="progress" style="display: inline-block; width: 75%; height: 10px; background-color: #ddd; vertical-align: middle;">
                    <div id="progressBarMusic" :style="{ width: progress + '%' }"></div>
                  </div>
                  <span>] {{ formatTime(duration) }}</span>
              </div>
              <div class="controls_music_buttons">
                  <button @click="prevSong" :disabled="currentSongIndex === 0"><i class="fa-solid fa-backward"></i></button>
                  <button @click="play_pause" :class="pausa_play ? 'play' : 'no_play'" ><i :class="pausa_play ? 'fa-solid fa-pause' : 'fa-solid fa-play' "></i></button>
                  <button @click="stop"><i class="fa-solid fa-stop"></i></button>
                  <button @click="nextSong" :disabled="currentSongIndex === songs.length - 1"><i class="fa-solid fa-forward"></i></button>
              </div>
          </div>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { useMusicPlayer } from './../composables/useMusicPlayer';

const { isMusicPlayerVisible } = useMusicPlayer();
// Definir los estados
const songs = ref([]); // Se inicializa vacío
const currentSongIndex = ref(0);
const currentSong = ref({});

const audio = ref(null);
const progress = ref(0);
const currentTime = ref(0); // Tiempo transcurrido
const duration = ref(0);    // Duración total de la canción

const pausa_play = ref(null);
let isReadyToPlay = ref(false); // Para asegurarnos de que el audio esté listo

// Función para reproducir la canción
const play_pause = () => {
  if(pausa_play.value == null){  // Solo se reproduce al hacer clic
    audio.value.play();
    pausa_play.value = true;
  } else {
    if(pausa_play.value == true){
      audio.value.pause();
      pausa_play.value = false;
    } else {
      audio.value.play();
      pausa_play.value = true;
    }
  }
};

// Función para detener la canción
const stop = () => {
  audio.value.pause();
  audio.value.currentTime = 0; // Reiniciar al inicio
  pausa_play.value = null;
};

// Función para reproducir la canción anterior
const prevSong = () => {
  if (currentSongIndex.value > 0) {
    currentSongIndex.value--;
    currentSong.value = songs.value[currentSongIndex.value];
    resetPlayer();
    audio.value.play();
    pausa_play.value = true
  }
};

// Función para reproducir la siguiente canción
const nextSong = () => {
  if (currentSongIndex.value < songs.value.length - 1) {
    currentSongIndex.value++;
    currentSong.value = songs.value[currentSongIndex.value];
    resetPlayer();
    audio.value.play();
    pausa_play.value = true
  }
};

// Función para actualizar el progreso y tiempo transcurrido
const updateProgress = () => {
  if (audio.value.duration) {
    currentTime.value = audio.value.currentTime;
    duration.value = audio.value.duration;
    progress.value = (audio.value.currentTime / audio.value.duration) * 100;
  }
};

// Función para formatear el tiempo en minutos y segundos
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Función que se ejecuta cuando una canción termina
const onSongEnd = () => {
  pausa_play.value = null; // Reiniciar el estado del botón de play/pause
  audio.value.currentTime = 0; // Reiniciar el tiempo de la canción
  // Reproducir la siguiente canción si existe
  if (currentSongIndex.value < songs.value.length - 1) {
    nextSong();
  }
};

// Función para reiniciar el reproductor cuando se cambia de canción
const resetPlayer = () => {
  isReadyToPlay.value = false; // Marcar que el audio aún no está listo
  audio.value.load(); // Cargar la nueva canción
  // Esperar a que esté listo antes de reproducir
  
};

const ocultarMusica = ()=>{
  isMusicPlayerVisible.value = false
}

// Función para obtener las canciones desde una API
const fetchSongs = async () => {
  try {
    const response = await fetch('https://www.dokidokispanish.club/api_ddsc/songs'); // URL de tu API
    if (!response.ok) {
      throw new Error('Error al obtener las canciones');
    }
    const data = await response.json();
    // Asignar las canciones obtenidas desde la propiedad 'results'
    songs.value = data.results.map(song => ({
      title: song.title,
      details: song.details,
      src: song.src,
      image: song.image
    }));
    currentSong.value = songs.value[currentSongIndex.value]; // Establecer la primera canción
    resetPlayer(); // Preparar el reproductor
  } catch (error) {
    console.error(error);
  }
};

// Evento que actualiza la barra de progreso y el tiempo transcurrido mientras la canción se reproduce
onMounted(() => {
  fetchSongs(); // Llamar a la función para obtener las canciones al cargar el componente
  audio.value.addEventListener('timeupdate', updateProgress);
  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value.duration;
  });
  audio.value.addEventListener('ended', onSongEnd);
});

// Limpiar los eventos al desmontar el componente
onUnmounted(() => {
  audio.value.removeEventListener('timeupdate', updateProgress);
  audio.value.removeEventListener('loadedmetadata', () => {
    duration.value = audio.value.duration;
  });
  audio.value.removeEventListener('ended', onSongEnd);
});
</script>

<style scoped>
.card_music{
    width: 40%;
    position: absolute;
    right: 1%;
    bottom: 10%;
    background: rgba(255, 255, 255, 0.95);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.5);
    border-radius: 10px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
}
.titulo_ventana_music{
    width: 100%;
    background: #e016d1;
    padding: 2%;
    display: flex;
    justify-content: space-between;
    align-items: center;
}
.titulo_ventana_music h2{
    text-wrap: nowrap;
    font-size: 1.5em;
    color: white;
}
.controls_music{
    width: 100%;
    padding: 2%;
    display: flex;
    flex-direction: column;
    
}
.controls_music > .datos_music{
    display: grid;
    grid-template-columns: 1fr 4fr;
    gap: 3%;
}
.datos_music .image_music{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.image_music img{
    width: 80%;
    filter: drop-shadow(5px 5px 10px black);
}
.progress_music_and_controls{
    display: flex;
    flex-direction: column;
    width: 100%;
    margin-top: 2%;
}

#progressBarMusic {
  width: 0;
  height: 100%;
  background-color: #4caf50;
}
.controls_music_buttons{
    width: 100%;
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 2%;
    margin-top: 2%;
}
.controls_music_buttons > button{
  border: solid 2px #e016d1;
  color: #e016d1;
  background:  none;
  border-radius: 5px;
  padding: 4%;
  cursor: pointer;
  font-size: 1.5em;
  transition: all 0.3s linear;
}
.play{
  background: #e016d1 !important;
  color: white !important;
}
.no_play{
  background: none !important;
  color: #e016d1 !important;
}
</style>