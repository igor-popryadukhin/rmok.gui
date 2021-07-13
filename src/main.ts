import Vue from 'vue'
import '@/plugins/axios'
import App from './App.vue'
import router from './router'
import store from './store'
import vuetify from './plugins/vuetify'
import '@/directives'

// Style
import '@/assets/scss/style.scss'

// Mixins
import '@/mixins/global'

// Plugins
import i18n, { loadLanguageAsync } from '@/plugins/i18n'
import '@/plugins/toast'
import '@/plugins/permission'
import '@/plugins/cookie'
import '@/plugins/router-query'
import '@/plugins/moment'
import '@/plugins/activity'
import '@/plugins/yandex-metrika'
import '@/plugins/file-dialog'
import '@/plugins/lvovich'
import '@/plugins/vuetify-dialog'
import '@/plugins/libphonenumber-js'
import '@/plugins/html-audio-element'
import '@/jsSIP'

import CleanLayout from '@/layouts/Clean.vue'

// layouts
Vue.component('administrator', () => import(/* webpackPreload: true */ './layouts/Administrator.vue'))
// Vue.component('call-center-manager', () => import(/* webpackPreload: true */ './layouts/CallCenterManager.vue'))
// Vue.component('team-leader', () => import(/* webpackPreload: true */ './layouts/TeamLeader.vue'))
Vue.component('operator-layout', () => import(/* webpackPreload: true */ './layouts/Operator.vue'))
Vue.component('clean', CleanLayout)

Vue.component('app-divider', () => import(/* webpackPreload: true */ './components/AppDivider/AppDivider.vue'))

Vue.config.productionTip = false

loadLanguageAsync('ru', 'main').then()

export const app: Vue = new Vue({
  i18n,
  render: (h) => h(App),
  router,
  store,
  vuetify
}).$mount('#app')
