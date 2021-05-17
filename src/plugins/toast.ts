import Vue from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
// see: https://maronato.github.io/vue-toastification
Vue.use(Toast, {
  closeButton: 'button',
  closeOnClick: true,
  draggable: true,
  draggablePercent: 0.6,
  hideProgressBar: true,
  maxToasts: 14,
  newestOnTop: true,
  position: POSITION.TOP_RIGHT,
  showCloseButtonOnHover: true,
  timeout: 4500,
  transition: 'Vue-Toastification__bounce'
})
