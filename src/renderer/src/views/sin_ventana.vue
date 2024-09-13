<template>
    <div data-aos="fade-down" data-aos-duration="1000">

    </div>
</template>

<script setup>
import { onMounted } from 'vue'
onMounted(async () => {
    try{
       const folderExists = await window.api.checkFolderExists();
        if (!folderExists) {
          router.push({ name: 'DDLC' }); // Redirigir a otra vista si la carpeta no existe
        } 
    }catch(errr){

    }
})

</script>

<style scoped>

</style>