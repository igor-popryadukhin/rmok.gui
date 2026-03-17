import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

import App from './src/App.vue'
import $router from './src/router'
import VueI18n from 'vue-i18n'

const defaultTheme = {
  primary: colors.blue
}

function applicationInit (VueInstance) {
  VueInstance.router = $router
  VueInstance.i18n = new VueI18n(VueInstance)
  VueInstance.config.productionTip = false
  return VueInstance
}

function getApplication (VueInstance) {
  return new VueInstance({
    i18n: new VueI18n(VueInstance),
    render: (h) => h(App)
  }).$mount('#app')
}

export { applicationInit, getApplication }
