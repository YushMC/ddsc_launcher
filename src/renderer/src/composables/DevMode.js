import { ref } from 'vue';

const isDevMode = ref(false); // Controla si el reproductor es visible o no

export function DevModeRun() {
  const toggleDevMode = () => {
    isDevMode.value = !isDevMode.value; // Alterna visibilidad
  };

  return {
    isDevMode,
    toggleDevMode,
  };
}