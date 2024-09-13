import './assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import AOS from 'aos'
import 'aos/dist/aos.css'
import router from './router'
import VueSweetalert2 from 'vue-sweetalert2';

const app = createApp(App)

app.use(router)  // Usa el router en la aplicación
app.use(VueSweetalert2)

// Montar la aplicación primero
app.mount('#app')

// Inicializar AOS después de montar la aplicación
AOS.init()