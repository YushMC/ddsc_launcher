<script setup>
import Header from './components/Header.vue'
import UpdateProgress from './components/UpdateProgress.vue';
import Music from './components/music.vue';

const savedImage = localStorage.getItem('backgroundImage');
  if (savedImage) {
    document.body.style.backgroundImage = `url(${savedImage})`;
  }
// :style="{ backgroundImage: `url(${backgroundImage})` }"
</script>

<template>
  <div class="content_app">
    <div class="content_router">
      <router-view  ></router-view>
    </div>
    <Header></Header>
    <!-- 
    <img src="./assets/gui/beta.png" id="beta_add">
    -->
    <UpdateProgress />
    <Music></Music>
  </div>
  
</template>
<style scoped>

.content_app {
  position: relative;
  width: 100%;
  display: flex;
  justify-content: center;
  height: 100%;
  background-size: cover; /* Ajusta el tamaño del fondo si es necesario */
  background-position: center; /* Centra el fondo si es necesario */
}
.content_app .content_router{
  width: 100%;
  height: 94%;
  display: flex;
  transition: all 1s linear;
}
</style>