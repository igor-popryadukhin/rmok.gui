import Vue from 'vue'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import '@/directives'

// Style
import '@/assets/scss/style.scss'

// Mixins
import '@/mixins/global'

// Plugins
import i18n, { loadLanguageAsync } from '@/plugins/i18n'
import vuetify from '@/plugins/vuetify'
import '@/plugins/axios'
import '@/plugins/sse'
import '@/plugins/debug'
import '@/plugins/toast'
import '@/plugins/cookie'
import '@/plugins/router-query'
import '@/plugins/activity'
import '@/plugins/yandex-metrika'
import '@/plugins/file-dialog'
import '@/plugins/lvovich'
import '@/plugins/vuetify-dialog'
import '@/plugins/html-audio-element'
import '@/plugins/sound'
import '@/plugins/vue-meta'
import '@/plugins/dayjs'
import '@/jsSIP'

import CleanLayout from '@/layouts/Clean.vue'

// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
const vuetifyDialogMovingImport = () => import(/* webpackPreload: true */ './vuetify-dialog-moving.ts')
vuetifyDialogMovingImport()

// layouts
Vue.component('Default', () => import(/* webpackPreload: true */ './layouts/Default.vue'))
Vue.component('Clean', CleanLayout)
Vue.component('Help', () => import(/* webpackPreload: true */ './layouts/Help.vue'))

Vue.component('AppDivider', () => import(/* webpackPreload: true */ './components/AppDivider/AppDivider.vue'))
Vue.component('AppTools', () => import(/* webpackPreload: true */ './components/AppTools/AppTools.vue'))

Vue.config.productionTip = false

loadLanguageAsync('ru', 'main').then()

export const app: Vue = new Vue({
  i18n,
  render: (h) => h(App),
  router,
  store,
  vuetify
}).$mount('#app')
