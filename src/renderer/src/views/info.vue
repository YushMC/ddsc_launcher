<template>
    <div class="ventana" data-aos="fade-down" data-aos-duration="1000" :style="{ left: position.x + 'px', top: position.y + 'px' }" @mousedown="startDragging">
      <div class="name_ventana"  @mousedown.stop="startDragging">
        <h3>Información</h3>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
        <div class="container_inicio">
          <div style="display: grid;grid-template-columns: repeat(2,1fr);width: 80%; gap: 2%;margin-top: 1%;">
              <a class="info_creators" href="https://github.com/YushMC/ddsc_launcher" target="_blank"><i class="fa-brands fa-github"></i> GitHub</a>
              <a class="info_creators" href="https://discord.gg/te9qdM56br" target="_blank"><i class="fa-brands fa-discord"></i> Discord</a>
            </div>
          <div class="content_card">
            <div>
              <h5 style="text-align: center;">Créditos</h5>
              <hr>
            </div>
            <div class="content_credits">
              <div>
                <h3>Desarrollado por:</h3>
                <div class="content_buttons_credits">
                  <a href="https://www.youtube.com/@ELYushMC" target="_blank">YushMC (Team DDSC Web)</a>
                </div>
              </div>
              <div>
                <h3>Idea original (DDLC):</h3>
                <div class="content_buttons_credits">
                  <a href="https://teamsalvato.com/" target="_blank">Team Salvato</a>
                </div>
              </div>
              <div>
                <h3>Música:</h3>
                <div class="content_buttons_credits">
                  <a href="https://www.youtube.com/playlist?list=PLc5ZKngbAPXMG4yjq9ESGfqblQfL9g4-p" target="_blank">DDLC OST</a>
                </div>
              </div>
              <div>
                <h3>Fondos:</h3>
                <div class="content_buttons_credits">
                  <a>DDLC CGs</a>
                  <a href="https://www.dokidokispanish.club/mod-Meni-Cuquis" target="_blank">DDLC Mod: Meni Cuquis</a>
                  <a href="https://www.dokidokispanish.club/mod-Celestial-Restraint" target="_blank">DDLC Mod: Celestial Restraint</a>
                  <a href="https://www.dokidokispanish.club/mod-Esquizofrenia" target="_blank">DDLC Mod: Ezquisofrenia</a>
                  <a href="https://www.dokidokispanish.club/mod-Mexican-Club" target="_blank">DDLC Mod: Mexican Club</a>
                  <a href="https://www.dokidokispanish.club/mod-Christmas-Time" target="_blank">DDLC Mod: Christmas Time</a>
                  <a href="https://www.dokidokispanish.club/mod-Doki-Doki-Recovery-Project#desarrollo" target="_blank">DDLC Mod: Recovery Project</a>
                </div>
              </div>
              <div>
                <h3>Iconos utilizados:</h3>
                <div class="content_buttons_credits">
                  <a href="https://icons8.com/icon/set/popular/color" target="_blank">icons8.com</a>
                  <a href="https://fontawesome.com/" target="_blank">fontawesome</a>
                </div>
              </div>
            </div>
         </div>
      </div>
    </div>
</template>  
  
<script setup>
import { ref } from 'vue';


const props = defineProps({
  title: String,
  initialPosition: {
    type: Object,
    default: () => ({ x: 150, y: 20 })
  }
});

const position = ref({ ...props.initialPosition });
const isDragging = ref(false);
const offset = ref({ x: 0, y: 0 });

function startDragging(event) {
  isDragging.value = true;
  offset.value.x = event.clientX - position.value.x;
  offset.value.y = event.clientY - position.value.y;

  window.addEventListener('mousemove', onDrag);
  window.addEventListener('mouseup', stopDragging);
}

function onDrag(event) {
  if (isDragging.value) {
    position.value.x = event.clientX - offset.value.x;
    position.value.y = event.clientY - offset.value.y;
  }
}

function stopDragging() {
  isDragging.value = false;
  window.removeEventListener('mousemove', onDrag);
  window.removeEventListener('mouseup', stopDragging);
}

</script>
  

<style scoped>

.container_inicio{
    width: 100%;
    height: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    background-image: url('https://www.dokidokispanish.club/assets/ddlc/gui/tilebg.png');
    background-repeat: repeat;
    background-size: inherit;
    animation: fondo_moc linear infinite 60s;
    
}
.content_card{
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 10px;
  backdrop-filter: blur(2px);
  overflow: auto;
  padding:  1% !important;
}
.content_card  > div{
  width: 90%;
  margin: 1% 0 ;
}

label{
  font-weight: 600;
  margin: 2% 0;
}
.container_inicio div input{
  padding: 0.5%;
  opacity: 0.5;
}
.image_button{
  width: 100%;
  border: none;
  background: none;
  cursor: pointer;
  opacity: 0.5;
}
.image_button img{
  width: 40%;
}
button{
  width: 100%;
  padding: 5%;
  color: white;
  background: #e016d1;
  border-radius: 10px;
  cursor: pointer;
  border: none;
}
.content_credits{
  width: 100%;
  display: flex !important;
  flex-wrap: wrap;
  gap: 2%;
  overflow-y: scroll !important;
  padding: 2%;
  max-height: 80% !important;
}
.content_credits > div{
  width: 100% !important;
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1%;
  border-radius: 5px;
  margin: 1% 0;
  border: solid 2px black;
}
.content_credits > div > h3{
  color: #000;
}

.content_buttons_credits{
  width: 30%;
  display: flex;
  flex-direction: column;
}
.content_buttons_credits >  a{
  padding: 1%;
  color: #fff;
  background: #e016d1;
  border-radius: 10px;
  text-decoration: none;
  text-align: center;
  margin-bottom: 1%;
}
.info_creators{
  background-color: #e016d1;text-align: center;color: #fff;padding: 2% 0;border-radius: 5px;text-decoration: none;
}
@keyframes fondo_moc{
  0%{
      background-position:0% 0%;
  }
  100%{
      background-position:100% 100%;
  }
}
</style>