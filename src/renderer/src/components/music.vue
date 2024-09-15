<template>
  <!-- Contenedor de audio -->
  <audio ref="audio" preload="auto">
    <source :src="currentSong.src" type="audio/mpeg" />
    Tu navegador no soporta la reproducción de audio.
  </audio>
  <!-- Ventana principal-->
  <div v-if="isMusicPlayerVisible" class="card_music">
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
    <!-- Controles de reproducción-->
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
      <!-- Barra de progreso con slider-->
      <div class="progress_music_and_controls">
        <div id="progress_music">
          
          <span>{{ formatTime(currentTime) }}</span>
          <input type="range" min="0" :max="duration" v-model="currentTime" @input="seek" />
          <span>{{ formatTime(duration) }}</span>
        </div>
        <!-- Botones de control-->
        <div class="controls_music_buttons">
          <button @click="prevSong" :disabled="!hasPreviousSong" :class="{ 'disabled': !hasPreviousSong }"><i class="fa-solid fa-backward-fast"></i></button>
          <button @click="play_pause" :class="pausa_play ? 'play' : 'no_play'"><i :class="pausa_play ? 'fa-solid fa-pause' : 'fa-solid fa-play'"></i></button>
          <button @click="stop"><i class="fa-solid fa-stop"></i></button>
          <button @click="nextSong" :disabled="!hasNextSong" :class="{ 'disabled': !hasNextSong }"><i class="fa-solid fa-forward-fast"></i></button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, computed } from 'vue';
//controlar la ventana (visibilidad)
import { useMusicPlayer } from './../composables/useMusicPlayer';
const { isMusicPlayerVisible } = useMusicPlayer();
//variables para almacenar las canciones y el tiempo
const songs = ref([]);
const currentSongIndex = ref(0);
const currentSong = ref({});
const audio = ref(null);
const currentTime = ref(0);
const duration = ref(0);
const pausa_play = ref(false);

const ocultarMusica = ()=>{
  isMusicPlayerVisible.value = false
}
//seleccionar cancion de la lista
const playSongFromList = (index) => {
  if (index === currentSongIndex.value) {
    play_pause();
    return;
  }
  currentSongIndex.value = index;
  currentSong.value = songs.value[currentSongIndex.value];
  pausa_play.value = true
  loadAndPlaySong(true); // Reiniciar currentTime al cambiar de canción
};
//pausar o reanudar cancion
const play_pause = () => {
  if (pausa_play.value) {
    audio.value.pause();
    pausa_play.value = false;
  } else {
    if (audio.value.paused && audio.value.src !== currentSong.value.src) {
      loadAndPlaySong();
    }
    audio.value.play().catch((error) => {
      console.error('Error al reproducir la canción:', error);
    });
    pausa_play.value = true;
  }
};
//detener cancion
const stop = () => {
  audio.value.pause();
  audio.value.currentTime = 0;
  pausa_play.value = false;
};
//cancion anterior
const prevSong = () => {
  if (currentSongIndex.value > 0) {
    currentSongIndex.value--;
    currentSong.value = songs.value[currentSongIndex.value];
    pausa_play.value = true
    loadAndPlaySong(true); // Reiniciar currentTime al cambiar de canción
  }
};
//cancion siguiente
const nextSong = () => {
  if (currentSongIndex.value < songs.value.length - 1) {
    currentSongIndex.value++;
    currentSong.value = songs.value[currentSongIndex.value];
    pausa_play.value = true
    loadAndPlaySong(true); // Reiniciar currentTime al cambiar de canción
  }
};
//ejecutar cancion al dar click a una de la lista, al pasar o retroceder o en modo continuo
const loadAndPlaySong = (resetTime = false) => {
  if (audio.value.src !== currentSong.value.src) {
    audio.value.src = currentSong.value.src;
    audio.value.load();
  }
  if (resetTime) {
    audio.value.currentTime = 0; // Reiniciar tiempo al cambiar de canción
  } else {
    audio.value.currentTime = currentTime.value; // Mantener el tiempo actual
  }
  audio.value.play().catch((error) => {
    console.error('Error al reproducir la canción:', error);
  });
};
//actualizar progreso en la barra
const updateProgress = () => {
  if (audio.value.duration) {
    currentTime.value = audio.value.currentTime;
    duration.value = audio.value.duration;
  }
};
//formatear los tiempos
const formatTime = (time) => {
  const minutes = Math.floor(time / 60);
  const seconds = Math.floor(time % 60);
  return `${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
//al terminar una cancion
const onSongEnd = () => {
  pausa_play.value = false;
  audio.value.currentTime = 0;
  nextSong();
};
//opcion para que el usario pueda adelantar o atrasar la linea del tiempo
const seek = () => {
  audio.value.currentTime = currentTime.value;
};
//importar las canciones
const fetchSongs = async () => {
  try {
    const response = await fetch('https://www.dokidokispanish.club/api_ddsc/songs');
    if (!response.ok) {
      throw new Error('Error al obtener las canciones');
    }
    const data = await response.json();
    songs.value = data.results.map(song => ({
      title: song.title,
      details: song.details,
      src: song.src,
      image: song.image
    }));
    currentSong.value = songs.value[currentSongIndex.value];
    //loadAndPlaySong(); // Iniciar reproducción de la primera canción
  } catch (error) {
    console.error(error);
  }
};
//opciones para visualizar los botones de anterior y siguiente
const hasPreviousSong = computed(() => currentSongIndex.value > 0);
const hasNextSong = computed(() => currentSongIndex.value < songs.value.length - 1);

onMounted(() => {
  fetchSongs();
  audio.value.addEventListener('timeupdate', updateProgress);
  audio.value.addEventListener('ended', onSongEnd);
});

onUnmounted(() => {
  audio.value.removeEventListener('timeupdate', updateProgress);
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
#progress_music{
  width: 100%;
  padding: 0 2%;
  display: grid;
  grid-template-columns: 1fr 4fr 1fr;
}
#progress_music > span{
  text-align: center;
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
.controls_music_buttons > button.disabled {
  opacity: 0.5;
  cursor: not-allowed;
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
  width: 100%;
  max-height: 300px;
  padding: 2%;
  overflow-y: scroll;
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