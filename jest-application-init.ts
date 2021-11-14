import Vuetify from 'vuetify'
import colors from 'vuetify/es5/util/colors'

import App from '@/App.vue'
import router from '@/router'
import store from '@/store'
import VueI18n from 'vue-i18n'

const defaultTheme = {
  primary: colors.blue
}

function applicationInit (VueInstance, { theme = defaultTheme } = {} /* passing your default there */) {
  VueInstance.router = router

  VueInstance.use(Vuetify, { theme })

  VueInstance.config.productionTip = false

  return VueInstance
}

function getApplication (VueInstance) {
  return new VueInstance({
    router,
    store,
    i18n: new VueI18n(VueInstance),
    render: (h) => h(App)
  }).$mount('#app')
}

export { applicationInit, getApplication }
