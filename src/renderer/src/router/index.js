import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/inicio.vue'
import Settings from '../views/configuracion.vue'
import AddMod from '../views/agregar_mod.vue'
import DDLC from '../views/agregar_ddlc.vue'
import download from '../views/download.vue'
import Escritorio from '../views/Escritorio.vue'
import info from '../views/info.vue'
import Info from '../views/info.vue'

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

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router