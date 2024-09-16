<template>
    <header>
        <div class="container_header">
            <div title="Menu" style="margin:0 1%;cursor:pointer;">
                <input type="checkbox" id="menu" >
                <label for="menu" style="cursor:pointer;">
                    <img  :src="imageUrl" style="width: 40px;filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.555));" alt="Menu" >
                </label>
                <div class="menu_contextual" style="bottom:5%;">
                    <a href="#" @click.prevent="closeApp"><i class="fa-solid fa-power-off"></i> Apagar</a>
                </div>
            </div>
            <router-link to="/inicio" title="Inicio" :class="{ active_window: $route.path === '/inicio' }">
                <div>
                    <img src="./../assets/gui/home.png" alt="Inicio" >
                </div>
                <hr v-if="$route.path === '/inicio'">
            </router-link>
            <router-link to="/agregar" title="Agregar Mod" :class="{ active_window: $route.path === '/agregar' }">
                <div>
                    <img src="./../assets/gui/agregar_mod.png" alt="Agregar">
                </div>
                <hr v-if="$route.path === '/agregar'">
            </router-link>
            <router-link v-if="isOnline" to="/download" :class="{ active_window: $route.path === '/download' }">
                <div>
                    <img src="./../assets/gui/download.png" alt="Descargar">
                </div>
                <hr v-if="$route.path === '/download'">
            </router-link>
            <router-link to="/ajustes" title="Ajustes" :class="{ active_window: $route.path === '/ajustes' }">
                <div>
                    <img src="./../assets/gui/settings.png" alt="Ajustes">
                </div>
                <hr v-if="$route.path === '/ajustes'">
            </router-link>
        </div>
        <div  class="options_header">
            <div v-if="isMusicPlayerRunning">
                <i class="fa-solid fa-music" @click="toggleMusicPlayer"></i>
            </div>
            <div class="clock">
                <span>{{ time }}</span>
                <span>{{ formattedDate }}</span>
            </div>
        </div>
        
    </header>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useMusicPlayer } from './../composables/useMusicPlayer';
const { toggleMusicPlayer } = useMusicPlayer();

import { MusicPlayerRun } from './../composables/MusicPlayerRunnig';
const { isMusicPlayerRunning } = MusicPlayerRun();


const imageUrl = 'https://www.dokidokispanish.club/assets/gui/Logo_DDSC.png'

const closeApp = () => {
  window.api.closeApp(); // Llama a la función expuesta en preload.js
}
const time = ref('');

// Función para actualizar la hora
const updateTime = () => {
  const now = new Date();
  time.value = now.toLocaleTimeString(); // Usa la hora local del sistema
}

// Actualiza la hora cada segundo
let timer;

// Definir una propiedad reactiva para la fecha
const formattedDate = ref('');

// Función para obtener y formatear la fecha actual
function updateDate() {
  const now = new Date();
  // Formatear la fecha en formato "dd/mm/yyyy"
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Mes es 0-indexado
  const year = now.getFullYear();
  formattedDate.value = `${day}/${month}/${year}`;
}

const isOnline = ref(navigator.onLine);

function updateOnlineStatus() {
  isOnline.value = navigator.onLine;
}

function checkConnectionStatus() {
  isOnline.value = navigator.onLine;
}

onMounted(() => {
  updateTime(); // Actualiza inmediatamente al montar
  timer = setInterval(updateTime, 1000); // Actualiza cada segundo
  updateDate();
  // Verificar si hay conexión al iniciar
  checkConnectionStatus();

  // Escuchar cambios en la conexión
  window.addEventListener('online', updateOnlineStatus);
  window.addEventListener('offline', updateOnlineStatus);
});




</script>

<style scoped>
.ocultar_ventana{
    opacity: 0;
    visibility: hidden;
}
.mostrar_ventana{
    opacity: 1;
    visibility: visible;
}
header{
    position: fixed;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    bottom: 0;
    background:rgba(255,255,255,0.8);
    backdrop-filter: blur(2px);
}
.container_header{
    width: 85%;
    height: 100%;
    margin: 0 auto;
    display: flex;
    align-items: center;
    justify-content: start;
    gap: 0.5%;
}
.active_window{
    background: rgba(0,0,0,0.2);
}
.active_window a div img{
    background: rgba(0,0,0,0.3);
    filter: drop-shadow(5px 5px 10px rgba(255, 255, 255, 0.555));
}
.menu_contextual{
    opacity: 0;
    width: 15%;
    visibility: hidden;
    transition: all 0.3s linear;
    position: absolute;
    display: flex;
    background: rgba(255, 255, 255, 0.8);
    bottom: 100% !important;
    left: 0;
    padding: 1%;
    border-top-left-radius: 10px;
    border-top-right-radius: 10px;
}
input{
    display: none;
}
input:checked ~ .menu_contextual{
    opacity: 1;
    visibility: visible;
}
.menu_contextual > a{
    width: 100%;
    text-decoration: none;
    text-transform:uppercase;
    font-size: 1.5em;
    text-align: center;
    padding:5% 1%;
    text-wrap: nowrap;
    display: flex;
    color: #000;
    transition: all 0.3s linear;
    border-radius: 10px;
}
.menu_contextual > a:hover{
    background: #f131e5;
    color: white;
}
.menu_contextual > a > i{
    margin: 0 4%;
}
a{
    width: 8%;
    height: 100%;
    display: grid;
    grid-template-rows: 10fr 1fr;
    justify-content: center;
    align-items: center;
}
a div{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
}
a div img{
    width: 40px;
    margin-bottom: 10%;
    filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.555));
}
hr{
    width: 100%;
    height: 80%;
    background-color:#f131e5;
    border: none;
}
h5{
    margin: 0 2%;
}
#logo{
    width: 48px;
}
.options_header{
    width: 30%;
    display: flex;
    flex-direction: row;
    justify-content: end;
    align-items: center;
}
.options_header div:first-child{
    width: 100%;
    display: flex;
    justify-content: end;
    align-items: center;
}
.options_header div:first-child i{
    padding: 2%;
    transition: all 0.3s linear;
    font-size: 1.5em;
    border-radius: 5px;
    margin-right: 2%;
}
.options_header div:first-child i:hover{
    background-color: rgba(0, 0, 0, 0.555);
    color: white;
    cursor: pointer;
}

.clock {
width: 40% !important;
  font-size: 1rem;
  font-family: 'Arial', sans-serif;
  text-align: center;
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
}
.clock > span{
    text-wrap: nowrap !important;
}
</style>