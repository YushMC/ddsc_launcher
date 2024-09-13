import { ref } from 'vue';

const isMusicPlayerVisible = ref(false); // Controla si el reproductor es visible o no

export function useMusicPlayer() {
  const toggleMusicPlayer = () => {
    isMusicPlayerVisible.value = !isMusicPlayerVisible.value; // Alterna visibilidad
  };

  return {
    isMusicPlayerVisible,
    toggleMusicPlayer,
  };
}