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
// import '@/plugins/vuescroll'
// import '@/plugins/libphonenumber-js'
import '@/plugins/vuetify-dialog'
import '@/plugins/lvovich'
import '@/plugins/router-query'
import CleanLayout from '@/layouts/Clean.vue'
import('./jsSIP')

// layouts
Vue.component('administrator', () => import(/* webpackChunkName: "layout-administrator" */ './layouts/Administrator.vue'))
Vue.component('call-center-manager', () => import(/* webpackChunkName: "layout-call-center-manager" */ './layouts/CallCenterManager.vue'))
Vue.component('default', () => import(/* webpackChunkName: "layout-default" */ './layouts/Default.vue'))
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
