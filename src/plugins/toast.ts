import Vue from 'vue'
import Toast from 'vue-toastification'
import 'vue-toastification/dist/index.css'
// see: https://maronato.github.io/vue-toastification
Vue.use(Toast, {
  transition: 'Vue-Toastification__bounce',
  maxToasts: 14,
  newestOnTop: true
})
