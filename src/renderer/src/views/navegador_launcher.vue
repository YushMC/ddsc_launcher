<template>
    <div class="ventana" :style="{ left: position.x + 'px', top: position.y + 'px' }" @mousedown="startDragging">
      <div class="name_ventana"  @mousedown.stop="startDragging">
        <h3>Navegador</h3>
        <router-link to="/"><h3>x</h3></router-link>
      </div>
        <div class="container_inicio">
            <iframe 
              :src="url" 
              width="100%" 
              height="94%" 
              frameborder="0">
            </iframe>
      </div>
    </div>
</template>  
  
<script setup>
import { ref } from 'vue';
// Recibe la prop 'url' desde la ruta
const props = defineProps({
  url: {
    type: String,
    required: true,
    default: 'https://www.dokidokispanish.club/'
  },
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
    align-items: center;
    flex-direction: column;
    border-radius: 5px;
    background-image: url('https://www.dokidokispanish.club/assets/ddlc/gui/tilebg.png');
    background-repeat: repeat;
    background-size: inherit;
    animation: fondo_moc linear infinite 60s;
    
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