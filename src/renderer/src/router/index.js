import { createRouter, createWebHashHistory } from 'vue-router'
import Home from '../views/inicio.vue'
import Settings from '../views/configuracion.vue'
import AddMod from '../views/agregar_mod.vue'
import DDLC from '../views/agregar_ddlc.vue'
import download from '../views/download.vue'
import Escritorio from '../views/sin_ventana.vue'
import Details_mod from '../views/details_mod.vue'

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
    path:'/detail/:modName',
    name: 'Detalles',
    component: Details_mod,
    props: true

  }
]

const router = createRouter({
  history: createWebHashHistory(),
  routes
})

export default router