<template>
  
  <!-- Ventana principal-->
  <div v-if="isMusicPlayerVisible | songs.length > 0" class="card_music">
    <!-- Titulo de la ventana-->
      <div class="titulo_ventana_music">
          <h2>Reproductor de Música (Beta)</h2>
          <h2 @click="ocultarMusica" style="cursor: pointer;">-</h2>
      </div>
      <!-- Lista de canciones-->
      <div v-if="songs.length > 0" class="song-list">
        <ul>
          <li v-for="(song, index) in songs" :key="index" @click="playSongFromList(index)" :class="{'active-song': currentSongIndex === index}">
            <img :src="song.image" alt="Logo" width="30">
            <span>{{ song.title }}</span>
          </li>
        </ul>
      </div>
      <!-- Contenedor de audio -->
      <audio ref="audio" preload="auto">
        <source v-if="songs[currentSongIndex]" :src="songs[currentSongIndex].src" type="audio/mpeg" />
        Tu navegador no soporta la reproducción de audio.
      </audio>

      <!-- Controles de reproudcción-->
      <div class="controls_music">
        <!-- Datos de la canción-->
          <div class="datos_music">
              <div class="image_music">
                <img v-if="songs[currentSongIndex]" :src="songs[currentSongIndex].image" alt="Logo">
              </div>
              <div class="info_music">
                <h3 v-if="songs[currentSongIndex]">{{ songs[currentSongIndex].title }}</h3>
                <h5 v-if="songs[currentSongIndex]">{{ songs[currentSongIndex].details }}</h5>
              </div>
          </div>
          <!-- Barra de prgreso y controles-->
          <div class="progress_music_and_controls">
              <div id="progress_music" style="width: 100%;padding: 0 2%;">
                  <span>{{ formatTime(currentTime) }}</span>
                  <span> [</span>
                  <div id="progress" style="display: inline-block; width: 75%; height: 10px; background-color: #ddd; vertical-align: middle;">
                    <div id="progressBarMusic" :style="{ width: progress + '%' }"></div>
                  </div>
                  <span>] {{ formatTime(duration) }}</span>
              </div>
              <!-- Botones de control-->
              <div class="controls_music_buttons">
                  <button @click="playPreviousSong"><i class="fa-solid fa-backward"></i></button>
                  <button @click="play_pause" :class="pausa_play ? 'play' : 'no_play'" ><i :class="pausa_play ? 'fa-solid fa-pause' : 'fa-solid fa-play' "></i></button>
                  <button @click="stop"><i class="fa-solid fa-stop"></i></button>
                  <button @click="playNextSong"><i class="fa-solid fa-forward"></i></button>
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

const songs = ref([]); // Lista de canciones obtenidas de la API
const currentSongIndex = ref(0); // Índice de la canción actual

const audio = ref(null);
const progress = ref(0);
const currentTime = ref(0);
const duration = ref(0);
const pausa_play = ref(null);

const fetchSongs = async () => {
  // Aquí obtienes las canciones desde tu API
  const response = await fetch('https://www.dokidokispanish.club/api_ddsc/songs');
  const data = await response.json();
  songs.value = data.results; // Asignar las canciones desde la API
};

// Función para reproducir la canción seleccionada desde la lista
const playSongFromList = (index) => {
  currentSongIndex.value = index;
  audio.value.pause();
  audio.value.load(); // Cargar la nueva canción
  audio.value.play();  // Reproducir la nueva canción
  pausa_play.value = true;
};

// Función para reproducir/pausar
const play_pause = () => {
  if (pausa_play.value == null || pausa_play.value === false) {
    audio.value.play();
    pausa_play.value = true;
  } else {
    audio.value.pause();
    pausa_play.value = false;
  }
};

// Función para detener la canción
const stop = () => {
  audio.value.pause();
  audio.value.currentTime = 0;
  pausa_play.value = false;
};

// Función para ir a la canción anterior
const playPreviousSong = () => {
  if (currentSongIndex.value > 0) {
    playSongFromList(currentSongIndex.value - 1);
  }
};

// Función para ir a la siguiente canción
const playNextSong = () => {
  if (currentSongIndex.value < songs.value.length - 1) {
    playSongFromList(currentSongIndex.value + 1);
  }
};

// Función para actualizar el progreso
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

// Cargar las canciones al montar el componente
onMounted(async () => {
  await fetchSongs();
  audio.value.addEventListener('timeupdate', updateProgress);
  audio.value.addEventListener('loadedmetadata', () => {
    duration.value = audio.value.duration;
  });
});

onUnmounted(() => {
  audio.value.removeEventListener('timeupdate', updateProgress);
});
</script>

<style scoped>
.card_music{
    width: 40%;
    height: 80%;
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
.song-list{
  height: 60%;
  padding: 1%;
  margin: 1%;
  overflow-y: scroll;
  border-radius: 5px;
  border: solid 2px #e016d1;
  box-shadow: 0px 0px 10px 3px #00000079;
}
.song-list ul {
  list-style: none;
  padding: 0;
}

.song-list li {
  cursor: pointer;
  padding: 10px;
  background-color: #f1f1f1;
  margin-bottom: 5px;
  display: flex;
  align-items: center;
}

.song-list li img {
  margin-right: 10px;
}

.song-list li.active-song {
  background-color: #e0e0e0;
  font-weight: bold;
}
</style>