import Vue from 'vue'
import '@/plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import VueApexCharts from 'vue-apexcharts'

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
import '@/plugins/lvovich'
import '@/plugins/router-query'
import '@/jsSIP'

// layouts
import CallCenterManager from '@/layouts/CallCenterManager.vue'
import AdministratorLayout from '@/layouts/Administrator.vue'
import DefaultLayout from '@/layouts/Default.vue'
import CleanLayout from '@/layouts/Clean.vue'
Vue.component('administrator', AdministratorLayout)
Vue.component('call-center-manager', CallCenterManager)
Vue.component('default', DefaultLayout)
Vue.component('clean', CleanLayout)

Vue.use(VueApexCharts)
Vue.component('apexchart', VueApexCharts)

Vue.config.productionTip = false

loadLanguageAsync('ru', 'main').then()

export const app: Vue = new Vue({
  router,
  store,
  vuetify,
  i18n,
  render: (h) => h(App)
}).$mount('#app')
