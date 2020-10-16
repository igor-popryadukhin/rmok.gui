import Vue from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import 'vue-toastification/dist/index.css'
// see: https://maronato.github.io/vue-toastification
Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 14,
  position: POSITION.TOP_RIGHT,
  newestOnTop: true,
  closeOnClick: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: true,
  hideProgressBar: true,
  closeButton: 'button',
  timeout: 3000
})
