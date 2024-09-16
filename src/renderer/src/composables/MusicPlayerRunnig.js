import { ref } from 'vue';

const isMusicPlayerRunning = ref(false); // Controla si el reproductor es visible o no

export function MusicPlayerRun() {
  const toggleMusicPlayerRunning = () => {
    isMusicPlayerRunning.value = !isMusicPlayerRunning.value; // Alterna visibilidad
  };

  return {
    isMusicPlayerRunning,
    toggleMusicPlayerRunning,
  };
}