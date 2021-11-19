import i18n from '@/plugins/i18n'
import Vue from 'vue'
import Toast, { POSITION } from 'vue-toastification'
import '@/assets/scss/vue-toastnotification/themes/default/index.css'

// see: https://maronato.github.io/vue-toastification
Vue.use(Toast, {
  closeButton: 'button',
  closeOnClick: true,
  draggable: true,
  draggablePercent: 0.6,
  hideProgressBar: true,
  maxToasts: 14,
  newestOnTop: true,
  position: POSITION.BOTTOM_RIGHT,
  showCloseButtonOnHover: true,
  timeout: 4500,
  transition: 'Vue-Toastification__bounce',
  filterBeforeCreate: (toast, toasts) => {
    if (typeof toast.content === 'string') {
      toast.content = i18n.tc(toast.content)
    }
    return toast
  }
})
