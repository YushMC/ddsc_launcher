import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/inicio.vue'
import Settings from '../views/configuracion.vue'
import AddMod from '../views/agregar_mod.vue'
import DDLC from '../views/agregar_ddlc.vue'
import download from '../views/download.vue'
import Escritorio from '../views/Escritorio.vue'
import Cambiar_ubicacion from '../views/cambiar_ubicacion.vue'
import Info from '../views/info.vue'
import navegador_launcher from '../views/navegador_launcher.vue'
import DevMode from '../views/DevMode.vue'

const routes = [
  {
    path: '/',
    name: 'escritorio',
    component: Escritorio
  },
  {
    path: '/inicio',
    name: 'Home',
    component: Home
  },
  {
    path: '/agregar',
    name: 'AddMod',
    component: AddMod
  },
  {
    path: '/ajustes',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/load_ddlc',
    name: 'DDLC',
    component: DDLC
  },
  {
    path: '/download',
    name: 'Descargar',
    component: download
  },
  {
    path:'/informacion',
    name: 'Info',
    component: Info
  },
  {
    path: '/change_rute',
    name: 'ChangeRute',
    component: Cambiar_ubicacion
  },
  {
    path:'/navegador',
    name: 'Navegador',
    component: navegador_launcher,
    props: (route) => ({ url: route.query.url }) // Pasar la URL como prop
  },
  {
    path: '/DevMode',
    name: 'devmode',
    component: DevMode
  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router