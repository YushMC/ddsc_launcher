<template>
  <!-- Contenedor de audio -->
  <audio ref="audio" preload="auto">
    <source :src="currentSong.src" type="audio/mpeg" />
  </audio>
  <!-- Ventana principal-->
  <div v-if="isMusicPlayerVisible" class="card_music">
    <!-- Titulo de la ventana-->
    <div class="titulo_ventana_music">
      <h2>Reproductor de Música</h2>
      <i @click="togleAlbums" class="fa-solid" style="color:white;font-size: 2em;cursor: pointer;":class="togleAlbumsSwitch ? 'fa-table-cells-large' : 'fa-list'"></i>
      <h2 @click="ocultarMusica" style="cursor: pointer;">-</h2>
    </div>
    <!-- Lista de canciones-->
    <div v-if="!togleAlbumsSwitch" class="song-albums">
      <label for="">Albumes</label>
      <ul>
        <li @click="viewAlbums('DDLC')" :class=" {'album_selected' : album_selected_ref===0}">
          <img src="https://www.dokidokispanish.club/assets/gui/window_icon.png" alt="">
          <h4>DDLC OST</h4>
        </li>
        <li @click="viewAlbums('ExitRedux')" :class=" {'album_selected' : album_selected_ref===1}">
          <img src="https://www.dokidokispanish.club/assets/logos/logo_exit_music_redux.png" alt="">
          <h4>Exit Music Redux OST</h4>
        </li>
        <li @click="viewAlbums('AfterSchool')" :class=" {'album_selected' : album_selected_ref===2}">
          <img src="https://www.dokidokispanish.club/assets/logos/logo_After_School.png" alt="">
          <h4>After School OST</h4>
        </li>
      </ul>
    </div>
    <div v-if="togleAlbumsSwitch" class="song-list">
      <label for="">Lista de reproducción</label>
      <ul>
        <li v-for="(song, index) in songs.filter(song => song.id >= id_inicio && song.id <= id_final)" 
        :key="song.id" 
        @click="playSongFromList(song.id)" 
        :class="{'active-song': currentSongIndex === song.id}">
          <img :src="song.image" alt="Logo" width="30">
          <span>{{ song.title }} - {{ song.details }}</span>
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
        <a v-if="songs[currentSongIndex].enlace != null " :href="songs[currentSongIndex].enlace" id="about" target="_blank">Visitar</a>
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
          <button @click="repeat_one_song" :class="replay ? 'play' : 'no_play'">1<i class="fa-solid fa-repeat"></i></button>
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

//mostrar icono de reproduccion
import { MusicPlayerRun } from './../composables/MusicPlayerRunnig';
const { toggleMusicPlayerRunning } = MusicPlayerRun();

const MusicPlayerRunnning_local = ref(false);
//variables para almacenar las canciones y el tiempo
const songs = ref([]);
const currentSongIndex = ref(0);
const currentSong = ref({});
const audio = ref(null);
const currentTime = ref(0);
const duration = ref(0);
const pausa_play = ref(false);
const togleAlbumsSwitch = ref(false);
const replay = ref(false);
const name_album= ref('');
const id_inicio = ref(1);
const album_selected_ref = ref(0);
const id_final = ref(17);

