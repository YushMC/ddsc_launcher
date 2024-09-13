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
      <router-view data-aos="fade-down" data-aos-duration="1000" ></router-view>
    </div>
    <Header></Header>
    <img src="./assets/gui/beta.png" id="beta_add">
    <UpdateProgress />
    <Music></Music>
  </div>
  
</template>
<style scoped>
#beta_add{
  position: fixed;
  top: 0;
  right: 0;
  z-index: 100;
  width: 5%;
  filter: drop-shadow(5px 5px 10px rgba(0, 0, 0, 0.555));
}
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
  width: 90%;
  height: 88%;
  margin:2%;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 1s linear;
}
</style>