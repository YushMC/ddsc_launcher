<template>
    <div class="ventana" data-aos="fade-down" data-aos-duration="1000">
        <h3>Detalles del mod: {{ modName }}</h3>
        <div class="container_inicio">
            <div>
              <button @click="openExplorerMod">Abrir carpeta</button>
            </div>
            <div>
              <button @click="deleteFolderOrFile">Eliminar</button>
            </div>
        </div>  
    </div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import Swal from 'sweetalert2'
const route = useRoute()
const modName = ref(route.params.modName)
const modInfo = ref(null)



const openExplorerMod = async () => {
    await window.api.openFolderMod(modName.value)
}

const deleteFolderOrFile =  async () => {
    try{
        const result = await Swal.fire({
        title: '¿Estás seguro?',
        text: "¡No podrás deshacer esta acción!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Sí, eliminarlo',
        cancelButtonText: 'Cancelar',
      })

        if (result.isConfirmed) {
          // Aquí pones la acción a ejecutar si el usuario confirma
          Swal.close(); 
          Swal.fire({
            title: `Eliminando carpeta del mod \n${modName.value}...`,
            allowOutsideClick: false,
            showConfirmButton: false,
            didOpen: () => {
              Swal.showLoading();
            }
          });
            try{
                const basePath = await window.api.getBasePath();

                const filePath = `${basePath}\\mods\\${modName.value}`;  // Cambia esta ruta por la que necesites eliminar
                const { success, message } = await window.api.deleteFolderOrFile(filePath);

                Swal.close(); // Cierra el swal de carga si el proceso terminó
                if (success) {
                    console.log('Eliminación exitosa:', message);
                    // Aquí puedes mostrar una alerta o notificación de éxito
                    Swal.fire(
                        'Eliminado!',
                        'Tu archivo ha sido eliminado.',
                        'success'
                    );
                } else {
                    Swal.fire({
                        icon: "error",
                        title: `Error al eliminar carpeta del mod \n${modName}`,
                        html: `Error: ${message}`
                      });
                    console.error('Error al eliminar:', message);
                    // Aquí puedes mostrar una alerta o notificación de error
                }
            }catch(err){
                Swal.close();
                Swal.fire({
                    icon: "error",
                    title: `Ocurrio un problema!`,
                    html: `Error: ${err}`
                });
            }
        }

    }catch(err){
        Swal.close();
        Swal.fire({
            icon: "error",
            title: `Ocurrio un problema!`,
            html: `Error: ${err}`
        });
    }
}

onMounted(() => {
  console.log('Mod seleccionado:', modName.value)
})
</script>

<style scoped>

.ventana{
    border: solid 3px #e016d1;
    margin: 10%;
    background: #e016d1;
    border-radius: 10px;
    filter: drop-shadow(5px 5px 10px black);
}
.ventana h3{
    margin-left: 1%;
    color: white;
}
.container_inicio{
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    height: 95%;
    border-radius: 5px;
    background-image: url('https://www.dokidokispanish.club/assets/ddlc/gui/tilebg.png');
    background-repeat: repeat;
    background-size: inherit;
    animation: fondo_moc linear infinite 60s;
}
.container_inicio div{
  margin: 1% 0;
}
label{
  font-weight: 600;
  margin: 2% 0;
}
.container_inicio div{
  width: 80%;
  display: grid;
  grid-template-columns: 8fr 1fr;
  gap: 2%;
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
  padding: 1%;
  color: white;
  background: #e016d1;
  border-radius: 10px;
  cursor: pointer;
  border: none;
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