const viewAlbums= (album)=>{
  if(album=="DDLC"){
    name_album.value = album;
    id_inicio.value = 0
    id_final.value = 15
    console.log(id_inicio.value)
  }else if(album=="ExitRedux"){
    id_inicio.value = 16
    id_final.value = 42
    name_album.value = album;
    console.log(id_inicio.value)
  }else if(album=="AfterSchool"){
    id_inicio.value = 43
    id_final.value = 47
    name_album.value = album;
    console.log(id_inicio.value)
  }
  togleAlbumsSwitch.value = !togleAlbumsSwitch.value
}
const togleAlbums = ()=>{
  togleAlbumsSwitch.value = !togleAlbumsSwitch.value
}
const repeat_one_song = ()=>{
  replay.value = !replay.value
}

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
  console.log(currentSongIndex.value);
  currentSong.value = songs.value[index];
  pausa_play.value = true
  if(currentSongIndex.value>= 0 && currentSongIndex.value <= 15){
    album_selected_ref.value= 0;
  }else if(currentSongIndex.value >= 16 && currentSongIndex.value <= 42){
    album_selected_ref.value= 1;
  }else if(currentSongIndex.value>= 43 && currentSongIndex.value <= 47){
    album_selected_ref.value= 2;
  }
  let detalles = 'Reproductor de música';
  console.log("reproduciendo: "+ currentSong.value.title);
  let estado = 'Reproduciendo canción: '+ currentSong.value.title;
  // Llama a la función expuesta por el preload
  window.electron.updateDiscordStatus(detalles, estado, 'ddlc_icon');
  if(MusicPlayerRunnning_local.value==false){
      toggleMusicPlayerRunning();
      MusicPlayerRunnning_local.value = !MusicPlayerRunnning_local.value;
  }
  loadAndPlaySong(true); // Reiniciar currentTime al cambiar de canción
};
//pausar o reanudar cancion
const play_pause = () => {
  if (pausa_play.value) {
    audio.value.pause();
    pausa_play.value = false;

    let detalles = 'Reproductor de música';
    let estado = 'Canción en pausa: '+ currentSong.value.title;
    // Llama a la función expuesta por el preload
    window.electron.updateDiscordStatus(detalles, estado, 'ddlc_icon');
  } else {
    if(MusicPlayerRunnning_local.value==false){
      toggleMusicPlayerRunning();
      MusicPlayerRunnning_local.value = !MusicPlayerRunnning_local.value;
    }
    if (audio.value.paused && audio.value.src !== currentSong.value.src) {
      loadAndPlaySong();
    }
    audio.value.play().catch((error) => {
      console.error('Error al reproducir la canción:', error);
    });
    if(currentSongIndex.value>= 0 && currentSongIndex.value <= 15){
      album_selected_ref.value= 0;
    }else if(currentSongIndex.value>= 16 && currentSongIndex.value <= 42){
      album_selected_ref.value= 1;
    }else if(currentSongIndex.value>= 43 && currentSongIndex.value <= 47){
      album_selected_ref.value= 2;
    }
    
    let detalles = 'Reproductor de música';
    console.log("reproduciendo: "+ currentSong.value.title);
    let estado = 'Reproduciendo canción: '+ currentSong.value.title;
    // Llama a la función expuesta por el preload
    window.electron.updateDiscordStatus(detalles, estado, 'ddlc_icon');
    pausa_play.value = true;
  }
};
//detener cancion
const stop = () => {
  audio.value.pause();
  audio.value.currentTime = 0;
  pausa_play.value = false;
  if(MusicPlayerRunnning_local.value==true){
    toggleMusicPlayerRunning();
    MusicPlayerRunnning_local.value = !MusicPlayerRunnning_local.value
  }
  // Llama a la función expuesta por el preload
  window.electron.updateDiscordStatus();
};
//cancion anterior
const prevSong = () => {
  if (currentSongIndex.value > id_inicio.value) {
    currentSongIndex.value--;
    currentSong.value = songs.value[currentSongIndex.value];
    pausa_play.value = true
    let detalles = 'Reproductor de música';
    console.log("reproduciendo: "+ currentSong.value.title);
    let estado = 'Reproduciendo canción: '+ currentSong.value.title;
    // Llama a la función expuesta por el preload
    window.electron.updateDiscordStatus(detalles, estado, 'ddlc_icon');
    loadAndPlaySong(true); // Reiniciar currentTime al cambiar de canción
  }
};
//cancion siguiente
const nextSong = () => {
  if (currentSongIndex.value < songs.value.length - 1) {
    currentSongIndex.value++;
    currentSong.value = songs.value[currentSongIndex.value];
    pausa_play.value = true
    let detalles = 'Reproductor de música';
    console.log("reproduciendo: "+ currentSong.value.title);
    let estado = 'Reproduciendo canción: '+ currentSong.value.title;
    // Llama a la función expuesta por el preload
    window.electron.updateDiscordStatus(detalles, estado, 'ddlc_icon');
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
  //en caso de no estar activado el repetir una vez
 
    if(replay.value==false){
      pausa_play.value = false;
      audio.value.currentTime = 0;
      if(!(currentSongIndex.value == id_final.value)){
        nextSong();
      }
    }else{
      audio.value.currentTime = 0;
      currentSong.value = songs.value[currentSongIndex.value];
      loadAndPlaySong(true);
      pausa_play.value = true;
    }
  
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
      id: song.id,
      title: song.title,
      details: song.details,
      src: song.src,
      image: song.image,
      enlace: song.enlace
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
    height: 89%;
    bottom: 10%;
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.5);
    backdrop-filter: blur(2px);
    border-radius: 10px;
    display: grid;
    grid-template-rows: 0.5fr 4fr 1.5fr;
    overflow: hidden;
}
.titulo_ventana_music{
    width: 100%;
    background: #e016d1;
    padding: 2%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-shadow: 0px 0px 10px 1px rgba(0, 0, 0, 0.5);
    position: relative;
    z-index: 20;
}
.titulo_ventana_music h2{
    text-wrap: nowrap;
    font-size: 1.5em;
    color: white;
}
.controls_music{
    width: 100%;
    padding: 0 2%;
    height: 100%;
    display: flex;
    flex-direction: column;
    border: solid 3px #e016d1;
    border-radius: 10px;
    background: #f1f1f1;
    position: relative;
    z-index: 20;
    box-shadow: 0px 0px 10px 5px rgba(0, 0, 0, 0.322);
    justify-content: center;
    align-items: center;
}
.controls_music > .datos_music{
  width: 100%;
    display: grid;
    grid-template-columns: 1fr 3fr 1fr;
    gap: 3%;
    justify-content: center;
    align-items: center;
}
.info_music{
  width: 100%;
  display: flex;
  flex-direction: column;
}
 #about{
  width: 100%;
  text-align: center;
  margin: 2% 0;
  background: #e016d1;
  color: white;
  border-radius: 5px;
  text-decoration: none;
}
.datos_music .image_music{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
.image_music img{
    width: 50px;
    filter: drop-shadow(0px  5px 10px rgba(0, 0, 0, 0.322));
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
    grid-template-columns: repeat(5, 1fr);
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
  height: 100%;
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
  transition: all 0.3s linear;
  border-radius: 5px;
}
.song-list li:hover{
  transform: scale(0.98);
  background-color: rgba(0, 0, 0, 0.2);
}

.song-list li img {
  margin-right: 10px;
}

.song-list li.active-song {
  background-color: #e41eb279;
  font-weight: bold;
}
.song-albums{
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  height: 100%;
  overflow-y: scroll;
}
.song-albums > ul{
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 1%;
  list-style: none;
  padding: 2%;
}
.song-albums li{
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  padding: 2%;
  border: solid 3px transparent;
  transition: all 0.3s linear;
  border-radius: 5px;
}
.song-albums li:hover{
  border: solid #e016d1 3px;
  cursor: pointer;
  transform: scale(1.02)
}
.album_selected{
  border: solid #e016d1 3px !important;
  box-shadow: 0px 0px 10px 2px rgba(0, 0, 0, 0.5);
  background: rgba(255, 255, 255, 0.8);
}
.song-albums li img{
  width: 50%;
}
.song-albums li > h4{
  text-align: center;
  font-weight: 400;
}
</style>