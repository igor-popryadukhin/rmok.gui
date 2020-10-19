import Vue from 'vue'
import '@/plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'

// Style
import '@/assets/scss/style.scss'

// Mixins
import '@/mixins/global'

// Plugins
import i18n, { loadLanguageAsync } from '@/plugins/i18n'
import '@/plugins/toast'
import '@/plugins/cookie'
import '@/plugins/vuescroll'
import '@/plugins/libphonenumber-js'
import '@/plugins/vuetify-dialog'
import '@/jsSIP'

// layouts
import DefaultLayout from '@/layouts/Default.vue'
import CleanLayout from '@/layouts/Clean.vue'
Vue.component('default', DefaultLayout)
Vue.component('clean', CleanLayout)

Vue.config.productionTip = false

loadLanguageAsync('ru', 'main').then()

export const app: Vue = new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
